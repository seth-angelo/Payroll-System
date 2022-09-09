const express = require("express");
const bodyParser = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');

const Profile = require("./models/profile");

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

// GET - get ug objects
// POST - create
// PUT - update whole object
// PATCH - update partial object
// DELETE - delete object

// let mongoURI = "mongodb+srv://payroll:payrollPass@cluster0.pslbxgl.mongodb.net/test";
let mongoURI = "mongodb://127.0.0.1:27017/dummy-hris";

if (process.env.NODE_ENV === 'prod') {
	mongoURI = 'mongodb+srv://SethAngelo:16-0316-947@cluster0.pfzxzmh.mongodb.net/?retryWrites=true&w=majority'
}
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

/* ORIG */
// app.get("/", (req, res) => {
// 	Profile.find({}, (err, fetchedProfiles) => {
// 		if (err) {
// 			console.log(err); ``
// 		} else {
// 			res.render('Payroll_System/index', { profiles: fetchedProfiles, title: 'Home' });
// 		}
// 	})
// });

// // Authentication Page (Login)
// app.get("/login", (req, res) => {
// 	res.render('Payroll_System/login', {title: 'Authentication'});
// });
/* END ORIG */

/* EDITED PART FOR HOMEPAGE */
app.get("/", (req, res) => {
	res.render('Payroll_System/login', { title: 'Authentication' });
});
// Authentication Page (Login)
app.get("/home", (req, res) => {
	Profile.find({}, (err, fetchedProfiles) => {
		if (err) {
			console.log(err); ``
		} else {
			res.render('Payroll_System/index', { profiles: fetchedProfiles, title: 'Home' });
		}
	})
});
/* END OF EDITED PART */

// Forget Pass Page
app.get("/forgetpass", (req, res) => {
	res.render('Payroll_System/forgetpass', { title: 'Reset Password' });
});

app.get("/hris", (req, res) => {
	res.render('DUMMY_HRIS/index');
});

app.get("/employees", (req, res) => {
	Profile.find({}, (err, fetchedProfiles) => {
		if (err) {
			console.log(err);
		} else {
			res.render('DUMMY_HRIS/employee-profiles', { profiles: fetchedProfiles });
		}
	})
});

app.post("/save-profile", (req, res) => {
	const body = req.body;
	console.log("body:", body);

	console.log("name:", body.name);
	console.log("position:", body.position);
	console.log("department:", body.department);
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

	Profile.create({
		name: body.name,
		position: body.position,
		department: body.department,
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
		ovetimeHours: body.overtime_hours,
		undertimeHours: body.undertime_hours
	}, (err, profile) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/hris');
		}
	})
});

let port = app.get("port");
app.listen(process.env.PORT || 5000, () => console.log(`Dummy HRIS running on port ${port}`));