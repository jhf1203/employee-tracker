const mysql = require("mysql");
const inquirer = require("inquirer");
const db = require("../db");
const colors = require("colors")

// The initial question, to discover which action the user wants to perform
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
      } else if (deptAnswers.firstQChoice === "view") {
      viewWhat(deptAnswers)
      } else {
      modifyWhat(deptAnswers)
      }
  });  
}

// If the user wishes to add an entry, this specifies what they would like to add and calls the appropriate function
function addWhat() {
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

// If the user wishes to view a table, this specifies what they would like to view and calls the appropriate function
function viewWhat() {
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

// If the user wishes to modify an entry, this specifies what they would like to change and calls the appropriate function
function modifyWhat() {
    inquirer.prompt([
      {
        type: "list",
        message: "Sounds good, what would you like to do?",
        name: "modifyWhatChoice",
        choices: ["Change an employee's manager", "Change an employee's role"]
      }
    ]).then(function(modifyWhatAnswers){
        if (modifyWhatAnswers.modifyWhatChoice === "Change an employee's manager") {
          modifyMgrEmplSel()
        } else {
          modifyRoleEmplSel()
        }
      })
}

// Function to create a new department
function addDept(){
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the department name",
      name: "addDeptAnswer",
    }
  ]).then(function(newDeptResults){
    db.connection.query(
      "INSERT INTO department SET ?",
      {
        name: newDeptResults.addDeptAnswer,
      },
      function(err, res) {
        if (err) throw err;
      continueOption();
  })}
)};

// Function to create a new role
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
            if (newRoleResults.addRoleSalary != parseInt(newRoleResults.addRoleSalary)) {
              console.log(`The salary must be numbers only, without letters or special characters.  Please try again.`.underline.red);
              addRole();
            } else {
              db.connection.query("INSERT INTO role SET ?",
                {
                title: newRoleResults.addRoleTitle,
                salary: newRoleResults.addRoleSalary,
                department_id: parseInt(newRoleResults.addRoleDept.slice(0, 3))
                },
              function(err, res) {
                if (err) throw err;
                continueOption();
              })}  
          })
    }
)}

// Function to begin adding a new employee
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

// Function that produces the manager and employee ids, to assign the appropriate manager to an employee
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
          for (let i = 0; i<res.length-1; i++) {
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
        if (newest === mgr) {
          console.log(`Looks like you have the same id as the employee and the manager.  Please try again.`)
          getMgr();
        } else {
          addMgr(newest, mgr);
        }
      });
    })
  })
}

// Function that physically adds the manager_id attribute into the employee entry, where appropraite
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

// Function to view all departments
function viewDept() {
    db.connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      const deptArr = []
      for (var i = 0; i < res.length; i++) {
        deptArr.push(res[i])
      }
      console.table(deptArr);
      continueOption();
    });
}   

// Function to view all roles
function viewRole() {
    db.connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      const roleArr = []
      for (var i = 0; i < res.length; i++) {
        roleArr.push(res[i])      
      }
      console.table(roleArr);
      continueOption();
    });
}   

// Function to view all employees
function viewEmployee() {
    db.connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      const empArr = []
      for (var i = 0; i < res.length; i++) {
        empArr.push(res[i]);
      }
      console.table(empArr);
      continueOption();
    });
}   

// Function to select which employee whose role we will be modifying
function modifyRoleEmplSel() {
  db.connection.query("SELECT id, first_name, last_name FROM employee", function(err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
      type: "list",
      message: "Which employee will you be changing?",
      name: "modifyRoleChangedE",
      choices: function(){
        const choiceArrayEmpl = []
        for (let i = 0; i<res.length; i++) {
            choiceArrayEmpl.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
        }
        return choiceArrayEmpl
      }
      },
    ]).then(function(empl){
      const changingEmpl = parseInt(empl.modifyRoleChangedE.slice(0,5));
      modifyRoleRoleSel(changingEmpl)
    })
  })
}

// Function to select which role we will be changing the employee to
function modifyRoleRoleSel(empl) {
  const employee = empl
  console.log(`employee: ${employee}`)
  db.connection.query("SELECT id, title FROM role", function (err, res) {
    inquirer.prompt([
      {
      type: "list",
      message: "And what will be their new role be?",
      name: "modifyRoleChangedR",
      choices: function(){
        const choiceArrayRole = []
        for (let i = 0; i<res.length; i++) {
            choiceArrayRole.push(`${res[i].id} | ${res[i].title}`);
        }
        return choiceArrayRole
      }
      },
    ]).then(function(role) {
      const newRole = parseInt(role.modifyRoleChangedR.slice(0,5));
      const changingEmpl = role.employee
      console.log(`role:  ${role}, employee:  ${employee}, New role:  ${newRole} & changing employee = ${changingEmpl}`)
      let query = db.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [newRole, employee], function(err, res){
        if (err) {
        } else {
          console.log(query.sql)
          console.log("Changed!")
          continueOption();
        }
      })
    })
  })
}

// Function to select which employee whose manager we will be modifying
function modifyMgrEmplSel() {
  db.connection.query("SELECT id, first_name, last_name FROM employee", function(err, res) {
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

// Function to select and assign the correct manager to the aforementioned employee
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
      const changingEmpl = employee

      if (mgr === changingEmpl) {
        console.log(`Looks like you have the same manager and employee id.  Please try again.`.underline.red)
        modifyMgrEmplSel()
      } else {
        db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [mgr, changingEmpl], function(err, res){
          if (err) {
          } else {
            console.log("Changed!")
            continueOption();
          }
        })
      }
    })
  })
}

// Function that appears at the end of each operation, to redirect to the beginning prompt should the user want to perform another action
function continueOption() {
  inquirer.prompt([
      {
      type:"list",
      message:"Would you like to perform another action?",
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
   
exports.firstQ = firstQ