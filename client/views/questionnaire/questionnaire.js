

Router.map(function() {
  this.route('questionnaire', {
    path: '/projects/:_id/questionnaire',
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