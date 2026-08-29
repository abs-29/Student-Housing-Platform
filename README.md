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
   ```bash
   node setup.mjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Edit the `.env` file with your settings:
   - MongoDB connection string
   - JWT secret key
   - Port number

4. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 📱 Usage

1. **Access the application:**
   Open your browser and go to `http://localhost:5000`

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

```
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
```

## 🔌 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Properties
- GET `/api/properties` - Get all properties
- GET `/api/properties/:id` - Get single property
- POST `/api/properties` - Create property (landlord only)
- PUT `/api/properties/:id` - Update property
- DELETE `/api/properties/:id` - Delete property

### Bookings
- GET `/api/bookings/my-bookings` - Get user bookings
- POST `/api/bookings` - Create booking
- PUT `/api/bookings/:id/status` - Update booking status

### Reviews
- GET `/api/reviews/property/:id` - Get property reviews
- POST `/api/reviews` - Create review
- PUT `/api/reviews/:id` - Update review
- DELETE `/api/reviews/:id` - Delete review

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
```