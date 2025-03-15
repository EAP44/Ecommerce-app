const mongoose = require("mongoose");

mongoose
  .connect("mongodb://mongo:27017/inventory-Docker",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
 })

  .then(() => {
    console.log("\n -> connected to mongodb with succesfuly ");
  })

  .catch(() => {
    console.log("\n -> error connecte !!!");
    console.log("\n -> verify the mongodb access :(");
  });
