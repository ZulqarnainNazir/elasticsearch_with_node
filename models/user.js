const utility = require("./utility");
const session = require("express-session");
const APP_URL = utility.getUrl();

class User {
  constructor(action, data) {
    this.data = data;
    this.action = action;
  }

  output() {
    switch (this.action) {
      case "test":
        return this.register();      
      case "signup":
        return this.signup();
      default:
        return Promise.reject(
          utility.Response("user", "warning", "Action not found")
        );
    }
  }

  signup() {
    let msg = "";
    utility.Database("insertUser",this.data.payload)
    return Promise.reject(
        utility.Response(
          "error",
          "user",
          0,
          msg
        )
      );
  }

  register() {
    return Promise.reject(
        utility.Response(
          "error",
          "user",
          0,
          "Test message"
        )
      );
  }
}

module.exports = User;
