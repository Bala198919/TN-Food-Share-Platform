import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Donation from './models/Donation.js';
import Request from './models/Request.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // 1. Clear old collections to prevent keys collision
    console.log('🧹 Clearing old collections...');
    await User.deleteMany({ email: { $in: [
      'donor@food.com', 'receiver@food.com', 'admin@food.com',
      'a2b@food.com', 'sangeetha@food.com', 'ammamess@food.com',
      'kuppanna@food.com', 'saravana@food.com',
      'anbu@NGO.org', 'nambikkai@NGO.org', 'udhayam@NGO.org'
    ]}});
    await Donation.deleteMany({});
    await Request.deleteMany({});

    console.log('👤 Creating premium Tamil Nadu FoodShare users with coordinates...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('donor123', salt);
    const receiverHashedPassword = await bcrypt.hash('receiver123', salt);
    const adminHashedPassword = await bcrypt.hash('admin123', salt);

    // Common testing profiles
    const defaultDonor = await User.create({
      name: 'Balan Food Mess',
      email: 'donor@food.com',
      password: hashedPassword,
      role: 'donor',
      phone: '9443011111',
      address: '22, North Mada Street, Mylapore, Chennai',
      providerType: 'mess',
      contactPersonName: 'Balamurugan',
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Mylapore',
      pincode: '600004',
      coordinates: { lat: 13.0330, lng: 80.2690 },
      description: 'Serving hot homestyle lunch and breakfast meals in Mylapore.'
    });

    const defaultReceiver = await User.create({
      name: 'Anbu Illam NGO',
      email: 'receiver@food.com',
      password: receiverHashedPassword,
      role: 'receiver',
      phone: '9444022222',
      address: '15, NGO Colony, Tambaram, Chennai',
      acceptorType: 'NGO',
      contactPersonName: 'Lakshmi',
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Tambaram',
      pincode: '600045',
      peopleServed: 120,
      coordinates: { lat: 12.9229, lng: 80.1274 },
      description: 'Non-profit trust supporting orphanages and homeless shelters.'
    });

    await User.create({
      name: 'TN Platform Admin',
      email: 'admin@food.com',
      password: adminHashedPassword,
      role: 'admin',
      phone: '9445033333',
      address: 'Administrative Block, Chennai Corporation, Chennai'
    });

    // Seed Tamil Nadu Hotel Providers
    const a2bUser = await User.create({
      name: 'A2B Adyar Ananda Bhavan',
      email: 'a2b@food.com',
      password: hashedPassword,
      role: 'donor',
      phone: '9840112233',
      address: 'No. 45, GST Road, Tambaram, Chennai',
      providerType: 'hotel',
      contactPersonName: 'Vijay Kumar',
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Tambaram',
      pincode: '600045',
      coordinates: { lat: 12.9240, lng: 80.1290 },
      description: 'Traditional sweets and pure vegetarian South Indian food.'
    });

    const sangeethaUser = await User.create({
      name: 'Sangeetha Veg Restaurant',
      email: 'sangeetha@food.com',
      password: hashedPassword,
      role: 'donor',
      phone: '9840223344',
      address: 'No. 21, South Canal Bank Rd, Mylapore, Chennai',
      providerType: 'restaurant',
      contactPersonName: 'Senthil Nathan',
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Mylapore',
      pincode: '600004',
      coordinates: { lat: 13.0334, lng: 80.2673 },
      description: 'Delivering delicious and healthy vegetarian cuisine.'
    });

    const ammamessUser = await User.create({
      name: 'Amma Mess Madurai',
      email: 'ammamess@food.com',
      password: hashedPassword,
      role: 'donor',
      phone: '9443112233',
      address: '12, Simmakkal Main Road, Madurai',
      providerType: 'mess',
      contactPersonName: 'Maruthu Pandian',
      state: 'Tamil Nadu',
      city: 'Madurai',
      area: 'Simmakkal',
      pincode: '625001',
      coordinates: { lat: 9.9252, lng: 78.1198 },
      description: 'Famous home-style non-vegetarian and vegetarian Madurai recipes.'
    });

    const kuppannaUser = await User.create({
      name: 'Junior Kuppanna Coimbatore',
      email: 'kuppanna@food.com',
      password: hashedPassword,
      role: 'donor',
      phone: '9442112233',
      address: 'No. 182, Cross Cut Road, Gandhipuram, Coimbatore',
      providerType: 'restaurant',
      contactPersonName: 'Muruganandam',
      state: 'Tamil Nadu',
      city: 'Coimbatore',
      area: 'Gandhipuram',
      pincode: '641012',
      coordinates: { lat: 11.0183, lng: 76.9639 },
      description: 'Authentic Kongu style biryani and meals.'
    });

    const saravanaUser = await User.create({
      name: 'Hotel Saravana Bhavan',
      email: 'saravana@food.com',
      password: hashedPassword,
      role: 'donor',
      phone: '9444112233',
      address: 'No. 3, West Boulevard Road, Singarathope, Trichy',
      providerType: 'hotel',
      contactPersonName: 'Ramachandran',
      state: 'Tamil Nadu',
      city: 'Trichy',
      area: 'Singarathope',
      pincode: '620008',
      coordinates: { lat: 10.8285, lng: 78.6942 },
      description: 'Global chain of high quality pure vegetarian food.'
    });

    // Seed NGO Acceptors
    const anbuHome = await User.create({
      name: 'Anbu Old Age Home',
      email: 'anbu@NGO.org',
      password: receiverHashedPassword,
      role: 'receiver',
      phone: '9444556677',
      address: '3, Anna Salai, Guindy, Chennai',
      acceptorType: 'old age home',
      contactPersonName: 'Dr. Subramanian',
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Guindy',
      pincode: '600032',
      peopleServed: 80,
      coordinates: { lat: 13.0067, lng: 80.2206 },
      description: 'Providing loving care and free hot meals to senior citizens.'
    });

    const nambikkaiCare = await User.create({
      name: 'Nambikkai Child Care Home',
      email: 'nambikkai@NGO.org',
      password: receiverHashedPassword,
      role: 'receiver',
      phone: '9443778899',
      address: '52, Koodal Nagar, Madurai',
      acceptorType: 'child care home',
      contactPersonName: 'Sister Teresa',
      state: 'Tamil Nadu',
      city: 'Madurai',
      area: 'Koodal Nagar',
      pincode: '625018',
      peopleServed: 65,
      coordinates: { lat: 9.9482, lng: 78.0961 },
      description: 'A safe haven providing shelter and education to underprivileged kids.'
    });

    const udhayamTrust = await User.create({
      name: 'Udhayam Charitable Trust',
      email: 'udhayam@NGO.org',
      password: receiverHashedPassword,
      role: 'receiver',
      phone: '9442889900',
      address: '75, Ramanathapuram Main Rd, Coimbatore',
      acceptorType: 'trust',
      contactPersonName: 'Karthik Raja',
      state: 'Tamil Nadu',
      city: 'Coimbatore',
      area: 'Ramanathapuram',
      pincode: '641045',
      peopleServed: 150,
      coordinates: { lat: 10.9995, lng: 76.9935 },
      description: 'Supporting daily wage laborers and community kitchens.'
    });

    console.log('✅ Users registered successfully.');

    // Seed Food Listings
    console.log('🌱 Seed food listings on behalf of providers...');
    
    await Donation.create({
      donor: a2bUser._id,
      providerName: a2bUser.name,
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Tambaram',
      pickupAddress: a2bUser.address,
      contact: a2bUser.phone,
      availableFrom: '08:00 AM',
      availableUntil: '11:00 AM',
      coverImage: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
      notes: 'Breakfast surplus. Excellent quality. Please bring clean vessels.',
      status: 'available',
      coordinates: { lat: 12.9240, lng: 80.1290 },
      foodItems: [
        {
          name: 'Idly',
          quantity: 40,
          unit: 'plates',
          category: 'breakfast',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
          description: 'Soft steamed rice cakes served with sambar.'
        },
        {
          name: 'Dosa',
          quantity: 25,
          unit: 'plates',
          category: 'breakfast',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
          description: 'Crispy rice crepes.'
        },
        {
          name: 'Pongal',
          quantity: 15,
          unit: 'plates',
          category: 'breakfast',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
          description: 'Ghee khichdi with cashews and black pepper.'
        }
      ]
    });

    await Donation.create({
      donor: sangeethaUser._id,
      providerName: sangeethaUser.name,
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Mylapore',
      pickupAddress: sangeethaUser.address,
      contact: sangeethaUser.phone,
      availableFrom: '12:30 PM',
      availableUntil: '03:30 PM',
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      notes: 'Lunch buffet surplus. Completely untouched veggie meals.',
      status: 'available',
      coordinates: { lat: 13.0334, lng: 80.2673 },
      foodItems: [
        {
          name: 'Meals',
          quantity: 30,
          unit: 'packets',
          category: 'lunch',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600',
          description: 'South Indian meals with Rice, Sambar, Rasam, and Kootu.'
        },
        {
          name: 'Chapati',
          quantity: 50,
          unit: 'pieces',
          category: 'lunch',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600',
          description: 'Wheat flatbreads.'
        }
      ]
    });

    await Donation.create({
      donor: ammamessUser._id,
      providerName: ammamessUser.name,
      state: 'Tamil Nadu',
      city: 'Madurai',
      area: 'Simmakkal',
      pickupAddress: ammamessUser.address,
      contact: ammamessUser.phone,
      availableFrom: '01:00 PM',
      availableUntil: '04:00 PM',
      coverImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800',
      notes: 'Famous Madurai meals. Very high demand.',
      status: 'available',
      coordinates: { lat: 9.9252, lng: 78.1198 },
      foodItems: [
        {
          name: 'Biryani',
          quantity: 20,
          unit: 'packets',
          category: 'lunch',
          foodType: 'non-veg',
          image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600',
          description: 'Seeraga Samba mutton biryani.'
        },
        {
          name: 'Lemon Rice',
          quantity: 15,
          unit: 'boxes',
          category: 'lunch',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
          description: 'Tangy yellow rice flavored with lemon juice.'
        }
      ]
    });

    await Donation.create({
      donor: kuppannaUser._id,
      providerName: kuppannaUser.name,
      state: 'Tamil Nadu',
      city: 'Coimbatore',
      area: 'Gandhipuram',
      pickupAddress: kuppannaUser.address,
      contact: kuppannaUser.phone,
      availableFrom: '07:30 PM',
      availableUntil: '10:30 PM',
      coverImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800',
      notes: 'Dinner excess packing. Please coordinate pickup quickly.',
      status: 'available',
      coordinates: { lat: 11.0183, lng: 76.9639 },
      foodItems: [
        {
          name: 'Biryani',
          quantity: 15,
          unit: 'packets',
          category: 'dinner',
          foodType: 'non-veg',
          image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600',
          description: 'Kuppanna chicken biryani packets.'
        },
        {
          name: 'Chapati',
          quantity: 30,
          unit: 'pieces',
          category: 'dinner',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600',
          description: 'Soft chapatis served with gravy.'
        }
      ]
    });

    await Donation.create({
      donor: saravanaUser._id,
      providerName: saravanaUser.name,
      state: 'Tamil Nadu',
      city: 'Trichy',
      area: 'Singarathope',
      pickupAddress: saravanaUser.address,
      contact: saravanaUser.phone,
      availableFrom: '05:00 PM',
      availableUntil: '08:00 PM',
      coverImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
      notes: 'Evening snacks surplus collection.',
      status: 'available',
      coordinates: { lat: 10.8285, lng: 78.6942 },
      foodItems: [
        {
          name: 'Dosa',
          quantity: 30,
          unit: 'plates',
          category: 'snacks',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
          description: 'Ghee roast dosas.'
        },
        {
          name: 'Curd Rice',
          quantity: 20,
          unit: 'cups',
          category: 'snacks',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
          description: 'Cooling curd rice tempered with mustard and ginger.'
        }
      ]
    });

    // Listing by the Mylapore donor
    await Donation.create({
      donor: defaultDonor._id,
      providerName: defaultDonor.name,
      state: 'Tamil Nadu',
      city: 'Chennai',
      area: 'Mylapore',
      pickupAddress: defaultDonor.address,
      contact: defaultDonor.phone,
      availableFrom: '11:00 AM',
      availableUntil: '02:00 PM',
      coverImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800',
      notes: 'Fresh Mylapore meals.',
      status: 'available',
      coordinates: { lat: 13.0330, lng: 80.2690 },
      foodItems: [
        {
          name: 'Meals',
          quantity: 25,
          unit: 'packets',
          category: 'lunch',
          foodType: 'veg',
          image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600',
          description: 'Banana leaf traditional rice with sambar.'
        }
      ]
    });

    console.log('🎉 Seeding successfully completed! Seeding summary:');
    console.log(`- Providers seeded: 6`);
    console.log(`- Acceptors (NGOs) seeded: 4`);
    console.log(`- Active Food Listings: 6`);
    
  } catch (error) {
    console.error('❌ Seeding Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedDatabase();
