const mainMenu = [
    {
        type: 'list',
        name: 'mainmenu',
        pageSize: 12,
        message: 'What would you like to do?',
        choices: [
            {name: '\x1b[34m⌸\x1b[0m  View all departments', value: 'viewDepartments'},
            {name: '\x1b[34m⌸\x1b[0m  View all roles', value: 'viewRoles'},
            {name: '\x1b[34m⌸\x1b[0m  View all employees', value: 'viewEmployees'},
            {name: '\x1b[32m＋\x1b[0m Add department', value: 'addDepartment'},
            {name: '\x1b[32m＋\x1b[0m Add role', value: 'addRole'},
            {name: '\x1b[32m＋\x1b[0m Add employee', value: 'addEmployee'},
            {name: '\x1b[33m✎\x1b[0m  Update employee', value: 'updateEmployee'},
            {name: '\x1b[31m\u2298  \u2297  Quit\x1b[0m', value: 'quit'},
        ],
    },
]

module.exports = mainMenu