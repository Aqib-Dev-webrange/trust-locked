import { MessageCircle, AlertTriangle, Users, CreditCard, UserCheck } from "lucide-react";


export const statusData = [
  {
    label: "User",
    count: 2543,
    color: "bg-blue-500",
    icon: <UserCheck className="w-[40px] h-[40px]" />,
  },
  {
    label: "Chat with user",
    count: 156,
    color: "bg-green-500",
    icon: <MessageCircle className="w-[40px] h-[40px]" />,
  },
  {
    label: "Dispute System",
    count: 23,
    color: "bg-red-500",
    icon: <AlertTriangle className="w-[40px] h-[40px]" />,
  },
  {
    label: "User Management",
    count: 1842,
    color: "bg-purple-600",
    icon: <Users className="w-[40px] h-[40px]" />,
  },
  {
    label: "Payments",
    count: 8756,
    color: "bg-indigo-600",
    icon: <CreditCard className="w-[40px] h-[40px]" />,
  },
];
