const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

class datadb {

  viewAllDepartments() {
    return db.promise().query(
      'SELECT * FROM employee'
    )
  }

}

module.exports=datadb;

