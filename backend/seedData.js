const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Sample services data
const services = [
  {
    name: 'Haircut',
    description: 'Professional haircut tailored to your style preferences',
    price: 50,
    duration: '30',
    category: 'Hair',
    image: '/services/haircut.jpg',
    featured: true
  },
  {
    name: 'Hair Color',
    description: 'Full hair color service using premium products',
    price: 120,
    duration: '90',
    category: 'Hair',
    image: '/services/haircolor.jpg',
    featured: true
  },
  {
    name: 'Blowout & Styling',
    description: 'Professional blow dry and styling',
    price: 40,
    duration: '45',
    category: 'Hair',
    image: '/services/blowout.jpg',
    featured: false
  },
  {
    name: 'Manicure',
    description: 'Classic manicure with cuticle care and polish',
    price: 35,
    duration: '45',
    category: 'Nails',
    image: '/services/manicure.jpg',
    featured: true
  },
  {
    name: 'Pedicure',
    description: 'Relaxing pedicure with foot scrub and polish',
    price: 45,
    duration: '60',
    category: 'Nails',
    image: '/services/pedicure.jpg',
    featured: false
  },
  {
    name: 'Gel Nails',
    description: 'Long-lasting gel nail application',
    price: 60,
    duration: '60',
    category: 'Nails',
    image: '/services/gelnails.jpg',
    featured: true
  },
  {
    name: 'Facial',
    description: 'Revitalizing facial treatment customized for your skin type',
    price: 85,
    duration: '60',
    category: 'Facial',
    image: '/services/facial.jpg',
    featured: true
  },
  {
    name: 'Swedish Massage',
    description: 'Relaxing full-body massage',
    price: 90,
    duration: '60',
    category: 'Massage',
    image: '/services/massage.jpg',
    featured: false
  },
  {
    name: 'Makeup Application',
    description: 'Professional makeup for special occasions',
    price: 65,
    duration: '45',
    category: 'Makeup',
    image: '/services/makeup.jpg',
    featured: false
  }
];

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@luxsalon.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'John Stylist',
    email: 'john@luxsalon.com',
    password: 'password123',
    role: 'staff'
  },
  {
    name: 'Sarah Nail Tech',
    email: 'sarah@luxsalon.com',
    password: 'password123',
    role: 'staff'
  },
  {
    name: 'Client User',
    email: 'client@example.com',
    password: 'password123',
    role: 'client'
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await Service.deleteMany();
    console.log('Services data cleared');
    
    await User.deleteMany();
    console.log('Users data cleared');

    // Import new data
    await Service.insertMany(services);
    console.log('Services data imported');
    
    await User.create(users);
    console.log('Users data imported');

    console.log('Data import completed successfully');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Run the import
importData();
