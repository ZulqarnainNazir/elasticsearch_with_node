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
        return utility.Database("insertUser",this.data.payload);
      case "update":
        return utility.Database("update",this.data.payload);
      case "filter":
        return utility.Database("filter",this.data.payload);
      default:
        return Promise.reject(
          utility.Response("user", "warning", "Action not found")
        );
    }
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
