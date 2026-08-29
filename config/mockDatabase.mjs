// Simple in-memory mock database for development
const mockDatabase = {
  users: [],
  properties: [],
  bookings: [],
  reviews: []
};

// Generate mock ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Mock User Model
export class MockUser {
  static async findOne(query) {
    return mockDatabase.users.find(u => 
      u.email === query.email || u._id === query._id
    );
  }

  static async create(data) {
    const user = { _id: generateId(), ...data, createdAt: new Date() };
    mockDatabase.users.push(user);
    return user;
  }

  static async findById(id) {
    return mockDatabase.users.find(u => u._id === id);
  }

  static async findByIdAndUpdate(id, data) {
    const user = mockDatabase.users.find(u => u._id === id);
    if (user) Object.assign(user, data);
    return user;
  }
}

// Mock Property Model
export class MockProperty {
  static async find(query) {
    return mockDatabase.properties.filter(p => {
      for (const key in query) {
        if (p[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static async findById(id) {
    return mockDatabase.properties.find(p => p._id === id);
  }

  static async create(data) {
    const property = { _id: generateId(), ...data, createdAt: new Date() };
    mockDatabase.properties.push(property);
    return property;
  }

  static async findByIdAndUpdate(id, data) {
    const property = mockDatabase.properties.find(p => p._id === id);
    if (property) Object.assign(property, data);
    return property;
  }

  static async countDocuments(query = {}) {
    return mockDatabase.properties.filter(p => {
      for (const key in query) {
        if (p[key] !== query[key]) return false;
      }
      return true;
    }).length;
  }
}

// Mock Booking Model
export class MockBooking {
  static async find(query) {
    return mockDatabase.bookings.filter(b => {
      for (const key in query) {
        if (b[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static async create(data) {
    const booking = { _id: generateId(), ...data, createdAt: new Date() };
    mockDatabase.bookings.push(booking);
    return booking;
  }

  static async findById(id) {
    return mockDatabase.bookings.find(b => b._id === id);
  }

  static async findByIdAndUpdate(id, data) {
    const booking = mockDatabase.bookings.find(b => b._id === id);
    if (booking) Object.assign(booking, data);
    return booking;
  }
}

// Mock Review Model
export class MockReview {
  static async find(query) {
    return mockDatabase.reviews.filter(r => {
      for (const key in query) {
        if (r[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static async create(data) {
    const review = { _id: generateId(), ...data, createdAt: new Date() };
    mockDatabase.reviews.push(review);
    return review;
  }

  static async findById(id) {
    return mockDatabase.reviews.find(r => r._id === id);
  }

  static async findByIdAndUpdate(id, data) {
    const review = mockDatabase.reviews.find(r => r._id === id);
    if (review) Object.assign(review, data);
    return review;
  }

  static async countDocuments(query = {}) {
    return mockDatabase.reviews.filter(r => {
      for (const key in query) {
        if (r[key] !== query[key]) return false;
      }
      return true;
    }).length;
  }
}

export default mockDatabase;
