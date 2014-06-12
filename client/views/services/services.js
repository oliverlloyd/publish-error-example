

Router.map(function() {
  this.route('services', {
    path: '/projects/:_id/services',
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