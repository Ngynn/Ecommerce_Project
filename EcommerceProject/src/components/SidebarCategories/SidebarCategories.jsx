import { FaPenNib, FaGamepad, FaBook, FaWindows, FaShieldAlt, FaThLarge, FaListUl } from "react-icons/fa";
import { SiMicrosoft, SiExpressvpn } from "react-icons/si";
import "./SidebarCategories.css";

export default function SidebarCategories({ onSelectCategory }) {
  const categories = [
    { id: "All", name: "Tất cả", icon: <FaListUl /> },
    { id: "Làm Việc", name: "Làm Việc", icon: <FaPenNib /> },
    { id: "Giải Trí", name: "Giải Trí", icon: <FaGamepad /> },
    { id: "Học Tập", name: "Học Tập", icon: <FaBook /> },
    { id: "Tiện Ích", name: "Tiện Ích", icon: <FaThLarge /> },
    { id: "Windows", name: "Windows", icon: <FaWindows /> },
    { id: "Microsoft", name: "Microsoft", icon: <SiMicrosoft /> },
    { id: "Diệt Virus", name: "Diệt Virus", icon: <FaShieldAlt /> },
    { id: "VPN", name: "VPN", icon: <SiExpressvpn /> },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Danh mục sản phẩm</h2>
      <ul className="sidebar-list">
        {categories.map((cat) => (
          <li
            key={cat.id}
            onClick={() => onSelectCategory?.(cat.id)}
            className="sidebar-item"
          >
            <span className="sidebar-icon">{cat.icon}</span>
            <span className="sidebar-text">{cat.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
