import React, { useRef, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { getUserName } from "../api/api";
import { getUserId } from "../App";

export default function ChatWindow({ messages, loading }) {
  const endRef = useRef();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function getUserNameByUserID() {
    try {
      const response = await getUserName(getUserId());
      setUserName(response?.data ?? "Anonymous");
      console.log("response >>>>> ", response);
    } catch (e) {
      setUserName("Anonymous");
    }
  }

  useEffect(() => {
    getUserNameByUserID();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">

      {/* Welcome Screen */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
          <img className="w-20 h-20" src="fifp_logo.png" alt="" />
          <h1 className="text-2xl font-semibold">Hello, {userName}</h1>
          <p className="text-lg mt-2">I’m your personal Finance Assistant.</p>
          <p className="text-sm text-gray-500 mt-1">
            Ask me anything to get started!
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              sender={msg.sender}
              text={
                typeof msg.text === "string"
                  ? msg.text
                  : JSON.stringify(msg.text)   // 🔥 Ensures JSON always arrives
              }
            />
          ))}

          {loading && (
            <div className="flex items-center gap-2 py-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
              <div
                className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
              <span className="ml-2 text-gray-500">Bot is typing...</span>
            </div>
          )}
        </>
      )}

      <div ref={endRef} />
    </div>
  );
}
