import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Import models
import Property from './models/Property.mjs';
import User from './models/User.mjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-housing';

// Bangladesh Divisions with all universities by Zilla, locations, and areas
const divisionsData = {
  'Dhaka': {
    areas: ['Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Mohakhali', 'Motijheel', 'Uttara', 'Farmgate', 'Shyamoli', 'Badda'],
    zillaData: {
      'Dhaka': [
        'Dhaka University', 'BUET', 'IUB (Independent University Bangladesh)', 'North South University', 
        'BRAC University', 'Daffodil International University', 'American International University Bangladesh', 
        'Bangladesh University of Business and Technology', 'East West University', 'Ahsanullah University of Science and Technology',
        'Central Women\'s University', 'City University Bangladesh', 'Gono Bishwabidyalay', 
        'Stamford University Bangladesh', 'Manarat International University', 'World University of Bangladesh',
        'Metropolitan University', 'United International University', 'SUST (Shahjalal University)', 
        'Green University of Bangladesh', 'Bangladesh Business School', 'Royal University', 'South East University',
        'Bangladesh Islamic University', 'Bangladesh Open University', 'Jahangirnagar University'
      ],
      'Gazipur': [
        'BUET Gazipur Campus', 'Jashore University of Science and Technology', 'Asian University of Bangladesh', 
        'BGMEA University of Fashion and Technology', 'Northern University Bangladesh (Gazipur)', 
        'Gona Shisho Bikshaa Pratisthan', 'Bangladesh Agricultural University', 'Amar Bangla University',
        'Islahia University', 'Moulana Bhashani Science and Technology University'
      ],
      'Narayanganj': [
        'Narayanganj National University', 'Bangladesh University of Business and Technology', 
        'Prime University Narayanganj Campus', 'Southern University Bangladesh', 'Islahia University Narayanganj',
        'Metropolitan University Narayanganj'
      ],
      'Tangail': [
        'National Institute of Technology (NIT)', 'Islamic University of Bangladesh', 
        'Tangail Engineering College', 'Sher-e-Bangla Agricultural University', 'Rajbari University',
        'Bangladesh College of Education'
      ]
    },
    priceRange: { min: 8000, max: 25000 }
  },
  
  'Chittagong': {
    areas: ['Chawkbazar', 'GEC', 'Halishahar', 'Nasirabad', 'Patenga', 'Bayazid', 'Sholoshohor', 'Anderkilla', 'Kotwali', 'Pahartali'],
    zillaData: {
      'Chattogram': [
        'Chittagong University', 'Chittagong University of Engineering and Technology (CUET)',
        'Daffodil International University Chittagong', 'Prime University Chittagong', 'Southeast University', 
        'Manarat International University', 'Chittagong College of Science', 'World University of Bangladesh',
        'Chittagong Independent University', 'Begum Rokeya University (Chattogram Campus)',
        'Bangladesh University of Business and Technology Chittagong', 'Chittagong Medical College',
        'Chittagong Science College', 'Islahia University Chittagong', 'Royal University Chittagong'
      ],
      'Cox\'s Bazar': [
        'Cox\'s Bazar University', 'Jashore University of Science and Technology Cox\'s Bazar', 'Technip Abdullah University',
        'Cox\'s Bazar Medical College', 'Bangladesh Open University Cox\'s Bazar Center'
      ],
      'Khagrachhari': [
        'Khagrachhari University', 'Chittagong University Khagrachhari Campus', 'Rangamati Science College'
      ],
      'Cumilla': [
        'Comilla University', 'Daffodil International University Cumilla', 'Bangladesh University of Business and Technology Cumilla',
        'Cumilla College', 'Comilla Independent University', 'Cumilla Women\'s College', 'Victoria College'
      ]
    },
    priceRange: { min: 5000, max: 18000 }
  },
  
  'Sylhet': {
    areas: ['Shahparan', 'Zindabazar', 'Amberkhana', 'Surma Road', 'Subid Bazar', 'Eid Gah', 'Kaziroad', 'Rasta Road', 'Polash', 'Joydebpur'],
    zillaData: {
      'Sylhet': [
        'Shahjalal University of Science and Technology', 'Jalalabad Ragib Rahmullah University',
        'Sylhet Engineering College', 'Sylhet International University', 'East West University Sylhet',
        'Moulana Bhashani Science and Technology University', 'Islamic University of Bangladesh Sylhet',
        'Sylhet Women\'s College', 'Sylhet Govt. College', 'Sunamganj University Extension'
      ],
      'Moulvibazar': [
        'Jalalabad Ragib Rahmullah University Moulvibazar', 'Moulvibazar University', 
        'Islamic University of Bangladesh Moulvibazar', 'Moulana Bhashani University Habiganj Campus',
        'Kalaiganj College', 'Srimangal College'
      ],
      'Sunamganj': [
        'Sunamganj University', 'Moulana Bhashani Science and Technology University Sunamganj',
        'Islamic University of Bangladesh Sunamganj', 'Sunamganj College', 'Dowarabazar College'
      ]
    },
    priceRange: { min: 4000, max: 12000 }
  },
  
  'Khulna': {
    areas: ['Nine Mile', 'Halishahar', 'Rupsa', 'Shahid Zia Road', 'Daukazchari', 'Khan Jahan Ali Road', 'Boyra', 'Sonadighi', 'Phultala', 'Dumuria'],
    zillaData: {
      'Khulna': [
        'Khulna University', 'Khulna University of Engineering & Technology (KUET)',
        'Islamic University of Technology', 'Prime University (Khulna)', 'Khulna College'
      ],
      'Satkhira': [
        'Satkhira University', 'Islamic University of Technology (Satkhira)',
        'Satkhira Independent University'
      ],
      'Bagerhat': [
        'Bagerhat University', 'Faridpur National College (Bagerhat)'
      ],
      'Jhenaidah': [
        'Jhenaidah University', 'Islamic University of Bangladesh (Jhenaidah)',
        'Jhenaidah Independent University'
      ]
    },
    priceRange: { min: 3500, max: 10000 }
  },
  
  'Rajshahi': {
    areas: ['Baridhara', 'Shah Makhdum', 'Kazla', 'Laxmipur', 'Talaimari', 'Motihar', 'Mohonpur', 'Durgapur', 'Nababganj', 'Puthia'],
    zillaData: {
      'Rajshahi': [
        'Rajshahi University', 'Rajshahi University of Engineering & Technology (RUET)',
        'Islamic University of Technology', 'Rajshahi University Evening College', 'Varendra University',
        'Rajshahi Science College'
      ],
      'Bogra': [
        'Islamic University of Bangladesh (Bogra)', 'Bogra University', 'Sher-e-Bangla University',
        'Bogra Independent University'
      ],
      'Pabna': [
        'Pabna University', 'Islamic University of Bangladesh (Pabna)',
        'Pabna Independent University'
      ],
      'Naogaon': [
        'Naogaon University', 'Islamic University of Bangladesh (Naogaon)'
      ]
    },
    priceRange: { min: 3500, max: 11000 }
  },
  
  'Rangpur': {
    areas: ['Sadorpur', 'Kaunia', 'Mithapukur', 'Pirganj', 'Sadar', 'Gangachara', 'Badarganj', 'Thakurgaon', 'Lalmonirhat', 'Kurigram'],
    zillaData: {
      'Rangpur': [
        'Rangpur University', 'Begum Rokeya University', 'Northern University Bangladesh',
        'Rangpur Medical College', 'Rangpur Independent University', 'Rangpur Science College'
      ],
      'Dinajpur': [
        'Dinajpur University', 'Begum Rokeya University (Dinajpur)', 'Islamic University of Bangladesh (Dinajpur)',
        'Dinajpur Independent University'
      ],
      'Kurigram': [
        'Kurigram University', 'Islamic University of Bangladesh (Kurigram)',
        'Northern University Bangladesh (Kurigram)'
      ],
      'Thakurgaon': [
        'Thakurgaon University', 'Begum Rokeya University (Thakurgaon)',
        'Islamic University of Bangladesh (Thakurgaon)'
      ]
    },
    priceRange: { min: 3000, max: 9000 }
  },
  
  'Barishal': {
    areas: ['Rupatoli', 'Ginnah', 'Kawran Bazar', 'Sadar', 'Kirtonkhola', 'Ashwina', 'Jhalokati', 'Pirojpur', 'Bhola', 'Patuakhali'],
    zillaData: {
      'Barishal': [
        'Barishal University', 'Barishal Engineering College', 'Barishal Medical College',
        'Bangladesh University of Business & Technology (Barishal)', 'Barishal Independent University'
      ],
      'Patuakhali': [
        'Patuakhali University', 'Patuakhali Science and Technology University', 'Islamic University of Bangladesh (Patuakhali)',
        'Patuakhali Independent University'
      ],
      'Bhola': [
        'Bhola University', 'Islamic University of Bangladesh (Bhola)',
        'Bhola Independent University'
      ],
      'Jhalokati': [
        'Jhalokati University', 'Bangladesh University of Business & Technology (Jhalokati)'
      ]
    },
    priceRange: { min: 3000, max: 8500 }
  },
  
  'Mymensingh': {
    areas: ['Sadar', 'Fulpur', 'Dhobaura', 'Mymensingh City', 'Ananda Mohan', 'Kashimpur', 'Nemchor', 'Tangail', 'Kishoreganj'],
    zillaData: {
      'Mymensingh': [
        'Bangladesh Agricultural University', 'Mymensingh Engineering College', 'National University',
        'Mymensingh Medical College', 'Mymensingh University', 'Moulana Bhashani Science and Technology University'
      ],
      'Kishoreganj': [
        'Kishoreganj University', 'Islamic University of Bangladesh (Kishoreganj)',
        'Moulana Bhashani Science and Technology University (Kishoreganj)', 'Kishoreganj Independent University'
      ],
      'Netrokona': [
        'Netrokona University', 'Islamic University of Bangladesh (Netrokona)',
        'Moulana Bhashani Science and Technology University (Netrokona)'
      ],
      'Sherpur': [
        'Sherpur University', 'Islamic University of Bangladesh (Sherpur)',
        'Bangladesh Agricultural University (Sherpur Campus)'
      ]
    },
    priceRange: { min: 3500, max: 10000 }
  }
};

