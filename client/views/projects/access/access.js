/* ---------------------------------------------------- +/

## Access ##

Code related to the access page

/+ ---------------------------------------------------- */


Router.map(function() {
  this.route('access', {
    path: '/projects/:_id/access',
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


Template.access.helpers({
  // return all collaborators in an array
  allCollaborators: function(){
    var self = this;
    return self.collaborators;
  },
  // return true if this user is the owner
  isOwner: function(project){
    return ownsThisProject(project);
  }
});

Template.owner.helpers({
  // return true if this user is the owner
  isOwner: function(project){
    return ownsThisProject(project);
  }
});

Template.collaborator.helpers({
  // return true if this collaborator is the owner
  isYou: function(project){
    return this.email === Meteor.user().emails[0].address;
  },
  // return true if this user is the owner
  isOwner: function(project){
    return ownsThisProject(project);
  }
});

var ownsThisProject = function(project){
  return Meteor.user().emails[0].address === project.owner.email;
};

Template.access.rendered = function () {

};

Template.access.events({
  'click .invite.button': function (event, template) {
    var project = this;
    var email = $('.invitee').val();
    Meteor.call('addCollaborator', project, email, function(error, result){
      // done, so reset the page
      $('.invitee').val('');
    });
    return false;
  }
});