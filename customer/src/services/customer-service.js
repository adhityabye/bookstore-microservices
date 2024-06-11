const { CustomerRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-errors");
const redisClient = require("../utils/redis-client");

class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;
    console.log("SignIn Inputs:", userInputs);

    try {
      const existingCustomer = await this.repository.FindCustomer({ email });

      if (existingCustomer) {
        const validPassword = await ValidatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });
          return FormateData({ id: existingCustomer._id, token });
        }
      }

      return FormateData(null);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;

    try {
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(password, salt);

      const existingCustomer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });

      const token = await GenerateSignature({
        email: email,
        _id: existingCustomer._id,
      });

      return FormateData({ id: existingCustomer._id, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async AddNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;

    try {
      const addressResult = await this.repository.CreateAddress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return FormateData(addressResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetProfile(id) {
    try {
      // Check if profile data is in the cache
      const cachedProfile = await redisClient.get(`profile:${id}`);

      if (cachedProfile) {
        console.log("Profile data retrieved from cache");
        return FormateData(JSON.parse(cachedProfile));
      }

      // If not in cache, fetch from database
      const existingCustomer = await this.repository.FindCustomerById({ id });

      if (!existingCustomer) {
        throw new APIError("Data Not found");
      }

      // Store the profile data in the cache with an expiration time of 1 hour
      await redisClient.setEx(
        `profile:${id}`,
        3600,
        JSON.stringify(existingCustomer)
      );

      console.log("Profile data retrieved from database");
      return FormateData(existingCustomer);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetWishList(customerId) {
    try {
      // Check if wishlist data is in the cache
      const cachedWishList = await redisClient.get(`wishlist:${customerId}`);

      if (cachedWishList) {
        console.log("Wishlist data retrieved from cache");
        return FormateData(JSON.parse(cachedWishList));
      }

      // If not in cache, fetch from database
      const wishListItems = await this.repository.Wishlist(customerId);

      if (!wishListItems) {
        throw new APIError("Data Not found");
      }

      // Store the wishlist data in the cache with an expiration time of 1 hour
      await redisClient.setEx(
        `wishlist:${customerId}`,
        3600,
        JSON.stringify(wishListItems)
      );

      console.log("Wishlist data retrieved from database");
      return FormateData(wishListItems);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async AddToWishlist(customerId, book) {
    try {
      const wishlistResult = await this.repository.AddWishlistItem(
        customerId,
        book
      );
      return FormateData(wishlistResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(customerId, book, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        book,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageOrder(customerId, order) {
    try {
      const orderResult = await this.repository.AddOrderToProfile(
        customerId,
        order
      );
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetShopingDetails(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({ id });

      if (existingCustomer) {
        return FormateData(existingCustomer);
      }
      return FormateData({ msg: "Error" });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async SubscribeEvents(payload) {
    const { event, data } = payload;
    const { userId, book, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddToWishlist(userId, book);
        break;
      case "ADD_TO_CART":
        this.ManageCart(userId, book, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, book, qty, true);
        break;
      case "CREATE_ORDER":
        this.ManageOrder(userId, order);
        break;
      case "TEST":
        console.log("TEST JALAN LMAO :D");
        break;
      default:
        break;
    }
  }
}

module.exports = CustomerService;
