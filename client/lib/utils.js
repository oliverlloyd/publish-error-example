



ownsThisProject = function(project){
  var user = Meteor.user();
  if (user && user.emails) 
    return user.emails[0].address === project.owner.email;
  else
    return false;
};