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
      case "api-test":
        return this.register();      
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
