const moment = require("moment");
const queries = require('../Query/vergeQuery');
const db = require('../database');
const {hashPassword, getToken} = require("../Validation/Validation");

 

  async function checkIfAdminExist(email) {
    const queryObj = {
        text: queries.findUserSignUp,
        values: [email],
    };
    const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            const date = new Date();
            const created_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
           let password = "judejulia"
            const hashedPassword = hashPassword(password);
            const queryObj = {
                text: queries.addNewUser,
                values: ["amara@gmail.com", hashedPassword, "Amaechi", "Hope", "Imo", created_at, created_at, true],
            };
            const { rows } = await db.query(queryObj);
                const result = rows[0];
                const tokens = getToken(result.id, result.email);
                const data = {
                    token: tokens,
                    result
            }        
        }  
}

async function checkIfAdminExistTwo(email) {
    const queryObj = {
        text: queries.findUserSignUp,
        values: [email],
    };
    const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            const date = new Date();
            const created_at = moment(date).format("YYYY-MM-DD HH:mm:ss");
           let password = "meach"
            const hashedPassword = hashPassword(password);
            const queryObj = {
                text: queries.addNewUser,
                values: ["meach@gmail.com", hashedPassword, "Nenye", "Peace", "Imo", created_at, created_at, true],
            };
            const { rows } = await db.query(queryObj);
                const result = rows[0];
                const tokens = getToken(result.id, result.email);
                const data = {
                    token: tokens,
                    result
            }        
        }  
}
checkIfAdminExist();
checkIfAdminExistTwo();