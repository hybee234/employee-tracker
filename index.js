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
let addDeptCalledByFunction = 0;            // indicator to determine if addDepartment function was called by a function (and not main menu)
let addRoleCalledByFunction = 0;            // indicator to determine if addRole function was called by a function (and not main menu)
let viewEmpCalledByFunction = 0;            // indicator to determine if viewEmployee function was called by a function (and not main menu)
let viewRoleCalledByFunction = 0;           // indicator to determine if viewRole function was called by a function (and not main menu)
let viewDeptCalledByFunction = 0;           // indicator to determine if viewDept function was called by a function (and not main menu)

//--------------//
//- Global SQL -//
//--------------//
let requestDeptSalarySQL = "";              // Used by viewTotalSalaryDept to set up SQL to view All department vs One department
const requestRoleInquirerSQL =              // SQL to pull all Role in an array suitable for inquirer

`
SELECT 
CONCAT("  ● \x1b[90m Role ID = \x1b[33m", r.id ,"\x1b[0m\x1b[90m, Role = \x1b[0m\x1b[32m", r.title ,"\x1b[0m\x1b[90m, Salary = \x1b[0m\x1b[36m", CONCAT("$",FORMAT(r.salary ,"C")),"\x1b[0m") as name,
r.id as value
FROM role r
`

const requestEmployeeInquirerSQL =          // SQL to pull all Role in an array suitable for inquirer
`
SELECT 
CONCAT("  ● \x1b[90m ID = \x1b[33m", e.id,"\x1b[0m\x1b[90m, Name = \x1b[0m\x1b[32m",e.last_name,"\x1b[0m\x1b[90m, \x1b[0m\x1b[32m",e.first_name,"\x1b[0m") as name,
e.id as value
FROM employee e

`

