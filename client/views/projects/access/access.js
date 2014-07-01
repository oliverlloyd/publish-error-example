/* ---------------------------------------------------- +/

## Access ##

Code related to the collaborators page

/+ ---------------------------------------------------- */


Router.map(function() {
  this.route('collaborators', {
    path: '/projects/:_id/collaborators',
    layoutTemplate: 'project',
    yieldTemplates: {
      'footer': {to: 'footer'},
      'header': {to: 'header'}
    },
    waitOn: function () {
      return Meteor.subscribe('aProject', this.params._id);
    },
    data: function () {
      // Get the current project and put it into the session
      var thisproject = Projects.findOne(this.params._id);
      Session.set('currentProject', thisproject);

      return {
        project: thisproject
      };
    }
  });
});


Template.collaborators.helpers({
  // return all collaborators in an array
  allCollaborators: function(){
    var self = this;
    return self.collaborators;
  },
  // return true if this user is the owner
  isOwner: function(project){
    return ownsThisProject(project);
  },
  titleText: function(){
    var self = this;
    var length = self.collaborators ? self.collaborators.length : 0;
    if ( length === 0 ) return "It's just you, invite someone to join?";
    else if ( length === 1 ) return "It\'s you and one other";
    else if ( length > 1 ) return "This project has " + length + " collaborators";
    else return "";
  },
  inviteText: function(){
    var self = this;
    var length = self.collaborators ? self.collaborators.length : 0;
    switch (length){
      case 0: return "Enter the email for the person to invite";
      case 1: return "Invite someone else?";
      case 2: return "Collaborators can view and record visits";
      default: return "Add a collaborator";
    }
  },
  isFirstRow: function(){
    var self = this;
    var length = self.collaborators ? self.collaborators.length : 0;
    if ( length === 0 ) return 'first-row';
    return false;
  }
});

Template.owner.helpers({
  // return true if this user is the owner
  isOwner: function(project){
    return ownsThisProject(project);
  },
  isFirstRow: function(){
    var self = this;
    var length = self.collaborators ? self.collaborators.length : 0;
    if ( length === 0 ) return 'first-row';
    return false;
  }
});

Template.collaborator.helpers({
  // return true if this collaborator is the owner
  isYou: function(project){
    var user = Meteor.user();
    if (user && user.emails) 
      return this.email === user.emails[0].address;
    else
      return false;
  },
  // return true if this user is the owner
  isOwner: function(project){
    return ownsThisProject(project);
  }
});

var ownsThisProject = function(project){
  var user = Meteor.user();
  if (user && user.emails) 
    return user.emails[0].address === project.owner.email;
  else
    return false;
};

Template.collaborators.rendered = function () {

};

Template.collaborators.events({
  'click .invite.button': function (event, template) {
    var project = this;
    var email = $('.invitee').val();
    Meteor.call('addCollaborator', project, email, function(err, result){
      if ( err ) toastr.error(err.reason);
      else {
        // done, so reset the page
        $('.invitee').val('');
      }
    });
    return false;
  }
});