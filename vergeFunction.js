const moment = require("moment");
const queries = require('./vergeQuery');
const db = require('./database');
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

  

async function createUser(body) {
    const date = new Date();
    const created_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const { first_name, last_name, email, password, state } = body;
    const is_admin = false;
    const hashedPassword = hashPassword(password);
    const queryObj = {
        text: queries.addNewUser,
        values: [email, hashedPassword, first_name, last_name, state, created_at, is_admin],
    };
    try {
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        console.log(rows[0]);     
        const tokens = getToken(result.id, result.email);
        const data = {
            token: tokens,
            result
        }
        return Promise.resolve({
            status: "Success!",
            code: 201,
            message: "You have successfully signed up", 
            data
        })
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "Error",
            code: 500,
            message: "Error signing up. Try again.",
        });
    }
}

async function createAdmin(body) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { first_name, last_name, email, password, state } = body;
    const is_admin = true;
    const hashedPassword = hashPassword(password);
    const queryObj = {
        text: queries.addNewUser,
        values: [email, hashedPassword, first_name, last_name, state, created_at, is_admin],
    };
    try {
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        console.log(rows[0]);
        const tokens = getToken(result.id, result.email);
        const data = {
            token: tokens,
            result
        }
        return Promise.resolve({
            status: "Success!",
            code: 201,
            message: "You have successfully signed up", 
            data
        })
    } catch (e) {
        console.log(e);
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
                message: "Email Already Exists. Input another e-mail",
            });
        }
    } catch (e) {
        console.log(e);
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
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user by Id",
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
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        if (!result) {
            return Promise.reject({
                status: "error",
                code: 404,
                message: "Email not found",
            });
        }
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
            status: "success",
            code: 202,
            message: "Log in successful. Welcome!", 
            data
        })
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding user",
        });
    }
}

async function createParcel(user_id, body) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const status = "pending"
    const { price, weight, location, destination, sender_name, sender_note } = body;
    const queryObj = {
        text: queries.addParcel,
        values: [user_id, 
                price, 
                weight, 
                location, 
                destination, 
                sender_name, 
                sender_note, 
                status, 
                created_at],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not place order",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 201,
                message: "Parcel order created successfully",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error creating order",
        });
    }
}

async function changeOrderStatus(user_id, id, body) {
    const { status } = body
    const queryObj = {
        text: queries.updateStatus,
        values: [status, user_id, id]
    }
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount === 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Cannot find order Id."
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 202,
                message: "Parcel delivery status updated successfully",
            });
        }
    } catch (e) {
        console.log(e)
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating parcel delivery status"
        })
    }
}

async function checkStatus(user_id, id) {
    const queryObj = {
        text: queries.getStatus,
        values: [user_id, id],
    };
    try {
        const { rows } = await db.query(queryObj);
        if (rows[0].status == "pending") {
            return Promise.resolve();
        }
        if (rows[0].status !== "pending") {
            return Promise.reject({
                status: "error",
                code: 401,
                message: "Unauthorized. Parcel has been shipped"
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

async function updateDestination(user_id, id, body) {
    const { destination } = body
    const queryObj = {
        text: queries.updateDestination,
        values: [destination, user_id, id]
    }
    try {
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Order Id could not be found. Try again."
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel delivery destination updated successfully!",
            });
        }
    } catch (e) {
        console.log(e)
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating parcel delivery destination"
        })
    }
}

async function updateLocation(user_id, id, body) {
    const { location } = body
    const queryObj = {
        text: queries.updateLocation,
        values: [location, user_id, id]
    }
    try {
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Delivery location not found"
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel delivery location updated successfully",
            });
        }
    } catch (e) {
        console.log(e)
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating parcel delivery location"
        })
    }
}

async function deleteParcel(id) {
    const queryObj = {
        text: queries.deleteParcel,
        values: [id],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "erorr",
                code: 500,
                message: "Parcel order not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel delivery order successfully deleted",
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error deleting parcel",
        });
    }
}

async function getUserId(id){
    const queryObj = {
        text: queries.findParcelByUserId,
        values: [id]
    };
    try{
        const { rows } = await db.query(queryObj);
        console.log(rows[0]);
        if(rows[0].status === "pending"){
            return Promise.resolve();
        }
        if (rows[0].status !== "pending") {
            return Promise.reject({
                status: "error",
                code: 401,
                message: "Unauthorized. Parcel has been shipped"
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

async function checkAdmin(id){
    const queryObj = {
        text: queries.findAdmin,
        values: [id]
    };
    try{
        const { rows } = await db.query(queryObj);
        console.log(rows[0]);
        if(rows[0].is_admin === true){
            return Promise.resolve();
        }
        if (rows[0].is_admin === false) {
            return Promise.reject({
                status: "error",
                code: 401,
                message: "Unauthorised. You're not an admin"
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding admin status",
        });
    }
}

async function getAllParcel() {
    const queryObj = {
        text: queries.findAllParcel,
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            message: "Successfully fetched all parcels",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching all parcels",
        });
    }
}

async function findUserParcel(id) {
    const queryObj = {
        text: queries.findUserParcel,
        values: [id],
    };
    try {
        const { rows, rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "erorr",
                code: 500,
                message: "Not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
              status: "success",
              code: 200,
              message: "User Parcel Found",
              data: rows
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error deleting parcel",
        });
    }
}

async function getAllUserParcel(user_id) { 
    const queryObj = {
        text: queries.getAllUserParcel,
        values: [user_id]
    }
    try {
        const { rows, rowCount } = await db.query(queryObj);
        if (rowCount === 0) {
            return Promise.reject({
                status: "erorr",
                code: 400,
                message: "Not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "User Parcels Found",
                data: rows
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error getting all user parcel",
        });
    }
}

module.exports = {
    createUser,
    createAdmin,
    checkIfUserDoesNotExist,
    checkIfUserExist,
    checkEmailAndPasswordMatch,
    createParcel,
    changeOrderStatus,
    checkStatus,
    updateDestination,
    updateLocation,
    deleteParcel,
    getAllParcel,
    findUserParcel,
    getUserId,
    checkAdmin,
    getAllUserParcel
};