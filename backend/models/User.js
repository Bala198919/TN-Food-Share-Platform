import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['donor', 'receiver', 'admin'],
      default: 'donor'
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number']
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    
    // Role-specific fields
    providerType: {
      type: String,
      enum: ['hotel', 'restaurant', 'catering', 'mess', 'marriage hall', 'hostel', 'bakery', 'home donor', '']
    },
    acceptorType: {
      type: String,
      enum: ['NGO', 'old age home', 'orphanage', 'child care home', 'shelter', 'trust', 'community kitchen', '']
    },
    contactPersonName: {
      type: String
    },
    state: {
      type: String,
      default: 'Tamil Nadu'
    },
    city: {
      type: String
    },
    area: {
      type: String
    },
    pincode: {
      type: String
    },
    peopleServed: {
      type: Number
    },
    logoUrl: {
      type: String
    },
    businessId: {
      type: String
    },
    description: {
      type: String
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

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
