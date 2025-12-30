import { useState } from "react";
import { MoreVertical, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { deleteSession, renameSession } from "../api/api";
import { Button, Switch } from "antd";

export default function Sidebar({
  sessions,
  onSelect,
  active,
  userId,
  refresh,
  onClose,
  onNewChat,
}) {
  const [menuOpen, setMenuOpen] = useState(null);
  const [renameId, setRenameId] = useState('');
  const [renameValue, setRenameValue] = useState("");

  const handleDelete = async (sid) => {
    await deleteSession(userId, sid);
    refresh();
    if (active === sid) onSelect(null);
    setMenuOpen(null);
  };

  const handleRename = async (sid) => {
    if (!renameValue.trim()) return;
    await renameSession(userId, sid, renameValue);
    refresh();
    setRenameId('');
    setMenuOpen(null);
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-4 overflow-y-auto flex flex-col">
      {/* Header with Close button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold truncate">Chat Sessions</h2>
        <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Conditionally show New Chat button */}
      {active && (
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded mb-4"
        >
          <Plus size={16} /> New Chat
        </button>
      )}

      {/* Session list */}
      <div className="flex-1">
        {sessions.map((s) => (
          <div key={s.session_id} className="relative group">
            <div
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                active === s.session_id ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
              onClick={() => onSelect(s.session_id)}
            >
              <div className="flex items-center gap-2 max-w-full overflow-hidden">
                {active === s.session_id && <ChevronRight size={16} />}
                {renameId === s.session_id ? (
                  <input
                    className="bg-gray-800 text-white p-1 rounded w-full"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => setRenameId('')}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleRename(s.session_id)
                    }
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{s.title}</span>
                )}
              </div>

              {/* Three-dot button: visible on hover or active */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(menuOpen === s.session_id ? null : s.session_id);
                }}
                className={`p-1 rounded ${
                  active === s.session_id
                    ? "block"
                    : "opacity-0 group-hover:opacity-100 transition-opacity"
                }`}
              >
                <MoreVertical size={16} />
              </button>
            </div>

            {/* Menu dropdown */}
            {menuOpen === s.session_id && (
              <div className="absolute right-0 mt-1 bg-white text-black rounded shadow z-10">
                <button
                  onClick={() => {
                    setRenameId(s.session_id);
                    setRenameValue(s.title);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDelete(s.session_id)}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(s.session_id);
                    setMenuOpen(null);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
