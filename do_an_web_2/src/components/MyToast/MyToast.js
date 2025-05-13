import { Toast } from "flowbite-react";
import { HiCheck, HiX, HiExclamation } from "react-icons/hi";
import React from "react";
import "./MyToast.css";
const MyToast = ({ type, message }) => {
  const icon = () => {
    switch (type) {
      case "success":
        return <HiCheck className="h-5 w-5" />;
      case "error":
        return <HiX className="h-5 w-5" />;
      case "warning":
        return <HiExclamation className="h-5 w-5" />;
    }
  };
  const color = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200";
      case "error":
        return "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200";
      case "warning":
        return "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200";
    }
  };
  return (
    <Toast id="toast" className="fixed top-50 right-5 ">
      <div
        className={
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
          color()
        }
      >
        {icon()}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
    </Toast>
  );
};
export default React.memo(MyToast);
