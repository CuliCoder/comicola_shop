import React, { useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer";
import MyToast from "../MyToast/MyToast";
import { useDispatch, useSelector } from "react-redux";
import { setCloseToast } from "../../Slice/MyToastSlice";
export default function Layout({ children }) {
  const toast = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  useEffect(() => {
    if (toast.show) {
      setTimeout(() => {
        dispatch(setCloseToast());
      }, 3000);
    }
  }, [toast.show]);
  return (
    <div>
      <Header />
      <main>
        {toast.show && <MyToast type={toast.type} message={toast.message} />}
        {children}
      </main>
      <Footer />
    </div>
  );
}
