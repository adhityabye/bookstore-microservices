const express = require("express");

const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  return res.status(200).json({ msg: "Books service is running" });
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
