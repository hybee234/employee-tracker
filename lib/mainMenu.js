const mainMenu = [
    {
        type: 'list',
        name: 'mainmenu',
        pageSize: 12,
        message: 'What would you like to do?',
        choices: [
            {name: '\x1b[34m⌸\x1b[0m  View all Departments', value: 'viewDepartments'},
            {name: '\x1b[34m⌸\x1b[0m  View all Roles', value: 'viewRoles'},
            {name: '\x1b[34m⌸\x1b[0m  View all Employees', value: 'viewEmployees'},
            {name: '\x1b[34m⌸\x1b[0m  View all Employees By Manager', value: 'viewEmployeesByManager'},
            {name: '\x1b[34m⌸\x1b[0m  View all Employees By Department', value: 'viewEmployeesByDepartment'},
            {name: '\x1b[34m⌸\x1b[0m  View Total Salary for Department', value: 'viewTotalSalaryDept'},
            {name: '\x1b[32m＋\x1b[0m Add Department', value: 'addDepartment'},
            {name: '\x1b[32m＋\x1b[0m Add Role', value: 'addRole'},
            {name: '\x1b[32m＋\x1b[0m Add Employee', value: 'addEmployee'},
            {name: '\x1b[33m✎\x1b[0m  Update Employee (Role/Manager)', value: 'updateEmployee'},
            {name: '\x1b[31m\u2297\x1b[0m  Delete Department', value: 'deleteDepartment'},
            {name: '\x1b[31m\u2297\x1b[0m  Delete Role', value: 'deleteRole'},
            {name: '\x1b[31m\u2297\x1b[0m  Delete Employee', value: 'deleteEmployee'},
            {name: '\x1b[31m\u2298  Quit\x1b[0m', value: 'quit'},
        ],
    },
]

module.exports = mainMenu