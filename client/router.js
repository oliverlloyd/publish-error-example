/* -------------------------------------------------------------- +/

## Router Config ##

Client-side Router.

Individual routes are stored in each pages corresponding .js file

/+ -------------------------------------------------------------- */

// Config
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

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
