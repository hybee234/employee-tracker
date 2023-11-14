//--------------------------//
//- Required packages/inks -// 
//--------------------------//
const inquirer = require('inquirer');

// const queries = require('./lib/server.js')
const mainMenu = require ('./lib/mainMenu.js')    

//--------------------------//
//- Connection to Database -// 
//--------------------------//
const db = require('./lib/connection.js')



//---------------------------//
//- Prompts to the end user -//
//---------------------------//

function launch() {
    inquirer
        .prompt(mainMenu)

        .then ((answers) => {
            switch (answers.mainmenu) {
            //- View all departments -//
                case "viewDepartments": viewDepartments()
                break;
            //- View all roles -//
                case "viewRoles": viewRoles()
                break;
            //- View all employees -//
                case "viewEmployees": viewEmployees()                   
                break;
            //- Add department -//
                case "addDepartment": addDepartment()                           
                break;
            //- Add role -//
                case "addRole": addRole()
                break;
            //- Add employee -//
                // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                // first_name VARCHAR(30) NOT NULL,
                // last_name VARCHAR(30) NOT NULL,
                // role_id INT, - which role
                // manager_id - which manager
                case "addEmployee":
                    console.log("  **addEmployee**")  
                    return launch()
                break;
            //- Update employee -//
                // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                // first_name VARCHAR(30) NOT NULL,
                // last_name VARCHAR(30) NOT NULL,
                // role_id INT, - which role
                // manager_id - which manager
                case "updateEmployee":
                    console.log("  **updateEmployee**")  
                    return launch()
                break;
            //- Quit -//
                case "quit": 
                    console.log("Thanks for visiting!")
                    process.exit()
                    return;
                break;
            }
        })
        .catch ((err) => {
            console.log(err)
        });
}


//-------------//
//- Functions -//
//-------------//

//-----------------------------------//
//- Function - View all departments -//
//-----------------------------------//

const viewDepartments = () => {
    db.query('SELECT * FROM department', async function (err, results) {    
        try{
            const query = await console.log(`\x1b[33m   **View all Departments**\x1b[0m`);
            const show = await console.table(results)
            const startagain = await launch();
        }
        catch (err) {
            console.log(err)
        }
    })
};

//-----------------------------//
//- Function - View all roles -//
//-----------------------------//

const viewRoles = () => {
    db.query('SELECT * FROM role', async function (err, results) {
        try{
            const query = await console.log(`\x1b[33m   **View all Roles**\x1b[0m`);
            const show = await console.table(results)
            const startagain = await launch();
        }
        catch (err) {
            console.log(err)
        }
    })
};

//---------------------------------//
//- Function - View all employees -//
//---------------------------------//

const viewEmployees = () => {
    db.query('SELECT * FROM employee', async function (err, results) {
        try{
            const query = await console.log(`\x1b[33m   **View all Employees**\x1b[0m`);
            const show = await console.table(results)
            const startagain = await launch();
        }
        catch (err) {
            console.log(err)
        }
    })
}

//---------------------------------//
//- Function - Add new Department -//
//---------------------------------//

const addDepartment = async () => {
    console.log(`\x1b[33m   **Add New Department**\x1b[0m`);
    inquirer
        .prompt ([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Please enter the new Department name'
            }
        ]).then ((answers) => {
            db.query('INSERT INTO department (name) VALUES (?)', answers.newDepartment, async function (err, result) {
                try{                                    
                    const show = await console.log(`\x1b[33m   ** ${answers.newDepartment} added successfully**\x1b[0m`)
                    const startagain = await launch();
                }
                catch (err) {
                    console.log(err)
                }
            })
        }) 
};

//---------------------------//
//- Function - Add new Role -//
//---------------------------//
    // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    // title VARCHAR(30) NOT NULL,
    // salary DECIMAL,
    // department_id INT, - which department
const addRole = async () => {
    console.log(`\x1b[33m   **Add new Role**\x1b[0m`);
    let arrayDept;

    // Create department constant
    try {
        const response = await db.promise().query(`SELECT id as value, name FROM department;`)   // Pull fresh extract of department
        
        arrayDept = response[0]
        arrayDept.unshift({value: 00, name: 'Create Department'})       

        console.log("Array Dept")
        console.log(arrayDept)

        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "roleDepartment",                
                message: "Which department is this new role in?",
                choices: arrayDept
            },
        ])

        
        let roleDepartment;
        if (answer.roleDepartment === 00) {       // if equal to 'Create Department"
            roleDepartment = await addDepartment();
            } else {
            roleDepartment = answer.roleDepartment;                
        }

        const a = await console.log("roleDepartment:")
        const b = await console.log(roleDepartment)
    } catch (err) {
        console.log(err);
        launch();
    }
};
    


    // inquirer
    //     .prompt ([
    //         {
    //             type: 'input',
    //             name: 'title',
    //             message: 'Title of new Role'
    //         },
    //         {
    //             type: 'input',
    //             name: 'salary',
    //             message: 'Salary of new Role'
    //         },
    //         {
    //             type: 'list',
    //             name: 'department',
    //             message: 'Which department does this role belong in?',
    //             // choices: db.query(`SELECT id AS value, name FROM department;`, async function (err, results) {
    //             //     try{
    //             //         const query = await console.log(`\x1b[33m   **${answers.mainmenu}**\x1b[0m`);
    //             //         const show = await console.table(results)
                //         const startagain = await launch();
                //     }
                //     catch (err) {
                //     console.log(err)
                //     }
//                 // })
//                 // choices: [1, 2, 3]
//                 choices: deptChoice
//             }
//         ]).then ((answers) => {
//             // db.query('INSERT INTO department (name) VALUES (?)', answers.newDepartment, async function (err, result) {
//             //     try{                                    
//             //         const show = await console.log(`\x1b[33m   ** ${answers.newDepartment} added successfully**\x1b[0m`)
//             //         const startagain = await launch();
//             //     }
//             //     catch (err) {
//             //         console.log(err)
//                 // }
//             // })
//             console.log(answers)
//         })                       
// };


//---------------------------------//
//- Call function to the end user -//
//---------------------------------//
launch()
// departmentChoices()
// console.log ("Returned")
// console.log(deptChoice)
