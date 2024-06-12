const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CustomerService();

  //example of request body
  //   {
  //     "email": "mr.adhityabayu@gmail.com",
  //     "password": "123",
  //     "phone": "123"
  // }

  //complete endpoint would be localhost:3000/customer/signup
  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      console.log("Signup Request Body:", req.body); // Log request body
      const { data } = await service.SignUp({ email, password, phone });
      console.log("Signup Response Data:", data); // Log response data
      return res.json(data);
    } catch (err) {
      console.error("Signup Error:", err); // Log errors
      next(err);
    }
  });

  //example of request body
  //{
  //     "email": "mr.adhityabayu@gmail.com",
  //     "password": "123"
  // }

  //complete endpoint would be localhost:3000/customer/login
  app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log("Login Request Body:", req.body); // Log request body
      const { data } = await service.SignIn({ email, password });
      console.log("Login Response Data:", data); // Log response data
      return res.json(data);
    } catch (err) {
      console.error("Login Error:", err); // Log errors
      next(err);
    }
  });

  //example of request body
  //{
  //     "street": "Srumbung",
  //     "postalCode": "56483",
  //     "city": "Magelang",
  //     "country": "Indonesia"
  // }

  //complete endpoint would be localhost:3000/customer/address
  app.post("/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { street, postalCode, city, country } = req.body;
      const { data } = await service.AddNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //complete endpoint would be localhost:3000/customer/profile
  app.get("/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //complete endpoint would be localhost:3000/customer/wishlist
  app.get("/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
