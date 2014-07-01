/* ---------------------------------------------------- +/

## Server Methods ##

   Services

/+ ---------------------------------------------------- */


Meteor.methods({
  addService: function(project, service) {
    if ( _.has(service, 'name') ) check(service.name, nonEmptyString);
    if ( _.has(service, 'type') ) check(service.type, nonEmptyString);
    if ( _.has(service, 'pursuasion') ) check(service.pursuasion, nonEmptyString);
    if ( _.has(service, 'options') ) check(service.options, Array);
    
    if( allowedTo.updateProject(Meteor.userId(), project) && isAcceptable(service) ){
      var now = Date.now();
      service.created = now;
      Projects.update({'_id': project._id}, {
        $push: {services: service},
        $set: {modified: now}
      });
    } else {
      throw new Meteor.Error(403, 'Invalid request');
    }
  },
  updateServiceName: function(project, serviceid, value) {
    check(value, nonEmptyString);
    check(serviceid, nonEmptyString);

    if( allowedTo.updateProject(Meteor.userId(), project) ){
      var now = Date.now();
      Projects.update({'_id': project._id, 'services._id': serviceid},{
        $set: {
          'services.$.name': value,
          'services.$.modified': now,
          modified: now
        }
      });
    } else {
      throw new Meteor.Error(403, 'You are not allowed to edit this project');
    }
  },
  deleteService: function(project, serviceid) {
    check(serviceid, nonEmptyString);

    if( allowedTo.updateProject(Meteor.userId(), project) ){
      var now = Date.now();
      Projects.update({'_id': project._id}, {
        $pull: {services: {_id: serviceid}},
        $set: {modified: now}
      });
    } else {
      throw new Meteor.Error(403, 'You are not allowed to edit this project');
    }
  },
  addServiceTag: function(project, serviceid, tag) {
    check(serviceid, nonEmptyString);
    check(tag, {
      _id: Match.Optional(nonEmptyString),
      label: nonEmptyString,
      value: Match.Optional(nonEmptyString),
      created: Match.Optional(Number),
      modified: Match.Optional(Number),
      applied: Match.Optional(Number)
    });

    if( allowedTo.updateProject(Meteor.userId(), project) ){
      var now = Date.now();
      Projects.update({'_id': project._id, 'services._id': serviceid}, {
        $addToSet:{'services.$.tags': tag.label},
        $set: {
          'services.$.modified': now,
          modified: now
        }
      });
      tag.created = tag.created || now;      
      tag.applied = now;
      delete tag._id;
      Tags.update({label: tag.label}, tag, {upsert: true});
    } else {
      throw new Meteor.Error(403, 'You are not allowed to edit this project');
    }
  },
  deleteServiceTag: function(project, serviceid, label) {
    check(serviceid, nonEmptyString);
    check(label, nonEmptyString);

    if( allowedTo.updateProject(Meteor.userId(), project) ){
      var now = Date.now();
      Projects.update({'_id': project._id, 'services._id': serviceid}, {
        $pull:{'services.$.tags': label},
        $set: {
          'services.$.modified': now,
          modified: now
        }
      });
    } else {
      throw new Meteor.Error(403, 'You are not allowed to edit this project');
    }
  }
});

// Validates the service object
var isAcceptable = function(service){
  check(service, {
    name: nonEmptyString,
    type: nonEmptyString,
    pursuasion: nonEmptyString,
    sticky: Boolean,
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
