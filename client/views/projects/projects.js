/* ---------------------------------------------------- +/

## Projects ##

Code related to the projects template

/+ ---------------------------------------------------- */

Session.setDefault('projectFilter', '');
Session.setDefault('tableLimit', 10);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);


Router.map(function() {
  this.route('projects', {
    waitOn: function () {
      return Meteor.subscribe('allProjects');
    },
    data: function () {
      var projectsCount = Projects.find({$or: [
        {name: { $regex: Session.get('projectFilter'), $options: 'i'}},
        {description: { $regex: Session.get('projectFilter'), $options: 'i'}}
      ]}
      ).count();
      var paginationCount = Math.floor((projectsCount - 1) / Session.get('tableLimit')) + 1;
      Session.set('paginationCount', paginationCount);

      return {
        projects: Projects.find(
          {$or: [
            {name: { $regex: Session.get('projectFilter'), $options: 'i'}},
            {description: { $regex: Session.get('projectFilter'), $options: 'i'}}
          ]},
          {
            limit: Session.get('tableLimit'),
            skip: Session.get('skipCount'),
            sort: {_id: -1}
          }
        )
      };
    }
  });
});


Template.projects.created = function () {
  //
};

Template.projects.helpers({
  isIncomplete : function() {
    var self = this;
    if ( self.services && self.services.length > 0 ) return false;
    else return true;
  },
  paginationItems: function(){
    var paginationArray = [];
    for (var i = 0; i < Session.get('paginationCount'); i++) {
      paginationArray[i] = {
        index: i
      };
    }
    if ( paginationArray.length > 1 ){
      return paginationArray;
    } else {
      return [];
    }
  },
  countOfProjects: function(){
    var count = Projects.find({$or: [
        {name: { $regex: Session.get('projectFilter'), $options: 'i'}},
        {description: { $regex: Session.get('projectFilter'), $options: 'i'}}
      ]}
    ).count();
    var tableLimit = Session.get('tableLimit');
    var selectedPagination = Session.get('selectedPagination');
    var skipCount = Session.get('skipCount');
    var from = skipCount + 1;
    var upto = (selectedPagination + 1) * tableLimit;

    if ( upto > count ) upto = count;
    if ( count === 0 ) return 'No projects found';

    var msg = 'Showing ' + from + ' to ' + upto+ ' of ' + count + ' project';
    if ( count > 1 || count === 0 ) msg += 's';
    return msg;
  },
  isPaginationVisible: function(){
    if( Session.get('paginationCount') < 2 ){
      return "hidden";
    }
  },
  isLeftArrowDisabled: function(){
    if( Session.get('selectedPagination') === 0 ){
      return "disabled";
    }
  },
  isRightArrowDisabled: function(){
    if( Session.get('selectedPagination') + 1 === Session.get('paginationCount') ){
      return "disabled";
    }
  }
});

Template.projects.rendered = function () {

};

Template.projects.events({
  'click .goto-newproject': function (event, template) {
    var self = this;
    Router.go('newproject');
    return false;
  },
  'click .project.remove': function (event, template) {
    var project = this;
    Meteor.call('removeProject', project, function(err, result){
      if ( err ) toastr.error(err.reason);
      else {
        // Check to see if removing this project means the page we're on is now empty
        // If so, jump back one page
        var tableLimit = Session.get('tableLimit');
        var paginationCount = Session.get('paginationCount');
        var selectedPagination = Session.get('selectedPagination');
        var skipCount = Session.get('skipCount');

        if ( skipCount === (tableLimit * paginationCount) ){
          skipCount -= tableLimit;
          selectedPagination--;
          if ( skipCount >= 0 ) Session.set('skipCount', skipCount);
          if ( selectedPagination >= 0 ) Session.set('selectedPagination', selectedPagination);
        }
      }
    });
    return false;
  },
  'keyup #projectFilter':function(){
    Session.set('projectFilter', $('#projectFilter').val());
    Session.set('skipCount', 0);
    Session.set('selectedPagination', 0);
    return false;
  },
  'click .left.pagination.arrow': function (event, template) {
    var selectedPagination = Session.get('selectedPagination');
    var newPagination = selectedPagination - 1;
    Session.set('selectedPagination', newPagination);
    Session.set('skipCount', newPagination * Session.get('tableLimit'));
    return false;
  },
  'click .right.pagination.arrow': function (event, template) {
    var selectedPagination = Session.get('selectedPagination');
    var newPagination = selectedPagination + 1;
    Session.set('selectedPagination', newPagination);
    Session.set('skipCount', newPagination * Session.get('tableLimit'));
    return false;
  },
  'click .pagination.number':function(){
    Session.set('selectedPagination', this.index);
    Session.set('skipCount', this.index * Session.get('tableLimit'));
    return false;
  },
});

Template.paginationItem.helpers({
  pageActive: function(){
    if(this.index === Session.get('selectedPagination')){
      return "active";
    }
  },
  getPage: function(){
    return this.index + 1;
  }
});