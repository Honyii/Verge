const express = require("express");
const {getUserId, getAllParcel, findUserParcel, getAllUserParcel} = require("../GetUserCollection/GetCollection")
const { createParcel,
        checkAdmin, 
        changeOrderStatus, 
        checkStatus, 
        updateDestination, 
        updateLocation,
        deleteParcel} = require("../Parcel/ParcelFunction");
const { checkIfUserDoesNotExist, createUser,
        checkEmailAndPasswordMatch,
        checkIfUserExist} = require('../User/UserFunction');



async function signupController (req, res) {
    const { email } = req.body;
    try {
        await checkIfUserDoesNotExist(email);
        const result = await createUser(req.body);
        return res.status(201).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
}

async function loginController (req, res) {
    try {
        const result = await checkEmailAndPasswordMatch(req.body);
        return res.status(202).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
}

async function parcelController (req, res) {
    const user_id = res.locals.user.id;
    try {      
        await checkIfUserExist(user_id);
        const result = await createParcel(user_id, req.body);
        return res.status(201).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
}

async function parcelChangeController (req, res)  {
    
        const  user_id = res.locals.user.id;
         const { id } = req.params;
         try {      
             await checkAdmin(user_id);          
             const result = await changeOrderStatus(user_id, id, req.body);
             return res.status(200).json(result)
         } catch (e) {
             return res.status(e.code).json(e)
         }
}

async function destinationChangeController (req, res) {
    const user_id = res.locals.user.id;
    const { id } = req.params;
    try {
        await checkIfUserExist(user_id);
        await checkStatus(user_id, id);
        const result = await updateDestination(user_id, id, req.body);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(e.code).json(e)
    }
}

async function locationChangeController (req, res) {
        const user_id = res.locals.user.id;
        const { id } = req.params;
        try {
            await checkAdmin(user_id);
            const result = await updateLocation(user_id, id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
}

async function deleteController (req, res) {
    const { id } = req.params;
    try {
        await getUserId(id);
        const result = await deleteParcel(id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
}

async function getAllparcelController (req, res) {
    try {
        const result = await getAllParcel();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
}

async function findAParcelController (req, res) {
    const { id } = req.params;
        try {
            const result = await findUserParcel(id);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
}

async function getAllUserCollectionController (req, res) {
    const user_id = res.locals.user.id;    
    try {
        const result = await getAllUserParcel(user_id);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(e.code).json(e)
    }
}

module.exports = {  signupController, loginController, parcelController,
                    parcelChangeController, destinationChangeController, 
                    locationChangeController, deleteController, getAllparcelController,
                    findAParcelController, getAllUserCollectionController  }