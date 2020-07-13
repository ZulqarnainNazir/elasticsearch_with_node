const client = require("./db_connection");
const mappings = require("./mappings");
const user_query = require("./helpers/user_helper");
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
const params = require('params');

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

    async Database(query, data) {
        // Insert in ES
        switch (query) {
          case "insertUser":
            var errors = await this.validateRequireFields(data);
            if(errors.length === 0)
                console.log("shi aya");
            else 
              return Promise.reject( this.Response("user", "error", "Fields require", errors) );
                // await this.insertUser(data);
          case "update":
            await this.updateUser(data);
          case "filter":
            await this.searchUser(data);
          default:
            return Promise.reject(
              utility.Response("user", "warning", "Action not found")
            );
        }
    }
    validateRequireFields(data){
        var fields = ["email","first_name","last_name","dob","nationality","phone","location","last_or_current_employer","last_or_current_pos","level_of_education","still_in_school"]
        const errors = [];
        fields.forEach(function(entry) {
            if (!String(data[entry]).trim()) {
                errors.push(entry + ' is required');
            }
        });
        if(String(data["email"]).trim() && !(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/).test(String(data.email))){
            errors.push('Invalid email format');    
        }
        if(String(data["dob"]).trim() && !this.isValidDate(data.dob)){
            errors.push('Invalid dob format it should be yyyy-mm-dd');    
        }
        return errors;
    }

    isValidDate(dateString) {
      var regEx = /^\d{4}-\d{2}-\d{2}$/;
      if(!dateString.match(regEx)) return false;  // Invalid format
      var d = new Date(dateString);
      var dNum = d.getTime();
      if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
      return d.toISOString().slice(0,10) === dateString;
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

    async searchUser(data){ 
        await client.search({ index: 'users', type: 'personal',
          body: await user_query.filterQuery(data)}).then((result, err) => {
          if (err) console.log(err)
          return Promise.reject({type: "success", action: "user", status: 200, response: "", data: result.hits.hits});
        })
    }

    async insertUser(data){
        await this.checkIndices();
        await client.search({ index: 'users', type: 'personal', body: { "query": { "match_phrase_prefix" : { "email": data.email}}}})
        .then(async function(result, err) {
            if(result && result.hits.hits[0]){
                return Promise.reject({type: "error", action: "user", status: 200, response: "User already exists with this email."});
            } else{
                let body =  await user_query.userBodyHash(data);
                await client.index({index: 'users', type: 'personal', body: body})
                .then(function(resp) {
                    return Promise.reject({type: "success", action: "user", status: 200, response: "User created successfully.", data: resp});
                });
            }
        });

    }

    async updateUser(data){
        this.checkIndices();
        await client.get({ index: 'users', id: data.id})
        .then(async function(result) {
            if(result){
                let permittedParams = await params(data).only(user_query.permittedParamsFun());
                var monthsT = 0;
                if(permittedParams.experience.length != 0){
                    await permittedParams.experience.forEach(function (arrayItem) {
                        var from = new Date(arrayItem.start_date);
                        var to = new Date(arrayItem.end_date);
                        var months = to.getMonth() - from.getMonth() + (12 * (to.getFullYear() - from.getFullYear()));
                        if(to.getDate() < from.getDate()){
                            return Promise.reject({type: "error", action: "user", status: 200, response: "Invalid experience.", data: arrayItem});
                        }
                        monthsT = monthsT + months/12;
                    });
                }
                permittedParams["total_experience"] = monthsT;
                await client.update({index: 'users', type: 'personal', id: data.id, body: {"doc": permittedParams}})
                .then((resp) => {
                    return Promise.reject({type: "success", action: "user", status: 200, response: "User updated successfully.", data: resp});
                });
            } else{
                return Promise.reject({type: "error", action: "user", status: 200, response: "User not found.", data: ""});
            }
        });
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

    async checkIndices() {
        await client.indices.exists({index: 'users'}, async (err, res, status) => {
            if (res) {
                console.log('index already exists');
                // client.indices.delete( {index: 'users'}, (err, res, status) => {});
            } else {
                await client.indices.create( {index: 'users'}, (err, res, status) => {});
                await client.indices.putMapping({
                    index: 'users',
                    type: 'personal',
                    include_type_name: true,
                    body: {
                    properties: mappings
                }
            });
          }
        })
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