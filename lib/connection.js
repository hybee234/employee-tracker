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
        port: 3306,
        user: "root",
        password: "12345678",
        database: "employee_tracker_db"
    },     
)

module.exports = db