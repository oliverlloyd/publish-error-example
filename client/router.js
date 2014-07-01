/* -------------------------------------------------------------- +/

## Router Config ##

Client-side Router.

Individual routes are stored in each pages corresponding .js file

/+ -------------------------------------------------------------- */

// Config
Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

// Required to show loading template
// See: http://stackoverflow.com/a/23419313/1233018
Router.onBeforeAction('loading');

// Filters
var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('homepage');
    pause();
  }
};

var goToProjects = function(pause) {
  if (Meteor.user()) {
    Router.go('projects');
    pause();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['homepage']});
Router.onBeforeAction(goToProjects, {only: ['homepage']});
