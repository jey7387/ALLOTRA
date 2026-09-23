const pool = require('../config/database');

const tamilNaduSchemes = [
  {
    name: 'Tamil Nadu Urban Habitat Development Board Scheme',
    location: 'Chennai',
    price: 1500000,
    total_units: 500,
    available_units: 120,
    description: 'Affordable housing for low-income urban families in Chennai metropolitan area.',
    eligibility_criteria: 'Annual income below ₹3 Lakhs, Tamil Nadu resident for 5+ years',
    category: 'EWS',
    application_deadline: '2026-12-31'
  },
  {
    name: 'Coimbatore Smart City Housing Scheme',
    location: 'Coimbatore',
    price: 1800000,
    total_units: 350,
    available_units: 85,
    description: 'Modern housing units in Coimbatore smart city zone with excellent connectivity.',
    eligibility_criteria: 'Annual income below ₹5 Lakhs, Tamil Nadu resident',
    category: 'LIG',
    application_deadline: '2026-11-30'
  },
  {
    name: 'Madurai Heritage Housing Project',
    location: 'Madurai',
    price: 1200000,
    total_units: 400,
    available_units: 200,
    description: 'Affordable housing near Madurai temple city with basic amenities.',
    eligibility_criteria: 'Annual income below ₹2.5 Lakhs, Priority to local residents',
    category: 'EWS',
    application_deadline: '2026-10-31'
  },
  {
    name: 'Trichy Central Housing Scheme',
    location: 'Trichy',
    price: 1350000,
    total_units: 300,
    available_units: 95,
    description: 'Central location housing in Trichy with good transport links.',
    eligibility_criteria: 'Annual income below ₹3 Lakhs, Tamil Nadu resident',
    category: 'LIG',
    application_deadline: '2026-09-30'
  },
  {
    name: 'Salem Industrial Housing Scheme',
    location: 'Salem',
    price: 1100000,
    total_units: 250,
    available_units: 150,
    description: 'Housing for industrial workers in Salem with proximity to industrial zones.',
    eligibility_criteria: 'Industrial workers, Annual income below ₹2 Lakhs',
    category: 'EWS',
    application_deadline: '2026-08-31'
  },
  {
    name: 'Tirunelveli Affordable Housing',
    location: 'Tirunelveli',
    price: 950000,
    total_units: 200,
    available_units: 180,
    description: 'Budget-friendly housing in Tirunelveli for economically weaker sections.',
    eligibility_criteria: 'Annual income below ₹2 Lakhs, Southern district residents priority',
    category: 'EWS',
    application_deadline: '2026-07-31'
  },
  {
    name: 'Erode Textile Workers Housing',
    location: 'Erode',
    price: 1300000,
    total_units: 280,
    available_units: 110,
    description: 'Special housing scheme for textile industry workers in Erode.',
    eligibility_criteria: 'Textile workers, Annual income below ₹3 Lakhs',
    category: 'LIG',
    application_deadline: '2026-06-30'
  },
  {
    name: 'Vellore Fort View Apartments',
    location: 'Vellore',
    price: 1600000,
    total_units: 320,
    available_units: 75,
    description: 'Premium affordable housing with views of Vellore Fort.',
    eligibility_criteria: 'Annual income below ₹4 Lakhs, Tamil Nadu resident',
    category: 'MIG',
    application_deadline: '2026-05-31'
  },
  {
    name: 'Thanjavur Delta Housing Scheme',
    location: 'Thanjavur',
    price: 1050000,
    total_units: 220,
    available_units: 165,
    description: 'Housing in the fertile Cauvery delta region for agricultural workers.',
    eligibility_criteria: 'Farmers/Agricultural workers, Annual income below ₹2.5 Lakhs',
    category: 'EWS',
    application_deadline: '2026-04-30'
  },
  {
    name: 'Kanyakumari Coastal Housing',
    location: 'Kanyakumari',
    price: 1400000,
    total_units: 180,
    available_units: 90,
    description: 'Coastal housing scheme in Kanyakumari district with sea views.',
    eligibility_criteria: 'Annual income below ₹3.5 Lakhs, Coastal district residents',
    category: 'LIG',
    application_deadline: '2026-03-31'
  }
];

async function seedSchemes() {
  try {
    console.log('Seeding Tamil Nadu housing schemes...');
    
    for (const scheme of tamilNaduSchemes) {
      const query = `
        INSERT INTO schemes (name, location, price, total_units, available_units, description, eligibility_criteria, category, application_deadline)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT DO NOTHING
        RETURNING id
      `;
      const values = [
        scheme.name,
        scheme.location,
        scheme.price,
        scheme.total_units,
        scheme.available_units,
        scheme.description,
        scheme.eligibility_criteria,
        scheme.category,
        scheme.application_deadline
      ];
      await pool.query(query, values);
      console.log(`✓ Added scheme: ${scheme.name}`);
    }
    
    console.log('✅ Schemes seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding schemes:', error);
    process.exit(1);
  }
}

seedSchemes();
