const { ProductModel } = require("../models");
const { APIError, BadRequestError } = require("../../utils/app-errors");

class ProductRepository {
  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }) {
    try {
      const book = new ProductModel({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });

      const productResult = await book.save();
      return productResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create book"
      );
    }
  }

  async books() {
    try {
      return await ProductModel.find();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Get books"
      );
    }
  }

  async FindById(id) {
    try {
      return await ProductModel.findById(id);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find book"
      );
    }
  }

  async FindByCategory(category) {
    try {
      const books = await ProductModel.find({ type: category });
      return books;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }

  async FindSelectedProducts(selectedIds) {
    try {
      const books = await ProductModel.find()
        .where("_id")
        .in(selectedIds.map((_id) => _id))
        .exec();
      return books;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find book"
      );
    }
  }
}

module.exports = ProductRepository;
