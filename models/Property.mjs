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