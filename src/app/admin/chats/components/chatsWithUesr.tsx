"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type ChatRoomRow = Database["public"]["Tables"]["chat_rooms"]["Row"];
type ChatMessageRow = Database["public"]["Tables"]["chat_messages"]["Row"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];

export default function ChatsWithUsers() {
  const [adminUid, setAdminUid] = useState<string | null>(null);
  const [recentChats, setRecentChats] = useState<
    { room: ChatRoomRow; user: UserRow; lastMessage: ChatMessageRow | null }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomRow | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageRow[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;
      setAdminUid(data.user.id);
    };
    fetchUser();
  }, []);

  const fetchRecentChats = useCallback(async () => {
    if (!adminUid) return;

    setLoadingRooms(true);
    const { data: rooms } = await supabase
      .from("chat_rooms")
      .select(
        `
        *,
        purchaser:users!chat_rooms_purchaserId_fkey (uid, display_name, email),
        seller:users!chat_rooms_sellerId_fkey (uid, display_name, email)
      `
      )
      .order("updatedAt", { ascending: false });

    const filtered = (rooms ?? []).filter(
      (r) => r.sellerId === adminUid || r.sellerId === null
    );

    const chatList = await Promise.all(
      filtered.map(async (room) => {
        const otherUser =
          room.sellerId === null || room.sellerId === adminUid
            ? room.purchaser
            : room.seller;

        const { data: lastMsg } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("roomId", room.roomId)
          .order("createdAt", { ascending: false })
          .limit(1);

        return {
          room,
          user: otherUser as UserRow,
          lastMessage: lastMsg?.[0] ?? null,
        };
      })
    );

    setRecentChats(chatList);
    setLoadingRooms(false);
  }, [adminUid]);

  useEffect(() => {
    if (adminUid) fetchRecentChats();
  }, [adminUid, fetchRecentChats]);

  const openChat = async (room: ChatRoomRow, user: UserRow) => {
    setSelectedRoom(room);
    setSelectedUser(user);
    setLoadingMsgs(true);

    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("roomId", room.roomId)
      .order("createdAt", { ascending: true });

    if (data) {
      setChatMessages(data);
      scrollToBottom();
    }

    setLoadingMsgs(false);
  };

  useEffect(() => {
    if (!selectedRoom) return;

    const channel = supabase
      .channel(`room-${selectedRoom.roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `roomId=eq.${selectedRoom.roomId}`,
        },
        (payload) => {
          setChatMessages((prev) => {
            const updated = [...prev, payload.new as ChatMessageRow];
            updated.sort(
              (a, b) =>
                new Date(a.createdAt ?? 0).getTime() -
                new Date(b.createdAt ?? 0).getTime()
            );
            return updated;
          });
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedRoom || !adminUid) return;

    const { error } = await supabase.from("chat_messages").insert({
      roomId: selectedRoom.roomId,
      data: chatInput.trim(),
      createdBy: adminUid,
      messageType: "text",
      messageStatus: "sent",
    });

    if (!error) {
      await supabase
        .from("chat_rooms")
        .update({ updatedAt: new Date().toISOString() })
        .eq("roomId", selectedRoom.roomId);

      setChatInput("");
      fetchRecentChats();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedRoom || !chatMessages.length) return;
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg.createdBy !== adminUid && lastMsg.messageStatus !== "seen") {
      supabase
        .from("chat_messages")
        .update({ messageStatus: "seen" })
        .eq("messageId", lastMsg.messageId);
    }
  }, [chatMessages, selectedRoom, adminUid]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full px-2 py-1 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingRooms ? (
            <div className="p-4 text-gray-500">Loading chats...</div>
          ) : recentChats.length ? (
            recentChats
              .slice()
              .sort((a, b) => {
                // Prefer lastMessage.createdAt, fallback to room.updatedAt
                const aTime = a.lastMessage?.createdAt
                  ? new Date(a.lastMessage.createdAt).getTime()
                  : new Date(a.room.updatedAt ?? 0).getTime();
                const bTime = b.lastMessage?.createdAt
                  ? new Date(b.lastMessage.createdAt).getTime()
                  : new Date(b.room.updatedAt ?? 0).getTime();
                return bTime - aTime; // descending order
              })
              .filter((c) =>
                (c.user?.display_name || c.user?.uid || "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map(({ room, user, lastMessage }) => (
                <button
                  key={room.roomId}
                  onClick={() => user && openChat(room, user)}
                  className={`flex items-center p-3 w-full text-left hover:bg-gray-50 ${
                    selectedRoom?.roomId === room.roomId ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white font-bold uppercase">
                    {user?.display_name?.[0]}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium">
                      {user?.display_name || user?.uid || "Unknown User"}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {lastMessage?.data}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {lastMessage?.createdAt
                      ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </button>
              ))
          ) : (
            <div className="p-4 text-gray-500">
              {/* loading */}
              No recent chats found.
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedRoom && selectedUser ? (
          <>
            <div className="p-4 bg-white border-b flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white font-bold">
                {selectedUser.display_name?.[0]}
              </div>
              <div className="ml-3">
                <div className="font-semibold">{selectedUser.display_name}</div>
                <div className="text-sm text-gray-500">{selectedUser.email}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loadingMsgs ? (
                <div className="text-gray-500">Loading messages...</div>
              ) : chatMessages.length ? (
                chatMessages.map((msg) => {
                  const isAdmin = msg.createdBy === adminUid;
                  const dateTime = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                    : "";
                  return (
                    <div
                      key={msg.messageId}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-md ${
                          isAdmin
                            ? "bg-green-100 text-green-900"
                            : "bg-white text-gray-900 border"
                        }`}
                      >
                        {msg.data}
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {dateTime}
                          {isAdmin && (
                            <span className="ml-2 text-green-500">✓ Delivered</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 italic">
                  No messages yet — start the conversation!
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t flex"
            >
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2 mr-2"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
