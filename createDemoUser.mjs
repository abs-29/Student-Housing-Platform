import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

import User from './models/User.mjs';
import Property from './models/Property.mjs';
import Booking from './models/Booking.mjs';
import Review from './models/Review.mjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-housing';

async function createDemoUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create demo user
    const hashedPassword = await bcrypt.hash('Demo@12345', 10);
    
    let demoUser = await User.findOne({ email: 'demo@studentstay.com' });
    
    if (demoUser) {
      console.log('⚠️ Demo user already exists, updating...');
      demoUser.name = 'Demo Student';
      demoUser.phone = '01712345678';
      demoUser.verified = true;
      await demoUser.save();
    } else {
      demoUser = new User({
        name: 'Demo Student',
        email: 'demo@studentstay.com',
        password: hashedPassword,
        phone: '01712345678',
        userType: 'student',
        verified: true,
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
      });
      await demoUser.save();
      console.log('✅ Demo user created successfully');
    }

    // Get some properties to create bookings and reviews
    const properties = await Property.find().limit(5);
    
    if (properties.length === 0) {
      console.log('❌ No properties found. Please seed properties first.');
      process.exit(1);
    }

    // Create 3 bookings for demo user
    await Booking.deleteMany({ student: demoUser._id });
    const bookings = [];
    
    for (let i = 0; i < 3; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 10));
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      const duration = 30; // days

      const booking = new Booking({
        student: demoUser._id,
        property: properties[i]._id,
        landlord: properties[i].landlord,
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        totalAmount: properties[i].price.amount * 1,
        status: i === 0 ? 'confirmed' : 'pending',
        paymentStatus: i === 0 ? 'paid' : 'pending',
        notes: `Booking for ${properties[i].title}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
      
      bookings.push(booking);
    }
    
    await Booking.insertMany(bookings);
    console.log(`✅ Created 3 demo bookings`);

    // Create 2 reviews for demo user
    await Review.deleteMany({ user: demoUser._id });
    
    const reviews = [
      {
        user: demoUser._id,
        property: properties[0]._id,
        landlord: properties[0].landlord,
        rating: 5,
        title: 'Excellent Property!',
        comment: 'Amazing location, very close to university. The landlord is very cooperative and helpful. Highly recommended for students!',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        user: demoUser._id,
        property: properties[1]._id,
        landlord: properties[1].landlord,
        rating: 4,
        title: 'Good value for money',
        comment: 'Very comfortable rooms with good amenities. A bit noisy during peak hours but overall satisfied with the stay.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    await Review.insertMany(reviews);
    console.log(`✅ Created 2 demo reviews`);

    // Create a demo property added by the user (as landlord)
    let demoLandlord = await User.findOne({ email: 'demolandlord@studentstay.com' });
    
    if (!demoLandlord) {
      const landlordPassword = await bcrypt.hash('Landlord@12345', 10);
      demoLandlord = new User({
        name: 'Demo Landlord',
        email: 'demolandlord@studentstay.com',
        password: landlordPassword,
        phone: '01987654321',
        userType: 'landlord',
        verified: true,
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Landlord'
      });
      await demoLandlord.save();
      console.log('✅ Demo landlord created');
    }

    // Check if demo property already exists
    const existingDemoProperty = await Property.findOne({ 
      'contactInfo.email': 'demolandlord@studentstay.com'
    });

    if (!existingDemoProperty) {
      const demoProperty = new Property({
        title: '🏠 Demo Luxury Studio Near Dhaka University',
        description: 'Premium student accommodation with all modern amenities. Fully furnished, high-speed WiFi, 24/7 security, and backup generator. Perfect for serious students looking for a peaceful study environment.',
        type: 'studio',
        address: {
          street: '45 Dhanmondi Lake Road',
          area: 'Dhanmondi',
          city: 'Dhaka',
          district: 'Dhaka',
          postalCode: '1205'
        },
        university: 'Dhaka University',
        distanceFromUniversity: 0.8,
        price: {
          amount: 15000,
          currency: 'BDT',
          period: 'monthly'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            caption: 'Living Room'
          },
          {
            url: 'https://images.unsplash.com/photo-1576305492759-16ef978bc9da?w=800&h=600&fit=crop',
            caption: 'Bedroom'
          },
          {
            url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
            caption: 'Kitchen Area'
          }
        ],
        amenities: ['wifi', 'ac', 'parking', 'kitchen', 'security', 'generator', 'furnished'],
        rooms: {
          total: 1,
          available: 1,
          bedrooms: 1,
          bathrooms: 1,
          capacity: 1
        },
        rules: {
          gender: 'any',
          smoking: false,
          pets: false,
          visitors: true
        },
        landlord: demoLandlord._id,
        contactInfo: {
          phone: '01987654321',
          email: 'demolandlord@studentstay.com',
          whatsapp: '01987654321'
        },
        status: 'available',
        verified: true,
        featured: true,
        rating: {
          average: 4.8,
          count: 12
        }
      });

      await demoProperty.save();
      console.log('✅ Created 1 demo property listing');
    } else {
      console.log('⚠️ Demo property already exists');
    }

    console.log('\n✨ Demo User Setup Completed!');
    console.log('\n📋 Demo User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Email: demo@studentstay.com');
    console.log('🔐 Password: Demo@12345');
    console.log('📱 Phone: 01712345678');
    console.log('👛 User Type: Student (Tenant)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🏠 Demo Property (Landlord):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: demolandlord@studentstay.com');
    console.log('🔑 Password: Landlord@12345');
    console.log('🏡 Property: Demo Luxury Studio Near Dhaka University');
    console.log('💰 Price: 15,000 BDT/month');
    console.log('📍 Location: Dhanmondi, Dhaka');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n✅ Features Demonstrated:');
    console.log('✔️  User Registration & Login');
    console.log('✔️  Property Browsing & Searching');
    console.log('✔️  Property Booking (3 active bookings)');
    console.log('✔️  Ratings & Reviews (2 reviews posted)');
    console.log('✔️  Dashboard Access');
    console.log('✔️  Property Listing Creation (Landlord)');
    console.log('✔️  Profile Management');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoUser();
