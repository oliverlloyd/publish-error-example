/* ---------------------------------------------------- +/

## Permissions ##

Permission checks

Usage:

if (isAllowedTo.editProject(Meteor.user(), myProject)){
  // do something  
}

/+ ---------------------------------------------------- */

allowedTo = {
  createProject: function (userId) {
    return true;
  },
  updateProject: function (userId, project) {
    return userId === project.owner._id;
  },
  removeProject: function (userId, project) {
    return userId === project.owner._id;
  }
};