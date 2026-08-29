import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create directory
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
};

// Helper function to create file
const createFile = (filePath, content) => {
  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Created file: ${filePath}`);
};

console.log('🚀 Starting Student Housing Platform Setup...\n');

// Create directory structure
const directories = [
  'config',
  'models',
  'controllers',
  'routes',
  'middleware',
  'utils',
  'public/css',
  'public/js',
  'public/images',
  'views'
];

directories.forEach(dir => createDir(path.join(__dirname, dir)));

// ==================== PACKAGE.JSON ====================
createFile(path.join(__dirname, 'package.json'), `
{
  "name": "student-housing-platform",
  "version": "1.0.0",
  "description": "Next-generation student housing platform",
  "main": "server.mjs",
  "type": "module",
  "scripts": {
    "start": "node server.mjs",
    "dev": "nodemon server.mjs",
    "setup": "npm install"
  },
  "keywords": ["student", "housing", "rental", "accommodation"],
  "author": "Metropolitan University Student",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
`);

// ==================== .ENV ====================
createFile(path.join(__dirname, '.env'), `
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-housing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5000
`);

// ==================== .GITIGNORE ====================
createFile(path.join(__dirname, '.gitignore'), `
node_modules/
.env
*.log
.DS_Store
uploads/
`);

// ==================== SERVER.MJS ====================
createFile(path.join(__dirname, 'server.mjs'), `
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.mjs';
import propertyRoutes from './routes/propertyRoutes.mjs';
import bookingRoutes from './routes/bookingRoutes.mjs';
import reviewRoutes from './routes/reviewRoutes.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-housing');
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/properties', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'properties.html'));
});

app.get('/add-property', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'add-property.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
  console.log('🌐 Frontend: http://localhost:' + PORT);
  console.log('🔌 API: http://localhost:' + PORT + '/api');
});

export default app;
`);

// ==================== MODELS ====================

// User Model
createFile(path.join(__dirname, 'models/User.mjs'), `
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'landlord', 'admin'],
    default: 'student'
  },
  phone: {
    type: String,
    trim: true,
    match: [/^(\\+88)?01[3-9]\\d{8}$/, 'Please provide a valid phone number']
  },
  university: {
    type: String,
    trim: true
  },
  studentId: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff&size=200'
  },
  verified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive data
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
`);

// Property Model
createFile(path.join(__dirname, 'models/Property.mjs'), `
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['room', 'apartment', 'pg', 'hostel', 'studio']
  },
  address: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: String
  },
  university: {
    type: String,
    required: true
  },
  distanceFromUniversity: {
    type: Number,
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'BDT'
    },
    period: {
      type: String,
      enum: ['monthly', 'semester', 'yearly'],
      default: 'monthly'
    }
  },
  images: [{
    url: {
      type: String,
      default: 'https://via.placeholder.com/800x600?text=Property+Image'
    },
    caption: String
  }],
  amenities: [{
    type: String,
    enum: ['wifi', 'ac', 'parking', 'laundry', 'kitchen', 'gym', 'security', 'cctv', 'water', 'electricity', 'gas', 'elevator', 'generator', 'furnished']
  }],
  rooms: {
    total: { type: Number, required: true },
    available: { type: Number, required: true },
    bedrooms: Number,
    bathrooms: Number,
    capacity: Number
  },
  rules: {
    gender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    },
    smoking: { type: Boolean, default: false },
    pets: { type: Boolean, default: false },
    visitors: { type: Boolean, default: true }
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: String,
    whatsapp: String
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'pending'],
    default: 'available'
  },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  views: { type: Number, default: 0 },
  bookings: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

propertySchema.index({ 'address.city': 1, university: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });

propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property'
});

export default mongoose.model('Property', propertySchema);
`);

// Booking Model
createFile(path.join(__dirname, 'models/Booking.mjs'), `
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: String,
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date
}, {
  timestamps: true
});

bookingSchema.index({ property: 1, startDate: 1 });
bookingSchema.index({ student: 1 });

