import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Mainpage.css";
import leftBanner from "../../Images/Banner/left.webp";
import rightTopBanner from "../../Images/Banner/rightTop.jpg";
import leftBottomBanner from "../../Images/Banner/leftbottom.jpg";
import rightBottomBanner from "../../Images/Banner/rightBottom.jpg";
import chieuHoangKi from "../../Images/Banner/ChieuHoangKi.jpg";
import tarotKieu from "../../Images/Banner/tarotKieu.jpg";
import thunhoibong from "../../Images/Banner/thunhoibongvang.jpg";
import { useSelector } from "react-redux";
import { formatPrice } from "../../config/formatPrice";
import Chat from "../Chat/Chat";
export default function () {
  const { newProducts, byCategory1, byCategory2 } = useSelector(
    (state) => state.products.products_mainpage
  );
  return (
    <>
      {/* {loading && <Spinner />} */}
      <div className="mb-20 relative">
        <div className="banner mb-8">
          <div className="flex">
            <div className="relative overflow-hidden ">
              <img src={leftBanner} alt="" />
              <div
                className=" w-full h-full absolute top-0 font-semibold  text-3xl text-white flex items-center justify-center opacity-0"
                style={{ background: `rgba(10, 10, 10, 0.5)` }}
              >
                <p> Boardgame Thành Tích</p>
              </div>
            </div>
            <div>
              <div className="relative overflow-hidden">
                <img src={rightTopBanner} alt="" />
                <div
                  className=" w-full h-full absolute top-0 font-semibold  text-3xl text-white flex items-center justify-center opacity-0"
                  style={{ background: `rgba(10, 10, 10, 0.5)` }}
                >
                  <p>Muốn bỏ cậu vào giỏ hàng! - Tập 1</p>
                </div>
              </div>
              <div className="flex ">
                <div className="relative overflow-hidden">
                  <img src={leftBottomBanner} alt="" />
                  <div
                    className=" w-full h-full absolute top-0 font-semibold  text-3xl text-white flex items-center justify-center opacity-0"
                    style={{ background: `rgba(10, 10, 10, 0.5)` }}
                  >
                    <p className="w-[300px]">
                      {" "}
                      Bẩm thầy Tường, có thầy Vũ đến tìm!
                    </p>
                  </div>
                </div>
                <div className="relative overflow-hidden">
                  <img src={rightBottomBanner} alt="" />
                  <div
                    className=" w-full h-full absolute top-0 font-semibold  text-3xl text-white flex items-center justify-center opacity-0"
                    style={{ background: `rgba(10, 10, 10, 0.5)` }}
                  >
                    <p className="w-[300px]">Truyện Ma Sau 6 Giờ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[1170px] m-auto text-center">
          <h1 className="text-6xl font-thin text-slate-100 tracking-wide">
            Sản phẩm mới
          </h1>
          <h1 className="text-2xl font-bold">Sản phẩm mới</h1>
          <div className="grid grid-rows-2 grid-cols-4 gap-x-6 mt-[30px]">
            {newProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="h-[490px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md"
              >
                <div className="h-[350px] object-cover">
                  <img src={product.thumbnail} alt="" />
                </div>
                <div className="name duration-100">
                  <p className="mt-[40px] font-normal w-full mb-5">
                    {product.title}
                  </p>
                  <span className="font-medium my-4">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <button
                  type="button"
                  className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold
              hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
               `}
                >
                  <FaCartPlus className=" w-5 h-10 px-1" />
                  THÊM VÀO GIỎ HÀNG
                </button>
              </Link>
            ))}
          </div>
          <Link
            to="/products"
            className={`flex h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold max-w-80 mt-5
              hover:bg-slate-900 duration-200 items-center justify-center
               `}
          >
            <FaCartPlus className=" w-5 h-10 px-1" />
            XEM THÊM SẢN PHẨM
          </Link>
        </div>
        <div className="w-[1170px] m-auto text-center my-20">
          <div className="flex gap-x-10">
            <div className="w-[570px] h-[565px] object-cover overflow-hidden pushImg">
              <img src={chieuHoangKi} alt="" />
              <div className="bg-black text-white text-center h-24 p-2 desc">
                <h3 className="qc-heading font-semibold text-xl">
                  {" "}
                  Chiêu Hoàng Kỷ{" "}
                </h3>
                <p className="text-sm font-thin">
                  Tác phẩm được lấy cảm hứng từ cuộc đời của Lý Chiêu Hoàng – vị
                  nữ đế đầu tiên và duy nhất trong lịch sử phong kiến của Việt
                  Nam.
                </p>
              </div>
            </div>
            <div className="w-[570px] h-[565px] object-cover overflow-hidden pushImg">
              <img src={tarotKieu} alt="" />
              <div className="bg-black text-white text-center h-24 p-2 desc">
                <h3 className="qc-heading font-semibold text-xl">
                  {" "}
                  Truyện Kiều và Tarot
                </h3>
                <p className="text-sm font-thin">
                  Cỗ bài Tarot và tác phẩm truyện thơ Truyện Kiều dù có cách thể
                  hiện khác nhau, cùng nhắm đến kể chuyện về nhân sinh và con
                  người.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Chat />
        <div className="w-[1170px] m-auto text-center">
          <h1 className="text-6xl font-thin text-slate-100 tracking-wide">
            Truyện tranh Việt Nam đặc sắc
          </h1>
          <h1 className="text-2xl font-bold">
            Các truyện tranh của tác giả Việt Nam
          </h1>
          <div className="grid grid-rows-2 grid-cols-4 gap-x-6 mt-[30px]">
            {byCategory1.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="h-[490px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md"
              >
                <div className="h-[350px] object-cover">
                  <img src={product.thumbnail} alt="" />
                </div>
                <div className="name duration-100">
                  <p className="mt-[40px] font-normal w-full mb-5">
                    {product.title}
                  </p>
                  <span className="font-medium my-4">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <button
                  type="button"
                  className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold
              hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
               `}
                >
                  <FaCartPlus className=" w-5 h-10 px-1" />
                  THÊM VÀO GIỎ HÀNG
                </button>
              </Link>
            ))}
          </div>
          <Link
            to="/"
            className={`flex h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold max-w-80
              hover:bg-slate-900 duration-200 items-center justify-center mt-5
               `}
          >
            <FaCartPlus className=" w-5 h-10 px-1 " />
            XEM THÊM SẢN PHẨM
          </Link>
        </div>
        <div
          className="w-full h-[400px] my-24"
          style={{
            backgroundImage: `url(${thunhoibong})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        ></div>
        <div className="w-[1170px] m-auto text-center">
          <h1 className="text-6xl font-thin text-slate-100 tracking-wide">
            Truyện tranh nước ngoài đặc sắc
          </h1>
          <h1 className="text-2xl font-bold">
            Các truyện tranh của tác giả quốc tế
          </h1>
          <div className="grid grid-rows-1 grid-cols-4 gap-x-6 mt-[30px]">
            {/* Product item */}
            {byCategory2.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="h-[490px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md"
              >
                <div className="h-[350px] object-cover">
                  <img src={product.thumbnail} alt="" />
                </div>
                <div className="name duration-100">
                  <p className="mt-[40px] font-normal w-full mb-5">
                    {product.title}
                  </p>
                  <span className="font-medium my-4">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <button
                  type="button"
                  className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold
                    hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
                    `}
                >
                  <FaCartPlus className=" w-5 h-10 px-1" />
                  THÊM VÀO GIỎ HÀNG
                </button>
              </Link>
            ))}
          </div>
          <Link
            to="/"
            className={`flex h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-bold max-w-80
              hover:bg-slate-900 duration-200 items-center justify-center mt-5
               `}
          >
            <FaCartPlus className=" w-5 h-10 px-1 " />
            XEM THÊM SẢN PHẨM
          </Link>
        </div>
      </div>
    </>
  );
}
