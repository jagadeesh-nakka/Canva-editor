import { io } from 'socket.io-client';

// Connect to the socket server
const socket = io('http://localhost:5000'); // Replace with your server URL

// Send feedback to the server
export const sendFeedback = (designId, feedback) => {
  socket.emit('feedback', { designId, feedback });
};

// Listen for new feedback from the server
export const listenToFeedback = (callback) => {
  socket.on('new-feedback', callback);
};

export default socket;
