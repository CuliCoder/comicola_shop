import React, { useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { LiaTimesSolid } from "react-icons/lia";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { BsCart } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteProduct, removeFromCart } from "../../Slice/cartSlice";
import { formatPrice } from "../../config/formatPrice";
import { setShowToast } from "../../Slice/MyToastSlice";
import logo from "../../Images/Comi_shop_logo.png";
import "./header.css";

export default function Header() {
  const productInCart = useSelector((state) => state.cart.getCart.items);
  const dispatch = useDispatch();
  const [enable, setEnable] = useState("hidden");
  const [hasproducts, setHasProducts] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [status_login, setStatus_login] = useState(false);
  const status = useSelector((state) => state.status);
  const authors = useSelector((state) => state.author.authors);
  const categorys = useSelector((state) => state.category.categories);
  const navigate = useNavigate();
  useEffect(() => {
    setStatus_login(status.error === 0);
  }, [status.error]);
  function handleCloseModal() {
    setEnable("hidden");
  }

  useEffect(() => {
    let total = 0;
    productInCart.forEach((item) => {
      total += parseInt(item.price * item.quantity);
    });
    setCurrentPrice(total);
    setHasProducts(productInCart.length > 0);
  }, [productInCart]);

  const handleSearchProduct = () => {
    let valueSeach = searchValue;
    if (valueSeach == "") {
      setOpenSearch(false);
    } else {
      valueSeach = searchValue.trim().toLowerCase().replaceAll(" ", "-");
      navigate(`/search/${valueSeach}`);
      setOpenSearch(false);
      setSearchValue("");
    }
  };

  return (
    <div>
      <div className="header w-full bg-red- h-24 border-black py-2 px-8 relative z-10">
        <div className="header-content flex justify-between items-center w-10/12 mx-auto">
          <Link to="/">
            <div className="header-logo w-52 object-cover">
              <img src={logo} alt="Logo Shop" />
            </div>
          </Link>
          <ul className="header-navbar flex justify-between font-face-mt px-2 text-sm gap-x-6">
            <Link to="/">
              <li className="navbar-item px-1 py-[20px]">TRANG CHỦ</li>
            </Link>
            <Link
              to="/products"
              className="navbar-item px-1 py-[20px] relative"
            >
              SẢN PHẨM
              <div className="modal-products shadow flex justify-between p-[18px] absolute w-[670px] text-left mt-[20px] bg-white z-5 ">
                <div className="col-1">
                  <p className="title font-bold">TÁC GIẢ TIÊU BIỂU</p>
                  <ul>
                    {authors.map((author) => (
                      <Link to={"/author/" + author.value}>
                        <li className="mt-7">{author.label}</li>
                      </Link>
                    ))}
                  </ul>
                </div>
                <div className="col-2">
                  <p className="title font-bold">SÁCH</p>
                  <ul>
                    {categorys.map((category) => (
                      <Link to={"/products/category/" + category.value}>
                        <li className="mt-7">{category.label}</li>
                      </Link>
                    ))}
                  </ul>
                </div>
                {/* <div className="col-3">
                  <p className="title font-bold">CÁC SẢN PHẨM KHÁC</p>
                  <ul>
                    <li className="mt-7">Huy Hiệu Tráng Men</li>
                    <li className="mt-7">Boardgame</li>
                    <li className="mt-7">Bookmark</li>
                    <li className="mt-7">Huy Hiệu Tráng Men</li>
                    <li className="mt-7">Huy Hiệu Tráng Men</li>
                  </ul>
                </div> */}
              </div>
            </Link>

            <Link to={status_login ? "/my-account" : "/login"}>
              <li className="navbar-item px-1 py-[20px]">TÀI KHOẢN CỦA TÔI</li>
            </Link>
          </ul>
          <div className="account-cart flex gap-x-4 ">
            {/* Input search */}
            <input
              type="text"
              className={`search-input focus:outline-none focus:ring-0 focus:shadow-none ${
                openSearch ? "enable" : "disable"
              }`}
              style={{
                border: "none",
                borderBottom: "1px solid black",
                outline: "none",
                padding: "0 10px 5px 10px",
                paddingBottom: "5px",
                width: "280px",
                borderColor: "#ccc",
                transition: "all 0.2s linear",
              }}
              name=""
              id=""
              placeholder="Nhập thông tin tìm kiếm..."
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.querySelector(".search-icon").click();
                }
              }}
              value={searchValue}
            />
            {/* Btn search */}
            <div
              style={{
                backgroundColor: "white",
                paddingBottom: "8px",
              }}
              className="search-icon hover:cursor-pointer"
              onClick={() => {
                handleSearchProduct();
              }}
              onMouseOver={() => {
                setOpenSearch(true);
              }}
            >
              <AiOutlineSearch
                style={{
                  color: "black",
                }}
              />
            </div>
            {/* User */}
            <Link to={status_login ? "/my-account" : "/login"}>
              <div>
                <AiOutlineUser />
              </div>
            </Link>

            {/* Cart */}
            <div
              className="flex items-starts relative hover:cursor-pointer"
              onClick={() => {
                setEnable("block");
              }}
            >
              <BsCart />
              <div
                className="w-4 h-4 bg-red-500 rounded-full text-white size-2 flex items-center justify-center absolute"
                style={{ bottom: "6px", right: "94px" }}
              >
                {(() => {
                  let count = 0;
                  productInCart.forEach((item) => (count += item.quantity));
                  return count;
                })()}
              </div>
              <p
                style={{
                  display: "inline-block",
                  lineHeight: "14px",
                  paddingLeft: "8px",
                  fontWeight: "bold",
                  width: "100px",
                  minWidth: "50px",
                }}
              >
                {formatPrice(currentPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`modal w-screen h-screen  fixed right-0 top-0 end-0 ${enable} fixed z-20`}
        onClick={handleCloseModal}
      >
        <div
          className="modal-cart w-[400px] h-screen hover:overflow-y-scroll bg-white right-0 absolute px-5 py-10 "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Sản phẩm gần đây</h1>
            <div
              className="w-4 h-4 border border-current flex justify-center items-center hover:border-orange-600 hover:cursor-pointer"
              onClick={handleCloseModal}
            >
              <LiaTimesSolid />
            </div>
          </div>
          <div className="mt-10 text-left ">
            {hasproducts ? (
              <div>
                <div className="cart-mini relative">
                  {/* Item */}
                  {productInCart.map((product) => (
                    <div className="flex justify-between mb-3" key={product.id}>
                      <img
                        className="w-[90px] "
                        src={product.thumbnail}
                        alt=""
                      />
                      <div className="w-[180px] ml-[-30px]">
                        <p className="text-sm text-slate-700">{product.name}</p>
                        <p>(x{product.quantity})</p>
                        <p>{formatPrice(product.price * product.quantity)}</p>
                      </div>
                      <div
                        className="w-3 h-3 border border-current flex justify-center items-center hover:border-orange-600 hover:cursor-pointer"
                        onClick={() => {
                          dispatch(deleteProduct(product));
                          dispatch(
                            setShowToast({
                              show: true,
                              message: "Xóa sản phẩm thành công",
                              type: "success",
                            })
                          );
                          {
                            status.error === 0 &&
                              dispatch(removeFromCart(product.id));
                          }
                        }}
                      >
                        <LiaTimesSolid />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-[80px]">
                  <p>Giá sản phẩm: {formatPrice(currentPrice)}</p>
                  <div className="">
                    <Link
                      to={
                        productInCart.length > 0
                          ? status_login
                            ? "/checkout"
                            : "/login"
                          : ""
                      }
                      onClick={handleCloseModal}
                      className="w-full h-[46px] bg-orange-500 text-white flex items-center justify-center mt-5 rounded-sm hover:bg-slate-400 hover:cursor-pointer duration-75 font-medium"
                    >
                      <FaLock />
                      <p className="ml-3">Thanh Toán</p>
                    </Link>
                    <Link
                      to="/cart"
                      className="w-full h-[46px] bg-white text-slate-950 flex items-center justify-center mt-5 border-slate-700 rounded-sm hover:bg-orange-500 hover:cursor-pointer hover:text-white duration-75 font-medium"
                      onClick={handleCloseModal}
                    >
                      <BsCart />
                      <p>Giỏ Hàng</p>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p>Bạn chưa có sản phẩm nào trong giỏ</p>
                <Link
                  to="/products"
                  className="w-60 h-[46px] bg-orange-500 text-white flex items-center justify-center mt-5 rounded-sm hover:bg-slate-400 hover:cursor-pointer duration-75 font-medium"
                  onClick={handleCloseModal}
                >
                  <p> TIẾP TỤC MUA SẮM</p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
