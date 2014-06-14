/* ---------------------------------------------------- +/

## Server Methods ##

   Services

/+ ---------------------------------------------------- */


Meteor.methods({
  addService: function(project, service) {
    if( allowedTo.updateProject(Meteor.user(), project) && isAcceptable(service) ){
      service.created = Date.now();
      Projects.update({'_id': project._id}, {$push: {services: service}, $set: {complete: true}});
    } else {
      throw new Meteor.Error(403, 'Invalid request');
    }
  }
});

// Validates the service object
var isAcceptable = function(service){
  check(service, {
    name: nonEmptyString,
    type: nonEmptyString,
    _id: Match.Optional(nonEmptyString)
  });

  if (service.name.length > 20 )
    throw new Meteor.Error(413, "Name too long");
  if ( service.name.length < 2 )
    throw new Meteor.Error(413, "Name too short, it should be greater than 2 characters");
  if (! Meteor.user())
    throw new Meteor.Error(403, "You must be logged in");
  else 
    return true;
};

var nonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});
