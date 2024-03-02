const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  likes: {
    type: Number,
    required: false,
    default: 0,
  },
  is_completed: {
    type: Boolean,
    required: false,
    default: false,
  },
}, {
  timestamps: true,
});

const TaskModel = mongoose.model('tasks', taskSchema);

module.exports = TaskModel;