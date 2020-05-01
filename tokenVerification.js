const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

dotenv.config()





const getAllUserCollection = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(403).send({
            status: "Forbidden",
            code: 403,
            message: "Access denied"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            state: decoded.state,
            is_admin: decoded.is_admin,
        }
        res.locals.user = req.user;
        next();
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            code: 400,
            message: "Authentication failed"
        })
    }
}
    const validateEmail = (email) => {
        const regEx = /\S+@\S+\.\S+/;
        return regEx.test(email);
    };

    const validatePassword = (password) => {
        if (password.length <= 5) {
        return false;
        } return true;
    };

    const verifyToken = async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return res.status(403).json({
                status: "Forbidden",
                code: 403,
                message: "Access denied"
            })
        }
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                state: decoded.state,
                is_admin: decoded.is_admin,
            }
            res.locals.user = req.user;
            if (decoded.is_admin == true) {
                return res.status(201).send("great")
            }
            next();
        } catch (error) {
            return res.status(400).json({
                status: "Error",
                code: 400,
                message: "Authentication failed"
            })
        }
    }
    const verifyUserToken = async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return res.status(403).json({
                status: "Forbidden",
                code: 403,
                message: "Access denied"
            })
        }
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                is_admin: decoded.is_admin,
                state: decoded.state
            }
            res.locals.user = req.user;
            if (decoded.is_admin == false) {
                return res.status(201).send("Authorized")
            }
            next();
        } catch (error) {
            return res.status(400).send({
                status: "Error",
                code: 400,
                message: "Authentication failed"
            })
        }
    }
module.exports = {
    verifyToken,
    verifyUserToken,
    getAllUserCollection,
    validateEmail,
    validatePassword
}