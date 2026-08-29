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