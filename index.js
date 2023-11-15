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
let addDeptCalledByAddRole = 0;             // indicator to determine if addDepartment function was called by addRole
let addRoleCalledByAddEmployee = 0;         // indicator to determine if addRole function was called by addEmployee
let viewEmpCalledByUpdateEmp = 0;           // indicator to determine if viewEmployee function was called by updateEmployee

//--------------//
//- Global SQL -//
//--------------//
let requestDeptSalarySQL = "";              // Used by viewTotalSalaryDept to set up SQL to view All department vs One department
const requestRoleInquirerSQL =              // SQL to pull all Role in an array suitable for inquirer
`
SELECT 
CONCAT("● \x1b[90m Role ID = \x1b[33m", r.id,"\x1b[0m\x1b[90m, Role = \x1b[0m\x1b[32m",r.title,"\x1b[0m\x1b[90m, Salary = \x1b[0m\x1b[36m$ ",r.salary,"\x1b[0m\x1b[90m, Dept = \x1b[0m\x1b[32m",d.name,"\x1b[0m") as name,
r.id as value
FROM role r
LEFT JOIN department d ON r.department_id = d.id
`

const requestEmployeeInquirerSQL =          // SQL to pull all Role in an array suitable for inquirer
`
SELECT 
CONCAT("● \x1b[90m ID = \x1b[33m", e1.id,"\x1b[0m\x1b[90m, Name = \x1b[0m\x1b[32m",e1.last_name,"\x1b[0m\x1b[90m, \x1b[0m\x1b[32m",e1.first_name,"\x1b[0m") as name,
e1.id as value
FROM employee e1
LEFT JOIN role r ON e1.role_id = r.id
LEFT JOIN department d ON r.department_id = d.id
LEFT JOIN employee e2 ON e1.manager_id = e2.id;
`

const requestDepartmentInquirerSQL =          // SQL to pull all Department in an array suitable for inquirer
`
SELECT 
CONCAT("● \x1b[90m ID = \x1b[33m", d.id,"\x1b[0m\x1b[90m, Name = \x1b[0m\x1b[32m",d.name,"\x1b[0m") as name,
d.id as value
FROM department d

`


//---------------------------//
//- Prompts to the end user -//
//---------------------------//

