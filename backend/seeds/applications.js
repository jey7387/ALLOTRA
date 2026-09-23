const pool = require('../config/database');

async function seedApplications() {
  try {
    console.log('Seeding applications...');
    
    // Get users and schemes
    const usersResult = await pool.query('SELECT id, role FROM users WHERE role = $1', ['citizen']);
    const users = usersResult.rows;
    
    const schemesResult = await pool.query('SELECT id FROM schemes');
    const schemes = schemesResult.rows;
    
    if (users.length === 0 || schemes.length === 0) {
      console.log('❌ No users or schemes found. Please seed them first.');
      process.exit(1);
    }
    
    const statuses = ['pending_verification', 'eligible', 'rejected', 'waitlisted', 'allotted'];
    const statusWeights = [0.3, 0.25, 0.2, 0.15, 0.1]; // Weighted distribution
    
    let applicationCount = 0;
    
    // Create multiple applications per user
    for (const user of users) {
      const numApplications = Math.floor(Math.random() * 3) + 1; // 1-3 applications per user
      
      for (let i = 0; i < numApplications; i++) {
        const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
        
        // Weighted random status selection
        const random = Math.random();
        let cumulative = 0;
        let status = 'pending_verification';
        
        for (let j = 0; j < statuses.length; j++) {
          cumulative += statusWeights[j];
          if (random < cumulative) {
            status = statuses[j];
            break;
          }
        }
        
        const query = `
          INSERT INTO applications (user_id, scheme_id, status, documents, submitted_at)
          VALUES ($1, $2, $3, $4, NOW())
          ON CONFLICT DO NOTHING
          RETURNING id
        `;
        const values = [
          user.id,
          randomScheme.id,
          status,
          JSON.stringify(['aadhar', 'income_proof', 'address_proof'])
        ];
        
        await pool.query(query, values);
        applicationCount++;
      }
    }
    
    console.log(`✅ Seeded ${applicationCount} applications successfully!`);
    
    // Update scheme available units based on allotted applications
    const updateQuery = `
      UPDATE schemes s
      SET available_units = s.total_units - (
        SELECT COUNT(*) 
        FROM applications a 
        WHERE a.scheme_id = s.id AND a.status = 'allotted'
      )
    `;
    await pool.query(updateQuery);
    console.log('✅ Updated scheme available units!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding applications:', error);
    process.exit(1);
  }
}

seedApplications();
