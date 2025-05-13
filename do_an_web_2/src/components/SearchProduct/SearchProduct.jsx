import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../Slice/cartSlice";
import { FaCartPlus } from "react-icons/fa";
import { fetchAddToCart } from "../../Slice/cartSlice";
import "./SearchProduct.css";

export default function SearchProduct() {
  const { valueSearch } = useParams();
  const [productBySearch, setProductBySearch] = useState([]);
  const products = useSelector(
    (state) => state.products.products_page.byUpdatedAt
  );
  const status = useSelector((state) => state.status);
  const dispatch = useDispatch();
  useEffect(() => {
    if (products && products.length > 0) {
      let productSearch = products.filter((product) =>
        product.title.toLowerCase().includes(valueSearch.replaceAll("-", " "))
      );
      setProductBySearch(productSearch);
    }
  }, [products, valueSearch]);
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
              <Link to="/products">Cửa hàng</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <div className="font-bold text-gray-800">{`Kết quả tìm kiếm cho ${valueSearch.replaceAll("-", " ")}`}</div>{" "}
            </Breadcrumb.Item>
          </div>
        </div>
      </Breadcrumb>
      <div className="w-[1170px] m-auto">
        <div>
          <p className="text-2xl font-bold mb-5 mt-10">
            Tên đã tìm kiếm: {(() => valueSearch.replaceAll("-", " "))()}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-x-6 mt-[60px] gap-y-2">
          {productBySearch.length > 0 ? (
            productBySearch.map((product, index) => (
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
            ))
          ) : (
            <p className="text-2xl font-bold">
              Không có sản phẩm nào khớp với từ khóa
            </p>
          )}
        </div>
        <Link
          to="/products"
          className={`flex h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold max-w-80 mt-5
              hover:bg-slate-900 duration-200 items-center justify-center my-10
               `}
        >
          <FaCartPlus className=" w-5 h-10 px-1" />
          XEM THÊM SẢN PHẨM
        </Link>
      </div>
    </div>
  );
}
