const express = require("express");
const bodyParser = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtSecret = 'paystation';
const Profile = require("./models/profile");
const Admin = require("./models/admin");
// const PasswordReset = require("./models/passwordReset");
// const userVerification = require("./models/userVerification");
// const passwordReset = require("./models/passwordReset");


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
let mongoURI = "mongodb://127.0.0.1:27017/dummy-hris"; // Only for localhost mongoDB Compass

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


/*
	* Note: Uncomment // next(err) for debugging *
*/

// Checking authentication
app.use("/home*", (req, res, next) => {
	console.log(app.locals.id);
	let id = { _id : app.locals.id };
	Admin.findById(id)
	.then((retrieved) => {
		if(!retrieved.loggedIn)
			throw new Error;
	})
	.catch((err) => {
		// next(err);
		const loggedOut = { loggedIn: false };
		Admin.updateMany({}, loggedOut, { new: true }, (err, retrieved) => {
			console.log(retrieved);
			console.log("Not admin. Logging out all accounts");
		});
		res.status(401).render('Payroll_System/login', {ERROR : "You must login as ADMIN in order to view."});
	});
	next();
});

app.get("/", (req, res) => {
	if(app.locals.name != null && app.locals.id != null) {
		console.log("Logged in already. Redirecting...");
		res.redirect('/home');
	}
	console.log("Logged Out/Login Page");
	res.render('Payroll_System/login', {ERROR : null});
});

// Sign in clicked
app.post("/signIn", (req, res, next) => {
	let temp = req.body;
	app.locals.rememberMe = temp.rememberMe === undefined? false: true;
	console.log(app.locals.rememberMe);
	let admin = { email: temp.Username };
	Admin.findOne(admin)
	.then((retrieved) => {
		if(temp.Username == retrieved.email && retrieved.password == temp.Password){
			app.locals.name = retrieved.firstName + " " + retrieved.lastName;
			app.locals.id = retrieved._id.toString();
			retrieved.loggedIn = true;
			retrieved.save();
			console.log("Found. Logging in..");
			res.status(200).redirect('/home');
		}
		else { // Password does not match
			console.log("Password does not match");
			res.status(404).render('Payroll_System/login', {ERROR : "Username or PASSWORD does not exist."});
		}
	}).catch((err) => { // Uusername is not found
		// next(err);
		console.log("Username not found");
		res.status(404).render('Payroll_System/login', {ERROR : "USERNAME or password does not exist."});
	})
});

app.get('/signOut', (req, res) => {
	let id = { _id : app.locals.id };
	const loggedOut = { loggedIn: false };
	Admin.findByIdAndUpdate(id, loggedOut, {new : true}, (err, retrieved) => {
		app.locals.id = null;
		app.locals.name = null;
		console.log(retrieved);
	});
	res.status(200).redirect('/');
});

app.get("/signup", (req, res) => {
	console.log("signup");
	res.render('Payroll_System/signup', {ERROR: null});
});

app.post("/register", (req, res) => {
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
		app.locals.name = result.firstName + " " + result.lastName;
		app.locals.id = result._id.toString();
		res.redirect("/home");
	}).catch((err) =>{
		// next(err)
		res.status(400).render('Payroll_System/signup', {ERROR: "Please fill out all the correct fields"});
	});
});

// Home Page
app.get("/home", (req, res, next) => {
	Profile.find({}, (err, fetchedProfiles) => {
		if (err) {
			console.log("Error on home page");
			next(err);
		} else {
			res.render('Payroll_System/index', { profiles: fetchedProfiles, Name: app.locals.name });
		}
	})
});

// Forget Pass Page Backend
// pass: paystation1111, generatedpass: ijpuvakcpoczjtuv
app.get("/forgetpass", (req, res) => {
	console.log("forgotPass");
	res.render('Payroll_System/forgetpass', { Title: 'Password Reset' });
});

app.post("/forgetPass", (req, res, next) => {
	const temp = req.body;
	const email = { email: temp.Username };
	Admin.findOne(email)
	.then((retrieved) => {
		if(retrieved == null)
			throw new Error;
		else { // Sending email link
			const secret = jwtSecret;
			const payload = {
				email: retrieved.email,
				id: retrieved.id
			}
			const token = jwt.sign(payload, secret, {expiresIn: "30m"});
			const production  = 'https://pay-station.herokuapp.com';
			const development = 'http://localhost:5000';
			const link = (process.env.NODE_ENV ? production : development)  + `/resetPassword/${token}`;
			console.log(link);
			const tranporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'softdevpaystation@gmail.com',
					pass: 'ijpuvakcpoczjtuv'
				},
				tls: {
					rejectUnauthorized: false
				}
			});
			tranporter.sendMail({
				from: `<softdevpaystation@gmail.com>`,
				to: retrieved.email,
				subject: "Password Reset",
				text: `Click here to reset password: ${link}`,
				html: `<b>Click here to reset password: <a href=${link}>Paystation Reset Pass</a></b>`,
			}, (err, success) => {
				if(err) {
					next(err)
					console.log('Error. \n' + err);
				}
				else {
					console.log("Ok. : \n" + success.response);
					res.render('Payroll_System/forgotconfirmation',
					{ 
						Title: 'Password Reset',
						Description: 'Please check your email for password reset instructions.',
						ERROR: null
					});
				}
			});
		}
	})
	.catch((err) => { // No email found in database
	next(err)
	console.log("No email scanned in db");
	res.render('Payroll_System/forgotconfirmation',
	{ 
		Title: 'Password Reset',
		Description: null,
		ERROR: 'Email is not registered.'
	}
	)});
});

// ? Assuming sent from mail
app.get("/resetPassword/:token", (req, res) => {
	try {
		console.log("Reset password form:");
		jwt.verify(req.params.token, jwtSecret);
		res.render("Payroll_System/resetpassword");
	} catch (error) {
		res.status(404).render('Payroll_System/forgotconfirmation',
		{ 
			Title: 'Password Reset',
			Description: null,
			ERROR: 'Error link.'
		});
	}
});

app.post("/resetPassword/:token", (req, res) => {
	console.log("Resseting Password..");
	const temp = req.body;
	const secret = jwt.verify(req.params.token, jwtSecret);
	const email = { email: secret.email };
	Admin.findOne(email)
	.then((retrieved) => {
		retrieved.password = temp.newPassword;
		retrieved.save();
		res.render('Payroll_System/forgotconfirmation',
		{ 
			Title: 'Password Reset',
			Description: 'Password resetted successfully.',
			ERROR: null
		});
	});
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