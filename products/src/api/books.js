const ProductService = require("../services/book-service");
const { PublishCustomerEvent, PublishShoppingEvent } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ProductService();

  //add catalog item

  //example of request body
  //   {
  //     "name": "<Judul Buku>",
  //     "desc": "<Description>",
  //     "type": "<Type>",
  //     "unit": 1, ineteger integer (without "..")
  //     "banner": "<Your Link>",
  //     "price": 5000, integer (without "..")
  //     "available": "true",
  //     "suplier": "<Supplier>"
  // }

  //complete endpoint would be localhost:3000/book/create
  app.post("/book/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //search by category. The category is the type of the book
  //complete endpoint would be localhost:3000/category/:type remeber not to incude the ":" and just write your type
  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  //search by book id
  //you can see the book id from the API most below to show all the book data
  //complete endpoint would be localhost:3000/:id remeber not to incude the ":"
  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  //this endpoint is to add the book to the wishlist.
  //complete endpoint would be localhost:3000/wishlist 
  //Its required request body like here
  //{
  //     "_id": "66684c30b8f4384c365493b6" The id is the book id and make sure you use the PUT method
  // }
  app.put("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id },
        "ADD_TO_WISHLIST"
      );
      PublishCustomerEvent(data);
      return res.status(200).json(data.data.book);
    } catch (err) {}
  });

  
  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_WISHLIST"
      );
      PublishCustomerEvent(data);
      return res.status(200).json(data.data.book);
    } catch (err) {
      next(err);
    }
  });

  //to show all the books in collection.
  app.get("/", async (req, res, next) => {
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
