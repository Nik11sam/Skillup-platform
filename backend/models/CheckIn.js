const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Goal',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  taskDescription: {
    type: String,
    required: [true, 'Please provide a task description'],
  },
  hoursStudied: {
    type: Number,
    required: [true, 'Please provide the hours studied'],
  },
  xpGained: {
    type: Number,
    required: true,
    default: 10,
  },
});

module.exports = mongoose.model('CheckIn', CheckInSchema);