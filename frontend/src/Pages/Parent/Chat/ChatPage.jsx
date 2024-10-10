import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import ParentHeader from "../../../Components/Header/ParentHeader";
import Footer from "../../../Components/Footer/Footer";
import { useSocket } from "../../../Context/SocketContext";
import {
  fetchMessages,
  fetchParentChats,
  fetchSearchResult,
  saveMessage,
} from "../../../utils/parentFunctions";

const ChatPage = () => {
  const socket = useSocket();
  const parentData = JSON.parse(localStorage.getItem("parentData"));
  const senderId = parentData?._id;
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatLists, setChatLists] = useState([])
  const messageRef = useRef(null);
  let debounceTimeout = useRef(null);

/*..............................chat list..........................*/
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetchParentChats();
      console.log(res.data);

      if (res.success) {
        setChatLists(res.data);
      } else {
        console.error("Failed to fetch chats:", res.message);
      }
    };
      fetchChats();
  }, []);

  /*.......................search......................*/
  const searchDoctor = async (query) => {
    const res = await fetchSearchResult(query);
    console.log(res);
    
    setDoctorList(res?.data);
  };

  /*...........................handle select...........................*/
  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    const res = await fetchMessages(doctor._id)
    
    if(res.success){
      if(res.data.length > 0) {
        setMessages(res.data);
      }else
        setMessages([]); 
    } else {
      setMessages([]);
    }
  };

  /*............................search...........................*/
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        searchDoctor(searchQuery);
      } else setDoctorList([]);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  /*..................................socket connection........................*/
  useEffect(() => {
    if (!socket) {
      console.log("Socket is undefined");
      return;
    }
    const receiverId = selectedDoctor?._id;
    socket.emit("join_room", { senderId, receiverId });

    socket.on("receive_message", (message) => {
      console.log("Message received:", message);
      if (message.senderId !== senderId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, selectedDoctor]);

  /*.............................emoji...............................*/
  const toggleEmojiPicker = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const onEmojiClick = (emoji) => {
    setMessageInput((prev) => prev + (emoji.native || emoji.emoji || ""));
    setEmojiPickerOpen(false);
  };

  /*.......................................send message..................................*/
  const sendMessage = async () => {
    if (messageInput.trim() && selectedDoctor) {
      const currentTime = new Date();
      const receiverId = selectedDoctor?._id;
      const newMessage = {
        senderId,
        receiverId,
        message: messageInput,
        createdAt: currentTime,
        read: false,
      };

      socket.emit("send_message", newMessage);

      await saveMessage(newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessageInput("");
    }
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <ParentHeader />

      <div className="flex w-full h-screen mt-20">
        {/* Left side: Search bar and doctor list */}
        <div className="w-1/3 p-6 border-r border-gray-300 flex flex-col">
          {/* Search bar */}
          <div className="mb-4 flex flex-col">
            <input
              type="text"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none"
              placeholder="Search for doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Doctor list */}
          <div className="flex flex-col">
            {doctorList.map((doctor) => (
              <div
                key={doctor._id}
                className={`p-3 cursor-pointer rounded-lg flex items-center mb-2 ${
                  selectedDoctor?._id === doctor._id
                    ? "bg-blue-200 text-white"
                    : "bg-[#DDD0C8]"
                }`}
                onClick={()=>handleDoctorSelect(doctor)}
              >
                <img
                  src={doctor.image}
                  alt={doctor.doctorName}
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold">{doctor.doctorName}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            {chatLists.map((chat) => (
              <div
                key={chat.doctorId}
                className={`p-3 cursor-pointer rounded-lg flex items-center mb-2 ${
                  selectedDoctor?._id === chat.doctorId
                    ? "bg-blue-200 text-white"
                    : "bg-[#DDD0C8]"
                }`}
                onClick={()=>handleDoctorSelect({
                  _id: chat.doctorId,
                  doctorName: chat.doctorName,
                  image: chat.doctorImage
                })}
              >
                <img
                  src={chat.doctorImage}
                  alt={chat.doctorName}
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold">{chat.doctorName}</p>
                  <p className="font-semibold">{chat.lastMessage.message}</p>
                  <span className="last-message-time text-xs text-gray-400">
                  {new Date(chat.lastMessage.createdAt).toLocaleTimeString()}
                </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right side: Chat area */}
        <div className="w-2/3 p-6">
          {selectedDoctor ? (
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-blue-100 h-full p-4">
              {/* Chat messages */}
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`col-start-1 col-span-12 p-3 rounded-lg ${msg.senderId === senderId ? "self-end" : "self-start"}`}
                    >
                      <div
                        className={`flex ${msg.senderId === senderId ? "flex-row-reverse" : "flex-row"} items-center`}
                      >
                        <div className="relative ml-3">
                          <div
                            className={`bg-[#323232] text-white text-base py-2 px-4 shadow rounded-xl`}
                          >
                            {msg.message
                              ? msg.message
                              : "No message content available"}
                          </div>
                          <div className="text-xs text-gray-800 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div ref={messageRef}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message input */}
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <button onClick={toggleEmojiPicker} className="mr-4">
                  🙂
                </button>
                {emojiPickerOpen && (
                  <div className="absolute bottom-16">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                    />
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={sendMessage}
                    className="flex items-center justify-center bg-[#323232] hover:bg-indigo-600 text-white rounded-xl px-4 py-1 flex-shrink-0"
                  >
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-20">
              Select a doctor to start the chat
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatPage;
