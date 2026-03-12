import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "./LocationContext";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const { setCompetitors } = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! I'm your Urban GIS AI assistant." }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    const fetchChatHistory = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch("http://localhost:8000/chat/history", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const formattedMessages = data.map(m => ({
                        role: m.role,
                        text: m.message
                    }));
                    setMessages(formattedMessages);
                }
                setHistoryLoaded(true);
                setIsHistoryVisible(true);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            // Clear chat on logout from frontend
            setMessages([{ role: "bot", text: "Hello! I'm your Urban GIS AI assistant." }]);
            setHistoryLoaded(false);
            setIsHistoryVisible(false);
            setIsTyping(false); // Ensure typing stops on logout
        }
    }, [user]);

    const addMessage = useCallback((msg) => {
        setMessages(prev => [...prev, msg]);
    }, []);

    const updateLastMessage = useCallback((text) => {
        setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0) {
                updated[updated.length - 1].text = text;
            }
            return updated;
        });
    }, []);

    const sendMessage = async (input, location) => {
        if (!input.trim()) return;

        if (!location) {
            addMessage({ role: "bot", text: "Please select your location first" });
            return;
        }

        const userMsg = { role: "user", text: input };
        addMessage(userMsg);
        setIsTyping(true);

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:8000/chat-stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    query: userMsg.text,
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    area_name: location?.name
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let botText = "";
            let resultId = null;
            let shouldRedirect = false;
            let buffer = "";

            addMessage({ role: "bot", text: "" });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // -------- CHECK REPORT FLAG --------
                const reportMatch = buffer.match(/__GENERATE_REPORT__:(true|false)/);
                if (reportMatch) {
                    shouldRedirect = reportMatch[1] === "true";
                    buffer = buffer.replace(reportMatch[0], "");
                }

                // -------- CHECK RESULT ID --------
                const idMatch = buffer.match(/__RESULT_ID__:(\d+)/);
                if (idMatch) {
                    resultId = idMatch[1];
                    buffer = buffer.replace(idMatch[0], "");
                }

                // -------- CHECK COMPETITORS --------
                const compMatch = buffer.match(/__COMPETITORS__:(\[.*\])/);
                if (compMatch) {
                    try {
                        const competitors = JSON.parse(compMatch[1]);
                        setCompetitors(competitors);
                    } catch (e) {
                        console.error("Error parsing competitors:", e);
                    }
                    buffer = buffer.replace(compMatch[0], "");
                }

                botText += buffer;
                buffer = "";

                await new Promise(resolve => setTimeout(resolve, 10));
                updateLastMessage(botText);
            }

            setIsTyping(false);
            if (shouldRedirect && resultId) {
                navigate(`/result/${resultId}`);
            }
        } catch (error) {
            console.error("Critical Chat Error:", error);
            setIsTyping(false);

            let errorMessage = "Something went wrong. Please try again.";
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                errorMessage = "Network error: Target server is unreachable. Please check if the backend is running and Ollama is started.";
            }

            addMessage({ role: "bot", text: errorMessage });
        }
    };

    const clearChat = () => {
        setMessages([{ role: "bot", text: "Hello! I'm your Urban GIS AI assistant." }]);
        setIsHistoryVisible(false);
    };

    return (
        <ChatContext.Provider value={{
            messages,
            setMessages,
            addMessage,
            updateLastMessage,
            isTyping,
            setIsTyping,
            sendMessage,
            clearChat,
            fetchChatHistory,
            isHistoryVisible,
            setIsHistoryVisible
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
