import Property from '../models/Property.mjs';

// Check if database is connected
const checkDB = (res) => {
  if (!global.dbConnected) {
    res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again later or start MongoDB.'
    });
    return false;
  }
  return true;
};

export const getAllProperties = async (req, res) => {
  try {
    if (!checkDB(res)) return;

    const {
      university,
      type,
      minPrice,
      maxPrice,
      city,
      zilla,
      amenities,
      gender,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = { status: 'available' };

    // Search support for location, university, area
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { university: searchRegex },
        { 'address.area': searchRegex },
        { 'address.city': searchRegex },
        { 'address.district': searchRegex },
        { title: searchRegex }
      ];
    }

    // Add other filters to the query
    if (university) {
      query.university = { $regex: university, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (city) {
      query['address.city'] = city;
    }
    if (zilla) {
      query['address.district'] = zilla;
    }
    if (gender) {
      query['rules.gender'] = { $in: [gender, 'any'] };
    }
    
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) {
        query['price.amount'].$gte = Number(minPrice);
      }
      if (maxPrice) {
        query['price.amount'].$lte = Number(maxPrice);
      }
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim());
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
    if (!checkDB(res)) return;

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
    if (!checkDB(res)) return;

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
    if (!checkDB(res)) return;

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
    if (!checkDB(res)) return;

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