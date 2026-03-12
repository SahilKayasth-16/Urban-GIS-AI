import React, { useState } from "react";
import "../styles/ChatBotDrawer.css";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";

const ChatBotDrawer = ({ isOpen, onClose, location }) => {
  const navigate = useNavigate();
  const {
    messages,
    addMessage,
    updateLastMessage,
    isTyping,
    setIsTyping,
    fetchChatHistory,
    isHistoryVisible,
    clearChat,
    sendMessage
  } = useChat();

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input, location);
    setInput("");
  };

  const TypingIndicator = () => (
    <div className="typing-indicator">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  );

  return (
    <>
      <div className={`chatbot-drawer ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h4>GIS Assistant</h4>
            <button
              className="history-btn"
              onClick={isHistoryVisible ? clearChat : fetchChatHistory}
              title={isHistoryVisible ? "Start New Chat" : "Load Chat History"}
            >
              {isHistoryVisible ? "New Chat" : "🕒 Old Chat"}
            </button>
          </div>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="chat-body">
          {messages.map((m, i) => {
            const reportMatch = m.text.match(/__REPORT_LINK__:(\d+)/);
            const cleanText = m.text.replace(/__REPORT_LINK__:\d+/, "");

            return (
              <div key={i} className={`chat-msg ${m.role}`}>
                {cleanText}
                {reportMatch && (
                  <div className="report-link-container">
                    <span
                      className="view-report-link"
                      onClick={() => navigate(`/result/${reportMatch[1]}`)}
                    >
                      View Report ↗
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && <TypingIndicator />}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
          />
          <button onClick={handleSend} disabled={isTyping}>➤</button>
        </div>
      </div>
    </>
  );
}

export default ChatBotDrawer;
