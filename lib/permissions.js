/* ---------------------------------------------------- +/

## Permissions ##

Permission checks

Usage:

if (isAllowedTo.editProject(Meteor.user(), myProject)){
  // do something  
}

/+ ---------------------------------------------------- */

allowedTo = {
  createProject: function (user) {
    return true;
  },
  updateProject: function (user, project) {
    return user._id === project.owner;
  },
  removeProject: function (user, project) {
    return user._id === project.owner;
  }
};