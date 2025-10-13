import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../services/api";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import ProductCard from "../../components/productCard/ProductCard";
import HeroBanner from "../../components/Banner/HeroBanner";
import "./home.css";
export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  // Lấy sản phẩm từ database (4 sản phẩm nổi bật + 3 bán chạy làm ví dụ)
  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.slice(4, 7);

  return (
    <div className="container">
      {/* ✅ Banner */}
      <HeroBanner />

      {/* Giới thiệu */}
      <section className="intro section-box">
        <h1>Digitech Shop</h1>
        <p>
          Digitech Shop là địa chỉ đáng tin cậy, chuyên cung cấp phần mềm bản
          quyền và dịch vụ nâng cấp tài khoản chính chủ. Chúng tôi cam kết mang
          đến chất lượng vượt trội, giá cả hợp lý và sẵn sàng hỗ trợ tận tâm
          24/7.
        </p>
      </section>

      {/* Thanh category */}
      <CategoryBar onCategoryClick={handleCategoryClick} />

      {/* 🔥 Sản phẩm nổi bật + Bán chạy */}
      <section className="highlight-box">
        <div className="highlight-left">
          <span className="tag">🔥 Xu Hướng 2025</span>
          <h2>Sản Phẩm Nổi Bật Nhất Năm 2025</h2>
          <p>
            Digitech Shop cung cấp phần mềm bản quyền chính hãng đa dạng: AI,
            Microsoft Office, thiết kế đồ họa, VPN/Antivirus... đáp ứng mọi nhu
            cầu học tập, công việc và giải trí với giá cực kỳ cạnh tranh.
          </p>
          <button className="btn-contact">Liên hệ tư vấn tại đây →</button>
        </div>

        <div className="highlight-right">
          <h3>Bán chạy</h3>
          <ul className="bestseller-list">
            {bestSellers.map((item) => (
              <li key={item.id} className="bestseller-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.price} đ</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