const requestDepartmentInquirerSQL =          // SQL to pull all Department in an array suitable for inquirer
`
SELECT 
CONCAT("  ● \x1b[90m ID = \x1b[33m", d.id,"\x1b[0m\x1b[90m, Name = \x1b[0m\x1b[32m",d.name,"\x1b[0m") as name,
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
            //- Default -//
                default:
                break;
            };
        })
        .catch ((err) => {
            console.log(err)
        });
};

//-----------------------------------//
//- Function - View all departments -//
//-----------------------------------//

const viewDepartments = async () => {
    try{
        // Inquirer Prompt - Summary or Detailed View
        const typeofViewDept = await inquirer.prompt ([
            {
                type: 'list',
                name: 'typeOfView',
                message: 'What type of Department View would you like?',
                choices: [
                    {name: '  ● Summary view (Departments only)', value: 0},
                    {name: '  ● Detailed view (Departments and associated roles and employees)', value: 1}
                ]
            }
        ])

        // Respond to user choice
        if (typeofViewDept.typeOfView === 0) {      // Summary View
            
            // Query database for SUMMARY view of Dapartments
            const showSummaryDept = await db.promise().query(`SELECT * FROM department;`)

            // Display banner
            console.log("");
            console.log(`\x1b[35m  ┌─────────────────────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ Summary View of Departments │\x1b[0m`);
            console.log(`\x1b[35m  └─────────────────────────────┘\x1b[0m`); 
            
            // Display Summary View to user
            console.table(showSummaryDept[0])
        } else {                                    // Detailed View
            // Query database for DETAILED view of Dapartments
            detailedDeptSQL = `
            SELECT 
            d.id as Department_ID,
            d.name AS Department,r.title AS Role,
            CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
            CONCAT(e.last_name,", ",e.first_name) as Employee,
            CONCAT(m.last_name,", ",m.first_name) as Manager
            FROM department d
            LEFT JOIN role r ON d.id = r.department_id
            LEFT JOIN employee e ON r.id = e.role_id
            LEFT JOIN employee m ON e.manager_id = m.id;
            `
            const showDetailedDept = await db.promise().query(detailedDeptSQL)

            // Display banner
            console.log("");
            console.log(`\x1b[35m  ┌──────────────────────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ Detailed View of Departments │\x1b[0m`);
            console.log(`\x1b[35m  └──────────────────────────────┘\x1b[0m`); 
            
            // Display Detailed View to user
            console.table(showDetailedDept[0])
        }
        
        if (viewDeptCalledByFunction === 1) {       // Value of 1 means viewDepartments() was called by a function
            viewDeptCalledByFunction = 0                // Reset the value to zero
            return                                      // Return back to the function that called viewDepartments()        
        } else {
            launch();                               // Else return to Main Menu 
        }           
    }
    catch (err) {
        console.log(err)
    }
};

//-----------------------------//
//- Function - View all roles -//
//-----------------------------//

const viewRoles = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ View all Roles │\x1b[0m`);
    console.log(`\x1b[35m  └────────────────┘\x1b[0m`);   

    try{
        // Query database for Role records
        const roleSQL = 
        `
        SELECT 
        r.id as Role_ID,
        r.title as Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        d.name as Department
        FROM role r
        LEFT JOIN department d ON r.department_id = d.id
        `
        const response = await db.promise().query(roleSQL)
        
        // Display Role Records
        console.table(response[0])

        // Determine how to close function 
        if (viewRoleCalledByFunction === 1) {       // Value of 1 means viewRoles() was called by a function
            viewRoleCalledByFunction = 0                // Reset the value to zero
            return                                      // Return back to the function that called viewRole()
        } else {
            launch();                               // Else return to Main Menu
        }
    }
    catch (err) {
        console.log(err)
    }
};

//---------------------------------//
//- Function - View all employees -//
//---------------------------------//

const viewEmployees = async() => {    
    console.log("");   
    console.log(`\x1b[35m  ┌────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ View all Employees │\x1b[0m`);
    console.log(`\x1b[35m  └────────────────────┘\x1b[0m`);

    try{
        // Query database for Employee records
        const employeeSQL =        
        `
        SELECT 
        e.id as Employee_ID,
        CONCAT(e.last_name,", ",e.first_name) as Name,
        d.name AS Department,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        CONCAT(m.last_name,", ",m.first_name) as Manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id;
        `
        const response = await db.promise().query(employeeSQL);

        // Display Employee Records
        console.table(response[0]);

        // Determine how to close function 
        if (viewEmpCalledByFunction === 1) {        // Value of 1 means viewEmployees() was called by a function
            viewEmpCalledByFunction = 0                 // Reset the value to zero
            return                                      // Return back to the function that called viewEmployees()
        } else {
            launch();                               // Else return to Main Menu
        }    
    }
    catch (err) {
        console.log(err)
    };    
};

//---------------------------------//
//- Function - Add New Department -//
//---------------------------------//

const addDepartment = async () => {
    console.log("");
    console.log(`\x1b[35m  ┌────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Add New Department │\x1b[0m`);
    console.log(`\x1b[35m  └────────────────────┘\x1b[0m`);
    try {
        // Inquirer Prompt - Department Name
        const deptName = await inquirer.prompt ([
            {
                type: 'input',
                name: 'dept',
                message: 'Please enter the new Department name:'
            }
        ]);

        // Insert New Department into the Detabase
        await db.promise().query('INSERT INTO department (name) VALUES (?)', deptName.dept);        
        
        // Show new Department by MAX department ID value
        const showNewDept = await db.promise().query('SELECT d.id as Department_ID, d.name as Department_Name FROM department d WHERE d.id = (SELECT MAX(d.id) from department d)');        
        console.table (showNewDept[0]);

        // Show success Message
        console.log(`\x1b[33m\n   ⭐ New departemnt "${deptName.dept}" added successfully ⭐\x1b[0m \n`); 

        // Determine how to close function
        if (addDeptCalledByFunction === 1) {        // Value of 1 means addDept() was called by a function
            addDeptCalledByFunction = 0                 // Reset the value to zero
            return;                                     // Return back to the function that called addRole()
        } else {        
            launch();                               // Else return to Main Menu          
        }   
    }catch (err) {
        console.log(err)
    };    
};

//---------------------------//
//- Function - Add new Role -//
//---------------------------//

const addRole = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌──────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Add New Role │\x1b[0m`);
    console.log(`\x1b[35m  └──────────────┘\x1b[0m`);   

    try {
        // Prepare Department Array for Inquirer
        const requestDepartmentInquirer = await db.promise().query(requestDepartmentInquirerSQL);                                                                                       // Pull fresh extract of department
        let departmentInquirer = requestDepartmentInquirer[0];                                                                                                                          // Save it as departmentInquirer
        departmentInquirer.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'}, {value: 0, name: ' \x1b[32m＋\x1b[0m Create New Department for this Role'})  // Add options for Cancel and return to main menu, and create department options

        // Inquirer Prompt - which Department
        const deptWhich = await inquirer.prompt([                                
            {
                type: "list",
                name: "dept",                
                pageSize: 12,
                message: "Which department does this role sit under?",                
                choices: departmentInquirer
            },
        ])
        
        // Respond to Inquirer Prompt (Department)
        if (deptWhich.dept === 0) {                                             // 1. User Selected 'Create New Department' for this role            
            addDeptCalledByFunction = 1;                                                                                                            // Set flag to indicate addDepartment() was called by function (logic in addDepartments() built to return here instead of mainMenu (launch())
            await addDepartment();                                                                                                                  // Call Add department function
            const requestNewDeptID = await db.promise().query('SELECT d.id FROM department d WHERE d.id = (SELECT MAX(d.id) from department d)');   // Request Department with Max ID value
            roleDeptId = requestNewDeptID[0][0].id;
        } else if (deptWhich.dept === -1) {                                     // 2. User selected 'Cancel and return to Main Menu'             
            launch();
            return          
        } else {                                                                // 3. User has selected an existing Department             
            roleDeptId = deptWhich.dept;      
        };

        // Inquirer Prompt - Remaining values for Role 
        const roleTitleSalary = await inquirer.prompt ([
            {
                type: 'input',
                name: 'title',
                message: 'What is the Title of this new Role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the Salary of this new Role? (Use numbers only)',
                validate: (answer) => {
                    if (isNaN(answer)) {
                        return false, "please enter valid number";  
                    } return true;
                }
            }
        ]);       

        // Insert the New Role into the database
        await db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleTitleSalary.title, roleTitleSalary.salary, roleDeptId]);
        
        // Show new Role by MAX Role ID value
        let showNewRoleSQL = `
        SELECT 
        r.id AS Role_ID,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        d.name AS Department
        FROM role r            
        LEFT JOIN department d ON r.department_id = d.id
        WHERE r.id = (SELECT MAX(r.id) FROM role r);
        `
        const showNewRoleQuery = await db.promise().query(showNewRoleSQL);        
        console.table (showNewRoleQuery[0])

        // Show success message
        console.log(`\x1b[33m\n   ⭐ New Role "${roleTitleSalary.title}" added successfully ⭐\x1b[0m \n`)

        // Determine how to close function
        if (addRoleCalledByFunction === 1) {    // Value of 1 means addRole() was called by a function
            addRoleCalledByFunction = 0             // Reset the value to zero
            return                                  // Return back to the function that called addRole()
        } else {
            launch();                           // Else return to Main Menu
        }            
    } catch (err) {
        console.log(err);        
    };
};

//-------------------------------//
//- Function - Add new Employee -//
//-------------------------------//

const addEmployee = async () => {    
    console.log("");
    console.log(`\x1b[35m  ┌──────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Add New Employee │\x1b[0m`);
    console.log(`\x1b[35m  └──────────────────┘\x1b[0m`);    
    try{
        // Prepare Role Array for Inquirer
        const requestRoleInquirer = await db.promise().query(requestRoleInquirerSQL);                                                                                             // Pull fresh extract of Roles
        let roleInquirer = requestRoleInquirer[0];                                                                                                                                // Save it as roleInquirer
        roleInquirer.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'}, {value: 0, name: ' \x1b[32m＋\x1b[0m Create New Role for this Employee'});   // add options to return to main menu and create department options

        // Prepare Employee Array for Inquirer       
        const requestEmployeeInquirer = await db.promise().query(requestEmployeeInquirerSQL);               // Pull fresh extract of Employees
        let employeeInquirer = requestEmployeeInquirer[0];                                                  // Save it as employeeInquirer
        employeeInquirer.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'});   // add option to return to main menu

        // Inquirer Prompt - First Name and Last Name
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

        // Inquirer Prompt - Role
        const employeeRole = await inquirer.prompt ([
            {
                type: 'list',
                name: 'role',
                pageSize: 12,
                message: "Please select the role of the new Employee",
                choices: roleInquirer
            }
        ]);
        
        // Respond to Role - Cancel and return to main menu, Add new Role, Use exiting Role)
        let employeeRoleID = employeeRole.role  
        if (employeeRoleID === -1) {        // 1. User wants to Cancel and retrun to main menu            
            launch();
            return;
        } else     
        if (employeeRoleID === 0) {         // 2. User wants to Create a new Role for this employee            
            addRoleCalledByFunction = 1                                                                                                 // Set flag to indicate addRole() was called by a function (logic in addRole() built in to return here instead of mainMenu (launch())
            await addRole();                                                                                                            // Create new Role and return the title of new Role stored as employeeNewRole
            const requestNewRoleID = await db.promise().query('SELECT r.id FROM role r WHERE r.id = (SELECT MAX(r.id) from role r)');   // Request Role with Max ID value
            employeeRoleID = requestNewRoleID[0][0].id                                                                                  // Store freshly created Role ID as employeeRoleID
                // }
        } else {                            // 3. User selected existing Role - proceed as normal
        }
        
        // Inquirer Prompt - Manager
        const employeeManager = await inquirer.prompt ([
            {
                type: 'list',
                name: 'manager',
                pageSize: 12,
                message: "Please select the manager of the new Employee",
                choices: employeeInquirer
            },
        ])

        // Respond to Manager - Cancel and return to main menu, proceed
        if (employeeManager.manager === -1) {       // 1. Cancel and retrun to main menu
            launch();
            return;                      
        } else {                                    // 2. Proceed            
        }
        
        // Insert New Employee Record into the database
        await db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeName.firstName, employeeName.lastName, employeeRoleID, employeeManager.manager]);
                
        // Show new employee by MAX employee ID value
        const showNewEmployeeSQL =`
        SELECT 
        e.id AS Employee_ID,
        e.first_name AS First_Name,
        e.last_name AS Last_Name,
        d.name AS Department,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        m.first_name AS Manager_First_Name,
        m.last_name AS Manager_Last_Name
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id                
        WHERE e.id = (SELECT MAX(e.id) FROM employee e);
        `
        const showNewEmployee = await db.promise().query(showNewEmployeeSQL);
        console.table (showNewEmployee[0]);

        // Show success message
        console.log(`\x1b[33m\n   ⭐ New employee "${employeeName.firstName} ${employeeName.lastName}" added successfully ⭐\x1b[0m \n`) 

        launch(); 
    } catch (err) {
    console.log(err);    
    };
};

//-------------------------------//
//- Function - Update Employee -//
//-------------------------------//

const updateEmployee = async () => {    
    console.log("")
    console.log(`\x1b[35m  ┌────────────────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ Update Employee (Role/Manager) │\x1b[0m`);
    console.log(`\x1b[35m  └────────────────────────────────┘\x1b[0m`);    

    try{
        // Determine target Employee first
        // Show all Employees to User
        viewEmpCalledByFunction = 1;           // Set flag to indicate viewEmployes() was called by function (logic in viewEmployees() built to return here instead of mainMenu (launch())
        await viewEmployees();                 // Display Employees for user to see                   

        // Prepare Employee Array for Inquirer
        const requestEmployeeInquirer = await db.promise().query(requestEmployeeInquirerSQL);      // Pull fresh extract of employees
        employeeInquirer = requestEmployeeInquirer[0];                                             // Save it as employeeInquirer

        // Inquirer prompt - Which Employee?
        const employeeUpdate = await inquirer.prompt ([
            {
                type: 'list',
                name: 'employee',
                pageSize: 12,
                message: "Please select the EMPLOYEE to update",
                choices: employeeInquirer
            },
        ]);

        // Show user the employee targetted for update
        const showSelectedEmployeeSQL =`
        SELECT 
        e1.id as Employee_ID,
        CONCAT(e1.last_name,", ",e1.first_name) as Name,
        d.name AS Department,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        CONCAT(e2.last_name,", ",e2.first_name) as Manager
        FROM employee e1
        LEFT JOIN role r ON e1.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id              
        WHERE e1.id = ?;
        `
        const reqShowSelectedEmployee = await db.promise().query(showSelectedEmployeeSQL,employeeUpdate.employee);
        console.table (reqShowSelectedEmployee[0]);                                                                     // Targetted Employee's Employee_ID

        // Inquirer prompt - What to update?
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

        // Respond to User Choice.
        if (employeeUpdateWhat.updateWhat === "role") { // User has selected "Role"
            console.log("")
            console.log(`\x1b[35m  ┌─────────────┐\x1b[0m`);
            console.log(`\x1b[35m  │ Update Role │\x1b[0m`);
            console.log(`\x1b[35m  └─────────────┘\x1b[0m`);                      

            // Show all Roles to User
            viewRoleCalledByFunction = 1;     // Set flag to indicate viewRoles() was called by function (logic in viewRoles() built to return here instead of mainMenu (launch())
            await viewRoles();                // Display Roles for user to see

            // Prepare Role Array for Inquirer
            const requestRoleInquirer = await db.promise().query(requestRoleInquirerSQL);           // Pull fresh extract of Roles
            let roleInquirer = requestRoleInquirer[0];                                              // Save it as roleInquirer  
            
            // Inquirer prompt - New Role
            const roleWhich = await inquirer.prompt ([
                {
                    type: 'list',
                    name: 'role',
                    pageSize: 12,
                    message: "Select the NEW ROLE for the employee:",
                    choices: roleInquirer
                },
            ]);

            // Respond to User selection - Update the Role against Employee
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

            // Inquirer Prompt - Who is the new manager?
            const managerWhich = await inquirer.prompt ([
                {
                    type: 'list',
                    name: 'manager',
                    pageSize: 12,
                    message: "Select the NEW MANAGER for the employee:",
                    choices: employeeInquirer           // This Array was assemble at the start of this function
                },
            ]);
                        
            // Respond to User Selection - Update Manager 
            const updateManagerSQL = 
            `
            UPDATE employee
            SET manager_id = ?
            WHERE id = ?;
            `
            await db.promise().query(updateManagerSQL, [managerWhich.manager, reqShowSelectedEmployee[0][0].Employee_ID]); 
            console.log(`\x1b[33m\n   ⭐ Manager updated successfully! ⭐\x1b[0m \n`);
        };
        
        // Show updated Employee Record to user
        const showSelectedEmployeeAfterUpdateSQL =
        `
        SELECT 
        e.id as Employee_ID,
        CONCAT(e.last_name,", ",e.first_name) as Name,
        d.name AS Department,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        CONCAT(m.last_name,", ",m.first_name) as Manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id              
        WHERE e.id = ?;
        `
        const reqShowUpdatedRecord = await db.promise().query(showSelectedEmployeeAfterUpdateSQL,employeeUpdate.employee);
        console.table (reqShowUpdatedRecord[0]); 

        launch();
    } catch (err) {
        console.log(err);        
    };
};

//--------------------------------------------//
//- Function - View all Employees By Manager -//
//--------------------------------------------//

const viewEmployeesByManager = async () => {    
    console.log("")
    console.log(`\x1b[35m  ┌───────────────────────────────┐\x1b[0m`);
    console.log(`\x1b[35m  │ View all Employees By Manager │\x1b[0m`);
    console.log(`\x1b[35m  └───────────────────────────────┘\x1b[0m`);    

    try{
        // Prepare Employee Array for Inquirer       
        const requestEmployeeInquirer = await db.promise().query(requestEmployeeInquirerSQL);           // Pull fresh extract of Employees
        let employeeInquirer = requestEmployeeInquirer[0];                                              // Save it as employeeInquirer
        
        // Inquirer prompt
        const managerWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'manager',
                pageSize: 12,
                message: "Select the MANAGER you'd like to view Employees under:",
                choices: employeeInquirer
            },
        ]);
        
        // Respond to User selection
        const viewEmpByManagerSQL =
        `
        SELECT 
        m.id as Manager_Employee_ID,
        CONCAT(m.last_name,", ",m.first_name) as Manager,
        CONCAT(e.last_name,", ",e.first_name) as Employee,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
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
        // Prepare Department Array for Inquirer
        const requestDepartmentInquirer = await db.promise().query(requestDepartmentInquirerSQL);           // Pull fresh extract of department
        let departmentInquirer = requestDepartmentInquirer[0];                                              // Save it as departmentInquirer

        // Inquirer prompt
        const deptWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'dept',
                pageSize: 12,
                message: "Select the DEPARTMENT you'd like to view Employees in:",
                choices: departmentInquirer
            },
        ]);
        
        // Respond to User selection
        const viewEmpByDeptSQL =
        `
        SELECT 
        d.id as Department_ID,
        d.name AS Department,
        CONCAT(e.last_name,", ",e.first_name) as Employee,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
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
        // Prepare Department Array for Inquirer
        const requestDepartmentInquirer = await db.promise().query(requestDepartmentInquirerSQL);                   // Pull fresh extract of department
        let departmentInquirer = requestDepartmentInquirer[0];                                                      // Save it as departmentInquirer
        departmentInquirer.unshift({value: 'all', name: ' \x1b[31m∑\x1b[0m  Show summary for all Departments'});    // add option to show Salary Summary for ALL departments
        
        // Inquirer prompt
        const deptWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'dept',
                pageSize: 12,
                message: "Select the DEPARTMENT you'd like to view total SALARY in:",
                choices: departmentInquirer
            },
        ]);
        
        // Respond to User selection
        if (deptWhich.dept === 'all') {                 // If user selects "all " then run query to obtain Salary Summary for ALL Departments
            requestDeptSalarySQL =
            `
            SELECT 
            d.id as Department_ID,
            d.name AS Department,
            CONCAT("$",FORMAT (SUM(r.salary), 'C')) as Total_Salary_Spend
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            GROUP BY d.id
            ORDER BY d.id;
            `
        } else {                                        // If user selects a department then run query to obtain Slary Summary for the CHOSEN Department
            requestDeptSalarySQL =
            `
            SELECT 
            d.id as Department_ID,
            d.name AS Department,
            CONCAT("$",FORMAT (SUM(r.salary), 'C')) as Total_Salary_Spend
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
        // Show all Departments to User
        viewDeptCalledByFunction = 1         // Set flag to indicate viewDepartments() was called by function (logic in viewDepartments() built to return here instead of mainMenu (launch())
        await viewDepartments()              // Display Employees for user to see  
        
        // Prepare Department Array for Inquirer
        const requestDepartmentInquirer = await db.promise().query(requestDepartmentInquirerSQL);               // Pull fresh extract of Departments
        let departmentInquirer = requestDepartmentInquirer[0];                                                  // Save it as departmentInquirer
        departmentInquirer.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'});     // Add option of cancel and return to main menu
        
        // Inquirer prompt
        const deptWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'dept',
                pageSize: 12,
                message: "Select the DEPARTMENT you'd like to DELETE:",
                choices: departmentInquirer
            },
        ]);
        
        // If user selects "Cancel and return to main menu" then call launch() and return
        if (deptWhich.dept === -1) {                
            launch();
            return;
        }

        // Show user the record being targeted for deletion
        const deleteDepartmentSelectedSQL =
        `
        SELECT 
        d.id AS Department_ID,
        d.name AS Department,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        CONCAT(e.last_name,", ",e.first_name) AS Employee
        FROM department d        
        LEFT JOIN role r ON d.id = r.department_id
        LEFT JOIN employee e ON r.id = e.role_id
        where d.id = ?;
        `
        const deleteDeptSelected = await db.promise().query(deleteDepartmentSelectedSQL, deptWhich.dept);
        console.table (deleteDeptSelected[0]);
        console.log(`\x1b[33m\n   ❗Note: ROLES and EMPLOYEES are preserved if the DEPARTMENT is deleted❗\x1b\n[0m`);

        // Are you sure?
        const areYouSure = await inquirer.prompt ([
            {
                type: 'list',
                name: 'sure',
                pageSize: 12,
                message: "Are you sure you want to delete this DEPARTMENT? This cannot be reversed!",
                choices: [
                    {name: 'Yes, please proceed', value: 1},
                    {name: 'No, cancel this request', value: 0}
                ]
            }
        ]);

        // Respond to user selection (Are you sure?)
        if (areYouSure.sure === 1) {            // Yes = Delete and return to main menu
            console.log(`\x1b[33m\n   ⭐ "${deleteDeptSelected[0][0].Department_Name}" deleted successfully! ⭐\x1b[0m \n`);
            const deleteDeptSQL =
            `
            DELETE FROM department
            where id = ?
            ` 
            const deleteDept = await db.promise().query(deleteDeptSQL,deptWhich.dept);
            
            launch();   
        } else {                                // No = Cancel to main menu
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
        // Show all Roles to User
        viewRoleCalledByFunction = 1;     // Set flag to indicate viewRoles() was called by function (logic in viewRoles() built to return here instead of mainMenu (launch())
        await viewRoles();                // Display Roles for user to see
                    
        // Prepare Role Array for Inquirer
        const requestRoleInquirer = await db.promise().query(requestRoleInquirerSQL);                   // Pull fresh extract of Roles
        let roleInquirer = requestRoleInquirer[0];                                                      // Save it as roleInquirer
        roleInquirer.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'});   // Add option of cancel and return to main menu

        // Inquirer prompt
        const roleWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'role',
                pageSize: 12,
                message: "Select the ROLE you'd like to DELETE:",
                choices: roleInquirer
            },
        ]);

        // If user selects "Cancel and return to main menu" then call launch() and return
        if (roleWhich.role === -1) {                
            launch();
            return;
        };
        

        // Show user the record being targetted for deletion
        const deleteRoleSelectedSQL =
        `
        SELECT 
        r.id as Role_ID,
        r.title as Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        d.name as Department,
        CONCAT(e.last_name,", ",e.first_name) AS Employee
        FROM role r
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee e ON r.id = e.role_id
        where r.id = ?;
        `
        const deleteRoleSelected = await db.promise().query(deleteRoleSelectedSQL, roleWhich.role);
        console.table (deleteRoleSelected[0]);
        console.log(`\x1b[33m\n   ❗Note: The DEPARTMENT and EMPLOYEES are preserved if the ROLE is deleted❗\x1b\n[0m`);

        // Are you sure?
        const areYouSure = await inquirer.prompt ([
            {
                type: 'list',
                name: 'sure',
                pageSize: 12,
                message: "Are you sure you want to delete this ROLE? This cannot be reversed.",
                choices: [
                    {name: 'Yes, please proceed', value: 1},
                    {name: 'No, cancel this request', value: 0}
                ]
            }
        ]);

        // Respond to user selection (Are you Sure?)
        if (areYouSure.sure === 1) {    // Yes = Delete and return to main menu
            console.log(`\x1b[33m\n   ⭐ "${deleteRoleSelected[0][0].Title}" deleted successfully! ⭐\x1b[0m \n`);
            const deleteRoleSQL =
            `
            DELETE FROM role
            where id = ?
            ` 
            await db.promise().query(deleteRoleSQL,roleWhich.role);       

            launch();                  
        } else {                        // No = Cancel to main menu
            launch();                  
        };
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
        // Show all Employees to User
        viewEmpCalledByFunction = 1;        // Set flag to indicate viewEmployes() was called by function (logic in viewEmployees() built to return here instead of mainMenu (launch()
        await viewEmployees();              // Display Employees for user to see           
        
        // Prepare Employee Array for Inquirer
        const requestEmployeeInquirer = await db.promise().query(requestEmployeeInquirerSQL);                   // Pull fresh extract of employees
        let employeeInquirer = requestEmployeeInquirer[0];                                                      // Save it as employeeInquirer
        employeeInquirer.unshift({value: -1, name: ' \x1b[31m↻\x1b[0m  Cancel and return to main Menu'});        // Add option of cancel and return to main menu

        // Inquirer prompt
        const employeeWhich = await inquirer.prompt ([
            {
                type: 'list',
                name: 'employee',
                pageSize: 12,
                message: "Select the EMPLOYEE you'd like to DELETE:",
                choices: employeeInquirer
            },
        ]);

        // If user selects "Cancel and return to main menu" then call launch() and return
        if (employeeWhich.employee === -1) {                
            launch();
            return;
        };        

        // Show user the record being targetted for deletion
        const deleteEmployeeelectedSQL =
        ` 
        SELECT 
        e.id as Employee_ID,
        CONCAT(e.last_name,", ",e.first_name) as Name,
        d.name AS Department,
        r.title AS Role,
        CONCAT("$",FORMAT(r.salary, 'C')) AS Salary,
        CONCAT(m.last_name,", ",m.first_name) as Manager
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
        WHERE e.id = ?;
        `
        const deleteEmployeeSelected = await db.promise().query(deleteEmployeeelectedSQL, employeeWhich.employee);
        console.table (deleteEmployeeSelected[0]);

        // Are you sure?
        const areYouSure = await inquirer.prompt ([
            {
                type: 'list',
                name: 'sure',
                pageSize: 12,
                message: "Are you sure you want to delete this ROLE? This cannot be reversed!",
                choices: [
                    {name: 'Yes, please proceed', value: 1},
                    {name: 'No, cancel this request', value: 0}
                ]
            }
        ]);

        // Respond to user selection (Are you Sure?)
        if (areYouSure.sure === 1) {    // Yes = Delete and return to main menu
            console.log(`\x1b[33m\n   ⭐ "${deleteEmployeeSelected[0][0].Name}" deleted successfully! ⭐\x1b[0m \n`);
            const deleteEmployeeSQL =
            `
            DELETE FROM employee
            where id = ?
            ` 
            await db.promise().query(deleteEmployeeSQL,employeeWhich.employee);  

            launch();
        } else {                        // No = Cancel to main menu
            launch();
        };
    }
    catch (err) {
        console.log(err);        
    };
};

//---------------------------------//
//- Call function to the end user -//
//---------------------------------//
launch()