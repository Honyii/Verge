const queries = require('../Query/vergeQuery');
const db = require('../database');


async function getUserId(id){
    const queryObj = {
        text: queries.findParcelByUserId,
        values: [id]
    };
    try{
        const { rows } = await db.query(queryObj);
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
async function getAllParcel() {
    const queryObj = {
        text: queries.findAllParcel,
    };
    try {
        const { rows } = await db.query(queryObj);
        const result = rows[0];
        const data = {
            result
        }
        return Promise.resolve({
            status: "success",
            code: 200,
            message: "Successfully fetched all parcels",
            price : data.result.price,
            weight : data.result.weight,
            location : data.result.location,
            destination : data.result.destination,
            senders_name: data.result.senders_name,
            senders_note : data.result.senders_note
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
        const result = rows[0];
        const data = {
            result 
        }
        if (rowCount == 0) {
            return Promise.reject({
                status: "erorr",
                code: 400,
                message: "Parcel Not found",
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
                message: "User parcel Collection Not found",
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

module.exports = {getUserId, getAllParcel, findUserParcel, getAllUserParcel }