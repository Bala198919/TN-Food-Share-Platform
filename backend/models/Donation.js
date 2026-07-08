import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    providerName: {
      type: String,
      required: true
    },
    state: {
      type: String,
      default: 'Tamil Nadu'
    },
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    pickupAddress: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    donationDate: {
      type: Date,
      default: Date.now
    },
    availableFrom: String,
    availableUntil: String,
    coverImage: String,
    notes: String,
    status: {
      type: String,
      enum: ['available', 'reserved', 'completed'],
      default: 'available'
    },
    foodItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'plates' },
        category: { type: String }, // breakfast, lunch, dinner, snacks
        foodType: { type: String, enum: ['veg', 'non-veg'] },
        image: { type: String },
        description: { type: String }
      }
    ],
    // Claim parameters to link with Request module
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    receiverName: {
      type: String
    },
    receiverPhone: {
      type: String
    },
    claimedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  {
    timestamps: true
  }
);

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
