export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          uid: string;
          email: string | null;
          created_at: string;
          last_sign_in_at: string | null;
          display_name: string | null;
          stripeUserId: string | null;
          connectId: string | null;
          ratings: number | null;
          isConnectAccVerified: boolean | null;
          isDocumentSubmitted: boolean | null;
        };
      };
      chat_rooms: {
        Row: {
          roomId: string;
          sellerId: string | null;
          purchaserId: string | null;
          isSellerDeleted: boolean | null;
          isPurchaserDeleted: boolean | null;
          sellerLastDeletedAt: string | null;
          purchaserLastDeletedAt: string | null;
          updatedAt: string | null;
        };
      };
      chat_messages: {
        Row: {
          messageId: string;
          roomId: string;
          messageType: string | null;
          messageStatus: string | null;
          data: string | null;
          createdAt: string | null;
          createdBy: string | null;
        };
      };
    };
  };
};