function launch() {
    console.log("");
    console.log(`\x1b[31m  ┌───────────┐\x1b[0m`);
    console.log(`\x1b[31m  │ Main Menu │\x1b[0m`);
    console.log(`\x1b[31m  └───────────┘\x1b[0m`); 
    inquirer
        .prompt(mainMenu)

        .then ((answers) => {
            switch (answers.mainmenu) {
            //- View all Departments -//
                case "viewDepartments": viewDepartments()
                break;
            //- View all Roles -//
                case "viewRoles": viewRoles()
                break;
            //- View all Employees -//
                case "viewEmployees": viewEmployees()                   
                break;
            //- View all Employees By Manager -//
                case "viewEmployeesByManager": viewEmployeesByManager()         // To create            
                break;
            //- View all Employees By Department -//
                case "viewEmployeesByDepartment": viewEmployeesByDepartment()   // To Create                   
                break;
            //- View total Salary for Department -//
                case "viewTotalSalaryDept": viewTotalSalaryDept()               // To Create       
                break;
            //- Add Department -//
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
            //- Delete Department -//
                case "deleteDepartment": deleteDepartment()                     // To Create
                break;
            //- Delete Role -//
                case "deleteRole": deleteRole()                                 // To Create
                break;
            //- Delete Employee -//
                case "deleteEmployee": deleteEmployee()                         // To Create
                break;
            //- Quit -//
                case "quit": 
                    console.log("");
                    console.log(`\x1b[31m  ┌─────────────────────────┐\x1b[0m`);
                    console.log(`\x1b[31m  │ Thanks for dropping by! │\x1b[0m`);
                    console.log(`\x1b[31m  └─────────────────────────┘\x1b[0m`);
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
        const typeofViewDept = await inquirer.prompt ([
            {
                type: 'list',
                name: 'typeOfView',
                message: 'What type of Department View would you like?',
                choices: [
                    {name: 'Summary of Departments', value: 0},
                    {name: 'Detailed record of Departments', value: 1}
                ]
            }
        ])

        if (typeofViewDept.typeOfView === 0) {
            const response = await db.promise().query(`SELECT * FROM department;`)
            console.log("");
            console.log(`\x1b[35m  ┌────────────────────────────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ Viewing Summary of all Departments │\x1b[0m`);
            console.log(`\x1b[35m  └────────────────────────────────────┘\x1b[0m`); 
            console.table(response[0])
        } else {
            viewAllDeptSQL = `
            SELECT 
            d.id as Department_ID,
            d.name AS Department,r.title AS Role,
            r.salary AS Salary,
            CONCAT(e.last_name,", ",e.first_name) as Employee,
            CONCAT(m.last_name,", ",m.first_name) as Manager
            FROM department d
            LEFT JOIN role r ON d.id = r.department_id
            LEFT JOIN employee e ON r.id = e.role_id
            LEFT JOIN employee m ON e.manager_id = m.id;
            `
            const response = await db.promise().query(viewAllDeptSQL)
            console.log("");
            console.log(`\x1b[35m  ┌────────────────────────────────────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ Viewing Detailed record of all Departments │\x1b[0m`);
            console.log(`\x1b[35m  └────────────────────────────────────────────┘\x1b[0m`); 
            console.table(response[0])
        }
        
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
        r.salary AS Role_Salary,
        r.id AS Role_ID
        FROM role r
        LEFT JOIN department d ON r.department_id = d.id
        ORDER BY d.name, r.salary DESC;
        `
        const response = await db.promise().query(roleSQL)
            console.log("");
            console.log(`\x1b[35m  ┌────────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ View all Roles │\x1b[0m`);
            console.log(`\x1b[35m  └────────────────┘\x1b[0m`);                  
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
        const employeeSQL =        
        `
        SELECT 
        e1.id as Employee_ID,
        CONCAT(e1.last_name,", ",e1.first_name) as Name,
        d.name AS Department,
        r.title AS Role,
        r.salary AS Salary,
        CONCAT(e2.last_name,", ",e2.first_name) as Manager
        FROM employee e1
        LEFT JOIN role r ON e1.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id;
        `
        const response = await db.promise().query(employeeSQL)
            console.log("");   
            console.log(`\x1b[35m  ┌────────────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ View all Employees │\x1b[0m`);
            console.log(`\x1b[35m  └────────────────────┘\x1b[0m`);         
            console.table(response[0])

            if (viewEmpCalledByUpdateEmp === 1) {       // if viewEmployees was called by UpdateEmployee then return there
                viewEmpCalledByUpdateEmp = 0                // set flag to zero
                return                                      // return to function to continue
            } else {
                launch();                               // if not called by upDate Employee then return to mainMenu.
            }    
    }
    catch (err) {
        console.log(err)
    }    
}

//---------------------------------//
//- Function - Add New Department -//
//---------------------------------//

const addDepartment = async () => {
    console.log("");
    console.log(`\x1b[35m  ┌────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Add New Department │\x1b[0m`);
    console.log(`\x1b[35m  └────────────────────┘\x1b[0m`);
    try {
        const answers = await inquirer.prompt ([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Please enter the new Department name:'
            }
        ])
        
        await db.promise().query('INSERT INTO department (name) VALUES (?)', answers.newDepartment);        
        console.log(`\x1b[33m\n   ⭐ New departemnt "${answers.newDepartment}" added successfully ⭐\x1b[0m \n`) 
                
        const showNewDept = await db.promise().query('SELECT id as Department_ID, name as Department_Name FROM department WHERE name = ?', answers.newDepartment);        
        console.table (showNewDept[0])
        if (addDeptCalledByAddRole === 1) {         // Check if addDepartment was called by Add Role - if yes then change addDpetCalledByAddRole to zero and return to add Role 
            // console.log(`if statement addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)
            return (answers.newDepartment);
        } else {
            // console.log("addDepartment calling MainMenu")
            // console.log(`else addDeptCalledByAddRole = ${addDeptCalledByAddRole}`)
            launch();      // Go back to main menu (call launch())             
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
    console.log("");
    console.log(`\x1b[35m  ┌──────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Add New Role │\x1b[0m`);
    console.log(`\x1b[35m  └──────────────┘\x1b[0m`);   
    // Create department constant
    try {
        const allDepartmentQuery = await db.promise().query(`SELECT * FROM department;`)                    // Pull fresh extract of department
            const arrayDept = allDepartmentQuery[0]                                                                                   // set ArrayDept to equal reponse index value zero
            arrayDept.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'}, {value: 0, name: ' \x1b[32m＋\x1b[0m Create New Department for this Role'})       // return to main menu and create department options
            // console.log("Array Dept")
            // console.log(arrayDept)

        const answer = await inquirer.prompt([                                  // ask the user which department they want to add to
            {
                type: "list",
                name: "roleDepartment",                
                pageSize: 12,
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
            return(-1)            
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
                message: 'What is the Salary of this new Role?',
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return false, "please enter valid number";  
                    } return true;
                }
            }
        ])
        // Insert the record into the role table//
        const roleDeptIdRes =  await db.promise().query('SELECT * FROM department WHERE name = ?', roleDept)
            // console.log (roleDeptIdRes)
            // console.log (roleDeptIdRes[0][0].id)
            const roleDeptId = roleDeptIdRes[0][0].id;

        await db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, roleDeptId]);
            console.log(`\x1b[33m\n   ⭐ New Role "${answers.title}" added successfully ⭐\x1b[0m \n`)
        
            //Log freshly created role for user to see - utilising maximum ID value on role table (Max = newest)
        let showNewRoleSQL = `
        SELECT 
        r.id AS Role_ID,
        r.title AS Role_Title,
        r.salary AS Role_Salary,
        d.name AS Department_Name
        FROM role r            
        LEFT JOIN department d ON r.department_id = d.id
        WHERE r.id = (SELECT MAX(r.id) FROM role r);
        `
        const showNewRoleQuery = await db.promise().query(showNewRoleSQL);        
        console.table (showNewRoleQuery[0])

            // console.log("Role calling MainMenu")
        if (addRoleCalledByAddEmployee === 1) {
            addRoleCalledByAddEmployee = 0  // set value to zero
            return (answers.title)  // return the role_title
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
    console.log("");
    console.log(`\x1b[35m  ┌──────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Add New Employee │\x1b[0m`);
    console.log(`\x1b[35m  └──────────────────┘\x1b[0m`);    
    try{
        // Extract Role table and store in arrayRole (for use in inquirer choices)
        const responseRoleQuery = await db.promise().query(`SELECT id as value, title AS name FROM role;`)                                               // Pull fresh extract of Roles
            const arrayRole = responseRoleQuery[0]                                                                                                             // set arrayRole to equal reponse index value zero
            arrayRole.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'}, {value: 0, name: ' \x1b[32m＋\x1b[0m Create New Role for this Employee'})   // add options to return to main menu and create department options
            // console.log("Array Role")
            // console.log(arrayRole)

        // Extract employee table and store in arrayManager (for use in inquirer choices)
        const responseManager = await db.promise().query(`SELECT id as value, CONCAT(last_name,", ", first_name) as name FROM employee;`)           // Pull fresh extract of employee
            arrayManager = responseManager[0]                                                                                                       // set arrayManager to equal reponse index value zero
            arrayManager.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'})                                                           // add option to return to main menu option
            // console.log("Array Manager")
            // console.log(arrayManager)

        //Ask questions about employee Name
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

        //Ask question about employee Role    
        const employeeRole = await inquirer.prompt ([
            {
                type: 'list',
                name: 'role',
                pageSize: 12,
                message: "Please select the role of the new Employee",
                choices: arrayRole
            }
        ]);
        
        //Check response to role - cancel and return to main menu, add new role, proceed ahead)
        let employeeRoleID = employeeRole.role  
        if (employeeRoleID === -1) {                                                    // Cancel and retrun to main menu
            // console.log (`employeeRole.role = ${employeeRoleID} - return to main menu`)
            launch();
            return;
        } else     
        if (employeeRoleID === 0) {                                                                                     // Create new Role for this employee
            // console.log (`employeeRoleID = ${employeeRoleID} - create role`)
            addRoleCalledByAddEmployee = 1                                                                                  // Flags that addRole was called by addEmployee function (used by addRole() to either return a value or go back to main manui)
            let employeeNewRole = await addRole();                                                                          // Create new Role and return the title of new Role stored as employeeNewRole
                if (employeeNewRole === -1) {                                                                                       // The returned value is "-1" if the user cancels out of addRole, this if statement is necessary to terminate end the addEmployee functions from continuing to execute any await functions the next time the use attempts to addRole
                    return;
                } else {
                console.log (employeeNewRole) 
                const employeeNewRoleID = await db.promise().query('SELECT id from role WHERE title = ?', employeeNewRole)      // Run Query to pull ID of new Role and store as employeeNewRoleID
                employeeRoleID = employeeNewRoleID[0][0].id                                                                     // assign new Role ID to employeeRoleID 
                }// console.log (`employeeRoleID = ${employeeRoleID} - (after creating new role)`)
        } else {                                                                                                        // Proceed as normal
            // console.log (`employeeRoleID = ${employeeRoleID} - keep going`)
        }
        
        //Ask question about manager//
        const employeeManager = await inquirer.prompt ([
            {
                type: 'list',
                name: 'manager',
                pageSize: 12,
                message: "Please select the manager of the new Employee",
                choices: arrayManager
            },
        ])

        if (employeeManager.manager === -1) {               // Cancel and retrun to main menu
            launch();
            return;                      
        } else {            
            // console.log (`employeeRoleID = ${employeeRoleID} - keep going`)
        }
            // console.log (`firstName = ${employeeName.firstName}`)
            // console.log (`lastName = ${employeeName.lastName}`)
            // console.log (`role = ${employeeRoleID}`)
            // console.log (`manager = ${employeeManager.manager}`)

            await db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeName.firstName, employeeName.lastName, employeeRoleID, employeeManager.manager]);
            console.log(`\x1b[33m\n   ⭐ New employee "${employeeName.firstName} ${employeeName.lastName}" added successfully ⭐\x1b[0m \n`) 
            
            // Show new employee by MAX employee ID value
            const showNewEmployeeSQL =`
            SELECT 
            e1.id AS Employee_ID,
            e1.first_name AS First_Name,
            e1.last_name AS Last_Name,
            d.name AS Department,
            r.title AS Role,
            r.salary AS Salary,
            e2.first_name AS Manager_First_Name,
            e2.last_name AS Manager_Last_Name
            FROM employee e1
            LEFT JOIN role r ON e1.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee e2 ON e1.manager_id = e2.id                
            WHERE e1.id = (SELECT MAX(e1.id) FROM employee e1);
            `
            const showNewEmployee = await db.promise().query(showNewEmployeeSQL);
            console.table (showNewEmployee[0]);

            // console.log("Role calling MainMenu")
            launch();    

    } catch (err) {
    console.log(err);
    
    }
}




//-------------------------------//
//- Function - Update Employee -//
//-------------------------------//

const updateEmployee = async () => {    
    console.log("")
    console.log(`\x1b[35m  ┌────────────────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Update Employee (Role/Manager) │\x1b[0m`);
    console.log(`\x1b[35m  └────────────────────────────────┘\x1b[0m`);    

    try{
    // Work out which employee the user wants to update and whether they want to update Role or Manager
        // Display current employees for the user to view
        viewEmpCalledByUpdateEmp = 1            // Set flag to indicate view Employes was called by Update Employees (and to return here instead of going back to main menu)                 
        await viewEmployees();                  // request extract of employees via viewEmployees function                

        // SQL query requested
        const requestEmployeeInquirer = await db.promise().query(requestEmployeeInquirerSQL)           // Pull fresh extract of employee (requestEmployeeInquirerSQL is global const)
        // Emplopyee array created
        employeeInquirer = requestEmployeeInquirer[0]                                       // Set array to pull index [0]

        const employeeUpdate = await inquirer.prompt ([
            {
                type: 'list',
                name: 'employee',
                pageSize: 12,
                message: "Please select the EMPLOYEE to update",
                choices: employeeInquirer
            },
        ])

        // Show the user the selected employee 
        const showSelectedEmployeeSQL =`
        SELECT 
        e1.id as Employee_ID,
        CONCAT(e1.last_name,", ",e1.first_name) as Name,
        d.name AS Department,
        r.title AS Role,
        r.salary AS Salary,
        CONCAT(e2.last_name,", ",e2.first_name) as Manager
        FROM employee e1
        LEFT JOIN role r ON e1.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id              
        WHERE e1.id = ?;
        `
        const reqShowSelectedEmployee = await db.promise().query(showSelectedEmployeeSQL,employeeUpdate.employee);
        console.table (reqShowSelectedEmployee[0]);                                                                     // this is the selected employee_ID

        const employeeUpdateWhat = await inquirer.prompt ([
            {
                type: 'list',
                name: 'updateWhat',
                pageSize: 12,
                message: "What would you like to update?",
                choices: [
                    {name: "Role", value: "role"},
                    {name: "Manager", value: "manager"}
                ]
            }
        ])

        if (employeeUpdateWhat.updateWhat === "role") {
            console.log("")
            console.log(`\x1b[35m  ┌─────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ Update Role │\x1b[0m`);
            console.log(`\x1b[35m  └─────────────┘\x1b[0m`);   
        
            // Show user the Roles avaialable
            const requestRoleSQL = `
            SELECT 
            r.id as Role_ID,
            r.title as Title,
            r.salary as Salary,
            d.name as Department
            FROM role r
            LEFT JOIN department d ON r.department_id = d.id
            `
            // SQL query requested
            const requestRole = await db.promise().query(requestRoleSQL)           // Pull fresh extract of role
            roleArray = requestRole[0]                                               // Set array to pull index [0]
            console.table(roleArray)                    // Show role table to user

            // SQL query requested
            const requestRoleInquirer = await db.promise().query(requestRoleInquirerSQL);           // Pull fresh extract of employee  (requestRoleInquirerSQL is global const)          
            let roleInquirer = requestRoleInquirer[0];                                 // Role array "roleInquirer" created           
            //Inquirer prompt
            const roleWhich = await inquirer.prompt ([
                {
                    type: 'list',
                    name: 'role',
                    pageSize: 12,
                    message: "Select the NEW ROLE for the employee:",
                    choices: roleInquirer
                },
            ]);

            // Update the record
            const updateRoleSQL = 
            `
            UPDATE employee
            SET role_id = ?
            WHERE id = ?;
            `
            await db.promise().query(updateRoleSQL, [roleWhich.role, reqShowSelectedEmployee[0][0].Employee_ID]);
            console.log(`\x1b[33m\n   ⭐ Role updated successfully! ⭐\x1b[0m \n`);
            
        };
        if (employeeUpdateWhat.updateWhat === "manager") {
            console.log("");
            console.log(`\x1b[35m  ┌────────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ Update Manager │\x1b[0m`);
            console.log(`\x1b[35m  └────────────────┘\x1b[0m`);   
            const managerWhich = await inquirer.prompt ([
                {
                    type: 'list',
                    name: 'manager',
                    pageSize: 12,
                    message: "Select the NEW MANAGER for the employee:",
                    choices: employeeInquirer
                },
            ]);
            // console.log (managerWhich.manager)                                          // This is the employee_id to update into manager_ID column
            
            // Update the employee record to the selected manager
            const updateManagerSQL = 
            `
            UPDATE employee
            SET manager_id = ?
            WHERE id = ?;
            `
            await db.promise().query(updateManagerSQL, [managerWhich.manager, reqShowSelectedEmployee[0][0].Employee_ID] ); 
            console.log(`\x1b[33m\n   ⭐ Manager updated successfully! ⭐\x1b[0m \n`);
        };
        
        // Show updated record to user
        const showSelectedEmployeeAfterUpdateSQL =`
        SELECT 
        e1.id as Employee_ID,
        CONCAT(e1.last_name,", ",e1.first_name) as Name,
        d.name AS Department,
        r.title AS Role,
        r.salary AS Salary,
        CONCAT(e2.last_name,", ",e2.first_name) as Manager
        FROM employee e1
        LEFT JOIN role r ON e1.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id              
        WHERE e1.id = ?;
        `
        const reqShowUpdatedRecord = await db.promise().query(showSelectedEmployeeAfterUpdateSQL,employeeUpdate.employee);
        console.table (reqShowUpdatedRecord[0]); 

        launch();
    } catch (err) {
        console.log(err);        
    };
};

//--------------------//
//- BONUS CONTENT !! -//
//--------------------//

//--------------------------------------------//
//- Function - View all Employees By Manager -//
//--------------------------------------------//

const viewEmployeesByManager = async () => {    
    console.log("")
    console.log(`\x1b[35m  ┌───────────────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ View all Emplopees By Manager │\x1b[0m`);
    console.log(`\x1b[35m  └───────────────────────────────┘\x1b[0m`);    

    try{
        const requestEmployeeInquirer = await db.promise().query(requestEmployeeInquirerSQL);           // Pull fresh extract of employee  (requestRoleInquirerSQL is global const)          
        let employeeInquirer = requestEmployeeInquirer[0];                                 // Role array "roleInquirer" created           
        //Inquirer prompt
        const managerWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'manager',
                pageSize: 12,
                message: "Select the MANAGER you'd like to view Employees under:",
                choices: employeeInquirer
            },
        ]);
        
        const viewEmpByManagerSQL =
        `
        SELECT 
        e.id as Manager_Employee_ID,
        CONCAT(m.last_name,", ",m.first_name) as Manager,
        CONCAT(e.last_name,", ",e.first_name) as Employee,
        r.title AS Role,
        r.salary AS Salary,
        d.name AS Department
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
        WHERE m.id = ?;
        `
        const viewEmpByManager = await db.promise().query(viewEmpByManagerSQL,managerWhich.manager);
        console.table (viewEmpByManager[0]); 



        launch();
    }
    catch (err) {
        console.log(err);        
    };
};

//-----------------------------------------------//
//- Function - View all Employees By Department -//
//-----------------------------------------------//

const viewEmployeesByDepartment = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌──────────────────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ View all Employees By Department │\x1b[0m`);
    console.log(`\x1b[35m  └──────────────────────────────────┘\x1b[0m`);    

    try{
        const requestDepartmentInquirer = await db.promise().query(requestDepartmentInquirerSQL);           // Pull fresh extract of employee  (requestRoleInquirerSQL is global const)          
        let departmentInquirer = requestDepartmentInquirer[0];                                 // Role array "roleInquirer" created           
        //Inquirer prompt
        const deptWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'dept',
                pageSize: 12,
                message: "Select the DEPARTMENT you'd like to view Employees in:",
                choices: departmentInquirer
            },
        ]);
        
        const viewEmpByDeptSQL =
        `
        SELECT 
        d.id as Department_ID,
        d.name AS Department,
        CONCAT(e.last_name,", ",e.first_name) as Employee,
        r.title AS Role,
        r.salary AS Salary,
        CONCAT(m.last_name,", ",m.first_name) as Manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
        WHERE d.id = ?
        `
        const viewEmpByDept = await db.promise().query(viewEmpByDeptSQL,deptWhich.dept);
        console.table (viewEmpByDept[0]); 

        launch();
    }
    catch (err) {
        console.log(err);        
    };
};




//-----------------------------------------------//
//- Function - View total Salary for Department -//
//-----------------------------------------------//

const viewTotalSalaryDept = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌─────────────────────────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ View Total Salary Budget for Department │\x1b[0m`);
    console.log(`\x1b[35m  └─────────────────────────────────────────┘\x1b[0m`);    

    try{
        const requestDepartmentInquirer = await db.promise().query(requestDepartmentInquirerSQL);               // Pull fresh extract of department
        let departmentInquirer = requestDepartmentInquirer[0];                                                   // Department array 
        departmentInquirer.unshift({value: 'all', name: ' \x1b[31m∑\x1b[0m  Show summary for all Departments'})   // add options to Summarise Salary total for all departments
        //Inquirer prompt
        const deptWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'dept',
                pageSize: 12,
                message: "Select the DEPARTMENT you'd like to view total SALARY in:",
                choices: departmentInquirer
            },
        ]);
        // console.log  (deptWhich.dept)        
        if (deptWhich.dept === 'all') {
            requestDeptSalarySQL =
            `
            SELECT 
            d.id as Department_ID,
            d.name AS Department,
            SUM(r.salary) as Salary
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            GROUP BY d.id;
            `
        } else {
            requestDeptSalarySQL =
            `
            SELECT 
            d.id as Department_ID,
            d.name AS Department,
            SUM(r.salary) as Salary
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE d.id = ?;
            ` 
        }

        const requestDeptSalary = await db.promise().query(requestDeptSalarySQL,deptWhich.dept);
        console.table (requestDeptSalary[0]); 

        launch();
    }
    catch (err) {
        console.log(err);        
    };
};

//--------------------------------//
//- Function - Delete Department -//
//--------------------------------//

const deleteDepartment = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌───────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Delete Department │\x1b[0m`);
    console.log(`\x1b[35m  └───────────────────┘\x1b[0m`);    

    try{
        const requestDepartmentInquirer = await db.promise().query(requestDepartmentInquirerSQL);               // Pull fresh extract of department
        let departmentInquirer = requestDepartmentInquirer[0];                                                   // Department array 
        
        //Inquirer prompt
        const deptWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'dept',
                pageSize: 12,
                message: "Select the DEPARTMENT you'd like to view total SALARY in:",
                choices: departmentInquirer
            },
        ]);
        
        //Show user the record being deleted
        const deleteDeptSelected = await db.promise().query("SELECT id as Department_ID, name as Department_Name FROM department WHERE id = ?", deptWhich.dept);
        console.table (deleteDeptSelected[0])
        // console.log (deleteDeptSelected[0][0].Department_Name)

        //Are you sure
        const areYouSure = await inquirer.prompt ([
            {
                type: 'list',
                name: 'sure',
                pageSize: 12,
                message: "Are you sure you want to delete this department? This cannot be reversed",
                choices: [
                    {name: 'Yes', value: 1},
                    {name: 'No, please cancel this request', value: 0}
                ]
            },
        ]);

        if (areYouSure.sure === 1) {
            console.log(`\x1b[33m\n   ⭐ "${deleteDeptSelected[0][0].Department_Name}" deleted successfully! ⭐\x1b[0m \n`);
            const deleteDeptSQL =
            `
            DELETE FROM department
            where id = ?
            ` 
            const deleteDept = await db.promise().query(deleteDeptSQL,deptWhich.dept);
           
            launch();
        } else {
            launch();
        }

    }
    catch (err) {
        console.log(err);        
    };
};


//--------------------------//
//- Function - Delete Role -//
//--------------------------//

const deleteRole = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌─────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Delete Role │\x1b[0m`);
    console.log(`\x1b[35m  └─────────────┘\x1b[0m`);    

    try{



        launch();
    }
    catch (err) {
        console.log(err);        
    };
};

//------------------------------//
//- Function - Delete Employee -//
//------------------------------//

const deleteEmployee = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌─────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Delete Employee │\x1b[0m`);
    console.log(`\x1b[35m  └─────────────────┘\x1b[0m`);    

    try{



        launch();
    }
    catch (err) {
        console.log(err);        
    };
};



//---------------------------------//
//- Call function to the end user -//
//---------------------------------//
launch()



