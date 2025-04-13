const mongoose = require('mongoose');

// Nested schema for storing favorite driver details
const FavoriteDriverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  code: {
    type: String
  },
  team: {
    name: String,
    color: String
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favoriteDrivers: [FavoriteDriverSchema],
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    notifications: {
      type: Boolean,
      default: true
    },
    dashboardLayout: {
      type: Object,
      default: {}
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);