import React, { useEffect, useState } from "react";
import ProductCard from "../productCard/ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]); // luôn là array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("http://localhost:9000/store/products", {
    headers: {
      "x-publishable-api-key": "pk_b2cf41247f32bfc9f08d3411059b74318d527f6cfa8a27ff5bb2973403063a4f",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API response:", data)
      setProducts(data.products)
      setLoading(false)
    })
    .catch((err) => {
      console.error("Lỗi khi fetch products:", err)
      setLoading(false)
    })
}, [])

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
