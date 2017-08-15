const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderUsername: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: String,
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
