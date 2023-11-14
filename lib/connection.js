//--------------------------//
//- Required packages/inks -// 
//--------------------------//

const mysql = require ('mysql2');

//--------------------------//
//- Connection to Database -// 
//--------------------------//

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