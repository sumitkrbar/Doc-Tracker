export const addDocController = async (req, res) => {
    try {
        const { owner, phone, vehicleNumber, cf, np, auth, remarks, userId } = req.body;

        vehicleNumber = vehicleNumber.toUpperCase();

        if(!owner || !vehicleNumber || !userId){
            throw new Error("Required fields are missing");
        }

        const newDocument = new Document({
            owner,
            phone,
            vehicleNumber,
            cf,
            np,
            auth,
            remarks,
            user: userId
        });
        await newDocument.save();

        res.status(201).json({ success: true, message: "Document added successfully", document: newDocument });
    } catch (error) {
        console.error("Error in addDocController:", error);
        res.status(500).json({ success: false, message: "Failed to add document", error: error.message });
    }
}