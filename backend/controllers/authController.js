import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      address,
      providerType,
      acceptorType,
      contactPersonName,
      state,
      city,
      area,
      pincode,
      peopleServed,
      logoUrl,
      businessId,
      description
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create user with role specific profiles
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
      providerType: providerType || '',
      acceptorType: acceptorType || '',
      contactPersonName: contactPersonName || '',
      state: state || 'Tamil Nadu',
      city: city || '',
      area: area || '',
      pincode: pincode || '',
      peopleServed: peopleServed ? Number(peopleServed) : undefined,
      logoUrl: logoUrl || '',
      businessId: businessId || '',
      description: description || ''
    });

    if (user) {
      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          providerType: user.providerType,
          acceptorType: user.acceptorType,
          contactPersonName: user.contactPersonName,
          state: user.state,
          city: user.city,
          area: user.area,
          pincode: user.pincode,
          peopleServed: user.peopleServed,
          logoUrl: user.logoUrl,
          businessId: user.businessId,
          description: user.description,
          token: generateToken(user._id)
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        providerType: user.providerType,
        acceptorType: user.acceptorType,
        contactPersonName: user.contactPersonName,
        state: user.state,
        city: user.city,
        area: user.area,
        pincode: user.pincode,
        peopleServed: user.peopleServed,
        logoUrl: user.logoUrl,
        businessId: user.businessId,
        description: user.description,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
