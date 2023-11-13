//--------------------------//
//- Required packages/links -// 
//--------------------------//
// const express = require('express');
// const PORT = process.env.PORT || 3001;
// const app = express ();
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());



// view all departments
const viewDepartments = (db) => {
    db.query('SELECT * FROM department',  function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("\n")
            console.table(results);
            return (results)
        }
        //return results
        res.status(200).json(results);                                                                     // Provide a response back to the API to allow it go continue on
        return;
    })
    .catch ((err) => {
        res.status(500).json('Delete/Splice ID failed');
        return;        
    });
};

// view all roles
const viewRoles = (db) => {
    db.query('SELECT * FROM role', function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("\n")
            console.table(results);
        }
        return 
    });
};

// view all employees
const viewEmployees = (db) => {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("\n")
            console.table(results);
        }
        return 
    });
};





// app.use((req, res) => {
//     res.status(404).end();
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });




exports.viewDepartments = viewDepartments;
exports.viewRoles = viewRoles;
exports.viewEmployees = viewEmployees;