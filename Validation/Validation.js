const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const saltRounds = 8;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);
const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
}; 


dotenv.config();

  const getToken = (id, email, first_name, last_name, state, is_admin) => {
    const key = process.env.TOKEN_SECRET;
    const token = jwt.sign({     
        id,
        email,
        first_name, 
        last_name, 
        state, 
        is_admin 
    },  key, { 
        expiresIn: 86400 });
    return token;
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

module.exports = {hashPassword, comparePassword, getToken, validateEmail, validatePassword};