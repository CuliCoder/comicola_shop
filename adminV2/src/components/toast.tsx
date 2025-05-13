import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./toast.css";

import { removeToast } from "../Slice/toast";
import { RootState } from "../store";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

const ToastComponent = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(removeToast(toast.id)), 2000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, dispatch]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast className="toast">
          {toast.toast.type == "success" ? (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
          ) : toast.toast.type == "error" ? (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-green-800 dark:text-green-200">
              <HiX className="h-5 w-5" />
            </div>
          ) : (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-500 dark:bg-green-800 dark:text-green-200">
              <HiExclamation className="h-5 w-5" />
            </div>
          )}
          <div className="ml-3 text-sm font-normal">{toast.toast.message}</div>
        </Toast>
      ))}
    </div>
  );
};

export default ToastComponent;
