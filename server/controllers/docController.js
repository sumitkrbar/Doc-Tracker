import Document from '../models/document.js';

export const addDocController = async (req, res) => {
    try {
        const { owner, phone, vehicleNumber, cf, np, auth, remarks, userId } = req.body;
              

        if(!owner || !vehicleNumber || !userId){
            throw new Error("Required fields are missing");
        }

        const formattedVehicleNumber = vehicleNumber.toUpperCase();

        const newDocument = new Document({
            owner,
            phone,
            vehicleNumber: formattedVehicleNumber,
            cf,
            np,
            auth,
            remarks,
            user: userId
        });
        console.log("beginning to save");
        
        await newDocument.save();
        console.log("saved");
        
        res.status(201).json({ success: true, message: "Document added successfully", document: newDocument });
    } catch (error) {
        console.error("Error in addDocController:", error);
        res.status(500).json({ success: false, message: "Failed to add document", error: error.message });
    }
}


