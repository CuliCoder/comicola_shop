// Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa";
import { BsChat } from "react-icons/bs";
import { useSelector } from "react-redux";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const infoUser = useSelector((state) => state.user.infomation);
  const chatView = useRef(null);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "" && socket) {
      socket.emit("userMessage", inputMessage);
      socket.emit("newUser", {
        socketId: socket.id,
      });
      setMessages((prev) => [
        ...prev,
        { id: socket.id, fromAdmin: false, message: inputMessage },
      ]);
      setInputMessage("");
    }
  };

  useEffect(() => {
    const newSocket = io.connect(process.env.REACT_APP_API_URL);
    setSocket(newSocket);

    newSocket.on("adminResponse", (data) => {
      if (data) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    chatView.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed right-2 bottom-4">
      <div
        className="rounded-[50%] w-16 h-16 bg-slate-100 flex justify-center items-center cursor-pointer shadow-lg"
        onClick={() => {
          setOpenChat(!openChat);
        }}
      >
        <BsChat className="w-12 h-12" />
      </div>
      <div
        className={`${
          openChat ? "flex" : "hidden"
        } flex-col h-[500px] max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden absolute right-[80px] top-[-450px]`}
      >
        <div className="bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Chat with shop</h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.fromAdmin ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.fromAdmin
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                } scrollbar overflow-y-auto`}
                ref={chatView}
              >
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleSendMessage}
              aria-label="Send message"
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            >
              <FaPaperPlane className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
