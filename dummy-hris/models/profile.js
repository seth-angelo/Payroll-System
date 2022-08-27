const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	name: String,
	taxStatus: String,
	salaryType: String,
	rate: Number,
	unpaidLeave: Number,
	bonus: Number,
	insuranceRate: Number,
	penalties: Number
});

module.exports = mongoose.model('Profile', profileSchema);