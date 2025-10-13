import React from "react";
import "./productCard.css";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

const price = product?.variants?.[0]?.calculated_price?.calculated_amount || 0;

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart"); // 👉 Chuyển sang giỏ hàng ngay sau khi thêm
  };
  console.log("Product data:", product)


  return (
    <div className="product-card">
      {/* Ảnh + overlay */}
      <div className="product-img">
        <img
          src={product?.thumbnail || "https://via.placeholder.com/200"}
          alt={product?.title}
        />
        <div className="explore-overlay">
          <Link to={`/products/${product.id}`} className="btn-explore">
            Khám phá ngay →
          </Link>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <div className="info-top">
          <h3 className="title">{product?.title}</h3>
          <div className="price-box">
            <span className="price">{price.toLocaleString()} đ</span>
            {product?.variants?.[0]?.original_price && (
              <span className="old-price">
                {(product?.variants?.[0]?.original_price / 100).toLocaleString()} đ
              </span>
            )}
          </div>
        </div>
        <div className="info-bottom">
          <p className="status">
            {product?.status === "in_stock" ? "Còn hàng" : "Liên hệ"}
          </p>
          <button onClick={handleAddToCart} className="btn-cart">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
