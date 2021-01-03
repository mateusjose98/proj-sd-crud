const client = require("./client");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
	client.getAll(null, (err, data) => {
		if (!err) {
			res.render("person", {
				results: data.persons
			});
		}
		else {
			console.log(err, data)
		}
	});
});

app.post("/save", (req, res) => {
	let newPerson = {
		name: req.body.name,
		age: req.body.age,
		address: req.body.address
	};

	client.insert(newPerson, (err, data) => {
		if (err) throw err;

		console.log("Person created successfully", data);
		res.redirect("/");
	});
});

app.post("/update", (req, res) => {
	const updatePerson = {
		id: req.body.id,
		name: req.body.name,
		age: req.body.age,
		address: req.body.address
	};

	client.update(updatePerson, (err, data) => {
		if (err) throw err;

		console.log("Person updated successfully", data);
		res.redirect("/");
	});
});

app.post("/remove", (req, res) => {
	client.remove({ id: req.body.person_id }, (err, _) => {
		if (err) throw err;

		console.log("Person removed successfully");
		res.redirect("/");
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Server running at port %d", PORT);
});
