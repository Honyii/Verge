const moment = require("moment");
const queries = require('../Query/vergeQuery');
const db = require('../database');



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
                created_at,
                created_at],
    };
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 404,
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
        return Promise.reject({ 
            status: "error",
            code: 500,
            message: "Error creating parcel order",
        });
    }
}

async function changeOrderStatus(user_id, id, body) {
    const d = new Date();
    const modified_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { status } = body
    const queryObj = {
        text: queries.updateStatus,
        values: [status, user_id, modified_at, id]
    }
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount === 0) {
            return Promise.reject({
                status: "Error",
                code: 404,
                message: "Cannot find order Id."
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel delivery status updated successfully",
            });
        }
    } catch (e) {
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
                message: "Unauthorized! Parcel has been shipped"
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating status parcel"
        });
    }
}

async function updateDestination(user_id, id, body) {
    const d = new Date();
    const modified_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { destination } = body
    const queryObj = {
        text: queries.updateDestination,
        values: [destination, user_id, modified_at, id ]
    }
    try {
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 400,
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
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating parcel delivery destination"
        })
    }
}

async function updateLocation(user_id, id, body) {
    const d = new Date();
    const modified_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { location } = body
    const queryObj = {
        text: queries.updateLocation,
        values: [location, user_id, modified_at, id ]
    }
    try {
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 400,
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
                code: 404,
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


async function checkAdmin(id){
    const queryObj = {
        text: queries.findAdmin,
        values: [id]
    };
    try{
        const { rows } = await db.query(queryObj);
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



module.exports = {createParcel, changeOrderStatus, checkStatus, updateDestination, updateLocation,  deleteParcel,checkAdmin};
    
    
   
    
    
   
    
