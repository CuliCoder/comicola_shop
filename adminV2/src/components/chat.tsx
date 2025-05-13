import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { FaPhone, FaVideo, FaPaperPlane } from "react-icons/fa";

interface Message {
  id: number;
  message: string;
  fromAdmin?: boolean;
}

interface Users {
  socketId: string;
  chats: Message[];
}

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL;
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError("Connection error. Please try again later.");
    });

    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("An error occurred. Please try again later.");
    });

    newSocket.on(
      "userResponse",
      (data: { id: string; message: string; fromAdmin: boolean }) => {
        console.log(data);
        const { id, message, fromAdmin } = data;
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now(), message, fromAdmin },
        ]);
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          const userExist = updatedUsers.find((user) => user.socketId === id);
          if (userExist) {
            userExist.chats.push({
              id: Date.now(),
              message,
              fromAdmin: false,
            });
          } else {
            updatedUsers.push({
              socketId: id,
              chats: [{ id: Date.now(), message, fromAdmin: false }],
            });
          }
          return updatedUsers;
        });
      }
    );

    newSocket.on("newUserResponse", (users: Users[]) => {
      const r = users.map((user) => ({
        socketId: user.socketId,
        chats: [],
      }));
      setUsers(r);
    });

    return () => {
      newSocket.off("newUserResponse");
      newSocket.close();
    };
  }, []);

  const selectUser = (id: string) => {
    setSelectedUserId(id);
    const user = users.find((user) => user.socketId === id);
    setChatMessages(user ? user.chats : []);
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== "" && socket && selectedUserId) {
      socket.emit("adminReply", {
        id: selectedUserId,
        message: inputMessage,
        fromAdmin: true,
      });
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), message: inputMessage, fromAdmin: true },
      ]);
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        const userExist = updatedUsers.find(
          (user) => user.socketId === selectedUserId
        );
        if (userExist) {
          userExist.chats.push({
            id: Date.now(),
            message: inputMessage,
            fromAdmin: true,
          });
        }
        return updatedUsers;
      });
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="relative">
      <div
        className="flex justify-center items-center w-[45px] h-[45px] bg-primary-200 rounded-full"
        onClick={() => setOpenModal(!openModal)}
      >
        Open Chat
      </div>
      <div
        className={`${
          openModal ? "flex" : "hidden"
        }  w-[700px] absolute right-10 top-0 bg-primary-50 rounded-sm shadow-lg p-4`}
      >
        <div className=" border-r-2 border-r-gray-500 pr-1 mr-1">
          <h3>Tin nhắn nhận được</h3>
          {Object.keys(users).length === 0 && (
            <p>Không có tin nhắn nào hiện tại</p>
          )}
          {users.map((user) => {
            return (
              <div
                className={`text-lg text-gray-700 ${
                  selectedUserId === user.socketId ? "bg-gray-200" : ""
                }`}
                onClick={() => selectUser(user.socketId)}
              >
                Người dùng {user.socketId}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center h-[400px] ">
          {selectedUserId ? (
            <div className="flex flex-col h-[400px] w-[400px] max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
              <div className="bg-white shadow-md">
                <div className="flex items-center justify-between p-4">
                  <p>{selectedUserId}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4"></div>

              <div className="bg-white p-4">
                {Array.isArray(chatMessages) &&
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{ textAlign: msg.fromAdmin ? "right" : "left" }}
                    >
                      {msg.message}
                    </div>
                  ))}
                <div className="flex space-x-2">
                  {selectedUserId && (
                    <div>
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                      <button
                        onClick={sendMessage}
                        aria-label="Send message"
                        className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                      >
                        <FaPaperPlane className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <h3>Chọn người dùng muốn phản hồi</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
