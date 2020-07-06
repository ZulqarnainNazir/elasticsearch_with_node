const express = require("express");
const bparser = require("body-parser");
const utility = require("../models/utility");
const user = require("../models/user");

let router = express.Router();
const jwt = require("jsonwebtoken");
router.use(
    bparser.json({
        limit: "50mb",
    })
);
const SECRET_KEY = "JWT_SECRET";

router.use(
    bparser.urlencoded({
        extended: true,
        limit: "50mb",
    })
);

router.all("/:method/:action", (req, res) => {
    let session = req.session;
    // console.log(session);
    let access = true; //check auth intentionally left true for test
    let method = req.params.method;
    let action = req.params.action;
    let token = req.headers.authorization;
    let body = {
        payload: req.body,
        action: action,
        token: token,
    };
    if (access) {
        if (method === "user") {
            let user = require("../models/user");
            let u = new user(action, body);
            u.output()
                .then((reply) => {
                    res.send(reply);
                })
                .catch((err) => {
                    // res.status(500);
                    res.send(err);
                });

        } else {
            res.status(404);
            res.send(utility.Response(method, "warning", "Method not found"));
        }
    }
});

module.exports = router;