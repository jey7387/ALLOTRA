const pool = require('../config/database');

async function cleanup() {
  try {
    console.log('Cleaning up existing data...');
    
    // Delete in order to respect foreign keys
    await pool.query('DELETE FROM applications');
    console.log('✓ Deleted applications');
    
    await pool.query('DELETE FROM schemes');
    console.log('✓ Deleted schemes');
    
    await pool.query('DELETE FROM users WHERE email LIKE \'%@example.com\'');
    console.log('✓ Deleted seed users (kept admin)');
    
    console.log('✅ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanup();
