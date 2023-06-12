const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Define the todo schema
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the todo model
const Todo = mongoose.model('Todo', todoSchema);

// Export the model
module.exports = Todo;
