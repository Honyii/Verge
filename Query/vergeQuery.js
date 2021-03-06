const queries = {
    addNewUser: `
    INSERT INTO users(
      email,
      password,
      first_name,
      last_name,
      state,
      created_at,
      modified_at,
      is_admin
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    checkLoginDetails: `
    SELECT * FROM users WHERE email=($1) AND password = ($2)
  `,
    findUserSignUp: `
    SELECT * FROM users WHERE email=($1)
  `,
    findUserId: `
    SELECT * FROM users WHERE id=($1)
  `,
  
    addParcel: `
    INSERT INTO parcel(
      user_id,
      price,
      weight,
      location,
      destination,
      sender_name,
      sender_note,
      status,
      created_at, 
      modified_at
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
  
    findAllParcel: `
      SELECT * FROM parcel 
    `,
    findUserParcel: `
    SELECT * FROM parcel WHERE id=($1)
  `,
    deleteParcel: `
        DELETE FROM parcel WHERE id=($1)      
    `,
    updateDestination:
      `
    UPDATE parcel SET destination=($1), user_id=($2), modified_at=($3) WHERE id=($4) RETURNING *
    `,
    updateStatus:
      `
    UPDATE parcel SET status=($1), user_id=($2), modified_at=($3) WHERE id=($4) RETURNING *
    `,
    updateLocation:
      `
    UPDATE parcel SET location=($1), user_id=($2), modified_at=($3) WHERE id=($4) RETURNING *
  `,
    getStatus: `
    SELECT * FROM parcel WHERE user_id=($1) AND id=($2)
    `,
    findParcelByUserId: `
      SELECT * FROM parcel WHERE id=($1)
      `,
    findAdmin: `
      SELECT is_admin FROM users WHERE id=($1)
      `,
      getAllUserParcel: `
        SELECT * FROM parcel WHERE user_id=($1) 
        `
  };
  
  module.exports = queries;