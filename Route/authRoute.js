const express = require("express");
const router = express.Router();
const   {signupController, loginController, parcelController,
        parcelChangeController, destinationChangeController, 
        locationChangeController, deleteController,
        getAllparcelController, findAParcelController,
        getAllUserCollectionController  } = require("../Controller/Controller");
const   {signupMiddleware, loginMiddleware, 
        parcelMiddleware, deleteMiddleware, 
        findAParcelMiddleware} = require("../Middleware/Middleware");
const { verifyAdminToken,
        verifyUserToken} = require("../tokenVerification/tokenVerification");

         
    


router.post("/auth/signup", signupMiddleware, signupController );
     

router.post( "/auth/login", loginMiddleware, loginController );
   
    
router.post("/parcel",  parcelMiddleware, verifyUserToken, parcelController );
    

router.put("/parcel/status/change/:id",  verifyAdminToken, parcelChangeController );


router.put("/parcel/destination/change/:id", verifyUserToken, destinationChangeController );


router.put("/parcel/location/change/:id", verifyAdminToken,  locationChangeController );


router.delete("/parcel/cancel/:id", verifyUserToken, deleteMiddleware, deleteController );
  

router.get("/parcel/all", verifyAdminToken, getAllparcelController );
    

router.get("/parcel/:id", verifyUserToken, findAParcelMiddleware, findAParcelController );
    
   
router.get("/parcel/", verifyUserToken, getAllUserCollectionController );
    
   
    
module.exports = router;