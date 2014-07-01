Router.map(function() {
  this.route('about', {
    layoutTemplate: 'layout',
    yieldTemplates: {
      'footer': {to: 'footer'},
      'header': {to: 'header'}
    }
  });
});