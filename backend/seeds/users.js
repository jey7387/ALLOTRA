const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const users = [
  {
    full_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543210'
  },
  {
    full_name: 'Priya Lakshmi',
    email: 'priya.lakshmi@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543211'
  },
  {
    full_name: 'Suresh Pandian',
    email: 'suresh.pandian@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543212'
  },
  {
    full_name: 'Kavitha Rajan',
    email: 'kavitha.rajan@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543213'
  },
  {
    full_name: 'Mohan Das',
    email: 'mohan.das@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543214'
  },
  {
    full_name: 'Anitha Krishnan',
    email: 'anitha.krishnan@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543215'
  },
  {
    full_name: 'Venkat Raman',
    email: 'venkat.raman@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543216'
  },
  {
    full_name: 'Sundaram Iyer',
    email: 'sundaram.iyer@example.com',
    password: 'password123',
    role: 'officer',
    phone: '9876543217'
  },
  {
    full_name: 'Meena Subramanian',
    email: 'meena.subramanian@example.com',
    password: 'password123',
    role: 'officer',
    phone: '9876543218'
  },
  {
    full_name: 'Karthik Srinivasan',
    email: 'karthik.srinivasan@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543219'
  },
  {
    full_name: 'Divya Balaji',
    email: 'divya.balaji@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543220'
  },
  {
    full_name: 'Ravi Chandra',
    email: 'ravi.chandra@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543221'
  },
  {
    full_name: 'Lakshmi Narayanan',
    email: 'lakshmi.narayanan@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543222'
  },
  {
    full_name: 'Senthil Kumar',
    email: 'senthil.kumar@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543223'
  },
  {
    full_name: 'Rekha Mohan',
    email: 'rekha.mohan@example.com',
    password: 'password123',
    role: 'citizen',
    phone: '9876543224'
  },
  {
    full_name: 'Admin User',
    email: 'admin@housing.gov',
    password: 'admin123',
    role: 'admin',
    phone: '9876543225'
  }
];

async function seedUsers() {
  try {
    console.log('Seeding users...');
    
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const query = `
        INSERT INTO users (full_name, email, password, role, phone)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;
      const values = [
        user.full_name,
        user.email,
        hashedPassword,
        user.role,
        user.phone
      ];
      await pool.query(query, values);
      console.log(`✓ Added user: ${user.full_name} (${user.role})`);
    }
    
    console.log('✅ Users seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@housing.gov / admin123');
    console.log('Officer: sundaram.iyer@example.com / password123');
    console.log('Citizen: rajesh.kumar@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
