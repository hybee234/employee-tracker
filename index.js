//--------------------------//
//- Required packages/inks -// 
//--------------------------//
const inquirer = require('inquirer');
const queries = require('./db/server.js')
const mysql = require ('mysql2');
const mysqlPromise = require ('mysql2/promise');

const questions = require ('./lib/questions.js')  // [HL] Questions

//Output cyan text//
const outputCyanText = (text) => console.log(`\x1b[36m${text}\x1b[0m`);

//--------------------------//
//- Connection to Database -// 
//--------------------------//
const db = mysql.createConnection (
    {
        host: "localhost",
        user: "root",
        password: "12345678",
        database: "employee_tracker_db"
    }, 
    console.log("Connected!")
)

//---------------------------//
//- Prompts to the end user -//
//---------------------------//

function askQuestions() {
    inquirer
        .prompt(questions)

        .then ((answers) => {
            switch (answers.mainmenu) {
            //- View all departments -//
                case "viewDepartments":
                    
                db.query('SELECT * FROM department', async function (err, results) {
                    try{
                        const show = await console.table(results)
                        const query = await console.log(`\x1b[33m   **${answers.mainmenu}**\x1b[0m`);
                        const startagain = await askQuestions();
                    }
                    catch (err) {
                    res.json(err)
                    }
                })
                
                 

                // async function viewDept () {
                //         const [rows,fields] = await db.query('SELECT * FROM department')
                //         console.table(rows);
                    
                //     console.log(await `\x1b[33m   **${answers.mainmenu}**\x1b[0m`);
                //     await askQuestions();
                //     }
                
                    return 
                break;
            //- View all roles -//
                case "viewRoles": queries.viewRoles(db) //turn to promise
                    console.log("  **viewRoles**")                
                    return askQuestions()
                break;
            //- View all employees -//
                case "viewEmployees": queries.viewEmployees(db) //turn to promise
                    console.log("  **viewEmployees**")                
                    return askQuestions()
                break;
            //- Add department -//
                case "addDepartment":
                    console.log("  **addDepartment**")  
                    return askQuestions()
                break;
            //- Add role -//
                case "addRole":
                    console.log("  **addRole**")  
                    return askQuestions()
                break;
            //- Add employee -//
                case "addEmployee":
                    console.log("  **addEmployee**")  
                    return askQuestions()
                break;
            //- Update employee -//
                case "updateEmployee":
                    console.log("  **updateEmployee**")  
                    return askQuestions()
                break;
            //- Quit -//
                case "quit": 
                    console.log("Thanks for visiting!")
                    process.exit()
                    return;
                break;
            }
            

            // //Quit//
            // if (answers.mainmenu === "quit") {
            //     return answers;
            // } else {
            //     return askQuestions();
            // }

        })
        .catch ((err) => {
            console.log(err)
        });
}


//---------------------------------//
//- Call function to the end user -//
//---------------------------------//
askQuestions()
    // .then()
    // .catch((error) => {})