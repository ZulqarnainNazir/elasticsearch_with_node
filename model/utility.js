const con = require("./db_connection");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ALOG = "AES-256-CBC";
const secret = "3s8VgUJCRAPkKrdLShTbPQh2yby9SPx6";
const iv = secret.substr(0, 16);
const SECRET_KEY = "DLAaZcKH59l1yHk954jyuiyWHwH7g";
const fs = require("fs");
var nodemailer = require("nodemailer");
const AUTH_EMAIL = "email";
const AUTH_PASSWORD = "email_pwd";
const APP_URL = "http://localhost:8000";

class Utility {
    /**
     * @description This method returns response for all api calls
     * @param {*} type
     * @param {*} action
     * @param {*} response
     * @param {*} data
     * @returns object
     */
    getEmail() {
        return AUTH_EMAIL;
    }
    getUrl() {
        return APP_URL;
    }
    Response(type, action, status = "", response, data = {}) {
        return {
            type,
            action,
            status,
            response,
            data,
        };
    }

    Database(query, data) {
        return new Promise((resolve, reject) => {
            // return resolve(query);
            con.query(query, data, (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        });
    }

    encrypt(data) {
        var encryptor = crypto.createCipheriv(ALOG, secret, iv);
        return encryptor.update(data, "utf8", "base64") + encryptor.final("base64");
    }

    decrypt(data) {
        var msg = "";
        var decryptor = crypto.createDecipheriv(ALOG, secret, iv);
        try {
            msg = decryptor.update(data, "base64", "utf8") + decryptor.final("utf8");
        } catch (ex) {
            console.log("Error On Decrypt: ", data);
        }
        return msg;
    }

    generateJWTToken(userData) {
        return jwt.sign(userData, SECRET_KEY);
    }

    verifyToken = (jwtToken) => {
        try {
            return jwt.verify(jwtToken, SECRET_KEY);
        } catch (e) {
            console.log('e:', e);
            return null;
        }
    }

    verifyToken(jwtToken) {
        return new Promise((resolve, reject) => {
            const authHeader = jwtToken;
            if (authHeader) {
                const token = authHeader.split(" ")[1];
                jwt.verify(token, SECRET_KEY, (err, user) => {
                    if (err) {
                        req.session.destroy();
                        reject(utility.Response("error", "user", 0, "Invalid token"));
                    } else if (user && user[0]["email"] && user[0]["id"]) {
                        resolve(true);
                    }
                });
            } else {
                req.session.destroy();
                reject(false);
            }
        });
    }

    validateCharacter(data) {
        var reg = /[^a-zA-Z ]/g;
        if (data.match(reg)) {
            return false;
        } else {
            return true;
        }
    }

    validateEmail(data) {
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (data.match(reg)) {
            return true;
        } else {
            return false;
        }
    }

    validatePhone(data) {
        var reg = /^((?:\+\d+)?\s*(?:\(\d+\)\s*(?:[\/–-]\s*)?)?\d+(?:\s*(?:[\s\/–-]\s*)?\d+)*)$/;
        if (data.match(reg)) {
            return true;
        } else {
            return false;
        }
    }

    validatePwd(str) {
        if (
            str.match(/[a-z]/g) &&
            str.match(/[A-Z]/g) &&
            str.match(/[0-9]/g) &&
            str.match(/[^a-zA-Z\d]/g)
        ) {
            return true;
        } else {
            return false;
        }
    }

    uploadImagefile(dataString) {
        return new Promise((resolve, reject) => {
            let path = "./upload/" + Date.now() + ".png";
            let base64Data = dataString.replace(/^data:([A-Za-z-+/]+);base64,/, "");
            fs.writeFileSync(path, base64Data, "base64");
            resolve(path);
        });
    }

    sendMail(email, subject, html) {
        console.log(html);
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: AUTH_EMAIL,
                pass: AUTH_PASSWORD,
            },
        });

        var mailOptions = {
            from: process.env.AUTH_PASSWORD,
            to: email,
            subject: subject,
            html: html,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log("Email sent: " + info.response);
                return true;
            }
        });
    }
}

module.exports = new Utility();