const PROTO_PATH = "../person.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

const PersonService = grpc.loadPackageDefinition(packageDefinition).PersonService;
const client = new PersonService(
	"localhost:30043",
	grpc.credentials.createInsecure()
);

module.exports = client;
