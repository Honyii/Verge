const express = require("express");
const router = express.Router();
const { createUser,
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
    getAllUserParcel,
    
} = require("./vergeFunction");
const {verifyToken, 
    verifyUserToken,
    getAllUserCollection,
    validateEmail,
    validatePassword
} = require("./tokenVerification");



router.post(
    "/auth/signup",
   async (req, res, next) => {
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
    },
    async (req, res) => {
        const { email } = req.body;
        try {
            await checkIfUserDoesNotExist(email);
            const result = await createUser(req.body);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.post(
    "/auth/signup/admin",
    (req, res, next) => {
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
    },
    async (req, res) => {
        const { email } = req.body;
        try {
            await checkIfUserDoesNotExist(email);
            const result = await  createAdmin(req.body);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.post(
    "/auth/login",
    (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
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
    },
    async (req, res) => {
        try {
            const result = await checkEmailAndPasswordMatch(req.body);
            return res.status(202).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.post(
    "/parcel/:user_id", verifyUserToken,
    (req, res, next) => {
        const { price, weight, location, destination, sender_name, sender_note } = req.body;
        if (!price || !weight || !location || !destination || !sender_name || !sender_note) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }
        next();
    },

    async (req, res, ) => {
        const { user_id } = req.params;
        try {
            await checkIfUserExist(user_id);
            const result = await createParcel(user_id, req.body);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.put("/parcel/status/change/:user_id/:id", verifyToken,
    async (req, res) => {
        const { user_id, id } = req.params;
        try {
            await checkAdmin(user_id);
            const result = await changeOrderStatus(user_id, id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.put("/parcel/destination/change/:user_id/:id", verifyUserToken,
    async (req, res) => {
        const { user_id, id } = req.params;
        try {
            await checkIfUserExist(user_id);
            await checkStatus(user_id, id);
            const result = await updateDestination(user_id, id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.put("/parcel/location/change/:user_id/:id", verifyToken,

    async (req, res) => {
        const { user_id, id } = req.params;
        try {
            await checkAdmin(user_id);
            const result = await updateLocation(user_id, id, req.body);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    }
);

router.delete("/parcel/cancel/:id", verifyToken,
    (req, res, next) => {
        const { id } = req.params;
        if (!parseInt(id)) {
            return res.status(400).json({
                message: "Id must be an integer",
            });
        }
        next();
    },
    async (req, res) => {
        const { id } = req.params;
        try {
            await getUserId(id);
            const result = await deleteParcel(id);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.get("/parcel/all", verifyToken, async (req, res) => {
    try {
        const result = await getAllParcel();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
});


router.get(
    "/parcel/:id", verifyUserToken,
    (req, res, next) => {
        const { id } = req.params;
        if (!parseInt(id)) {
            return res.status(400).json({
                message: "Id must be an integer",
            });
        }
        next();
    },
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await findUserParcel(id);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.get(
    "/parcel/", getAllUserCollection,
    async (req, res) => {
       const user_id = res.locals.user.id;
       console.log(user_id)
        try {
            const result = await getAllUserParcel(user_id);
            return res.status(200).json(result)
        } catch (e) {
            return res.status(e.code).json(e)
        }
    });
    
module.exports = router;