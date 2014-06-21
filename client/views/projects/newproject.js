/* ---------------------------------------------------- +/

## Create New Project ##

Code related to the newproject template

/+ ---------------------------------------------------- */

Router.map(function() {
  this.route('newproject', {
    path: '/projects/new'
  });
});

Template.newproject.created = function () {
  //
};

Template.newproject.helpers({
  //
});

Template.newproject.rendered = function () {
  // Form validation - http://semantic-ui.com/modules/form.html
  $('.ui.form.newproject').form({
    projectName: {
      identifier  : 'project-name', // matches the name attribute
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a name'
        },
        {
          type   : 'length[3]',
          prompt : 'The name needs to be at least 3 characters'
        }
      ]
    },
    desciption: {
      identifier  : 'project-description', // matches the name attribute
      rules: [
        {
          type   : 'empty',
          prompt : 'Please enter a description'
        }
      ]
    }
  });
};

Template.newproject.events({
  'click .create.project': function (event, template) {
    var self = this;
    
    // Create a project object to submit
    var project = {
      name: template.find("input[name=project-name]").value,
      description: template.find("input[name=project-description]").value,
      pursuasion: 'project'
    };

    $('.ui.form.newproject').form('setting', { // http://semantic-ui.com/modules/form.html
      onFailure    : function(){
        return false;
      },
      onSuccess    : function(){
        Meteor.call('createProject', project, function(error, id){
          // at this point we should move on to creating services, not route to the project page
          Router.go('project',{_id: id});
        });      
        return false;
      }
    });

    $('.ui.form.newproject').form('validate form'); // http://semantic-ui.com/modules/form.html
  }
});