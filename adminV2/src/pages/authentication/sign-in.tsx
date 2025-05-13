/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import axios from "../../config/axios";
import { useDispatch } from "react-redux";
import { showToast } from "../../Slice/toast";
import { useNavigate } from "react-router-dom";

const SignInPage: FC = function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginAdmin = async () => {
    try {
      await axios
        .post("/api/v2/auth/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          if (res.data.code === 1) {
            localStorage.setItem("token", res.data.accessToken);
            dispatch(showToast({ type: "success", message: "Login success" }));
            window.location.href = "/";
          } else {
            dispatch(showToast({ type: "error", message: res.data.message }));
            setMessage(res.data.message);
          }
        })
        .catch((error) => {
          dispatch(showToast({ type: "error", message: error }));
        });
    } catch (error) {
      dispatch(showToast({ type: "error", message: "Login failed" }));
      console.error("Login failed:", error);
    }
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLoginAdmin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="ComiShop logo"
          src="/images/Comi_shop_logo.png"
          className="mr-3 h-12"
        />
      </div>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in to dashboard
        </h1>
        <form>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder=""
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              onKeyPress={handlePressEnter}
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div>
          </div>
          <div className="mb-6">
            <Button onClick={handleLoginAdmin} className="w-full lg:w-auto">
              Login to your account
            </Button>
          </div>
        </form>
        <p className="text-red-500 font-light">{message ? message : null}</p>
      </Card>
    </div>
  );
};

export default SignInPage;
