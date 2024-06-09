const express = require("express");
const { PORT, DB_URL } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");

const StartServer = async () => {
  const app = express();

  console.log(`PORT: ${PORT}`);
  console.log(`DB_URL: ${DB_URL}`);

  await databaseConnection();
  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
