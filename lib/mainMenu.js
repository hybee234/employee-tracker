const mainMenu = [
    {
        type: 'list',
        name: 'mainmenu',
        message: 'What would you like to do?',
        choices: [
            {name: 'View all departments', value: 'viewDepartments'},
            {name: 'View all roles', value: 'viewRoles'},
            {name: 'View all employees', value: 'viewEmployees'},
            {name: 'Add department', value: 'addDepartment'},
            {name: 'Add role', value: 'addRole'},
            {name: 'Add employee', value: 'addEmployee'},
            {name: 'Update employee', value: 'updateEmployee'},
            {name: 'Quit', value: 'quit'},
        ],
    },
]

module.exports = mainMenu