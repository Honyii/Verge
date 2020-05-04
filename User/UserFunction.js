const moment = require("moment");
const queries = require('../Query/vergeQuery');
const db = require('../database');
const {hashPassword, comparePassword, getToken} = require("../Validation/Validation");

async function createUser(body) {
    const date = new Date();
    const created_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const { first_name, last_name, email, password, state } = body;
    const hashedPassword = hashPassword(password);
    const is_admin = false;
    const queryObj = {
        text: queries.addNewUser,
        values: [email, hashedPassword, first_name, last_name, state, created_at, created_at, is_admin],
    };
    try {
        const { rows, rowCount } = await db.query(queryObj);
        if (rowCount > 0) {
            const result = rows[0];
            const tokens = getToken(result.id, result.email);
            const data = {
                token: tokens,
                result
        }
            return Promise.resolve({
                message: "You have successfully signed up!",
                first_name: data.result.first_name,
                last_name: data.result.last_name,
            });
        }
        if (rowCount == 0) {
            return Promise.reject({
                status: "Error",
                code: 404,
                message: "Could not create user",
            });
        }   
    } catch (e) {
        return Promise.reject({
            status: "Error",
            code: 500,
            message: "Error signing up. Try again.",
        });
    }
}


async function checkIfUserDoesNotExist(email) {
    const queryObj = {
        text: queries.findUserSignUp,
        values: [email],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.resolve();
        }
        if (rowCount > 0) {
            return Promise.reject({
                status: "error",
                code: 409,
                message: "Email Already Exists",
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function checkIfUserExist(id) {
    const queryObj = {
        text: queries.findUserId,
        values: [id],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 404,
                message: "User does not exist. Kindly use valid user.",
            });
            
        }
        if (rowCount > 0) {
            return Promise.resolve();
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function checkEmailAndPasswordMatch(body) {
    const {email, password} = body;
    const queryObj = {
        text: queries.findUserSignUp,
        values: [email],
    };

    try {
        const { rows, rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 404,
                message: "Email not found",
            });
        }
        
        if (rowCount > 0) {
            const result = rows[0];
            if (!comparePassword(result.password, password)) {
                return Promise.reject({
                    status: "error",
                    code: 400,
                    message: "Password is incorrect",
                });
            }
  
            const tokens = getToken(result.id, result.email);
            const data = {
                token: tokens,
                result
            }
            return Promise.resolve({
                message: "Log in successful. Welcome!",
                first_name: data.result.first_name,
                last_name: data.result.last_name,
                token: data.token
                
               
            })
        }

    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

module.exports = {createUser, checkIfUserDoesNotExist, checkIfUserExist, checkEmailAndPasswordMatch }