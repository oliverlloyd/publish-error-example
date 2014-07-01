Router.map(function() {
  this.route('homepage', {
    path: '/',
    layoutTemplate: 'layout',
    yieldTemplates: {
      'footer': {to: 'footer'},
      'header': {to: 'header'}
    }
  });
});