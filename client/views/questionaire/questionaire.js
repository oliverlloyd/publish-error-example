

Router.map(function() {
  this.route('questionaire', {
    path: '/projects/:_id/questionaire',
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