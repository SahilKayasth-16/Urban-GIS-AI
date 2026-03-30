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
        <div className="chatbot-header">
          <div className="header-title">
            <i className="fa-solid fa-robot"></i>
            <h2>GIS Assistant</h2>
          </div>
          <div className="header-actions">
            <button
              className="history-btn"
              onClick={isHistoryVisible ? clearChat : fetchChatHistory}
              title={isHistoryVisible ? "Start New Chat" : "Load Chat History"}
            >
              <i className={isHistoryVisible ? "fa-solid fa-plus" : "fa-solid fa-clock-rotate-left"}></i>
              <span>{isHistoryVisible ? "New Chat" : "History"}</span>
            </button>
            <button className="close-btn" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => {
            const reportMatch = m.text.match(/__REPORT_LINK__:(\d+)/);
            const cleanText = m.text.replace(/__REPORT_LINK__:\d+/, "");

            return (
              <div key={i} className={`chat-bubble ${m.role === "assistant" ? "ai" : "user"}`}>
                <div className="bubble-content">
                  {cleanText}
                </div>
                {reportMatch && (
                  <div className="report-link-container">
                    <button
                      className="view-report-btn"
                      onClick={() => navigate(`/result/${reportMatch[1]}`)}
                    >
                      <span>View Detailed Report</span>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && <TypingIndicator />}
        </div>

        <div className="chat-input-area">
          <div className="input-wrapper">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about this area..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isTyping}
            />
            <button className="send-btn" onClick={handleSend} disabled={isTyping || !input.trim()}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatBotDrawer;
