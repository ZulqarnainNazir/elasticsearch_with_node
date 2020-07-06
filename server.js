const express = require("express");

const app = express();
let router = require("./router");
let apiRouter = require("./routes/api");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const env = app.get("env");
let secret = "vEvaRC2HEnYwFB5FybCUF9Zxmg42z6G7Bw2W";
if (env === "production") {
  console.log("production");
  const redis = require("redis");
  let RedisStore = require("connect-redis")(session);
  let redisClient = redis.createClient();
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: secret,
      saveUninitialized: true,
      resave: false,
    })
  );
} else {
  app.use(
    session({
      secret: "vEvaRC2HEnYwFB5FybCUF9Zxmg42z6G7Bw2W",
      resave: true,
      saveUninitialized: true,
      cookie: { secure: 'auto' },
    })
  );
}

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

app.listen(8000);
