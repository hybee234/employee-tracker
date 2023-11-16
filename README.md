<a ID="readme-top"></a>

<div align="center">

# Hubers Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=flat)](https://nodejs.org/en)
[![Inquirer Badge](https://img.shields.io/badge/Inquirer-red)](https://www.npmjs.com/)
![MySQL2 Badge](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

</div>


## Description

Employee Tracker is an employee management solution that keeps track of current employees, roles (job functions) and departments.
Employee Tracker is a command line interface (CLI) application that enables users to maintain the database. 

High level features of the solution are:
* Viewing the database - departments, roles and employees
* Additions to the database - departments, roles and employees
* Deleting from the database - departments, roles and employees
* Updates to employee records

This application has been developed from scratch

## Table of contents

- <a href="#user-story">User Story</a>
- <a href="#user-acceptance-criteria">User Acceptance Criteria</a>
- [Installation](#installation)
- [Usage](#usage)
- <a href="#screenshots">Video and Screenshots</a>
- [License](#license)
- [Contributing](#contributing)
- [Testing](#testing)
- <a href="#technologies-used">Technologies Used</a>
- [Questions](#questions)

## User Story <a ID="user-story"></a>

This application was developed with this user story in mind:

```
AS A business owner

I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## User Acceptance Criteria <a ID="user-acceptance-criteria"></a>

### This application was developed with the below User acceptance criteria:

```
GIVEN a command-line application that accepts user input

WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an 
employee, and update an employee role

WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids

WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database

WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

```



### Additional requirements:

* MySQL2 package must be used to connect to MySQL database
* Inquirer package must be used to enable interaction via command line interface

#### Bonus features

The below optional features have been included in this application

* Ability to Update Employee Manager
* Ability to View Employees by Manager
* Ability to View Employees by Department
* Ability to Delete Departments
* Ability to Delete Roles
* Ability to Delete Employees
* Ability to View total Salary for a Department


#### Additional Featuures

Several personal challenges were set in the development of this application:
* Optimising the user interface for the CLI by utilising ANSI colours and icons to improve usability
* Features to improve workflow for the user:
    * When adding a new employee - the user has the option to add a new role and department as part of the process
    * Lists have the option of cancelling out of the process and returning to main menu
    * Formatted headings and confirmation messages to reduce cognitive buren on where/which task is being performed
    * When deleting records, the user is prompted again for confirmation
    * Formatting of Salaries to be prefixed with $ and have commas introduced
    * When viewing Department - two options are included:
        * Summary version (department level only)
        * Detailed version (department + associated roles and employees)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Screenshots <a ID = "screenshots"></a>

Screenshot of the application during "Add New Role" and "Add New Employee Process"\
* Note the headings rendered with colour schemes used
* Note formatting and use of icons and colours across the application

<div align="center">

![Screenshot of the application in flight](./lib/images/screenshot1.png)

</div>

Screenshot of the application during "Delete Employee" process
* Note the formatting of salary and icons and colours used in selection options

<div align="center">

![Screenshot of the application during "Delete Employee" process](./lib/images/screenshot2.png)

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

1. Clone or fork the repository
2. Run the below in concole install necessary packages
    * MySQL2 (Major version 3),
    * Inquirer (Major version 8),    
    * dotenv (Major version 8) 
```
npm i
```
3. After NPM packages have been installed, you'll need to set up your MySQL database for the application to read and write to. Log into MySQL2:
```
myself -u root -p
```
4. Within mysql2 - create the datbase with the schema provided, run the below command in the root folder (the below is the relative path):
```
source ./db/schema.sql
```
5. Optional - you can seed some data into the database while you are in mysql2 (Skip this step if you are going to use real data)
```
source ./db/seeds.sql
```
6. Exit MySQL2:
```
quit
```
7. You can run the application once packages have been installed and the database is created. Run the below in the CLI:
```
node index.js
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Once in, you will immediately be presented with the Main Menu which serves as the "home page" to the application.

From here it is a matter of navigating through the processes to view, add, remove records from the database following prompts on the screen. Once processes are progressed to completion (or cancelled) the application will return back to the main menu to await the next process.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
    
## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This application can be used in conjunction with licensing covered in  <b>MIT Lcensee</b>

(Click on the badge for details of the license)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

To contribute to this application, please reach out to me via my contact details below

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Testing

Automated Test scripts have not been developed for this application

### Main Menu
* Validate that the main menu launches with a red heading "Main Menu"
* Validate that the main menu options have coloured icons against them to improve selection (blue "chart" icon for view, green "plus icon" for add, "pencil" for update, crossed out circle for delete)
* Validate that the Main Menu displays up to 12 rows of options


### View all Departments
* Validate that selecting View all departments presents you with two options - summary view and detailed view
* Validate that Summary view displays one record for each department AND that a heading "Summary View of Departments" appears
* Validate that Detailed view desplays all departments and its associated Roles and Employees AND that a heading "Detailed View of Departments" appears the department can appear multiple times in this format (once for each role and employee) 
* Validate that viewing either view will bring you back to the main menu

### View all Roles
* Validate that a purple heading in a box is rendered with text "view all roles"
* Validate that viewing all roles presents you with a table of all Roles (Role ID, Role, Salary, Department)
* Validate that Salary is presented formatted as currency
* Validate that you are returned to main menu

### View all Employees


### View all Employees by Manager

* Validate that when 

### View all Employees by Department

### View Total Salary for Department

### Add Department


### Add Role

### Add Employee


### Update Employee (Role/Manager)


### Delete Department


### Delete Role


### Delete Employee


### Quit
* Validate that selecting quit terminates the application with a pleasant message saying "Thanks for dropping by!"


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Technologies used <a ID="technologies-used"></a>

* Javascript
* Node.js
* Node Package Manager (NPM)
* MySQL2
* Inquirer
* dotenv

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Questions

- Visit my GitHub page: <a href="https://github.com/hybee234"> hybee234 </a>
  
<p align="right">(<a href="#readme-top">back to top</a>)</p>

