const User = require('../models/User');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
  try {
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@salon.com' });
    
    if (!adminUser) {
      // Get admin password from environment variables or use a secure default
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!Secure';
      
      // Create admin user
      const admin = new User({
        name: 'Admin',
        email: 'admin@salon.com',
        password: adminPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
};

module.exports = setupAdmin; 