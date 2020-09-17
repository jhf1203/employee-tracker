const mysql = require("mysql");
const inquirer = require("inquirer");
const db = require("../db");
const colors = require("colors");

function firstQ() {
  inquirer.prompt([
    {
      type: "list",
      message: "Would you like to add, view, or modify information?",
      name: "firstQChoice",
      choices: ["add", "view", "modify"]
    }
  ]).then(function(deptAnswers){
    console.log(deptAnswers.firstQChoice);
    if (deptAnswers.firstQChoice === "add") {
      addWhat(deptAnswers)
      } else if (deptAnswers.firstQChoice === "remove") {
      removeWhat(deptAnswers);
      } else if (deptAnswers.firstQChoice === "view") {
      viewWhat(deptAnswers)
      } else {
      modifyWhat(deptAnswers)
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

function viewWhat(a) {
    inquirer.prompt([
      {
        type: "list",
        message: "Sounds good, what would you like to view?",
        name: "viewWhatChoice",
        choices: ["Departments", "Roles", "Employees"]
      }
    ]).then(function(viewWhatAnswers){
      if (viewWhatAnswers.viewWhatChoice === "Departments") {
        viewDept()
      } else if (viewWhatAnswers.viewWhatChoice === "Roles") {
        viewRole()
      } else {
        viewEmployee();
      }
    })
}

function modifyWhat(a) {
    inquirer.prompt([
      {
        type: "list",
        message: "Sounds good, what would you like to do?",
        name: "modifyWhatChoice",
        choices: ["Change an employee's manager", "Change the salary for a role"]
      }
    ]).then(function(modifyWhatAnswers){
      if (modifyWhatAnswers.modifyWhatChoice === "Change an employee's manager") {
        modifyMgrEmplSel()
      } else {
        modifySalary();
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
    let query = db.connection.query(
        "INSERT INTO department SET ?",
        {
          name: newDeptResults.addDeptAnswer,
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " department inserted!\n");
        continueOption();
  })}
)};

function addRole() {
    db.connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
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
            name: "addRoleDept",
            choices: function(){
                const choiceArrayDepts = []
                for (let i = 0; i<res.length; i++) {
                    choiceArrayDepts.push(`${res[i].id} | ${res[i].name}`);
                }
                return choiceArrayDepts
            }
            },
        ]).then(function(newRoleResults){
                let query = db.connection.query(
                    "INSERT INTO role SET ?",
                    {
                    title: newRoleResults.addRoleTitle,
                    salary: newRoleResults.addRoleSalary,
                    department_id: parseInt(newRoleResults.addRoleDept.slice(0, 3))
                    },
                    function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " role inserted!\n");
                    continueOption();
                    })
            })
    }
)}

function addEmployee(){
  db.connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
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
          name: "addEmployeeRole",
          choices: function(){
            const choiceArrayRoles = []
            for (let i = 0; i<res.length; i++) {
                choiceArrayRoles.push(`${res[i].id} | ${res[i].title}`);
            }
            return choiceArrayRoles
        }
        },
        { 
          type: "confirm",
          message: "And will this person be a people manager?",
          name: "addEmployeeIsMgr",
        },
        { 
          type: "confirm",
          message: "Great, will this employee report to a manager?",
          name: "addEmployeeHasMgr",
        },
      ]).then(function(newEmployeeResults) {
        let query = db.connection.query(
          "INSERT INTO employee SET ?",
          {
          first_name: newEmployeeResults.addEmployeeNameF,
          last_name: newEmployeeResults.addEmployeeNameL,
          role_id: parseInt(newEmployeeResults.addEmployeeRole.slice(0, 5)),
          is_manager: newEmployeeResults.addEmployeeIsMgr,
          },
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee inserted!\n");
            if (newEmployeeResults.addEmployeeHasMgr === true) {
              getMgr()
            } else {
              continueOption();
            }
          }
        )
      })
  })
};   

function getMgr(){
  db.connection.query("SELECT * FROM employee WHERE is_manager=1", function(err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        message: "Who will their leader be?",
        name: "addEmployeeMgr",
        choices: function(){
          const choiceArrayMgrs = []
          for (let i = 0; i<res.length; i++) {
              choiceArrayMgrs.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
          }
          return choiceArrayMgrs
        }
      }
    ]).then(function(mgrQ) {
      const idArr = []
      db.connection.query("SELECT id FROM employee", function(err, ans) {
        for (let i = 0; i < ans.length; i++) {
        idArr.push(ans[i].id)
        }
        const newest = idArr[idArr.length-1];
        const mgr = parseInt(mgrQ.addEmployeeMgr.slice(0, 5));
        addMgr(newest, mgr);
      });
    })
  })
}

function addMgr(manager, employee) {
  db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [employee, manager], function(err, res) {
    if (err) {
      console.log(err)
    } else {
      console.log("done!")
      continueOption();
    }
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
              db.connection.end()
          }
      })
}

function viewDept() {
    var query = db.connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      console.log(query.sql);
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].name)
      }
      console.log("-----------------------------------");
      continueOption();
    });
}   

function viewRole() {
    db.connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].title + " | " + res[i].salary + " | " + res[i].department_id)
      }
      console.log("-----------------------------------");
      continueOption();
    });
}   

function viewEmployee() {
    var query = db.connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      console.log(query.sql);
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].first_name + " | " + res[i].last_name + " | " + res[i].role_id + " | " + res[i].is_mgr + " | " + res[i].manager_id)
      }
      console.log("-----------------------------------");
      continueOption();
    });
}   

function modifyMgrEmplSel() {
  db.connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
      type: "list",
      message: "Which employee will you be changing?",
      name: "modifyMgrChangedE",
      choices: function(){
        const choiceArrayEmpl = []
        for (let i = 0; i<res.length; i++) {
            choiceArrayEmpl.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
        }
        return choiceArrayEmpl
      }
      },
    ]).then(function(empl){
      const changingEmpl = parseInt(empl.modifyMgrChangedE.slice(0,5));
      modifyMgrMgrSel(changingEmpl)
    })
  })
}

function modifyMgrMgrSel(empl) {
  const employee = empl
  db.connection.query("SELECT id, first_name, last_name FROM employee WHERE is_manager = 1", function (err, res) {
    inquirer.prompt([
      {
      type: "list",
      message: "And who will be their new leader?",
      name: "modifyMgrChangedM",
      choices: function(){
        const choiceArrayMgr = []
        for (let i = 0; i<res.length; i++) {
            choiceArrayMgr.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
        }
        return choiceArrayMgr
      }
      },
    ]).then(function(people) {
      const mgr = parseInt(people.modifyMgrChangedM.slice(0,5));
      const empl = people.employee
      db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [mgr, empl], function(err, res){
        if (err) {
          console.log(err)
        } else {
          console.log("Changed!")
          continueOption();
        }
      })
    })
  })
}
   
exports.firstQ = firstQ