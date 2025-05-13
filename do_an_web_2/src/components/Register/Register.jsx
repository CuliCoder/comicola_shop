import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import * as registerAction from "../../Slice/registerSlice.js";
import { clearState } from "../../Slice/registerSlice.js";
import Spinner from "../Spinner/Spinner.js";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getCode = useSelector((state) => state.register.getCode);
  const checkCode = useSelector((state) => state.register.checkCode);
  const registerUser = useSelector((state) => state.register.registerUser);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerAction.getCode(email));
    setEmailErr(false);
  };
  useEffect(() => {
    setEmailErr(getCode.message);
  }, [getCode.message]);
  const handleSubmitCode = () => {
    dispatch(registerAction.checkCode({ email, code }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerAction.registerUser({ email, password, confirmPassword }));
  };
  useEffect(() => {
    if (registerUser.error === 0) {
      dispatch(clearState());
      navigate("/login");
    }
  }, [registerUser.error]);
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);
  return (
    <div>
      {getCode.loading && <Spinner />}

      <div className="register">
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
        <div className="py-[60px] bg-white ">
          <p className="text-6xl text-slate-200 font-thin mb-3 text-center">
            #my account
          </p>
          <p className="text-3xl font-bold text-center">Tạo tài khoản</p>
          <div className="w-[560px] p-[20px] m-auto mt-14 text-left">
            {checkCode.error !== 0 && (
              <>
                <div className="flex">
                  <p className="font-thin">Địa chỉ email đăng ký mới</p>{" "}
                  <span className="inline text-[red]">*</span>
                </div>
                <div className="flex gap-x-7 h-[40px] items-center">
                  <input
                    type="email"
                    pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
                    name=""
                    id=""
                    className="outline-none border w-full my-2 px-2 py-2"
                    placeholder="Nhập email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                  />
                  <button
                    type="button"
                    className="h-full w-[150px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10"
                    onClick={handleSubmit}
                  >
                    Gửi Mã
                  </button>
                </div>
                {<p className="text-red-600">{getCode.message}</p>}
                <p className="font-thin mt-3">
                  A link to set a new password will be sent to your email
                  address.
                </p>
                <div className="flex mt-10">
                  <p className="font-thin">Kiểm tra mail để lấy mã</p>{" "}
                  <span className="inline text-[red]">*</span>
                </div>
                <div className="flex gap-x-7 h-[40px] items-center  w-[300px]">
                  <input
                    type="text"
                    name=""
                    id=""
                    className="outline-none border w-full my-2 px-2 py-2"
                    placeholder="Mã xác thực"
                    onChange={(e) => {
                      setCode(e.target.value);
                    }}
                    value={code}
                  />
                  <button
                    type="button"
                    className="h-full w-[150px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10"
                    onClick={handleSubmitCode}
                  >
                    Xác nhận
                  </button>
                </div>
                {<p className="font-thin text-red-700">{checkCode.message}</p>}
              </>
            )}
            {checkCode.error === 0 && (
              <form onSubmit={handleRegister}>
                <div className="flex mt-10">
                  <p className="font-thin">Nhập mật khẩu</p>{" "}
                  <span className="inline text-[red]">*</span>
                </div>
                <div className="flex gap-x-7 h-[40px] items-center  w-[300px]">
                  <input
                    type="password"
                    name="password"
                    className="outline-none border w-full my-2 px-2 py-2"
                    placeholder=" Mật khẩu"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                  />
                </div>
                <div className="flex mt-5">
                  <p className="font-thin">Xác nhận lại mật khẩu</p>{" "}
                  <span className="inline text-[red]">*</span>
                </div>
                <div className="flex gap-x-7 h-[40px] items-center  w-[300px]">
                  <input
                    type="password"
                    name="repeatPassword"
                    id=""
                    className="outline-none border w-full my-2 px-2 py-2"
                    placeholder="Nhập lại mật khẩu"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    value={confirmPassword}
                  />
                </div>
                <button
                  type="submit"
                  className="h-full w-[150px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10"
                >
                  Đăng Ký
                </button>
                {
                  <p className="font-thin text-red-700">
                    {registerUser.message}
                  </p>
                }
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
