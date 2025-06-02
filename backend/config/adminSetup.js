const User = require('../models/User');

const setupAdmin = async () => {
  try {
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@salon.com' });
    
    if (!adminUser) {
      // Create admin user
      const admin = new User({
        name: 'Admin',
        email: 'admin@salon.com',
        password: 'admin',
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
};

module.exports = setupAdmin; 