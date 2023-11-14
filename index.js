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
        
        arrayDept = response[0]                                                                 //set ArrayDept to equal reponse index value zero
        arrayDept.unshift({value: -1, name: ' ↻ Back to main Menu'}, {value: 0, name: 'Create Department'})       // return to main menu and create department options
        
        console.log("Array Dept")
        console.log(arrayDept)

        const answer = await inquirer.prompt([                  // ask the user which department they want to add to
            {
                type: "list",
                name: "roleDepartment",                
                message: "Which department is this new role in?",
                choices: arrayDept
            },
        ])

        //Turn this if statement into a proper async/await so that the next process waits for it

        let roleDeptValue;
        
        
        if (await answer.roleDepartment === 0) {              // if equal to 'Create Department"
            roleDeptValue = await addDepartment();     // call Add department function
        } else if (await answer.roleDepartment === -1) {
            launch();
            return;
        } else {
            roleDeptValue = await answer.roleDepartment;     // use value provided           
        }

        // const a = await console.log("roleDeptValue:")
        // const b = await console.log(roleDeptValue)

        // asks the rest of the questions to gather what's needed for the Role
        // 

        // launch();

    } catch (err) {
        console.log(err);
        
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
