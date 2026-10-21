const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    visitorName: {
      type: String,
      default: "Unknown",
    },

    purpose: {
      type: String,
      default: "",
    },

    conversation: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },

        text: {
          type: String,
          required: true,
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Visitor", visitorSchema);