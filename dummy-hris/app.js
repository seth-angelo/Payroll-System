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

app.use(function (req, res, next) {
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

let mongoURI = "mongodb://localhost:27017/dummy-hris";
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.get("/", (req, res) => {
	res.render('index');
});

app.get("/employees", (req, res) => {
	Profile.find({}, (err, fetchedProfiles) => {
		if (err) {
			console.log(err);
		} else {
			res.render('employee-profiles', {profiles: fetchedProfiles});
		}
	})
});

app.post("/save-profile", (req, res) => {
	const body = req.body;
	console.log("body:", body);

	console.log("name:", body.name);
	console.log("tax status:", body.tax_status);
	console.log("salary type:", body.salary_type);
	console.log("rate:", body.rate);
	console.log("unpaid leave:", body.unpaid_leave);
	console.log("bonus:", body.bonus);
	console.log("insurance rate:", body.isr_rate);
	console.log("penalties:", body.penalties);

	Profile.create({
		name: body.name, 
		taxStatus: body.tax_status,
		salaryType: body.salary_type,
		rate: body.rate,
		unpaidLeave: body.unpaid_leave,
		bonus: body.bonus,
		insuranceRate: body.isr_rate,
		penalties: body.penalties
	}, (err, profile) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	})
});

let port = app.get("port");
let server = app.listen(5000, function () {
	console.log("Dummy HRIS running on port", port);
});