export default mongoose.model('Booking', bookingSchema);
`);

// Review Model
createFile(path.join(__dirname, 'models/Review.mjs'), `
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ratings: {
    cleanliness: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    amenities: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    landlord: { type: Number, min: 1, max: 5 }
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

reviewSchema.index({ property: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
`);

// ==================== CONTROLLERS ====================

// Auth Controller
createFile(path.join(__dirname, 'controllers/authController.mjs'), `
import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-key', {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, university, studentId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone,
      university,
      studentId
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, university, studentId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, university, studentId },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
`);

// Property Controller
createFile(path.join(__dirname, 'controllers/propertyController.mjs'), `
import Property from '../models/Property.mjs';

export const getAllProperties = async (req, res) => {
  try {
    const {
      university,
      type,
      minPrice,
      maxPrice,
      city,
      amenities,
      gender,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = { status: 'available' };

    if (university) query.university = university;
    if (type) query.type = type;
    if (city) query['address.city'] = city;
    if (gender) query['rules.gender'] = { $in: [gender, 'any'] };
    
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = Number(minPrice);
      if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    const properties = await Property.find(query)
      .populate('landlord', 'name email phone profileImage')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'name email phone profileImage')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name profileImage'
        }
      });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.views += 1;
    await property.save();

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      landlord: req.user.id
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const searchProperties = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const properties = await Property.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { university: { $regex: q, $options: 'i' } },
        { 'address.area': { $regex: q, $options: 'i' } },
        { 'address.city': { $regex: q, $options: 'i' } }
      ],
      status: 'available'
    }).limit(20);

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ status: 'available' });
    const totalBookings = await Property.aggregate([
      { $group: { _id: null, total: { $sum: '$bookings' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalProperties,
        availableProperties,
        totalBookings: totalBookings[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
`);

// Booking Controller
createFile(path.join(__dirname, 'controllers/bookingController.mjs'), `
import Booking from '../models/Booking.mjs';
import Property from '../models/Property.mjs';

export const createBooking = async (req, res) => {
  try {
    const { propertyId, startDate, endDate, duration, totalAmount, notes } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.rooms.available === 0) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available'
      });
    }

    const booking = await Booking.create({
      property: propertyId,
      student: req.user.id,
      landlord: property.landlord,
      startDate,
      endDate,
      duration,
      totalAmount,
      notes
    });

    property.rooms.available -= 1;
    property.bookings += 1;
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user.id })
      .populate('property')
      .populate('landlord', 'name phone email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getLandlordBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ landlord: req.user.id })
      .populate('property')
      .populate('student', 'name phone email university')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.landlord.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = status;
    await booking.save();

    if (status === 'cancelled' || status === 'rejected') {
      const property = await Property.findById(booking.property);
      property.rooms.available += 1;
      await property.save();
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledBy = req.user.id;
    booking.cancelledAt = Date.now();
    booking.cancellationReason = req.body.reason;
    await booking.save();

    const property = await Property.findById(booking.property);
    property.rooms.available += 1;
    await property.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
`);

// Review Controller
createFile(path.join(__dirname, 'controllers/reviewController.mjs'), `
import Review from '../models/Review.mjs';
import Property from '../models/Property.mjs';

export const createReview = async (req, res) => {
  try {
    const { propertyId, rating, ratings, title, comment } = req.body;

    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property'
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user.id,
      rating,
      ratings,
      title,
      comment
    });

    // Update property rating
    const property = await Property.findById(propertyId);
    const reviews = await Review.find({ property: propertyId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    property.rating.average = totalRating / reviews.length;
    property.rating.count = reviews.length;
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name profileImage')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
`);

// ==================== MIDDLEWARE ====================

// Auth Middleware
createFile(path.join(__dirname, 'middleware/auth.mjs'), `
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'User role ' + req.user.role + ' is not authorized to access this route'
      });
    }
    next();
  };
};
`);

// Validation Middleware
createFile(path.join(__dirname, 'middleware/validation.mjs'), `
import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'landlord']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Property title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['room', 'apartment', 'pg', 'hostel', 'studio']).withMessage('Invalid property type'),
  body('price.amount').isNumeric().withMessage('Price must be a number'),
  body('university').trim().notEmpty().withMessage('University is required')
];
`);

// ==================== ROUTES ====================

// Auth Routes
createFile(path.join(__dirname, 'routes/authRoutes.mjs'), `
import express from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/authController.mjs';
import { protect } from '../middleware/auth.mjs';
import { validate, registerValidation, loginValidation } from '../middleware/validation.mjs';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
`);

// Property Routes
createFile(path.join(__dirname, 'routes/propertyRoutes.mjs'), `
import express from 'express';
import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  searchProperties,
  getStats
} from '../controllers/propertyController.mjs';
import { protect, authorize } from '../middleware/auth.mjs';
import { validate, propertyValidation } from '../middleware/validation.mjs';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/search', searchProperties);
router.get('/stats', getStats);
router.get('/my-properties', protect, authorize('landlord', 'admin'), getMyProperties);
router.get('/:id', getProperty);
router.post('/', protect, authorize('landlord', 'admin'), validate(propertyValidation), createProperty);
router.put('/:id', protect, authorize('landlord', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('landlord', 'admin'), deleteProperty);

export default router;
`);

// Booking Routes
createFile(path.join(__dirname, 'routes/bookingRoutes.mjs'), `
import express from 'express';
import {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.mjs';
import { protect, authorize } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, authorize('student'), createBooking);
router.get('/my-bookings', protect, authorize('student'), getMyBookings);
router.get('/landlord-bookings', protect, authorize('landlord'), getLandlordBookings);
router.put('/:id/status', protect, authorize('landlord', 'admin'), updateBookingStatus);
router.put('/:id/cancel', protect, authorize('student'), cancelBooking);

export default router;
`);

// Review Routes
createFile(path.join(__dirname, 'routes/reviewRoutes.mjs'), `
import express from 'express';
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/property/:propertyId', getPropertyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
`);

// ==================== VIEWS (HTML) ====================

// Index Page
createFile(path.join(__dirname, 'views/index.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Housing Platform - Find Your Perfect Accommodation</title>
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <i class="fas fa-home"></i>
                <span>StudentStay</span>
            </div>
            <ul class="nav-menu">
                <li><a href="/" class="active">Home</a></li>
                <li><a href="/properties">Properties</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="nav-actions">
                <a href="/login" class="btn btn-outline">Login</a>
                <a href="/register" class="btn btn-primary">Sign Up</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">Find Your Perfect Student Home</h1>
                <p class="hero-subtitle">Discover verified, affordable accommodation near your university</p>
                
                <div class="search-box">
                    <div class="search-input-group">
                        <i class="fas fa-map-marker-alt"></i>
                        <input type="text" id="searchLocation" placeholder="University or Location">
                    </div>
                    <div class="search-input-group">
                        <i class="fas fa-home"></i>
                        <select id="propertyType">
                            <option value="">Property Type</option>
                            <option value="room">Room</option>
                            <option value="apartment">Apartment</option>
                            <option value="pg">PG</option>
                            <option value="hostel">Hostel</option>
                            <option value="studio">Studio</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="searchProperties()">
                        <i class="fas fa-search"></i> Search
                    </button>
                </div>

                <div class="stats">
                    <div class="stat-item">
                        <h3 id="totalProperties">0</h3>
                        <p>Properties Available</p>
                    </div>
                    <div class="stat-item">
                        <h3 id="totalBookings">0</h3>
                        <p>Happy Students</p>
                    </div>
                    <div class="stat-item">
                        <h3>50+</h3>
                        <p>Universities</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Properties -->
    <section class="featured-properties">
        <div class="container">
            <h2 class="section-title">Featured Properties</h2>
            <p class="section-subtitle">Handpicked accommodations for students</p>
            
            <div class="properties-grid" id="featuredProperties">
                <div class="loading">Loading properties...</div>
            </div>

            <div class="text-center" style="margin-top: 40px;">
                <a href="/properties" class="btn btn-primary">View All Properties</a>
            </div>
        </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
        <div class="container">
            <h2 class="section-title">How It Works</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Search</h3>
                    <p>Find properties near your university with advanced filters</p>
                </div>
                <div class="step">
                    <div class="step-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Compare</h3>
                    <p>Compare verified listings with transparent pricing</p>
                </div>
                <div class="step">
                    <div class="step-icon">
                        <i class="fas fa-key"></i>
                    </div>
                    <h3>Book</h3>
                    <p>Book directly without broker fees</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section class="features">
        <div class="container">
            <h2 class="section-title">Why Choose StudentStay?</h2>
            <div class="features-grid">
                <div class="feature">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Verified Listings</h3>
                    <p>All properties are verified by our team</p>
                </div>
                <div class="feature">
                    <i class="fas fa-dollar-sign"></i>
                    <h3>No Broker Fees</h3>
                    <p>Connect directly with landlords</p>
                </div>
                <div class="feature">
                    <i class="fas fa-star"></i>
                    <h3>Real Reviews</h3>
                    <p>Honest reviews from verified students</p>
                </div>
                <div class="feature">
                    <i class="fas fa-headset"></i>
                    <h3>24/7 Support</h3>
                    <p>We're here to help anytime</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>StudentStay</h3>
                    <p>Your trusted platform for student accommodation</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/properties">Browse Properties</a></li>
                        <li><a href="/register">List Your Property</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p><i class="fas fa-envelope"></i> info@studentstay.com</p>
                    <p><i class="fas fa-phone"></i> +880 1721-140302</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 StudentStay. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="/js/main.js"></script>
    <script>
        // Load featured properties
        async function loadFeaturedProperties() {
            try {
                const response = await fetch('/api/properties?limit=6&featured=true');
                const data = await response.json();
                
                const container = document.getElementById('featuredProperties');
                
                if (data.success && data.data.length > 0) {
                    container.innerHTML = data.data.map(property => \`
                        <div class="property-card">
                            <img src="\${property.images[0]?.url || 'https://via.placeholder.com/400x300'}" alt="\${property.title}">
                            <div class="property-info">
                                <h3>\${property.title}</h3>
                                <p class="location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    \${property.address.area}, \${property.address.city}
                                </p>
                                <p class="university">
                                    <i class="fas fa-university"></i>
                                    \${property.university}
                                </p>
                                <div class="property-meta">
                                    <span><i class="fas fa-bed"></i> \${property.rooms.total} Rooms</span>
                                    <span><i class="fas fa-star"></i> \${property.rating.average.toFixed(1)}</span>
                                </div>
                                <div class="property-footer">
                                    <div class="price">
                                        <span class="amount">\${property.price.currency} \${property.price.amount.toLocaleString()}</span>
                                        <span class="period">/\${property.price.period}</span>
                                    </div>
                                    <a href="/properties?id=\${property._id}" class="btn btn-sm">View Details</a>
                                </div>
                            </div>
                        </div>
                    \`).join('');
                } else {
                    container.innerHTML = '<p>No featured properties available at the moment.</p>';
                }
            } catch (error) {
                console.error('Error loading properties:', error);
                document.getElementById('featuredProperties').innerHTML = 
                    '<p>Error loading properties. Please try again later.</p>';
            }
        }

        // Load stats
        async function loadStats() {
            try {
                const response = await fetch('/api/properties/stats');
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('totalProperties').textContent = data.data.totalProperties || 0;
                    document.getElementById('totalBookings').textContent = data.data.totalBookings || 0;
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        function searchProperties() {
            const location = document.getElementById('searchLocation').value;
            const type = document.getElementById('propertyType').value;
            
            let url = '/properties?';
            if (location) url += \`university=\${encodeURIComponent(location)}&\`;
            if (type) url += \`type=\${type}\`;
            
            window.location.href = url;
        }

        // Load data on page load
        window.addEventListener('DOMContentLoaded', () => {
            loadFeaturedProperties();
            loadStats();
        });
    </script>
</body>
</html>
`);

