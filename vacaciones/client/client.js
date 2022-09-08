let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let readline = require("readline");
//Read terminal Lines
let reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
//Load the protobuf
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("../proto/vacaciones.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);
const REMOTE_SERVER = "0.0.0.0:50050";

//Create gRPC client
let client = new proto.work_leave.EmployeeLeaveDaysService(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

//Start the stream between server and client
let verify = () => {
  let data = {
    employee_id: 1,
    name: "Diego Botia",
    accrued_leave_days: 10,
    requested_leave_days: 4,
  };
  client.eligibleForLeave(data, (err, res) => {
    if (res.eligible) {
      client.grantLeave(data, (err, res) => {
        console.log(res);
      });
    } else {
      console.log("Pidió más días de los disponibles.");
    }
  });
};

verify();
