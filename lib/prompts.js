const mysql = require("mysql");
const inquirer = require("inquirer");
const deptArr = ["test"];
console.log(deptArr)
function firstQ() {
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
      addWhat(deptAnswers)
      } else {
      removeWhat(deptAnswers);
    }
  });  
}

function addWhat(a) {
  inquirer.prompt([
    {
      type: "list",
      message: "Sounds good, what would you like to add?",
      name: "addWhatChoice",
      choices: ["New Department", "New Role", "New Employee"]
    }
  ]).then(function(addWhatAnswers){
    if (addWhatAnswers.addWhatChoice === "New Department") {
      addDept()
    } else if (addWhatAnswers.addWhatChoice === "New Role") {
      addRole()
    } else {
      addEmployee();
    }
  })
}

function removeWhat(a) {
  inquirer.prompt([
    {
      type: "list",
      message: "Sounds good, what would you like to remove?",
      name: "removeWhatChoice",
      choices: ["Department", "Role", "Employee"]
    }
  ]).then(function(removeWhatAnswers){
    if (removeWhatAnswers.removeWhatChoice === "Department") {
      removeDept()
    } else if (removeWhatAnswers.removeWhatChoice === "Role") {
      removeRole()
    } else {
      removeEmployee();
    }
  })
}

function addDept(){
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the department name",
      name: "addDeptAnswer",
    }
  ]).then(function(newDeptResults){
    console.log(newDeptResults.addDeptAnswer);
    continueOption();
  })}

function addRole(){
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the name of the job title",
      name: "addRoleTitle",
    },
    {
      type: "input",
      message: "What is the salary for this position?",
      name: "addRoleSalary",
    },
    {
      type: "list",
      message: "In which department will this role be?",
      name: "addRoleDepartment",
      choices: ["fake choices"]
    },
  ]).then(function(newRoleResults){
    console.log(
      `Job Title:  ${newRoleResults.addRoleTitle}
      Salary:  ${newRoleResults.addRoleSalary}
      Department: ${newRoleResults.addRoleDepartment}`);
      continueOption();
  })
//   .then(function() {
//       inquirer.prompt([
//         {
//         type:"list",
//         message:"Do you have more to add or remove?",
//         name: "loopAnswer",
//         choices: ["yes", "no"]
//         }
//       ]).then(function(answer){
//           if (answer.loopAnswer === "yes") {
//               firstQ()
//           } else {
//               console.log("all finished!")
//           }
//       })
//   })
}

function addEmployee(){
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the employee's first name",
      name: "addEmployeeNameF",
    },
    {
      type: "input",
      message: "Please enter the employee's last name",
      name: "addEmployeeNameL",
    },
    {
      type: "list",
      message: "Which team will they be joining?",
      name: "addEmployeeDept",
      choices: ["fake choices"]
    },
    { 
        type: "list",
        message: "And will this person be a people manager?",
        name: "addEmployeeIsMgr",
        choices: ["Yes", "No"]
      },
    { 
      type: "list",
      message: "Great, who will their leader be?",
      name: "addEmployeeMgr",
      choices: ["Some guy", "Some Lady", "They will not have a manager"]
    },
  ]).then(function(newEmployeeResults){
    console.log(
      `You added ${newEmployeeResults.addEmployeeNameF} ${newEmployeeResults.addEmployeeNameL}, congrats on the new addition in ${newEmployeeResults.addEmployeeDept}!`);
      continueOption();
  })
}

function removeDept(){
  inquirer.prompt([
    {
      type: "input",
      message: "Please select the department to be removed",
      name: "removeDeptDept",
    },
    {
      type: "input",
      message: "For validation purposes, please enter your first and last name",
      name: "userInput1",
    },
    {
      type: "input",
      message: "Please enter your first and last name one more time, this confirms that you are eliminating a department",
      name: "userInput2",
    },
  ]).then(function(removeDeptResults){
    if (removeDeptResults.userInput1 === removeDeptResults.userInput2) {
      console.log(`Department Removed!`)
    } else {
      console.log("Sorry, there was a problem with your name matching for validation.  Please try again.")
    }
    continueOption();
  })
}

function removeRole(){
  inquirer.prompt([
    {
      type: "input",
      message: "Please select the role to be eliminated",
      name: "removeRoleRole",
    },
    {
      type: "input",
      message: "For validation purposes, please enter your first and last name",
      name: "userInput1",
    },
    {
      type: "input",
      message: "Please enter your first and last name one more time, this confirms that you are eliminating a department",
      name: "userInput2",
    },
  ]).then(function(removeRoleResults){
    if (removeRoleResults.userInput1 === removeRoleResults.userInput2) {
      console.log(`Role Removed!`)
    } else {
      console.log("Sorry, there was a problem with your name matching for validation.  Please try again.")
    }
    continueOption();
  })
}

function removeEmployee(){
  inquirer.prompt([
    {
      type: "input",
      message: "Please select the Employee to be removed",
      name: "removeEmployeeEmployee",
    },
    {
      type: "input",
      message: "For validation purposes, please enter your first and last name",
      name: "userInput1",
    },
    {
      type: "input",
      message: "Please enter your first and last name one more time, this confirms that you are eliminating a department",
      name: "userInput2",
    },
  ]).then(function(removeDeptResults){
    if (removeDeptResults.userInput1 === removeDeptResults.userInput2) {
      console.log(`Employee Removed!`)
    } else {
      console.log("Sorry, there was a problem with your name matching for validation.  Please try again.")
    }
    continueOption();
  })
}

function continueOption() {
    inquirer.prompt([
        {
        type:"list",
        message:"Do you have more to add or remove?",
        name: "loopAnswer",
        choices: ["yes", "no"]
        }
      ]).then(function(answer){
          if (answer.loopAnswer === "yes") {
              firstQ()
          } else {
              console.log("all finished!")
          }
      })
}

exports.firstQ = firstQ