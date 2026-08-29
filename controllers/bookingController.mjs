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