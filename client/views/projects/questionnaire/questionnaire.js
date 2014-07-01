

Router.map(function() {
  this.route('questionnaire', {
    path: '/projects/:_id/questionnaire',
    layoutTemplate: 'project',
    yieldTemplates: {
      'footer': {to: 'footer'},
      'header': {to: 'header'}
    },
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