import React from "react";
import logothanhtoan from "../Images/logothanhtoan.webp";
import logoBocongthong from "../Images/bocongthuong.png";

export default function Footer() {
  return (
    <div>
      <div className="footer w-full bg-[#232323] h-[480px] px-[160px] py-[64px] text-white">
        <div className="row flex justify-between text-left mb-6">
          <div className="footer-desc w-[470px] text-slate-300">
            <p>
              Comicola™, logo Comicola là nhãn hiệu đã đăng ký với Cục Sở Hữu
              Trí Tuệ. Các sản phẩm có nhãn hiệu Comicola™ thuộc sở hữu của công
              ty Cổ phần Comicola. Các sản phẩm khác do Comicola phát hành thuộc
              về chủ sở hữu tương ứng.
            </p>
          </div>
          <div className="instructions">
            <ul className="mt-[-8px]">
              <li className="item py-1 text-[16px]">Hướng dẫn thanh toán</li>
              <li className="item py-1 text-[16px]">Hướng dẫn hủy đơn hàng</li>
              <li className="item py-1 text-[16px]">Kiểm tra đơn hàng</li>
            </ul>
          </div>
          <div className="article">
            <ul className="mt-[-8px]">
              <li className="item py-1 text-[16px]">Điều khoản sử dụng</li>
              <li className="item py-1 text-[16px]">
                Chính Sách Bảo Mật Thông Tin
              </li>
              <li className="item py-1 text-[16px]">
                Chính Sách Bảo Mật Thanh Toán
              </li>
            </ul>
          </div>
        </div>
        <div className="info mt-[60px]">
          <div className="">
            <p className="text-slate-300 text-[14px]">
              Các phương thức thanh toán
            </p>
            <div className="flex justify-center mt-2">
              <img src={logothanhtoan} alt="Logo thanh toan" />
            </div>
          </div>
          <div className="flex justify-between mt-10">
            <div className="authen text-left text-slate-300 text-[14px]">
              <p>
                Giấy xác nhận Đăng ký hoạt động phát hành Xuất bản phẩm số
                5379/XN-CXBIPH do Cục Xuất bản, In và Phát hành cấp ngày
                09/09/2019
              </p>
              <p>
                Giấy Đăng kí kinh doanh số 0313105297 do Sở Kế hoạch và Đầu tư
                thành phố Hồ Chí Minh cấp ngày 21/1/2015
              </p>
            </div>
            <img
              className="w-[164px] h-[62px]"
              src={logoBocongthong}
              alt="Logo Bo Cong Thuong"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
