import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { GoBell } from "react-icons/go";
import { useMyContext } from "../context/contextAPI";
const Notify: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [totalNoti, setTotalNoti] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const currentNoti = useRef(0);
  // const { countNewOrder, setCountNewOrder } = useMyContext();
  // useEffect(() => {
  //   currentNoti.current = totalNoti;
  // }, [totalNoti]);

  const playNotificationSound = () => {
    const audio = new Audio("/images/bell-98033.mp3");
    audio.play();
  };

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL as string;
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("An error occurred. Please try again later.");
    });

    return () => {
      newSocket.close();
    };
  }, []);
  socket?.on("newOrderResponse", () => {
    playNotificationSound();
    setTotalNoti(totalNoti + 1);
  });

  return (
    <>
      <div
        className="fixed"
        onClick={() => {
          setOpenModal(!openModal);
        }}
      >
        <GoBell size={30} fill="" />
        <p className="absolute top-0 right-[-5px] bg-red-400 text-white w-5 h-5 rounded-full text-center">
          {/* {countNewOrder} */}
          {totalNoti}
        </p>
      </div>
      {openModal && (
        <div className=" absolute top-0 right-0 w-52 h-52 bg-white border-black border p-2 rounded-sm">
          <div className="h-40">
            <p>Có {totalNoti} đơn hàng mới</p>
          </div>
          <div>
            <button
              onClick={() => {
                setTotalNoti(0);
                // setCountNewOrder(0);
              }}
              className="bg-blue-500 text-white rounded-md p-1 ml-5"
            >
              Đánh dấu đã đọc
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notify;