// Landlord info templates
const landlordFirstNames = ['Mr.', 'Haji', 'Sheikh', 'Khan', 'Miah', 'Ali', 'Rahman', 'Ahmed'];
const landlordLastNames = ['Ahmed', 'Hassan', 'Khan', 'Rahman', 'Islam', 'Ali', 'Hossain', 'Malik', 'Hussain', 'Siddiqui'];

// Property types
const propertyTypes = ['room', 'apartment', 'pg', 'hostel', 'studio'];

// Common amenities (must match schema enum)
const amenitiesList = ['wifi', 'ac', 'parking', 'laundry', 'kitchen', 'gym', 'security', 'cctv', 'water', 'electricity', 'gas', 'elevator', 'generator', 'furnished'];

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

function generatePropertyName(area, type) {
  const prefixes = ['Cozy', 'Bright', 'Modern', 'Classic', 'Premium', 'Elite', 'Comfy', 'Home'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix} ${type.charAt(0).toUpperCase() + type.slice(1)} in ${area}`;
}

function generateLandlordName() {
  return `${landlordFirstNames[Math.floor(Math.random() * landlordFirstNames.length)]} ${landlordLastNames[Math.floor(Math.random() * landlordLastNames.length)]}`;
}

function generatePhone() {
  const prefix = '01' + ['3', '4', '5', '6', '7', '8', '9'][Math.floor(Math.random() * 7)];
  const rest = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return prefix + rest;
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing properties (optional)
    await Property.deleteMany({});
    console.log('🗑️ Cleared existing properties');

    let totalProperties = 0;
    let landlordCount = 0;

    // Create properties for each division and zilla
    for (const [division, divisionData] of Object.entries(divisionsData)) {
      console.log(`\n📍 Adding properties for ${division}...`);
      
      // Iterate through each zilla in this division
      for (const [zilla, universities] of Object.entries(divisionData.zillaData)) {
        const properties = [];
        
        // Create 50 properties per zilla (increased from 30)
        for (let i = 0; i < 50; i++) {
          const area = divisionData.areas[i % divisionData.areas.length];
          // Select a random university from the zilla's university list
          const university = universities[Math.floor(Math.random() * universities.length)];
          const propertyType = propertyTypes[i % propertyTypes.length];
          const price = Math.floor(
            Math.random() * (divisionData.priceRange.max - divisionData.priceRange.min) + divisionData.priceRange.min
          );
          
          // Create a unique landlord for variety (but reuse some)
          const landlordIndex = Math.floor(i / 5);
          const landlordName = generateLandlordName();
          const landlordEmail = `landlord${landlordIndex}@studentstay.com`;
          
          // Check if landlord exists, if not create
          let landlord = await User.findOne({ email: landlordEmail });
          if (!landlord) {
            const hashedPassword = await bcrypt.hash('Password123!', 10);
            landlord = new User({
              name: landlordName,
              email: landlordEmail,
              password: hashedPassword,
              phone: generatePhone(),
              userType: 'landlord',
              verified: true
            });
            await landlord.save();
            landlordCount++;
          }

          const property = new Property({
            title: generatePropertyName(area, propertyType),
            description: `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} in ${area}, ${zilla} near ${university}. Fully furnished and ready for students. Contact landlord for more details.`,
            type: propertyType,
            address: {
              street: `${Math.floor(Math.random() * 200) + 1} Street`,
              area: area,
              city: division,
              district: zilla,
              postalCode: `${Math.floor(Math.random() * 90000) + 10000}`
            },
            university: university,
            distanceFromUniversity: Math.floor(Math.random() * 5) + 0.5,
            price: {
              amount: price,
              currency: 'BDT',
              period: 'monthly'
            },
            images: [
              {
                url: `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop`,
                caption: 'Main room'
              },
              {
                url: `https://images.unsplash.com/photo-1576305492759-16ef978bc9da?w=800&h=600&fit=crop`,
                caption: 'Bedroom'
              },
              {
                url: `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop`,
                caption: 'Living area'
              }
            ],
            amenities: getRandomElements(amenitiesList, Math.floor(Math.random() * 6) + 2),
            rooms: {
              total: ['studio', 'room'].includes(propertyType) ? 1 : Math.floor(Math.random() * 3) + 2,
              available: ['studio', 'room'].includes(propertyType) ? 1 : Math.floor(Math.random() * 2) + 1,
              bedrooms: ['studio', 'room'].includes(propertyType) ? 1 : Math.floor(Math.random() * 3) + 1,
              bathrooms: Math.floor(Math.random() * 2) + 1,
              capacity: ['studio', 'room'].includes(propertyType) ? 1 : Math.floor(Math.random() * 3) + 2
            },
            rules: {
              gender: ['any', 'male', 'female'][Math.floor(Math.random() * 3)],
              smoking: false,
              pets: Math.random() > 0.7,
              visitors: true
            },
            landlord: landlord._id,
            contactInfo: {
              phone: landlord.phone,
              email: landlord.email,
              whatsapp: landlord.phone
            },
            status: 'available',
            verified: true,
            featured: Math.random() > 0.8,
            rating: {
              average: Math.floor(Math.random() * 2) + 3.5,
              count: Math.floor(Math.random() * 30)
            }
          });
          
          properties.push(property);
        }
        
        await Property.insertMany(properties);
        totalProperties += properties.length;
        console.log(`   ✅ Added 50 properties for ${zilla}`);
      }
    }

    console.log(`\n✨ Seeding completed!`);
    console.log(`📊 Total properties added: ${totalProperties}`);
    console.log(`👥 Total landlords created: ${landlordCount}`);
    
    // Show summary by division
    for (const [division, divisionData] of Object.entries(divisionsData)) {
      for (const zilla of Object.keys(divisionData.zillaData)) {
        const count = await Property.countDocuments({ 'address.district': zilla, 'address.city': division });
        console.log(`   ${division} - ${zilla}: ${count} properties`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
