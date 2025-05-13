import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../Slice/cartSlice";
import { Link } from "react-router-dom";
import { Pagination } from "flowbite-react";
import { CgMenuGridR } from "react-icons/cg";
import { FaCartPlus } from "react-icons/fa";
import { Breadcrumb } from "flowbite-react";
import { fetchAddToCart } from "../../Slice/cartSlice";
const Products = React.memo(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);
  const [fillterValue, setFillterValue] = useState("");
  const [allProducts, setAllProducts] = useState();
  const productInCart = useSelector((state) => state.cart.items);
  const [totalPages, setTotalPages] = useState(0);
  const [productsInCurrentPage, setProductsInCurrentPage] = useState();
  const [countProduct, setCountProduct] = useState();
  const itemsPerPage = 12;
  const dispatch = useDispatch();
  const { byUpdatedAt, byPriceAsc, byPriceDesc, loading } = useSelector(
    (state) => state.products.products_page
  );
  const status = useSelector((state) => state.status);
  useEffect(() => {
    const handleFillProduct = () => {
      switch (fillterValue) {
        case "1":
          setAllProducts(byUpdatedAt);
          break;
        case "2":
          setAllProducts(byPriceAsc);
          break;
        case "3":
          setAllProducts(byPriceDesc);
          break;
        default:
          setAllProducts(byUpdatedAt);
          break;
      }
    };
    if (byUpdatedAt && byPriceAsc && byPriceDesc) {
      handleFillProduct();
    }
  }, [fillterValue, byUpdatedAt, byPriceAsc, byPriceDesc]);
  useEffect(() => {
    if (byUpdatedAt) {
      setTotalPages(Math.ceil(byUpdatedAt.length / itemsPerPage));
    }
  }, [byUpdatedAt]);
  useEffect(() => {
    if (allProducts) {
      setProductsInCurrentPage(renderProduct(currentPage, itemsPerPage));
      const textCount =
        "Hiển thị " +
        ((currentPage - 1) * itemsPerPage + 1) +
        "-" +
        ((currentPage - 1) * itemsPerPage + itemsPerPage > allProducts.length
          ? allProducts.length
          : (currentPage - 1) * itemsPerPage + itemsPerPage) +
        " của " +
        allProducts.length +
        " kết quả";
      setCountProduct(textCount);
    }
  }, [allProducts, currentPage]);
  // Pagination
  const renderProduct = (pageNumber, itemsPerPage) => {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = allProducts.slice(startIndex, endIndex);
    return pageData;
  };
  const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    let numFormat = formatter.format(number);
    return numFormat;
  };

  return (
    <div>
      <div className="products pb-[120px]">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="bg-[#f4f9fc] h-[60px] items-centerpx-5 py-3 dark:bg-gray-800"
        >
          <div className="w-[1170px] m-auto">
            <div className="flex justify-center items-center">
              <Breadcrumb.Item>
                <Link to="/">Trang Chủ</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/products" className="font-bold text-gray-800">
                  Cửa hàng
                </Link>{" "}
              </Breadcrumb.Item>
            </div>
          </div>
        </Breadcrumb>
        <div className="preview w-[1170px] m-auto mt-10">
          <div className="fillter flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <div>
                <CgMenuGridR className="w-[30px] h-[30px]" />
              </div>
              <p className="font-medium text-medium">{countProduct}</p>
            </div>
            <div className="h-[40px]">
              <select
                className="focus:ring-0 rounded-sm"
                onChange={(e) => {
                  setFillterValue(e.target.value);
                }}
              >
                <option value="0">Thứ tự mặc định:</option>
                <option value="1">Mới nhất</option>
                <option value="2">Theo giá: từ thấp đến cao</option>
                <option value="3">Theo giá: từ cao xuống thấp</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-6 mt-[60px] gap-y-2">
            {productsInCurrentPage &&
              productsInCurrentPage.map((product, index) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="h-[490px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md"
                >
                  <div className="h-[350px] object-cover">
                    <img src={product.thumbnail} alt="" />
                  </div>
                  <div className="name duration-100 p-2">
                    <p className="mt-[40px] font-normal w-full mb-5">
                      {product.title}
                    </p>
                    <span className="font-medium my-4">
                      {formatNumber(product.price)}
                    </span>
                  </div>
                  <Link to="/cart">
                    <button
                      type="button"
                      className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold
                  hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
                  `}
                      onClick={() => {
                        {
                          status.error === 0 &&
                            dispatch(
                              fetchAddToCart({
                                id_product: product.id,
                                quantity: 1,
                                price: product.price,
                              })
                            );
                        }
                        dispatch(
                          addProduct({
                            id: product.id,
                            name: product.title,
                            price: product.price,
                            quantity: 1,
                            total_price: product.price * 1,
                            thumbnail: product.thumbnail,
                          })
                        );
                      }}
                    >
                      <FaCartPlus className=" w-5 h-10 px-1" />
                      THÊM VÀO GIỎ HÀNG
                    </button>
                  </Link>
                </Link>
              ))}
          </div>
          <div className="flex overflow-x-auto sm:justify-center mt-[30px]">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default Products;
