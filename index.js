const inquirer = require('inquirer');
const db = require('./db');
const questions = [
  {
    type: 'input',
    name: 'first_name',
    message: "What would you like to do?",
  },
  {
    type: 'input',
    name: 'last_name',
    message: "What would you lasasta?",
  },

];

function questionsf(questions) {
  inquirer
  .prompt(questions)
  .then((data) => {
    db.viewAllDepartments();
    console.log(JSON.stringify(data, null, '  '));
  });
}

questionsf(questions);