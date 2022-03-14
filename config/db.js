const mongoose = require("mongoose");

const mongo_uri= process.env.mongo_uri;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(mongo_uri
    //     {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    //     }
    )
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};