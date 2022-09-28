const mongoose = require('mongoose');
const bycrpt = require('bcryptjs');
const saltRounds = 10;

const adminAccountSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNum: Number,
    email: String,
    password: String,
    loggedIn: Boolean
});

adminAccountSchema.pre('create', () => {
    const admin = this;
    admin.firstName = "General Fong";
    // bycrpt.hash(admin.password, saltRounds, (err, hash) =>{
        
    // });
});

adminAccountSchema.methods.comparePassword = (candidatePassword, cb) => {
    
};

// adminAccountSchema.methods.comparePassword = (candidatePassword, cb) => {
//     bycrpt.compare();
// };

module.exports = mongoose.model('Admin-account', adminAccountSchema);
