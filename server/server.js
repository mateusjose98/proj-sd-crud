const PROTO_PATH = "./person.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

var personsProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();

//database
const persons = [
	{
		id: "030303c7c-f82d-4e44-88ca-ae2a1aaa92b7",
		name: "Rose",
		age: 50,
		address: "Av. Daniel de La Touche, n 003"
	},
	{
		id: "12345677-7ca6-44bc-b721-fb4d5312cafc",
		name: "Rafael Silva",
		age: 33,
		address: "Rua dos Alfeneros, n 4"
	},
	{
		id: "12345677-7ca6-44bc-b721-rbdd5312cafc",
		name: "Mateus João",
		age: 23,
		address: "Rua dos Alfeneros, n 44"
	}

];

server.addService(personsProto.PersonService.service, {
	getAll: (_, callback) => {
		callback(null, { persons });
	},

	get: (call, callback) => {
		let person = persons.find(n => n.id == call.request.id);

		if (person) {
			callback(null, person);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found"
			});
		}
	},

	insert: (call, callback) => {
		let person = call.request;
		
		person.id = uuidv4();
		persons.push(person);
		callback(null, person);
	},

	update: (call, callback) => {
		let existingPerson = persons.find(n => n.id == call.request.id);

		if (existingPerson) {
			existingPerson.name = call.request.name;
			existingPerson.age = call.request.age;
			existingPerson.address = call.request.address;
			callback(null, existingPerson);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found"
			});
		}
	},

	remove: (call, callback) => {
		let existingPersonIndex = persons.findIndex(
			n => n.id == call.request.id
		);

		if (existingPersonIndex != -1) {
			persons.splice(existingPersonIndex, 1);
			callback(null, {});
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found"
			});
		}
	}
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Servidor rodando no endereço http://127.0.0.1:30043");
server.start();
