# readMe-profile-generator

![](https://img.shields.io/badge/License-MIT-yellowgreen)
      
## Table Of Contents
1.  [Description](#description)
2.  [Installation](#installation) 
3.  [Usage](#usage)
4.  [Collaborating](#collaborating)
5.  [Contact](#contact)
      
_________________________________
  
### Description
      
This is a termainal-based application using Node, that generates a team profile for tracking based off of user input.  We are able to gather basic personnel data for various members of a development team consisting of Managers, Engineers, and Interns:
- Name
- Job title
- Employee ID number
- E-Mail Address
- Office Number (managers)
- Github Username (engineers)
- School (interns).

This application was developed to be consistent and easy to interpret using HTML templates that generate from the user input provided, while also being able to easily be built upon should larger organizations with more job titles need it.  
      
_________________________________
  
### Instructions
  
Installation for this application is quite easy, as the final webpage is created dynamically.  For the profile generator to work properly you need only to ensure that you have the Jest and Inquirer packages installed, for debugging.  Everything else that's used to make this applicatoin functional (fs, path) are built into Node already.  

  
_________________________________
  
### Usage
  
The work for this project happens in the "app.js" file, which is served by multiple other js modules to organize employee classes and subclasses as well as the logic to render the employee to the html file.

Also included are application tests and HTML templates that can be modified as an organization sees fit, or duplicated to account for additional roles.  The inquirer prompts are located in the app file as well, and can be modified as an organization sees fit.

In order to use this application you simply run app.js in its terminal ("node app"), and answer the prompts accordingly.  You are able to add as many employees as you would like, regardless of job title.  The HTML template takes care of arranging them in an org chart format of rows starting with manager, then engineer and intern.

[Demonstration | overview & view functions](https://www.youtube.com/watch?v=w48XsXep2bc&t)
[Demonstration | add department/role/manager functions](https://www.youtube.com/watch?v=fDIFrE-xfAw)
[Demonstration | modify role/manager functions](https://www.youtube.com/watch?v=nmxNC3FbKGg)

_________________________________
  
### Collaborating
  
Got an idea?  A bug to report?  Or even a thought on how the application could run more efficiently?  Log it [here](https://github.com/jhf1203/team-profile-generator/issues) as an issue, and we'll talk about it!
  
_________________________________
  
### Contact Me
  
#### Jim Faulkner
- [E-mail](mailto:jhf1203@gmail.com)
- [Github](jhf1203)
  
_________________________________
  
### License
  
This application is [licensed](https://opensource.org/licenses/MIT) under the MIT License
