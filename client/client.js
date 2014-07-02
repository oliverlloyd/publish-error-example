

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    this.redirect('homepage');
    pause();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['homepage']});


Router.map(function() {
  this.route('homepage', {
    path: '/'
  });
});

Router.map(function() {
  this.route('things', {
    waitOn: function () {
      return Meteor.subscribe('allMyThings');
    }
  });
});

