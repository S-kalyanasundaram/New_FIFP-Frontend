// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://api.fifpclub.com/fifpchatbot",//"http://127.0.0.1:8000"
});

// Load data for the user
export const loadData = (userId) => API.post(`/load-data/${userId}`);

// Ask a question
export const askQuestion = (payload) => API.post(`/ask`, payload);

// Get all chat sessions for user
export const getSessions = (userId) => API.get(`/chat-sessions/${userId}`);

// Get chat history
export const getChatHistory = (userId, sessionId) =>
  API.get(`/chat-history/${userId}/${sessionId}`);

// Delete a session
export const deleteSession = (userId, sessionId) =>
  API.delete(`/chat-sessions/${userId}/${sessionId}`);

// Rename a chat session
export const renameSession = (userId, sessionId, title) =>
  API.put(`/chat-sessions/${userId}/${sessionId}`, { title });

// Get user name
export const getUserName = (userId) => API.get(`/user-name/${userId}`);