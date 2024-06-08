const express = require("express");

const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  return res.status(200).json({ msg: "Shop service is running" });
});

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
