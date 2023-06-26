require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { log } = require("console");
const app = express();
const encrypt = require("mongoose-encryption");

console.log(process.env.SECRET);
console.log(process.env.MONGO_URL);
console.log(process.env.PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("home");
	// res.send("HI");
});
app.get("/register", (req, res) => {
	res.render("register");
});
app.get("/login", (req, res) => {
	res.render("login");
});

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("users", userSchema);

app.post("/register", (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password,
	});
	newUser
		.save()
		.then(res.render("secrets"))
		.catch((err) => {
			console.log(err);
		});
});

app.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({ email: username })
		.then((foundUser) => {
			if (foundUser) {
				if (foundUser.password === password) {
					res.render("secrets");
				} else {
					res.send("invalid Crdentials");
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

app.listen(3000, () => {
	console.log("Server is listening to port 3000");
});
