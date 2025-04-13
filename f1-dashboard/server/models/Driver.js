const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  stats: {
    wins: Number,
    podiums: Number,
    poles: Number,
    fastestLaps: Number,
    championships: Number
  },
  seasonStats: {
    points: {
      type: Number,
      default: 0
    },
    position: {
      type: Number,
      default: 0
    },
    raceResults: [
      {
        round: Number,
        raceId: String,
        position: Number,
        points: Number,
        grid: Number,
        status: String
      }
    ]
  }
});

module.exports = mongoose.model('Driver', DriverSchema);