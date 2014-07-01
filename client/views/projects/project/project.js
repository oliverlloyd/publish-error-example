/* ---------------------------------------------------- +/

## Item ##

Code related to the project template

/+ ---------------------------------------------------- */
Router.map(function() {
  this.route('project', {
    path: '/projects/:_id',
    waitOn: function () {
      return Meteor.subscribe('aProject', this.params._id);
    },
    data: function () {
      return {
        project: Projects.findOne(this.params._id)
      };
    }
  });
});

Template.project.created = function () {
  //
};

Template.project.helpers({
  
  myHelper: function () {
    //
  }

});

Template.project.rendered = function () {
  //
};

Template.project.events({
  'click .delete': function(e, instance){
    var project = this;
    e.preventDefault();
    Meteor.call('removeProject', project, function(error, result){
      if ( err ) toastr.error(err.reason);
      else {
        alert('Project deleted.');
        Router.go('/projects');
      }
    });
  }
});