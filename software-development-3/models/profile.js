const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	name: String,
	position: String,
	department: String,
	taxStatus: String,
	salaryType: String,
	TWDays: Number,
	TWHours: Number,
	rate: Number,
	unpaidLeave: Number,
	taxableLeave: Number,
	bonus: Number,
	insuranceRate: Number,
	penalties: Number,
	overtimeHours: Number,
	undertimeHours: Number
});

module.exports = mongoose.model('Profile', profileSchema);