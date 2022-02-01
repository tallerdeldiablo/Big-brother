const mysql = require("mysql2");
const inquirer = require("inquirer");

const { allowedNodeEnvironmentFlags } = require("process");

//connect to data bas
const connectionInfo =
{
    host: 'localhost',
    user: "root",
    password: "root",
    database: 'employees_db',
    insecureAuth: true,
    port: 3306,
};

const db = mysql.createConnection(connectionInfo)

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Your database is now connected");
    mainmenu();
});

//first promt
function mainmenu() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: [
                    {
                        name: "View All Departments",
                        value: "1"
                    },
                    {
                        name: "View All Roles",
                        value: "2"
                    },
                    {
                        name: "View All Employees",
                        value: "3"
                    },
                    {
                        name: "Add a Department",
                        value: "4"
                    },
                    {
                        name: "Add a Role",
                        value: "5"
                    },
                    {
                        name: "Add a Employee",
                        value: "6"
                    },
                    {
                        name: "Update an Employee Role",
                        value: "7"
                    },
                    {
                        name: "Exit",
                        value: "Exit"
                    }
                ]
            }
        ])
        .then((res) => {
            let choice = res.choice
            switch (choice) {

                case "1":
                    viewAllDepartments();
                    break;

                case "2":
                    viewAllRoles();
                    break;

                case "3":
                    viewAllEmployees();
                    break;

                case "4":
                    addDepartment();
                    break;

                case "5":
                    addRole();
                    break;

                case "6":
                    addEmployee();
                    break;

                case "7":
                    updateEmployeeRole();
                    break;

                case "Close":
                    console.log("bye")
                    process.exit()
            }
        })
}


//view the departments
function viewAllDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
        console.table(results)
        mainmenu()
    })
}

//view the roles
function viewAllRoles() {
    db.query(`SELECT role.id, title, salary, department_name FROM role JOIN department ON role.department_id = department.id`,
        function (err, results) {
            console.table(results)
            mainmenu()
        });
}
//view the employees
function viewAllEmployees() {
    db.query(`SELECT emp.id, emp.first_name, emp.last_name, title, salary, department_name, 
    CONCAT(emp2.first_name, ' ', emp2.last_name) AS "manager_name" FROM employee AS emp
    JOIN role ON emp.role_id = role.id
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS emp2 ON emp.manager_id = emp2.id;`,
        function (err, results) {
            console.table(results);
            //back to menu
            mainmenu()
        });
}

function addDepartment() {
    inquirer
        .prompt(
            {
                type: 'input',
                message: 'Enter the name of the department.',
                name: 'department'
            })
        .then(res => {
            let value = res.department
            db.query(`INSERT INTO department(department_name) VALUES (?)`, value, function (err) {
                if (err) console.log(err);
                console.log("New Department has been added.")
                 //back to menu
                mainmenu()
            });
        })
}

function addRole() {
    db.query('SELECT department_name FROM department', function (err, res) {
        let deptArray = [];
        for (let i of res) deptArray.push(i.department_name)

        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Enter the role you would like to add.',
                    name: 'title'
                },
                {
                    type: 'input',
                    message: 'Enter the salary of the role.',
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: 'Select the appropriate department of the role.',
                    name: "department",
                    choices: deptArray
                }
            ])
          .then(res => {
                const { title, salary, department } = res

      db.query(`SELECT id FROM department WHERE department_name = ?`, department, function (err, res) {
           if (err) console.log(err);
             let departmentId = res[0].id;
               db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [title, salary, departmentId], function (err) {
                        if (err) console.log(err);
                        console.log("Role has been added.")
                         //back to menu
                        mainmenu()
                    });
                });
          })
    })
}

function addEmployee() {
    db.query('SELECT title FROM role', function (err, results) {
        let roles = []

     for (let i of results) roles.push(i.title)

        db.query("SELECT CONCAT(first_name, ' ', last_name) AS 'manager_name' FROM employee", function (err, results) {
            let employees = []
            for (let i of results) {
                employees.push(i.manager_name)
            }
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: "Please enter the employee's first name.",
                        name: 'first'
                    },
                    {
                        type: 'input',
                        message: "Please enter the employee's last name.",
                        name: 'last'
                    },
                    {
                        type: 'list',
                        message: "Please choose the employee's role.",
                        name: 'role',
                        choices: roles
                    },
                    {
                        type: 'list',
                        message: "Please choose the employee's manager.",
                        name: 'manager',
                        choices: employees
                    }
                ])
                .then(res => {
                    const { first, last, role, manager } = res

                    db.query(`SELECT id FROM role WHERE title = ?`, role, function (err, res) {
                        if (err) console.log(err);
                        let roleId = res[0].id
                        // for empty imputs
                        if (manager === "none") {
                            var managerid = null

                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [first, last, roleId, managerid], function (err) {
                                if (err) console.log(err);
                                console.log("Employee has been added.")
                                 //back to menu
                                mainmenu()
                            })
                        } else {
                            //split
                            let split = manager.split(" ")

                            db.query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [split[0], split[1]], function (err, res) {
                                if (err) console.log(err);

                                let managerid = res[0].id

                                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?,?,?,?)`, [first, last, roleId, managerid], function (err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    console.log("Employee has been added.")
                                    mainmenu()
                                })
                            })
                        }
                    })
                })
        })
    })
}
/*--------------------   --------------------------------*/

/*  -------*  update *-------------*/

function updateEmployeeRole() {
    db.query(`SELECT CONCAT(first_name, ' ', last_name) AS "employees" FROM employee`, function (err, results) {
        let employees = []

        for (let i of results) employees.push(i.employees)

        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Please select the employee would you like to update.',
                    name: "employee",
                    choices: employees
                }
            ]).then(res => {
                split = res.employee.split(" ")

                db.query(`SELECT id FROM employee WHERE employee.first_name =? AND employee.last_name =?`, [split[0], split[1]],

                    function (err, results) {
                        let employeeId = results[0].id

                        db.query(`SELECT title FROM role`, function (err, results) {
                            let roles = []

                            for (let i of results) {
                                roles.push(i.title)
                            }

                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        message: 'Please select a new role.',
                                        name: "role",
                                        choices: roles
                                    }
                                ])
                                .then(res => {
                                    db.query(`SELECT id FROM role WHERE role.title = ?`, res.role, function (err, results) {
                                        let roleId = results[0].id

                                        db.query(`UPDATE employee SET role_id = ? WHERE employee.id = ?`, [roleId, employeeId], function (err, results) {
                                            console.log("Employee role has been updated.")
                                            mainmenu()
                                        })
                                    })
                                })
                        })
                    })
            })
    })
}

/*----starts from here - */
//first menu 
mainmenu()

//end