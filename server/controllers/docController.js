import Document from '../models/document.js';

// Validation helper
const validateDocumentInput = ({ owner, vehicleNumber, userId }) => {
    const errors = [];
    if (!owner) errors.push('Owner is required');
    if (!vehicleNumber) errors.push('Vehicle number is required');
    if (!userId) errors.push('User ID is required');
    
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

/**
 * Controller to add a new document
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addDocController = async (req, res) => {
    try {
        const { owner, phone, vehicleNumber, cf, np, auth, remarks, userId } = req.body;
        
        // Validate required fields
        validateDocumentInput({ owner, vehicleNumber, userId });

        // Format and create document
        const formattedVehicleNumber = vehicleNumber.toUpperCase().trim();
        const newDocument = new Document({
            owner: owner.trim(),
            phone: phone?.trim(),
            vehicleNumber: formattedVehicleNumber,
            cf: cf || null,
            np: np || null,
            auth: auth || null,
            remarks: remarks?.trim(),
            user: userId
        });

        // Save document to database
        await newDocument.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Document added successfully", 
            document: newDocument 
        });
    } catch (error) {
        console.error("Error in addDocController:", error);
        
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({ 
            success: false, 
            message: "Failed to add document", 
            error: error.message 
        });
    }
}

/**
 * Helper function to build date range query
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {Object|null} Mongoose query object for date range
 */
const buildDateRangeQuery = (startDate, endDate) => {
    if (!startDate && !endDate) return null;
    if (startDate && endDate && startDate > endDate){
        throw new Error("Start date cannot be after end date");
    }

    const query = {};
    if (startDate) query.$gte = new Date(startDate);
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // include entire end day
        query.$lte = end;
    }
    return query;
};

/**
 * Controller to get filtered documents
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFilteredDocsController = async (req, res) => {
    try {
        const { _id } = req.user;
        const {
            owner,
            vehicleNumber,
            cfStart,
            cfEnd,
            npStart,
            npEnd,
            authStart,
            authEnd
        } = req.query;

        // Build base query
        const query = { user: _id };
        
        // Add filters
        if (owner) {
            query.owner = { $regex: owner.trim(), $options: "i" }; // case-insensitive partial match
        }
        
        if (vehicleNumber) {
            query.vehicleNumber = vehicleNumber.trim().toUpperCase(); // exact match
        }

        // Add date range filters
        const cfQuery = buildDateRangeQuery(cfStart, cfEnd);
        if (cfQuery) query.cf = cfQuery;

        const npQuery = buildDateRangeQuery(npStart, npEnd);
        if (npQuery) query.np = npQuery;

        const authQuery = buildDateRangeQuery(authStart, authEnd);
        if (authQuery) query.auth = authQuery;

        // Execute query
        const documents = await Document.find(query)
            .sort({ createdAt: -1 })
            .lean() // Convert to plain JS objects for better performance
            .exec();

        res.json({ 
            success: true, 
            count: documents.length,
            documents 
        });

    } catch (error) {
        console.error("Error in getFilteredDocsController:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch documents", 
            error: error.message 
        });
    }
};


