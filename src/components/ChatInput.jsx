//ChatInput.jsx
import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-50">
      <input
      type="text"
      className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400 text-gray-800 transition-all duration-200"
      placeholder="Ask about Current Analysis,Future Forecasting, or Alternative."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
      onClick={handleSend}
      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
        <Send size={20} />
      </button>

    </div>
  );
}
