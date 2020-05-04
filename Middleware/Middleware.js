const express = require("express");
const {validateEmail, validatePassword} = require("../Validation/Validation");

    const signupMiddleware = (req, res, next) => {
            const { first_name, last_name, email, password, state } = req.body;
            if (!first_name || !last_name || !email || !password || !state) {
                return res.status(400).json({
                    message: "Please fill all fields",
                });
            }
            if(!validateEmail(email)) {
                return res.status(400).json({
                    message: "Input a valid Email"
                })
            } 
            if (!validatePassword(password)) {
                return res.status(400).json({
                    message: "Password must not be less than 6 charcters"
                })
            }        
            next();     
       }

    const loginMiddleware = (req, res, next) => {
        const { email, password } = req.body;
        if ( !email || !password ) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }
        if(!validateEmail(email)) {
            return res.status(400).json({
                message: "Input a valid Email"
            })
        } 
        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password must not be less than 6 charcters"
            })
        }        
        next();     
   }

   const parcelMiddleware = (req, res, next) => {
        const { price, weight, location, destination, sender_name, sender_note } = req.body;
        if (!price || !weight || !location || !destination || !sender_name || !sender_note) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }
        next();
    }

    const deleteMiddleware = (req, res, next) => {
        const { id } = req.params;
        if (!parseInt(id)) {
            return res.status(400).json({
                message: "Id must be an integer",
            });
        }
        next();
    }

    const findAParcelMiddleware = (req, res, next) => {
        const { id } = req.params;
        if (!parseInt(id)) {
            return res.status(400).json({
                message: "Id must be an integer",
            });
        }
        next();
    }

module.exports = {signupMiddleware, loginMiddleware, parcelMiddleware, deleteMiddleware, findAParcelMiddleware}