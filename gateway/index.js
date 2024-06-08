const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customer", proxy("http://localhost:3001"));
app.use("/shop", proxy("http://localhost:3003"));
app.use("/", proxy("http://localhost:3002")); //books

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Hello");
});
