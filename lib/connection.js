const mysql = require ('mysql2');
//--------------------------//
//- Connection to Database -// 
//--------------------------//

// called by all other files accessing sql database
// .index.js
// 

const db = mysql.createConnection (
    {
        host: "localhost",
        user: "root",
        password: "12345678",
        database: "employee_tracker_db"
    }, 
    console.log("Connected!")
)

module.exports = db