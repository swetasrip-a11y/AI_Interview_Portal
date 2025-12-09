const bcrypt = require('bcrypt');
const db = require('./models/database');

const createAdmin = async () => {
  try {
    const email = 'admin@interview.com';
    const password = 'admin123';
    const full_name = 'Admin User';

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.run(
      'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, full_name, 'admin']
    );

    console.log('✅ Admin user created!');
    console.log('📧 Email: admin@interview.com');
    console.log('🔐 Password: admin123');
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Run immediately
;(async () => {
  try {
    await db.init();
    await createAdmin();
  } catch (e) {
    console.error('Failed to create admin:', e.message || e);
  }
})();
