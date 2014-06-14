/* ---------------------------------------------------- +/

## Server Methods ##

   Services

/+ ---------------------------------------------------- */


Meteor.methods({
  addService: function(project, service) {
    if ( service.hasOwnProperty('name') ) check(service.name, nonEmptyString);
    if ( service.hasOwnProperty('type') ) check(service.type, nonEmptyString);
    if ( service.hasOwnProperty('options') ) check(service.options, Array);

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
    options: Match.Optional(Array),
    _id: Match.Optional(nonEmptyString)
  });

  if (service.name.length > 20 )
    throw new Meteor.Error(413, "Name too long");
  if ( service.name.length < 2 )
    throw new Meteor.Error(413, "Name too short, it should be greater than 2 characters");
  if ( service.options && service.options.length < 1 )
    throw new Meteor.Error(413, "No options, you must supply at least one option for a list");
  if (! Meteor.user())
    throw new Meteor.Error(403, "You must be logged in");
  else 
    return true;
};

var nonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});
