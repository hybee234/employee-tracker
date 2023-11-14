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
let addRoleCalledByAddEmployee = 0; // indicator to determine if addRole function was called by addEmployee

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
            console.log(`\x1b[33m\n              ** View all Employees **\x1b[0m`);
            console.log(`\x1b[33m   ** Sorted by Department_Name and Salary (DESC) **\x1b[0m \n`);
            console.table(response[0])
            launch();
    }
    catch (err) {
        console.log(err)
    }    
}

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
            return (answers.newDepartment);
        } else {
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
            arrayDept.unshift({value: -1, name: ' ↻  Cancel and return to main Menu'}, {value: 0, name: ' ＋ Create New Department for this Role'})       // return to main menu and create department options
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
        if (addRoleCalledByAddEmployee === 1) {
            addRoleCalledByAddEmployee = 0  // set value to zero
            return (answers.title)  // return the role_id (TODO)  <--------------- need to pass freshly created role_id back for storage
        } else {
            launch();
        }            
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
    try{
        const responseRole = await db.promise().query(`SELECT id as value, title AS name FROM role;`)                                                    // Pull fresh extract of role
            arrayRole = responseRole[0]                                                                                                     // set ArrayRole to equal reponse index value zero
            arrayRole.unshift({value: -1, name: ' ↻  Cancel and return to main Menu'}, {value: 0, name: ' ＋ Create New Role for this Employee'})    // return to main menu and create department options
            console.log("Array Role")
            console.log(arrayRole)

        const responseManager = await db.promise().query(`SELECT id as value, CONCAT(last_name,", ", first_name) as name FROM employee;`)                                                    // Pull fresh extract of role
            arrayManager = responseManager[0]                                                                                                     // set ArrayRole to equal reponse index value zero
            arrayManager.unshift({value: -1, name: ' ↻  Cancel and return to main Menu'})    // return to main menu option
            console.log("Array Manager")
            console.log(arrayManager)



        const employeeName = await inquirer.prompt ([
            {
                type: 'input',
                name: 'firstName',
                message: 'Please provide the First Name of the new employee:'                
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Please provide the Last Name of the new employee:'
            } 
        ]);   
            
        const employeeRole = await inquirer.prompt ([
            {
                type: 'list',
                name: 'role',
                message: "Please select the role of the new Employee",
                choices: arrayRole
            }
        ]);
        
        let employeeRoleID = employeeRole.role
        
        if (employeeRoleID === -1) {
            console.log (`employeeRole.role = ${employeeRoleID} - return to main menu`)
            launch();
            return;
        } else
        
        if (employeeRoleID === 0) {
            console.log (`employeeRoleID = ${employeeRoleID} - create role`)
            addRoleCalledByAddEmployee = 1                  // flags that addRole was called by addEmployee function
            employeeNewRole = await addRole();            // employeeRoleID ()

            const employeeNewRoleID = await db.promise().query('SELECT id from role WHERE title = ?', employeeNewRole)

            employeeRoleID = employeeNewRoleID[0][0].id     // assign new Role ID to employee Role ID
            console.log (`employeeRoleID = ${employeeRoleID} - (after creating new role)`)
            
            
        } else {            
            console.log (`employeeRoleID = ${employeeRoleID} - keep going`)
        }
        

        const employeeManager = await inquirer.prompt ([
            {
                type: 'list',
                name: 'manager',
                message: "Please select the manager of the new Employee",
                choices: arrayManager
            },
        ])
        
            console.log (`firstName = ${employeeName.firstName}`)
            console.log (`lastName = ${employeeName.lastName}`)
            console.log (`role = ${employeeRoleID}`)
            console.log (`manager = ${employeeManager.manager}`)

            await db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeName.firstName, employeeName.lastName, employeeRoleID, employeeManager.manager]);
            console.log(`\x1b[33m\n   ** New employee "${employeeName.firstName} ${employeeName.lastName}" added successfully **\x1b[0m \n`)   
            // console.log("Role calling MainMenu")
            launch();    

    } catch (err) {
    console.log(err);
    
    }
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
