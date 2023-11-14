//--------------------------//
//- Required packages/inks -// 
//--------------------------//
const inquirer = require('inquirer');
const mainMenu = require ('./lib/mainMenu.js')    
//--------------------------//
//- Connection to Database -// 
//--------------------------//
const db = require('./lib/connection.js')

//--------------------//
//- Global Variables -// 
//--------------------//

let arrayDept;                      // array of departments available (used in creating new role)
// let roleDept;                  // new Role department value (used in creating new role)
let addDeptCalledByAddRole = 0;     // indicator to determine if addDepartment function was called by addRole

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

const viewDepartments = async () => {
    try{
        const response = await db.promise().query('SELECT * FROM department')
            console.log(`\x1b[33m\n   ** View all Departments **\x1b[0m \n`);
            console.table(response[0])
            launch();
    }
    catch (err) {
        console.log(err)
    }
};

//-----------------------------//
//- Function - View all roles -//
//-----------------------------//

const viewRoles = async () => {
    try{
        const roleSQL = `
        SELECT 
        d.name AS Department_Name,
        r.title AS Role_Title,
        r.salary AS Role_Salary
        FROM role r
        JOIN department d ON r.department_id = d.id
        ORDER BY d.name, r.salary DESC;
        `
        const response = await db.promise().query(roleSQL)
            console.log(`\x1b[33m\n   ** View all Roles **\x1b[0m \n`);
            console.table(response[0])
            launch();
    }
    catch (err) {
        console.log(err)
    }
};

//---------------------------------//
//- Function - View all employees -//
//---------------------------------//

const viewEmployees = async() => {    
    try{
        const employeeSQL =`
        SELECT 
        d.name AS Department_Name,
        r.title AS Role_Title,
        e1.first_name AS First_name,
        e1.last_name AS Last_name,
        r.salary AS Role_Salary,
        e2.first_name AS Manager_First_Name,
        e2.last_name AS Manager_Last_Name
        FROM employee e1
        JOIN role r ON e1.role_id = r.id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id    
        ORDER BY d.name, r.salary DESC;
        `
        const response = await db.promise().query(employeeSQL)         
            console.log(`\x1b[33m\n   ** View all Employees **\x1b[0m \n`);
            console.table(response[0])
            launch();
    }
    catch (err) {
        console.log(err)
    }    
}

// const viewEmployees = async() => {
//     db.query('SELECT * FROM employee', async function (err, results) {
//         try{
//             const query = await console.log(`\x1b[33m\n   ** View all Employees **\x1b[0m \n`);
//             const show = await console.table(results)
//             const startagain = await launch();
//         }
//         catch (err) {
//             console.log(err)
//         }
//     })
// }

// const addRole = async () => {
//     console.log(`\x1b[33m\n   **Add new Role**\x1b[0m \n`);

//     // Create department constant
//     try {
//         const response = await db.promise().query(`SELECT * FROM department;`)                    // Pull fresh extract of department
//             arrayDept = response[0]                                                                                   // set ArrayDept to equal reponse index value zero
//             arrayDept.unshift({value: -1, name: ' ↻  Back to main Menu'}, {value: 0, name: ' ＋ Create New Department for this Role'})       // return to main menu and create department options
//             console.log("Array Dept")
//             console.log(arrayDept)

//---------------------------------//
//- Function - Add New Department -//
//---------------------------------//

const addDepartment = async () => {
    // console.log(`add Department addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)
    try {
        console.log(`\x1b[33m\n   **Add New Department**\x1b[0m \n`);
        // console.log(`1st try addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)
        const answers = await inquirer.prompt ([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Please enter the new Department name:'
            }
        ])
        
        await db.promise().query('INSERT INTO department (name) VALUES (?)', answers.newDepartment);
        
        console.log(`\x1b[33m\n   ** New departemnt "${answers.newDepartment}" added successfully **\x1b[0m \n`)        
        if (addDeptCalledByAddRole === 1) {         // Check if addDepartment was called by Add Role - if yes then change addDpetCalledByAddRole to zero and return to add Role 
            // console.log(`if statement addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)
            return (answers.newDepartment);        }
        else {
            // console.log("addDepartment calling MainMenu")
            // console.log(`else addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)
            const startagain = await launch();      // Go back to main menu (call launch())             
        }   
    }catch (err) {
        console.log(err)
    };    
};

//---------------------------//
//- Function - Add new Role -//
//---------------------------//
    // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    // title VARCHAR(30) NOT NULL,
    // salary DECIMAL,
    // department_id INT, - which department

const addRole = async () => {
    console.log(`\x1b[33m\n   **Add new Role**\x1b[0m \n`);

    // Create department constant
    try {
        const response = await db.promise().query(`SELECT * FROM department;`)                    // Pull fresh extract of department
            arrayDept = response[0]                                                                                   // set ArrayDept to equal reponse index value zero
            arrayDept.unshift({value: -1, name: ' ↻  Back to main Menu'}, {value: 0, name: ' ＋ Create New Department for this Role'})       // return to main menu and create department options
            console.log("Array Dept")
            console.log(arrayDept)

        const answer = await inquirer.prompt([                                  // ask the user which department they want to add to
            {
                type: "list",
                name: "roleDepartment",                
                message: "Which department does this role sit under?",
                choices: arrayDept
            },
        ])
        
        if (answer.roleDepartment === 0) {                                      // if user selects 'Create New Department"
            // console.log ("roleDepartment === 0, calling add Department")
            addDeptCalledByAddRole = 1                                          // Set "addDeptCalledbyAddRole = 1" to indicate YES
            // console.log(`addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)                             
            roleDept = await addDepartment();                                   // call Add department function
        } else if (answer.roleDepartment === -1) {                              // if users selects "Back to main menu"
            // console.log ("roleDepartment === -1, Back to main menu")
            launch();
            return;
        } else {                                                                // if user selects an existing department
            // console.log ("roleDepartment is good value, existing department") 
            roleDept = answer.roleDepartment;      
        }

        // Ask for the rest of the values for the role//
        const answers = await inquirer.prompt ([
            {
                type: 'input',
                name: 'title',
                message: 'What is the Title of this new Role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the Salary of this new Role?'
            }
        ])
        // Insert the record into the role table//
        const roleDeptIdRes =  await db.promise().query('SELECT * FROM department WHERE name = ?', roleDept)
            // console.log (roleDeptIdRes)
            // console.log (roleDeptIdRes[0][0].id)
            const roleDeptId = roleDeptIdRes[0][0].id;

        await db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, roleDeptId]);
            console.log(`\x1b[33m\n   ** New Role "${answers.title}" added successfully **\x1b[0m \n`)   
            // console.log("Role calling MainMenu")
            launch();    
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


const addEmployee = async () => {
    console.log(`\x1b[33m\n   **Add new Employee**\x1b[0m \n`); 

}




//-------------------------------//
//- Function - Update Employee -//
//-------------------------------//

// id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
// first_name VARCHAR(30) NOT NULL,
// last_name VARCHAR(30) NOT NULL,
// role_id INT, - which role
// manager_id - which employee_id is their manager


//---------------------------------//
//- Call function to the end user -//
//---------------------------------//
launch()
// departmentChoices()
// console.log ("Returned")
// console.log(deptChoice)
