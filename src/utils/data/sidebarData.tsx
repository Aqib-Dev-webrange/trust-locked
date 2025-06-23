
import { 
  FiUser, 
  FiMessageCircle, 
  FiAlertTriangle, 
  FiCreditCard 
} from "react-icons/fi";

export type SidebarDataItem = {
  type: "item";
  label: string;
  icon: React.ReactElement;
  count?: number;
  link: string;
} | {
  type: "section";
  title: string;
  icon: React.ReactElement;
  children: (
    | {
      type: "item";
      label: string;
      icon?: React.ReactElement; // <-- optional in child items
      count?: number;
      link: string;
    }
    | {
      type: "button";
      label: string;
    }
  )[];
};

export const sidebarData: SidebarDataItem[] = [
  {
    type: "item",
    label: "User Management",
    icon: <FiUser className="w-5 h-5" />,
    link: "/users",
  },
  {
    type: "item",
    label: "Chat with user",
    icon: <FiMessageCircle className="w-5 h-5" />,
    link: "/chats",
  },
  {
    type: "item",
    label: "Dispute System",
    icon: <FiAlertTriangle className="w-5 h-5" />,
    link: "/disputes",
  },
  {
    type: "item",
    label: "Payments",
    icon: <FiCreditCard className="w-5 h-5" />,
    link: "/payments",
  },
];