// Login Page
createFile(path.join(__dirname, 'views/login.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - StudentStay</title>
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-header">
                <h1>Welcome Back</h1>
                <p>Login to your StudentStay account</p>
            </div>

            <form id="loginForm" class="auth-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="Enter your email">
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Enter your password">
                </div>

                <div class="form-options">
                    <label class="checkbox">
                        <input type="checkbox" name="remember">
                        <span>Remember me</span>
                    </label>
                    <a href="#" class="link">Forgot password?</a>
                </div>

                <button type="submit" class="btn btn-primary btn-block">Login</button>

                <div class="auth-footer">
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    
                    alert('Login successful!');
                    window.location.href = '/dashboard';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    </script>
</body>
</html>
`);

// Register Page
createFile(path.join(__dirname, 'views/register.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - StudentStay</title>
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-header">
                <h1>Create Account</h1>
                <p>Join StudentStay today</p>
            </div>

            <form id="registerForm" class="auth-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required placeholder="Enter your full name">
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="Enter your email">
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="+880 1XXX-XXXXXX">
                </div>

                <div class="form-group">
                    <label for="role">I am a</label>
                    <select id="role" name="role" required>
                        <option value="student">Student</option>
                        <option value="landlord">Landlord</option>
                    </select>
                </div>

                <div class="form-group" id="universityGroup">
                    <label for="university">University</label>
                    <input type="text" id="university" name="university" placeholder="Your university name">
                </div>

                <div class="form-group" id="studentIdGroup">
                    <label for="studentId">Student ID</label>
                    <input type="text" id="studentId" name="studentId" placeholder="Your student ID">
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Create a password (min 6 characters)">
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm your password">
                </div>

                <button type="submit" class="btn btn-primary btn-block">Create Account</button>

                <div class="auth-footer">
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Toggle student fields
        document.getElementById('role').addEventListener('change', (e) => {
            const isStudent = e.target.value === 'student';
            document.getElementById('universityGroup').style.display = isStudent ? 'block' : 'none';
            document.getElementById('studentIdGroup').style.display = isStudent ? 'block' : 'none';
        });

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                role: document.getElementById('role').value,
                password: document.getElementById('password').value
            };

            if (formData.role === 'student') {
                formData.university = document.getElementById('university').value;
                formData.studentId = document.getElementById('studentId').value;
            }

            const confirmPassword = document.getElementById('confirmPassword').value;

            if (formData.password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    
                    alert('Registration successful!');
                    window.location.href = '/dashboard';
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    </script>
</body>
</html>
`);

// Dashboard Page
createFile(path.join(__dirname, 'views/dashboard.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - StudentStay</title>
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <i class="fas fa-home"></i>
                <span>StudentStay</span>
            </div>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/properties">Properties</a></li>
                <li><a href="/dashboard" class="active">Dashboard</a></li>
            </ul>
            <div class="nav-actions">
                <div class="user-menu">
                    <img src="" alt="User" id="userAvatar" class="avatar">
                    <span id="userName">User</span>
                    <button onclick="logout()" class="btn btn-sm">Logout</button>
                </div>
            </div>
        </div>
    </nav>

    <div class="dashboard">
        <div class="container">
            <h1>Dashboard</h1>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-home"></i>
                    <div>
                        <h3 id="myPropertiesCount">0</h3>
                        <p>My Properties</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-check"></i>
                    <div>
                        <h3 id="myBookingsCount">0</h3>
                        <p>My Bookings</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <div>
                        <h3 id="reviewsCount">0</h3>
                        <p>Reviews</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-actions">
                <a href="/add-property" class="btn btn-primary" id="addPropertyBtn">
                    <i class="fas fa-plus"></i> Add New Property
                </a>
                <a href="/properties" class="btn btn-outline">
                    <i class="fas fa-search"></i> Browse Properties
                </a>
            </div>

            <div class="dashboard-content">
                <div id="studentContent" style="display:none;">
                    <h2>My Bookings</h2>
                    <div id="bookingsList"></div>
                </div>

                <div id="landlordContent" style="display:none;">
                    <h2>My Properties</h2>
                    <div id="propertiesList"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token || !user) {
            window.location.href = '/login';
        }

        document.getElementById('userName').textContent = user.name;
        document.getElementById('userAvatar').src = user.profileImage;

        // Show content based on role
        if (user.role === 'student') {
            document.getElementById('studentContent').style.display = 'block';
            document.getElementById('addPropertyBtn').style.display = 'none';
            loadMyBookings();
        } else if (user.role === 'landlord') {
            document.getElementById('landlordContent').style.display = 'block';
            loadMyProperties();
        }

        async function loadMyProperties() {
            try {
                const response = await fetch('/api/properties/my-properties', {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    document.getElementById('myPropertiesCount').textContent = data.count;
                    
                    const html = data.data.map(property => \`
                        <div class="property-item">
                            <h3>\${property.title}</h3>
                            <p>\${property.address.area}, \${property.address.city}</p>
                            <p>Price: \${property.price.currency} \${property.price.amount}</p>
                            <p>Status: \${property.status}</p>
                        </div>
                    \`).join('');
                    
                    document.getElementById('propertiesList').innerHTML = html || '<p>No properties yet</p>';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function loadMyBookings() {
            try {
                const response = await fetch('/api/bookings/my-bookings', {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    document.getElementById('myBookingsCount').textContent = data.count;
                    
                    const html = data.data.map(booking => \`
                        <div class="booking-item">
                            <h3>\${booking.property?.title}</h3>
                            <p>Start: \${new Date(booking.startDate).toLocaleDateString()}</p>
                            <p>Status: \${booking.status}</p>
                            <p>Amount: \${booking.totalAmount} BDT</p>
                        </div>
                    \`).join('');
                    
                    document.getElementById('bookingsList').innerHTML = html || '<p>No bookings yet</p>';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    </script>
</body>
</html>
`);

// Properties Page
createFile(path.join(__dirname, 'views/properties.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Properties - StudentStay</title>
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <i class="fas fa-home"></i>
                <span>StudentStay</span>
            </div>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/properties" class="active">Properties</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
            </ul>
            <div class="nav-actions">
                <a href="/login" class="btn btn-outline">Login</a>
            </div>
        </div>
    </nav>

    <div class="properties-page">
        <div class="container">
            <div class="page-header">
                <h1>Browse Properties</h1>
                <p>Find your perfect student accommodation</p>
            </div>

            <div class="properties-layout">
                <aside class="filters">
                    <h3>Filters</h3>
                    
                    <div class="filter-group">
                        <label>Property Type</label>
                        <select id="filterType">
                            <option value="">All Types</option>
                            <option value="room">Room</option>
                            <option value="apartment">Apartment</option>
                            <option value="pg">PG</option>
                            <option value="hostel">Hostel</option>
                            <option value="studio">Studio</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>City</label>
                        <select id="filterCity">
                            <option value="">All Cities</option>
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Sylhet">Sylhet</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Price Range</label>
                        <input type="number" id="minPrice" placeholder="Min Price">
                        <input type="number" id="maxPrice" placeholder="Max Price">
                    </div>

                    <button class="btn btn-primary btn-block" onclick="applyFilters()">Apply Filters</button>
                </aside>

                <main class="properties-main">
                    <div class="properties-grid" id="propertiesGrid">
                        <div class="loading">Loading properties...</div>
                    </div>

                    <div class="pagination" id="pagination"></div>
                </main>
            </div>
        </div>
    </div>

    <script>
        let currentPage = 1;

        async function loadProperties() {
            const params = new URLSearchParams(window.location.search);
            const type = params.get('type') || document.getElementById('filterType')?.value || '';
            const city = params.get('city') || document.getElementById('filterCity')?.value || '';
            const minPrice = document.getElementById('minPrice')?.value || '';
            const maxPrice = document.getElementById('maxPrice')?.value || '';

            try {
                let url = \`/api/properties?page=\${currentPage}\`;
                if (type) url += \`&type=\${type}\`;
                if (city) url += \`&city=\${city}\`;
                if (minPrice) url += \`&minPrice=\${minPrice}\`;
                if (maxPrice) url += \`&maxPrice=\${maxPrice}\`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    displayProperties(data.data);
                    displayPagination(data.pagination);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function displayProperties(properties) {
            const grid = document.getElementById('propertiesGrid');
            
            if (properties.length === 0) {
                grid.innerHTML = '<p>No properties found</p>';
                return;
            }

            grid.innerHTML = properties.map(property => \`
                <div class="property-card">
                    <img src="\${property.images[0]?.url || 'https://via.placeholder.com/400x300'}" alt="\${property.title}">
                    <div class="property-info">
                        <h3>\${property.title}</h3>
                        <p class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            \${property.address.area}, \${property.address.city}
                        </p>
                        <p class="university">
                            <i class="fas fa-university"></i>
                            \${property.university}
                        </p>
                        <div class="property-meta">
                            <span><i class="fas fa-bed"></i> \${property.rooms.total} Rooms</span>
                            <span><i class="fas fa-star"></i> \${property.rating.average.toFixed(1)}</span>
                        </div>
                        <div class="property-footer">
                            <div class="price">
                                <span class="amount">\${property.price.currency} \${property.price.amount.toLocaleString()}</span>
                                <span class="period">/\${property.price.period}</span>
                            </div>
                            <button class="btn btn-sm" onclick="viewProperty('\${property._id}')">View Details</button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function displayPagination(pagination) {
            // Simple pagination implementation
            const paginationDiv = document.getElementById('pagination');
            let html = '';
            
            for (let i = 1; i <= pagination.pages; i++) {
                html += \`<button class="btn \${i === pagination.page ? 'btn-primary' : 'btn-outline'}" 
                         onclick="goToPage(\${i})">\${i}</button>\`;
            }
            
            paginationDiv.innerHTML = html;
        }

        function goToPage(page) {
            currentPage = page;
            loadProperties();
        }

        function applyFilters() {
            currentPage = 1;
            loadProperties();
        }

        function viewProperty(id) {
            alert('Property details page - ID: ' + id);
        }

        window.addEventListener('DOMContentLoaded', loadProperties);
    </script>
</body>
</html>
`);

// Add Property Page
createFile(path.join(__dirname, 'views/add-property.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Property - StudentStay</title>
    <link rel="stylesheet" href="/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <i class="fas fa-home"></i>
                <span>StudentStay</span>
            </div>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/properties">Properties</a></li>
                <li><a href="/dashboard" class="active">Dashboard</a></li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <div class="add-property-page">
            <h1>Add New Property</h1>
            
            <form id="addPropertyForm" class="property-form">
                <div class="form-section">
                    <h2>Basic Information</h2>
                    
                    <div class="form-group">
                        <label for="title">Property Title *</label>
                        <input type="text" id="title" required>
                    </div>

                    <div class="form-group">
                        <label for="description">Description *</label>
                        <textarea id="description" rows="4" required></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="type">Property Type *</label>
                            <select id="type" required>
                                <option value="room">Room</option>
                                <option value="apartment">Apartment</option>
                                <option value="pg">PG</option>
                                <option value="hostel">Hostel</option>
                                <option value="studio">Studio</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="university">Nearest University *</label>
                            <input type="text" id="university" required>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h2>Location</h2>
                    
                    <div class="form-group">
                        <label for="street">Street Address *</label>
                        <input type="text" id="street" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="area">Area *</label>
                            <input type="text" id="area" required>
                        </div>

                        <div class="form-group">
                            <label for="city">City *</label>
                            <input type="text" id="city" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="district">District *</label>
                            <input type="text" id="district" required>
                        </div>

                        <div class="form-group">
                            <label for="distance">Distance from University (km) *</label>
                            <input type="number" id="distance" step="0.1" required>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h2>Pricing & Rooms</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="price">Price (BDT) *</label>
                            <input type="number" id="price" required>
                        </div>

                        <div class="form-group">
                            <label for="period">Period *</label>
                            <select id="period" required>
                                <option value="monthly">Monthly</option>
                                <option value="semester">Semester</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="totalRooms">Total Rooms *</label>
                            <input type="number" id="totalRooms" required>
                        </div>

                        <div class="form-group">
                            <label for="availableRooms">Available Rooms *</label>
                            <input type="number" id="availableRooms" required>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h2>Contact Information</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="contactPhone">Contact Phone *</label>
                            <input type="tel" id="contactPhone" required>
                        </div>

                        <div class="form-group">
                            <label for="contactEmail">Contact Email</label>
                            <input type="email" id="contactEmail">
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Add Property</button>
                    <a href="/dashboard" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>
    </div>

    <script>
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
        }

        document.getElementById('addPropertyForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const propertyData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                type: document.getElementById('type').value,
                university: document.getElementById('university').value,
                distanceFromUniversity: parseFloat(document.getElementById('distance').value),
                address: {
                    street: document.getElementById('street').value,
                    area: document.getElementById('area').value,
                    city: document.getElementById('city').value,
                    district: document.getElementById('district').value
                },
                price: {
                    amount: parseFloat(document.getElementById('price').value),
                    period: document.getElementById('period').value,
                    currency: 'BDT'
                },
                rooms: {
                    total: parseInt(document.getElementById('totalRooms').value),
                    available: parseInt(document.getElementById('availableRooms').value)
                },
                contactInfo: {
                    phone: document.getElementById('contactPhone').value,
                    email: document.getElementById('contactEmail').value
                },
                images: [{
                    url: 'https://via.placeholder.com/800x600?text=Property+Image'
                }],
                amenities: []
            };

            try {
                const response = await fetch('/api/properties', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify(propertyData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('Property added successfully!');
                    window.location.href = '/dashboard';
                } else {
                    alert(data.message || 'Failed to add property');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    </script>
</body>
</html>
`);

// ==================== CSS ====================

createFile(path.join(__dirname, 'public/css/style.css'), `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #4F46E5;
    --primary-dark: #4338CA;
    --secondary: #10B981;
    --danger: #EF4444;
    --warning: #F59E0B;
    --dark: #1F2937;
    --light: #F3F4F6;
    --white: #FFFFFF;
    --border: #E5E7EB;
    --shadow: rgba(0, 0, 0, 0.1);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: var(--dark);
    background: var(--light);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navbar */
.navbar {
    background: var(--white);
    box-shadow: 0 2px 10px var(--shadow);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 700;
    color: var(--primary);
}

.nav-brand i {
    font-size: 28px;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 30px;
}

.nav-menu a {
    text-decoration: none;
    color: var(--dark);
    font-weight: 500;
    transition: color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.active {
    color: var(--primary);
}

.nav-actions {
    display: flex;
    gap: 15px;
}

/* Buttons */
.btn {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: var(--primary);
    color: var(--white);
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-outline {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
}

.btn-outline:hover {
    background: var(--primary);
    color: var(--white);
}

.btn-sm {
    padding: 6px 16px;
    font-size: 13px;
}

.btn-block {
    width: 100%;
    justify-content: center;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: var(--white);
    padding: 100px 0;
    text-align: center;
}

.hero-title {
    font-size: 48px;
    margin-bottom: 20px;
    font-weight: 800;
}

.hero-subtitle {
    font-size: 20px;
    margin-bottom: 40px;
    opacity: 0.9;
}

.search-box {
    background: var(--white);
    padding: 15px;
    border-radius: 12px;
    display: flex;
    gap: 10px;
    max-width: 800px;
    margin: 0 auto 60px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.search-input-group {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-right: 1px solid var(--border);
}

.search-input-group:last-of-type {
    border-right: none;
}

.search-input-group i {
    color: var(--primary);
}

.search-input-group input,
.search-input-group select {
    border: none;
    outline: none;
    font-size: 14px;
    width: 100%;
    color: var(--dark);
}

.stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    max-width: 800px;
    margin: 0 auto;
}

.stat-item h3 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 10px;
}

.stat-item p {
    font-size: 16px;
    opacity: 0.9;
}

/* Featured Properties */
.featured-properties {
    padding: 80px 0;
    background: var(--white);
}

.section-title {
    font-size: 36px;
    text-align: center;
    margin-bottom: 10px;
    font-weight: 700;
}

.section-subtitle {
    text-align: center;
    color: #6B7280;
    margin-bottom: 50px;
}

.properties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
}

.property-card {
    background: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px var(--shadow);
    transition: transform 0.3s, box-shadow 0.3s;
}

.property-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.property-card img {
    width: 100%;
    height: 240px;
    object-fit: cover;
}

.property-info {
    padding: 20px;
}

.property-info h3 {
    font-size: 20px;
    margin-bottom: 12px;
    font-weight: 600;
}

.location,
.university {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6B7280;
    font-size: 14px;
    margin-bottom: 8px;
}

.property-meta {
    display: flex;
    gap: 20px;
    margin: 15px 0;
    padding: 15px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.property-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: #6B7280;
}

.property-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price .amount {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary);
}

.price .period {
    font-size: 14px;
    color: #6B7280;
}

/* How It Works */
.how-it-works {
    padding: 80px 0;
    background: var(--light);
}

.steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-top: 50px;
}

.step {
    text-align: center;
    padding: 30px;
    background: var(--white);
    border-radius: 12px;
}

.step-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: var(--white);
}

.step h3 {
    margin-bottom: 15px;
    font-size: 22px;
}

/* Features */
.features {
    padding: 80px 0;
    background: var(--white);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    margin-top: 50px;
}

.feature {
    text-align: center;
    padding: 30px 20px;
}

.feature i {
    font-size: 48px;
    color: var(--primary);
    margin-bottom: 20px;
}

.feature h3 {
    margin-bottom: 15px;
    font-size: 18px;
}

/* Footer */
.footer {
    background: var(--dark);
    color: var(--white);
    padding: 60px 0 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-bottom: 40px;
}

.footer-section h3,
.footer-section h4 {
    margin-bottom: 20px;
}

.footer-section ul {
    list-style: none;
}

.footer-section ul li {
    margin-bottom: 10px;
}

.footer-section a {
    color: var(--white);
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.3s;
}

.footer-section a:hover {
    opacity: 1;
}

.footer-bottom {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Auth Pages */
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
}

.auth-box {
    background: var(--white);
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 500px;
}

.auth-header {
    text-align: center;
    margin-bottom: 40px;
}

.auth-header h1 {
    font-size: 32px;
    margin-bottom: 10px;
}

.auth-header p {
    color: #6B7280;
}

.auth-form .form-group {
    margin-bottom: 25px;
}

.auth-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--dark);
}

.auth-form input,
.auth-form select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.auth-form input:focus,
.auth-form select:focus {
    outline: none;
    border-color: var(--primary);
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.auth-footer {
    text-align: center;
    margin-top: 25px;
}

.auth-footer a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
}

/* Dashboard */
.dashboard {
    padding: 40px 0;
    min-height: calc(100vh - 70px);
}

.dashboard h1 {
    margin-bottom: 40px;
}

.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 40px;
}

.stat-card {
    background: var(--white);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px var(--shadow);
    display: flex;
    align-items: center;
    gap: 20px;
}

.stat-card i {
    font-size: 48px;
    color: var(--primary);
}

.stat-card h3 {
    font-size: 36px;
    margin-bottom: 5px;
}

.dashboard-actions {
    display: flex;
    gap: 15px;
    margin-bottom: 40px;
}

.dashboard-content {
    background: var(--white);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px var(--shadow);
}

.user-menu {
    display: flex;
    align-items: center;
    gap: 15px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

/* Properties Page */
.properties-page {
    padding: 40px 0;
}

.page-header {
    text-align: center;
    margin-bottom: 50px;
}

.page-header h1 {
    font-size: 40px;
    margin-bottom: 10px;
}

.properties-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 40px;
}

.filters {
    background: var(--white);
    padding: 25px;
    border-radius: 12px;
    height: fit-content;
    position: sticky;
    top: 90px;
}

.filters h3 {
    margin-bottom: 25px;
}

.filter-group {
    margin-bottom: 25px;
}

.filter-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

.filter-group input,
.filter-group select {
    width: 100%;
    padding: 10px;
    border: 2px solid var(--border);
    border-radius: 8px;
    margin-bottom: 10px;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

/* Property Form */
.add-property-page {
    max-width: 900px;
    margin: 40px auto;
}

.property-form {
    background: var(--white);
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 2px 10px var(--shadow);
}

.form-section {
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 2px solid var(--border);
}

.form-section:last-of-type {
    border-bottom: none;
}

.form-section h2 {
    margin-bottom: 25px;
    color: var(--primary);
}

.form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
}

.form-group textarea {
    resize: vertical;
}

.form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
}

.text-center {
    text-align: center;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #6B7280;
}

/* Responsive */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }

    .hero-title {
        font-size: 32px;
    }

    .search-box {
        flex-direction: column;
    }

    .stats {
        grid-template-columns: 1fr;
    }

    .properties-grid {
        grid-template-columns: 1fr;
    }

    .steps,
    .features-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-stats {
        grid-template-columns: 1fr;
    }

    .properties-layout {
        grid-template-columns: 1fr;
    }

    .filters {
        position: static;
    }

    .form-row {
        grid-template-columns: 1fr;
    }
}
`);

// ==================== JAVASCRIPT ====================

createFile(path.join(__dirname, 'public/js/main.js'), `
// Global helper functions

// API call wrapper
async function apiCall(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': \`Bearer \${token}\` })
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format price
function formatPrice(amount, currency = 'BDT') {
    return \`\${currency} \${amount.toLocaleString()}\`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with a library
    alert(message);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

console.log('StudentStay Platform Loaded Successfully!');
`);

// ==================== README ====================

createFile(path.join(__dirname, 'README.md'), `
# Student Housing Platform 🏠

A comprehensive, modern student housing platform built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🚀 Features

- **User Authentication**: Secure registration and login for students and landlords
- **Property Management**: Add, edit, and manage property listings
- **Advanced Search**: Filter by location, price, amenities, etc.
- **Booking System**: Students can book properties directly
- **Review System**: Verified reviews from students
- **Responsive Design**: Works on all devices
- **Real-time Stats**: Dashboard with analytics

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Run the setup file:**
   \`\`\`bash
   node setup.mjs
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables:**
   Edit the \`.env\` file with your settings:
   - MongoDB connection string
   - JWT secret key
   - Port number

4. **Start the server:**
   \`\`\`bash
   npm start
   \`\`\`
   
   For development with auto-reload:
   \`\`\`bash
   npm run dev
   \`\`\`

## 📱 Usage

1. **Access the application:**
   Open your browser and go to \`http://localhost:5000\`

2. **Register an account:**
   - Students: Browse and book properties
   - Landlords: List and manage properties

3. **Browse properties:**
   - Use filters to find the perfect accommodation
   - View detailed information and reviews

4. **Book a property:**
   - Select dates and submit booking
   - Track booking status in dashboard

## 🏗️ Project Structure

\`\`\`
student-housing-platform/
├── config/          # Configuration files
├── models/          # MongoDB models
├── controllers/     # Business logic
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── public/          # Static files (CSS, JS, images)
├── views/           # HTML pages
├── server.mjs       # Main server file
└── package.json     # Dependencies
\`\`\`

## 🔌 API Endpoints

### Authentication
- POST \`/api/auth/register\` - Register new user
- POST \`/api/auth/login\` - Login user
- GET \`/api/auth/me\` - Get current user

### Properties
- GET \`/api/properties\` - Get all properties
- GET \`/api/properties/:id\` - Get single property
- POST \`/api/properties\` - Create property (landlord only)
- PUT \`/api/properties/:id\` - Update property
- DELETE \`/api/properties/:id\` - Delete property

### Bookings
- GET \`/api/bookings/my-bookings\` - Get user bookings
- POST \`/api/bookings\` - Create booking
- PUT \`/api/bookings/:id/status\` - Update booking status

### Reviews
- GET \`/api/reviews/property/:id\` - Get property reviews
- POST \`/api/reviews\` - Create review
- PUT \`/api/reviews/:id\` - Update review
- DELETE \`/api/reviews/:id\` - Delete review

## 🎨 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers

## 📊 Database Models

1. **User**: Student/Landlord information
2. **Property**: Housing listings
3. **Booking**: Rental bookings
4. **Review**: Property reviews

## 🤝 Contributing

This is a university project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contact

- **Developer**: Metropolitan University Student
- **Email**: info@studentstay.com
- **WhatsApp**: +880 1721-140302

## 🎓 Academic Information

**Project**: Project 300 - Web Development
**University**: Metropolitan University
**Department**: Computer Science & Engineering
**Instructor**: Abdul Wadud Shakib

---

Made with ❤️ for students, by students
\`\`\`
`);

console.log('\n✅ Setup Complete!');
console.log('\n📦 Next Steps:');
console.log('1. Run: npm install');
console.log('2. Start MongoDB server');
console.log('3. Run: npm start');
console.log('4. Visit: http://localhost:5000');
console.log('\n🎉 Happy Coding!\n');