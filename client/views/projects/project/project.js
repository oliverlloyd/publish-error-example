/* ---------------------------------------------------- +/

## Item ##

Code related to the project template

/+ ---------------------------------------------------- */

Template.project.created = function () {
  //
};

Template.project.helpers({
  servicesMenuActive: function(){
    var current = Router.current();
    if( current && getPage(current.path) === 'services' ){
      return "active";
    }
  },
  questionnaireMenuActive: function(){
    var current = Router.current();
    if( current && getPage(current.path) === 'questionnaire' ){
      return "active";
    }
  },
  collaboratorsMenuActive: function(){
    var current = Router.current();
    if( current && getPage(current.path) === 'collaborators' ){
      return "active";
    }
  },
  currentPage: function(){
    return getPage(Router.current().path);
  },
  // returns a count of services
  serviceCount: function(){
    var self = this;
    var length = self.services ? self.services.length : 0;
    return length;
  },
  // counts collaborators
  collaboratorCount: function(){
    var self = this;
    var length = self.collaborators ? self.collaborators.length : 0;
    return length;
  },
  // counts collaborators
  questionnaireCount: function(){
    var self = this;
    var length = self.questionnaires ? self.questionnaires.length : 0;
    return length;
  }
});

var getPage = function(path){
  var items = path.split('/');
  return _.last(items);
};

Template.project.rendered = function () {
  //
};

Template.project.events({
  'click .delete.project': function(e, instance){
    var project = this;
    if ( confirm('Are you sure you want to delete project ' + project.name + '?') ) {
      Meteor.call('removeProject', project, function(err, result){
        if ( err ) toastr.error(err.reason);
        else {
          toastr.info('Project deleted.');
          Router.go('/projects');
        }
      });
    }
    return false;
  }
});