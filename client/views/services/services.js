// Session.setDefault('selectedType', 'boolean');

Router.map(function() {
  this.route('services', {
    path: '/projects/:_id/services',
    waitOn: function () {
      return Meteor.subscribe('aProject', this.params._id);
    },
    data: function () {
      // Initalise each display service
      $('.ui.service.display-control.dropdown').dropdown();

      return {
        project: Projects.findOne(this.params._id)
      };
    }
  });
});


Template.services.rendered = function () {
  // Initialise the type dropdown for creating a new service
  $('.ui.service.type.dropdown').dropdown('set value', 'boolean');
  $('.ui.service.type.dropdown').dropdown('set selected', 'boolean');
  
  // Initalise each display service
  $('.ui.service.display-control.dropdown').dropdown();

  // Init transitions for displaying the example
  $('.service.type.example').transition();
};


Template.services.helpers({
  // return all services in an array
  allServices: function(){
    var self = this;
    return self.services;
  },
  // construct a string to title the page with if we have services
  servicesTitle: function(){
    var self = this;
    var length = self.services ? self.services.length : 0;
    var title = length;
    if ( length === 1 ) title += ' Service';
    else title += ' Services';
    title += ' | ' + self.name;
    return title;
  },
  // returns true is there is at least one service
  atLeastOneService: function(){
    var self = this;
    return self.services && self.services.length > 0;
  }
});


Template.services.events({
  'change input.service.type': function (event, template) {
    var self = this;

    // Show example
    var type = $('.ui.service.type.dropdown').dropdown('get value');
    showServiceExample(type);
  },
  'keyup #service-name, keypress #service-name': function (event, template) {
    var self = event.currentTarget;

    // Copy over text to example
    var typed = $(self).val();
    if ( typed && typed.length > 0 )
      $('.service.example.thetext').text(typed);
    else
      resetExampleText();

    // Show example
    var type = $('.ui.service.type.dropdown').dropdown('get value');
    showServiceExample(type);
  },
  'click .create.service.button': function (event, template) {
    var project = this;
    var service = buildService();
    console.log('add service, service: ', service)
    Meteor.call('addService', project, service, function(error, result){
      // done, so reset the page
      resetServiceExample();
    });
    return false;
  },
  'click .add.example.option.button': function (event, template) {
    var optionText = $('#option-text').val();
    var index = $('.ui.service.example.list.dropdown .item').length;
    var optionHtml = '<div class="item" data-value="'+index+'">'+optionText+'</div>'
    $('.ui.service.example.list.dropdown .menu').append($(optionHtml));
    $('.ui.service.example.list.dropdown').dropdown(); // Reset the dropdown control so it picks up this option
    $('.ui.service.example.list.dropdown').dropdown('show'); // Show the good work we've done to the user - Ie. open the dropdown
    $('#option-text').val(''); // reset the option name input
    return false;
  }
});

var buildService = function(){
  // Build a basic service based on page controls
  var service = {
    name: $('#service-name').val(),
    type: $('.ui.service.type.dropdown').dropdown('get value')
  };

  // If it's a list, add the options
  if ( service.type === 'list' ){
    service.options = [];
    $('.service.control.list .item').each(function(){
      service.options.push($(this).text());
    });
  }

  return service;
};

var resetServiceExample = function(){
  // Clear name input
  $('#service-name').val('');

  // Clear option text
  $('#option-text').val('');

  // remove options
  $('.ui.service.example.list.dropdown .menu').empty();

  // Clear example text
  resetExampleText();

  // Show example
  var type = $('.ui.service.type.dropdown').dropdown('get value');
  showServiceExample(type);  
};

var resetExampleText = function(){
  $('.service.example.thetext').text('Enter a name for this service above');
};

var showServiceExample = function(type){
  // Show the main segment if it is hidden
  if ( !$('.service.type.example').transition('is visible') ) $('.service.type.example').transition('horizontal flip');

  if ( $('.service.control.example.'+type).is(':visible') ){
    // Don't do anything if the chosen type is already showing
  } else {
    // hide the other controls
    $('.service.example.control').each(function(){
      if ( $(this).is(':visible') ) {
        $('.service.example.control').hide();
      }
    });

    // Show the example for the type selected
    $('.service.example.control.'+type).show();
  }
};

Template.serviceItem.helpers({
  isBooleanActive: function(){
    var service = this;
    if( service.type === 'boolean' ){
      return true;
    }
  },
  isListActive: function(){
    var service = this;
    if( service.type === 'list' ){
      return true;
    }
  },
  isTextActive: function(){
    var service = this;
    if( service.type === 'text' ){     
      return true;
    }
  },
  isNumberActive: function(){
    var service = this;
    if( service.type === 'number' ){     
      return true;
    }
  },
  firstOption: function(){
    var self = this;
    return self.options[0];
  },
  getOptions: function(){
    var self = this;
    self.options = self.options || [];    
    return self.options;
  }
});



