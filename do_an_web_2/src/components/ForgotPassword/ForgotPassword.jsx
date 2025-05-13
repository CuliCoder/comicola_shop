import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rgEmail } from "../../utils/regex";
import axios from "../../config/configAxios";
import { useDispatch, useSelector } from "react-redux";
import { setShowToast } from "../../Slice/MyToastSlice";
import Spinner from "../Spinner/Spinner";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!rgEmail.test(email)) {
      setLoading(false);
      dispatch(
        setShowToast({
          show: true,
          message: "Email không hợp lệ",
          type: "error",
        })
      );
      return;
    }
    const request = async () => {
      await axios
        .put("/auth/forgot-password", { email })
        .then((res) => {
          setLoading(false);
          dispatch(
            setShowToast({
              show: true,
              message: res.data.message,
              type: res.data.error === 0 ? "success" : "error",
            })
          );
          res.data.error === 0 && navigate("/login");
        })
        .catch((err) => {
          setLoading(false);
          dispatch(
            setShowToast({
              show: true,
              message: err.response.data.message,
              type: "error",
            })
          );
        });
    };
    request();
  };
  return (
    <div>
      {loading && <Spinner />}
      <div className=" reset-password pb-10">
        <div className="breadcrumb bg-[#f4f9fc] h-[110px] py-5 ">
          <div className="flex items-center justify-center">
            <a href="/" className="px-1">
              Trang Chủ
            </a>{" "}
            / <p className="font-medium px-1"> Tài khoản của tôi</p>
          </div>
          <div className="text-3xl font-bold text-center">
            Tài khoản của tôi
          </div>
        </div>
        <div className="py-[60px] bg-white w-[1170px] m-auto">
          <form className="text-left" onSubmit={handleSubmit}>
            <p className="font-thin text-sm">
              Quên mật khẩu? Vui lòng nhập địa chỉ email. Bạn sẽ nhận được một
              mật khẩu mới qua email.
            </p>
            <p className="font-bold text-l mt-5">Nhập email:</p>
            <input
              type="email"
              name=""
              id=""
              autoComplete="off"
              placeholder="Email"
              className="w-4/5 outline-none focus:shadow px-2 py-3 border mt-1 font-medium text-slate-900"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <button
              type="submit"
              className="h-full w-[200px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10 block"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
