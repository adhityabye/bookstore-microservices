# Deskripsi Aplikasi 📝

Berisikan backend service yang merupakan implementasi dari scenario dalam toko buku. API dibuat dengan pendekatan REST dengan implementasi arsitektur microservices, serta beberapa fitur tambahan lainnya.

# Tech Stack ⚙️

- Node.js
- Express.js
- Redis
- MongoDB
- Docker

# Links 🔗

- Postman : https://s.id/PostmanAPI
- Presentation Slides : https://s.id/PPTMicorservice

# How to run this project 🏃‍♂️

Clone this repository into your local machine. you can put it anywhere, tho

```
https://github.com/adhityabye/bookstore-microservices.git
```

Dont forget to configure you .env file. You can use your own mongoDB cluster database.

```
MONGODB_URI=<your own DB>
APP_SECRET=<your app secret>
PORT=<your desired port>
```

You can generate the APP_SECRET using this command,

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

To start the redis local server, make sure you are using wsl and configure like this to make it run smoothly.

```
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install redis
sudo service redis-server start
redis-cli
127.0.0.1:6379> ping
```

## Services ⁉️

1. Go to each service directory, opened in separated terminal

```
cd gateway
```

2. Install the NPM package

```
npm install
```

3. Run the App

```
npm start
```

4. This app will running on port 3000. Use the postman app for testing the API, endpoint are provided below.

```
http://localhost:3000/{endpoints}
```
