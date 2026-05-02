const BloodRequest = require('../models/BloodRequest');

const createRequest = async (req, res) => {
    const { hospital_name, blood_group, rhesus, volume_ml } = req.body;

    try {
        const newRequest = new BloodRequest({
            hospital_name,
            blood_group: blood_group.toUpperCase(),
            rhesus,
            volume_ml,
            requested_by_email: req.user.email
        });

        const savedRequest = await newRequest.save();
        
        res.status(201).json({
            message: "Permintaan darah berhasil dibuat",
            data: savedRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find().sort({ createdAt: -1 });
        res.status(200).json({ data: requests });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createRequest, getRequests };