const mongoose = require('mongoose');


// Define a schema for chat messages
const chatMessageSchema = new mongoose.Schema({
  username: { type: String },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create a model for chat messages
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Save a chat message to the database
const saveChatMessage = async ( username, receiver, message) => {
  try {
    const chatMessage = new ChatMessage({
      username:  username,
      receiver: receiver,
      message: message
    });
    await chatMessage.save();
    console.log('Chat message saved successfully');
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
};

module.exports = { ChatMessage, saveChatMessage };
