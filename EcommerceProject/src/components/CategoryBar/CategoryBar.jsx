// CategoryBar.jsx
import React, { useState } from "react";
import "./CategoryBar.css";

const categories = [
  { name: "Làm Việc", icon: "📝" },
  { name: "Giải Trí", icon: "🎬" },
  { name: "Học Tập", icon: "🎓" },
  { name: "Tiện Ích", icon: "☁️" },
  { name: "Windows", icon: "🪟" },
  { name: "Microsoft", icon: "📂" },
  { name: "Diệt Virus", icon: "🛡️" },
  { name: "VPN", icon: "📡" },
];

export default function CategoryBar({ onCategoryClick }) {
  const [active, setActive] = useState(categories[0].name);

  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className={`category-item ${active === cat.name ? "active" : ""}`}
          onClick={() => {
            setActive(cat.name);
            onCategoryClick(cat.name);
          }}
        >
          <div className="icon">{cat.icon}</div>
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}
