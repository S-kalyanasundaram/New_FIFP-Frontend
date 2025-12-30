import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react"; // or any icon you like
import Suggestions from "./components/Suggestions";

import {
  askQuestion,
  getSessions,
  getChatHistory,
  loadData,
} from "./api/api";

// Function to get USER_ID dynamically from localStorage or query params
export const getUserId = () => {
  // Try localStorage first
  let id

  // If not found in localStorage, try query params
  if (!id) {
    const params = new URLSearchParams(window.location.search);
    id = params.get("userID");
    if (id) {
      localStorage.setItem("userID", id); // save for next time
    }
  }

  return id || "userID"; // fallback default ID
};

function App() {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const USER_ID = getUserId(); // dynamically determined

  // Example suggestions (can be dynamic later)
  const suggestions = [
    "Current Analysis",
    "Future Forecasting",
    "Alternative",
  ];

  useEffect(() => {
    if (USER_ID) {
      loadData(USER_ID);
      fetchSessions();
    }
  }, [USER_ID]);
  useEffect(() => {
  const handler = (e) => handleSend(e.detail);
  window.addEventListener("send-question", handler);
  return () => window.removeEventListener("send-question", handler);
}, []);


  const fetchSessions = async () => {
    const res = await getSessions(USER_ID);
    setSessions(res.data.sessions);
  };

  const handleSend = async (text) => {
    const newMsg = { sender: "user", text };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true); // start loading

    try {
      const res = await askQuestion({
        user_id: USER_ID,
        question: text,
        session_id: sessionId,
      });

      if (res.data.answer) {
        setMessages((prev) => [...prev, { sender: "bot", text: res.data.answer }]);
        setSessionId(res.data.session_id);
        fetchSessions();
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  const loadHistory = async (sid) => {
    setSessionId(sid);
    const res = await getChatHistory(USER_ID, sid);
    const hist = res.data.history
      .map((c) => [
        { sender: "user", text: c.question },
        { sender: "bot", text: c.answer },
      ])
      .flat();
    setMessages(hist);
  };

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
  };

  return (
    <div className="flex h-screen">
      {/* {sidebarOpen && (
        <Sidebar
          sessions={sessions}
          onSelect={loadHistory}
          active={sessionId}
          userId={USER_ID}
          refresh={fetchSessions}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
        />
      )} */}

      <div className="flex flex-col flex-1 relative">
  <ChatWindow messages={messages} loading={loading} />

  {/* Suggestions Section (only when chat is empty) */}
  {!messages.length && (
    <div className="absolute inset-0 flex items-center justify-center " style={{ paddingTop: "40vh" }} >
      <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
        {suggestions.map((qstn, index) => (
          <h1
            key={index}
            className="
bg-gradient-to-r from-[#0b2f22] to-[#145a42]
backdrop-blur-lg
border border-[#1fa37a]/30
text-white
font-medium
text-md
px-4 py-3
rounded-full
shadow-lg
shadow-[#0b2f22]/60
hover:scale-105
hover:from-[#0e3b2b]
hover:to-[#1b6b50]
transition-all
duration-300
cursor-pointer
"
            onClick={() => handleSend(qstn)}
          >
            {qstn}
          </h1>
        ))}
      </div>
    </div>
  )}

  {/* <ChatInput onSend={handleSend} /> */}
</div>


      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            fixed top-6 left-6 
            bg-gray-800 hover:bg-gray-700 
            text-white 
            w-12 h-12 
            rounded-full 
            flex items-center justify-center 
            shadow-lg 
            transition-colors duration-200
            z-50
          "
        >
          <Menu size={24} />
        </button>
      )}
    </div>
  );
}

export default App;
