Router.map(function() {
  this.route('content', {
    layoutTemplate: 'layout',
    yieldTemplates: {
      'footer': {to: 'footer'},
      'header': {to: 'header'}
    }
  });
});