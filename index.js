//--------------------------//
//- Required packages/inks -// 
//--------------------------//
const inquirer = require('inquirer');

// const queries = require('./lib/server.js')
const mainMenu = require ('./lib/mainMenu.js')    


//-------------//
//- Variables -// 
//-------------//

let arrayDept;       // array of departments available (used in creating new role)
let roleDeptValue;   // new Role department value (used in creating new role)
let addDeptCalledByAddRole = 0; // indicator to determine if addDepartment function was called by addRole

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
                case "addEmployee": addEmployee()                
                break;
            //- Update employee -//
                case "updateEmployee": updateEmployee()
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
    try {
        console.log(`\x1b[33m   **Add New Department**\x1b[0m`);
        const answers = await inquirer.prompt ([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Please enter the new Department name:'
            }
        ])
        db.query('INSERT INTO department (name) VALUES (?)', answers.newDepartment, async (err, result) => {
            try{                                    
                const show = await console.log(`\x1b[33m\n   ** New departemnt "${answers.newDepartment}" added successfully**\x1b[0m`)
                roleDeptValue = await result.insertId
                const log = await console.log (roleDeptValue)
                if (addDeptCalledByAddRole === 1) {         // Check if addDepartment was called by Add Role - if yes then change addDpetCalledByAddRole to zero and return to add Role 
                    addDeptCalledByAddRole = 0;
                    return (roleDeptValue)}
                else {const startagain = await launch();}   // Else, go back to main menu (call launch())             
            }
            catch (err) {
                console.log(err)
            }
        })
    }catch (err) {
        console.log(err)
    };
    console.log ("addDepartment finished executing")
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

    // Create department constant
    try {
        const response = await db.promise().query(`SELECT id as value, name FROM department;`)                    // Pull fresh extract of department
        
        arrayDept = response[0]                                                                                   // set ArrayDept to equal reponse index value zero
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
                
        if (answer.roleDepartment === 0) {              // if equal to 'Create Department"
            console.log ("roleDepartment === 0, calling add Department")
            addDeptCalledByAddRole = 1                  // Set "addDeptCalledbyAddRole = 1" to indicate YES
            console.log (`addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)
            roleDeptValue = await addDepartment();     // call Add department function
        } else if (answer.roleDepartment === -1) {      // Back to main menu
            console.log ("roleDepartment === -1, Back to main menu")
            await launch();
            return;
        } else {
            console.log ("roleDepartment is good value, existing department")
            roleDeptValue = answer.roleDepartment;     // use department value provided           
        }
        
        // Ask for the rest of the values for the role//
        const answers = await inquirer.prompt ([
            {
                type: 'input',
                name: 'title',
                message: 'What is the Title of the Role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the Salary of the Role?'
            }
        ])
        // Insert the record into the role table//
        await db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, roleDeptValue]);
        console.log(`\x1b[33m\n   **New Role "${answers.title}" added successfully**\x1b[0m`)   
        const startagain = await launch();    
    } catch (err) {
        console.log(err);
        
    }
};

//-------------------------------//
//- Function - Add new Employee -//
//-------------------------------//
// id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
// first_name VARCHAR(30) NOT NULL,
// last_name VARCHAR(30) NOT NULL,
// role_id INT, - which role
// manager_id - which manager





const addEmployee = async () => {}




//-------------------------------//
//- Function - Update Employee -//
//-------------------------------//

// id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
// first_name VARCHAR(30) NOT NULL,
// last_name VARCHAR(30) NOT NULL,
// role_id INT, - which role
// manager_id - which manager


//---------------------------------//
//- Call function to the end user -//
//---------------------------------//
launch()
// departmentChoices()
// console.log ("Returned")
// console.log(deptChoice)
