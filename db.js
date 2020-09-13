var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345678",
  database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  testQ();
  connection.end();
});

function testQ(deptAnswers) {
  inquirer.prompt([
    {
      type: "list",
      message: "Would you like to add an entry, or remove an entry?",
      name: "firstQChoice",
      choices: ["add", "remove"]
    }
  ]).then(function(deptAnswers){
    console.log(deptAnswers.firstQChoice);
    if (deptAnswers.firstQChoice === "add") {
      addDept(deptAnswers)
      } else {
      removeDept(deptAnswers);
    }
  });  
}

function addDept(abc) {
  console.log("we're going to add" + abc.firstQChoice)
}

function removeDept(abc) {
  console.log("we're going to remove" + abc.firstQChoice);
}
  
