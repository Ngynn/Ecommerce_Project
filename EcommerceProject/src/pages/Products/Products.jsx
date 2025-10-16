import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/productCard/ProductCard";
import SidebarCategories from "../../components/SidebarCategories/SidebarCategories";
import "./Products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [products, setProducts] = useState([]);
  const regionId = "reg_01K73N9QAJJ6DVF7FGKAKCJQG0";

  // pagination state
  const pageSize = 12;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  // NEW: input state cho trang (chuỗi để kiểm soát input)
  const [pageInput, setPageInput] = useState(String(Number(searchParams.get("page")) || 1));

  useEffect(() => {
    // Gọi API nhiều trang để lấy hết sản phẩm (limit/offset). Nếu API của bạn dùng cursor,
    // cần điều chỉnh sang starting_after/next_cursor theo docs.
    const fetchAllProducts = async () => {
      try {
        const limit = 100; // tăng lên tùy nhu cầu / theo giới hạn server
        let offset = 0;
        let allProducts = [];

        while (true) {
          const res = await fetch(
            `http://localhost:9000/store/products?region_id=${regionId}&limit=${limit}&offset=${offset}`,
            {
              headers: {
                "x-publishable-api-key":
                  "pk_d4bf2faebacb69611013a1fd3c32bb8f76ab55d06f2068d92b0efd01a377ecfc",
              },
            }
          );

          if (!res.ok) {
            throw new Error(`Fetch error: ${res.status}`);
          }

          const data = await res.json();
          console.log("API page response:", data);

          // tùy API, danh sách có thể nằm ở data.products, data.items, data.data,...
          const items = data.products || data.items || data.data || [];
          allProducts = allProducts.concat(items);

          // Điều kiện dừng: nếu items ít hơn limit => không còn trang tiếp
          if (items.length < limit) {
            break;
          }

          offset += limit;
        }

        setProducts(allProducts);
      } catch (err) {
        console.error("Lỗi khi fetch products:", err);
      }
    };

    fetchAllProducts();
  }, []); // chỉ chạy 1 lần khi load trang

  // Sync category + page từ URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    } else {
      setCategory("All");
    }

    setPage(pageFromUrl);
    setPageInput(String(pageFromUrl)); // sync input khi URL thay đổi
  }, [searchParams]);

  // Khi chọn category: cập nhật URL và đặt lại trang về 1
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setPageInput("1");
    setSearchParams({ category: newCategory, page: String(1) });
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    return (
      (category === "All" || p.collection?.title === category) &&
      (p.title || "").toLowerCase().includes((search || "").toLowerCase())
    );
  });

  // pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  // nếu page lớn hơn totalPages (ví dụ sau khi lọc), đưa về totalPages
  useEffect(() => {
    if (page > totalPages) {
      const newPage = totalPages;
      setPage(newPage);
      setPageInput(String(newPage));
      setSearchParams({ category: category, page: String(newPage) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts.length, totalPages]);

  const changePage = (newPage) => {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setPage(newPage);
    setPageInput(String(newPage));
    setSearchParams({ category: category, page: String(newPage) });

    // scroll to top: ưu tiên cuộn element container nếu layout cuộn trong div,
    // fallback về window.scrollTo nếu không tìm thấy.
    try {
      const container = document.querySelector(".container-products");
      if (container && typeof container.scrollIntoView === "function") {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      // nếu lỗi thì ít nhất scroll window
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // NEW: tạo danh sách trang để hiển thị nút (show ellipsis khi nhiều trang)
  const getPageList = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    const left = Math.max(2, page - 2);
    const right = Math.min(totalPages - 1, page + 2);

    if (left > 2) pages.push("left-ellipsis");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("right-ellipsis");

    pages.push(totalPages);
    return pages;
  };

  // NEW: handlers cho input số trang
  const handlePageInputChange = (e) => {
    // giữ nguyên chuỗi để người dùng có thể nhập tạm (ví dụ "0" hoặc "")
    setPageInput(e.target.value);
  };

  const applyPageInput = () => {
    const n = Number(pageInput);
    if (!Number.isFinite(n) || n < 1) {
      // reset về trang hiện tại nếu input không hợp lệ
      setPageInput(String(page));
      return;
    }
    changePage(Math.min(Math.max(1, Math.floor(n)), totalPages));
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      applyPageInput();
    }
  };

  const handlePageInputBlur = () => {
    applyPageInput();
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="container-products">
      <div className="subContainer">
        <div className="side-bar">
          {/* Sidebar bên trái */}
          <SidebarCategories onSelectCategory={handleCategoryChange} />
        </div>

        <div className="content">
          {/* Nội dung chính */}
          <div className="title-style" style={{ flex: 1 }}>
            <h2 style={{ marginBottom: "20px" }}>
              {category === "All" ? "Tất cả sản phẩm" : `Sản phẩm: ${category}`}
            </h2>
          </div>

          {/* Grid danh sách sản phẩm */}
          <div className="product-grid">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <p>Không tìm thấy sản phẩm</p>
            )}
          </div>

          {/* Pagination controls */}
          <div
            className="pagination"
            style={{
              marginTop: 20,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <button
              onClick={() => changePage(page - 1)}
              disabled={page <= 1}
              className="icon-pagination-button"
              aria-label="Trang trước"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="sr-only">Prev</span>
            </button>

            <nav aria-label="Pagination">
              <ul className="pagination-list" style={{ display: "flex", gap: 6, listStyle: "none", padding: 0, margin: 0 }}>
                {getPageList().map((item, idx) =>
                  item === "left-ellipsis" || item === "right-ellipsis" ? (
                    <li key={`${item}-${idx}`} className="ellipsis" aria-hidden="true" style={{ padding: "6px 8px" }}>
                      …
                    </li>
                  ) : (
                    <li key={item}>
                      <button
                        onClick={() => changePage(item)}
                        className={`page-button ${item === page ? "active" : ""}`}
                        aria-current={item === page ? "page" : undefined}
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <button
              onClick={() => changePage(page + 1)}
              disabled={page >= totalPages}
              className="icon-pagination-button"
              aria-label="Trang tiếp theo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
