//--------------------------//
//- Required packages/inks -// 
//--------------------------//
const inquirer = require('inquirer');

const queries = require('./lib/server.js')
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
                case "viewDepartments":                   
                    db.query('SELECT * FROM department', async function (err, results) {
                        try{
                            const query = await console.log(`\x1b[33m   **${answers.mainmenu}**\x1b[0m`);
                            const show = await console.table(results)
                            const startagain = await launch();
                        }
                        catch (err) {
                        console.log(err)
                        }
                    })
                break;
            //- View all roles -//
                case "viewRoles": 
                    db.query('SELECT * FROM role', async function (err, results) {
                        try{
                            const query = await console.log(`\x1b[33m   **${answers.mainmenu}**\x1b[0m`);
                            const show = await console.table(results)
                            const startagain = await launch();
                        }
                        catch (err) {
                            console.log(err)
                        }
                    })
                break;
            //- View all employees -//
                case "viewEmployees":                     
                db.query('SELECT * FROM employee', async function (err, results) {
                    try{
                        const query = await console.log(`\x1b[33m   **${answers.mainmenu}**\x1b[0m`);
                        const show = await console.table(results)
                        const startagain = await launch();
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
                break;
            //- Add department -//
                // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                // name VARCHAR(30) NOT NULL
                case "addDepartment":
                    console.log("  **addDepartment**")
                    inquirer
                        .prompt (
                            {type: 'input',
                            name: 'newDepartment',
                            message: 'Please enter the new Department name'}
                        ).then (newDepartment)
                            db.query('INSERT INTO department (name) VALUES ("?")', newDepartment, async function (err, result) {
                                try{
                                    const query = await console.log(`\x1b[33m   **${answers.mainmenu}**\x1b[0m`);
                                    const show = await console.table("Dept added successfully")
                                    const startagain = await launch();
                                }
                                catch (err) {
                                    console.log(err)
                                }
                            })
                            
                break;
            //- Add role -//
                // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                // title VARCHAR(30) NOT NULL,
                // salary DECIMAL,
                // department_id INT, - which department
                case "addRole":
                    console.log("  **addRole**")  
                    return launch()
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


//---------------------------------//
//- Call function to the end user -//
//---------------------------------//
launch()
