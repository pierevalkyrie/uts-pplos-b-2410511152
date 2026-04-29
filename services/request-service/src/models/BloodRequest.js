const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    hospital_name: { type: String, required: true },
    blood_group: { type: String, required: true, enum: ['A', 'B', 'AB', 'O'] },
    rhesus: { type: String, required: true, enum: ['+', '-'] },
    volume_ml: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
    requested_by_email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);