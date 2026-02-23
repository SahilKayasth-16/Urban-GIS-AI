import React, { useState } from "react";
import "../styles/ChatBotDrawer.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatBotDrawer = ({ isOpen, onClose, location}) => {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm your Urban GIS AI assistant." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!location) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Please Select location on map first." }
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "bot", text: "Analyzing location... please wait." }
    ]);

    try {
      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
        area_name: location.name,
        category_id: 1
      };

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/run-analysis",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resultId = response.data.result_id;

      navigate(`/result/${resultId}`)
    } catch(error) {
      console.error("Analysis failed.", error);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong..." }
      ]);
    }

    setInput();
  };
    return(
        <>
            <div className={`chatbot-drawer ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
            <h4>GIS Assistant</h4>
            <button onClick={onClose}>✖</button>
        </div>

        <div className="chat-body">
            {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
                {m.text}
            </div>
            ))}
        </div>

        <div className="chat-input">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            />
            <button onClick={sendMessage}>➤</button>
        </div>
        </div>
        </>
    );
}

export default ChatBotDrawer;