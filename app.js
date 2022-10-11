const express = require("express");
const bodyParser = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');

const Profile = require("./models/profile");
const Admin = require("./models/admin");

const app = express();

app.set("port", 5000);
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/public')));

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});



// let mongoURI = "mongodb+srv://payroll:payrollPass@cluster0.pslbxgl.mongodb.net/test";
let mongoURI = "mongodb://127.0.0.1:27017/dummy-hris";

if (process.env.NODE_ENV === 'production') {
	mongoURI = 'mongodb+srv://SethAngelo:16-0316-947@cluster0.pfzxzmh.mongodb.net/?retryWrites=true&w=majority'
}
//console.log(mongoURI)
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	},
);

// GET - get ug objects
// POST - create
// PUT - update whole object
// PATCH - update partial object
// DELETE - delete object

// Checking authentication
app.use("/home*", (req, res, next) => {
	const admin = { firstName: app.locals.name };
	// console.log(admin);
	Admin.findOne(admin)
	.then((retrieved) => {
		if(!retrieved.loggedIn)
			throw new Error;
	})
	.catch((err) => {
		const loggedOut = { loggedIn: false };
		Admin.updateMany({}, loggedOut, { new: true }, (err, retrieved) => {
			console.log(retrieved);
		});
		res.render('Payroll_System/login', {ERROR : "You must login as ADMIN in order to view."});
	});
	next();
});

app.get("/", (req, res) => {
	// const admin = { firstName: "John" };
	// console.log("Currently: " + app.locals.name);
	const admin = { firstName: app.locals.name };
	const loggedOut = { loggedIn: false };
	Admin.findOneAndUpdate(admin, loggedOut, {new : true}, (err, retrieved) => {
		// console.log(retrieved);
		app.locals.name = null;
		// console.log("Now: " + app.locals.name);
	});
	console.log("Logged Out/Login Page");
	res.render('Payroll_System/login', {ERROR : null});
});

// Sign in clicked
app.post("/signIn", (req, res, next) => {
	const temp = req.body;
	const admin = { email: temp.Username };
	Admin.findOne(admin)
	.then((retrieved) => {
		if(temp.Username == retrieved.email && retrieved.password == temp.Password){
			app.locals.name = retrieved.firstName;
			retrieved.loggedIn = true;
			retrieved.save();
			console.log("found");
			res.redirect('/home');
		}
		else { // Password does not match
			console.log("Password does not match");
			res.render('Payroll_System/login', {ERROR : "Username or PASSWORD does not exist."});
		}
	}).catch((err) => { // If username is not found
		console.log("Username not found");
		res.render('Payroll_System/login', {ERROR : "USERNAME or password does not exist."});
	})
});

app.get("/signup", (req, res) => {
	console.log("signup");
	res.render('Payroll_System/signup', {ERROR: null});
});

app.post("/register", (req, res, next) => {
	const temp = req.body;
	Admin.create({
		firstName: temp.firstname,
		lastName: temp.lastname,
		phoneNum: temp.phone,
		email: temp.Username,
		password: temp.Password,
		loggedIn: true
	}).then((result) => {
		console.log(result);
		res.redirect("/home");
	}).catch((err) =>{
		res.render('Payroll_System/signup', {ERROR: "Please fill out all the correct fields"});
	});
});

// Logged In (temp)
app.get("/home", (req, res, next) => {
	Profile.find({}, (err, fetchedProfiles) => {
		if (err) {
			next(err);
		} else {
			res.render('Payroll_System/index', { profiles: fetchedProfiles});
		}
	})
});

// Forget Pass Page
app.get("/forgetpass", (req, res) => {
	console.log("forgotPass");
	res.render('Payroll_System/forgetpass', { title: 'Reset Password' });
});
app.get("/forgotconfirmation", (req, res) => {
	console.log("forgotconfirmation");
	res.render('Payroll_System/forgotconfirmation', { title: 'Reset Password' });
});

app.get("/hris", (req, res) => {
	res.render('DUMMY_HRIS/index');
});

app.get("/employees", (req, res, next) => {
	Profile.find({}, (err, fetchedProfiles) => {
		if (err) {
			next(err);
		} else {
			res.render('DUMMY_HRIS/employee-profiles', { profiles: fetchedProfiles });
			console.log();
		}
	})
});

app.post("/save-profile", (req, res, next) => {
	const body = req.body;
	console.log("body:", body);
	console.log("name:", body.name);
	console.log("position:", body.position);
	console.log("department:", body.department);
	console.log("payroll period:", body.payroll_period);
	console.log("tax status:", body.tax_status);
	console.log("salary type:", body.salary_type);
	console.log("total working days:", body.TWD);
	console.log("total working hours:", body.TWH);
	console.log("rate:", body.rate);
	console.log("unpaid leave:", body.unpaid_leave);
	console.log("taxable leave:", body.taxable_leave);
	console.log("bonus:", body.bonus);
	console.log("insurance rate:", body.isr_rate);
	console.log("penalties:", body.penalties);
	console.log("overtime hours:", body.overtime_hours);
	console.log("undertime hours:", body.undertime_hours);
	console.log("cash advance application:", body.cash_advance);

	Profile.create({
		name: body.name,
		position: body.position,
		department: body.department,
		payrollPeriod: body.payroll_period,
		taxStatus: body.tax_status,
		salaryType: body.salary_type,
		TWDays: body.TWD,
		TWHours: body.TWH,
		rate: body.rate,
		unpaidLeave: body.unpaid_leave,
		taxableLeave: body.taxable_leave,
		bonus: body.bonus,
		insuranceRate: body.isr_rate,
		penalties: body.penalties,
		overtimeHours: body.overtime_hours,
		undertimeHours: body.undertime_hours,
		cashAdvance: body.cash_advance
	}, (err, profile) => {
		if (err) {
			next(err);
		} else {
			res.redirect('/hris');
		}
	})
});

let port = app.get("port");
app.listen(process.env.PORT || 5000, () => console.log(`Dummy HRIS running on port ${port}`));