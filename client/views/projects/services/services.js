

// When editing service name text, ID of the service
Session.setDefault('editing_servicename', null);


Router.map(function() {
  this.route('services', {
    path: '/projects/:_id/services',
    waitOn: function () {
      return Meteor.subscribe('aProject', this.params._id);
    },
    data: function () {
      // Initalise each display service
      $('.ui.service.display-control.dropdown').dropdown();

      // Get the current project and put it into the session
      var thisproject = Projects.findOne(this.params._id);
      Session.set('currentProject', thisproject);

      return {
        project: thisproject
      };
    }
  });
});


////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};


Template.services.created = function() {
  // Setup our own version of jQuerie's autocomplete - allows us to do things our own way
  $.widget( "custom.semanticAutocomplete", $.ui.autocomplete, {
    _renderItem: function( ul, item ) {
      return $( "<li>" )
        .addClass( "item" )
        .append( $( "<a>" ).text( item.label ) )
        .appendTo( ul );
    },
    _renderMenu: function( ul, items ) {
      var that = this;
      $.each( items, function( index, item ) {
        that._renderItemData( ul, item );
      });
    }
  });  
};

Template.services.rendered = function () {
  // Initialise the type dropdown for creating a new service
  $('.ui.service.type.dropdown').dropdown('set value', 'boolean');
  $('.ui.service.type.dropdown').dropdown('set selected', 'boolean');

  // Initalise each display service
  $('.ui.service.display-control.dropdown').dropdown();

  // Init transitions for displaying the example
  $('.service.type.example').transition();

  $('.sticky').each(function(){
    applyStickyPopup($(this));
  });
  
};

var applyStickyPopup = function(item){
  item.popup({
    position : 'bottom right',
    title    : 'Stickyness',
    content  : 'Each time a sticky service is chosen or a value entered it will become the default for that device. Normally a service will default to the last value chosen for the client'
  });  
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
    Meteor.call('addService', project, service, function(err, result){
      if ( err ) toastr.error(err.reason);
      else {
        // done, so reset the page
        resetServiceExample();

        // add popup to icon
        var justAdded = $('.sticky.icon').last();
        applyStickyPopup(justAdded);
      }
    });
    return false;
  }
});

Template.services.events(okCancelEvents(
  '#option-text',
  {
    ok: function (value) {
      var index = $('.ui.service.example.list.dropdown .item').length;
      var optionHtml = '<div class="item" data-value="'+index+'">'+value+'</div>';
      $('.ui.service.example.list.dropdown .menu').append($(optionHtml));
      $('.ui.service.example.list.dropdown').dropdown(); // Reset the dropdown control so it picks up this option
      $('.ui.service.example.list.dropdown').dropdown('show'); // Show the good work we've done to the user - Ie. open the dropdown
      $('#option-text').val(''); // reset the option name input
    },
    cancel: function () {
      $('#option-text').val(''); // reset the option name input
    }
  }));

var buildService = function(){
  // Build a basic service based on page controls
  var service = {
    _id: Random.id(), // Give an id to each service so we can reference them in lists
    name: $('#service-name').val(),
    type: $('.ui.service.type.dropdown').dropdown('get value'),
    sticky: $('#isSticky').is(':checked'),
    pursuasion: 'service'
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



Template.serviceRow.helpers({
  isList: function(){
    var service = this;
    return service.type === 'list';
  },
  isSticky: function(){
    var service = this;
    return service.sticky;
  },
  firstOption: function(){
    var self = this;
    self.options = self.options || [null];
    return self.options[0];
  },
  listOptions: function(){
    var self = this;
    self.options = self.options || [];    
    return self.options.toString();
  },
  describeType: function(service){
    var self = this;
    var type = service.type;
    switch ( type ) {
      case 'boolean':{
        return 'Simple Yes / No';
      }
      break;
      case 'number': {
        return 'A Number';
      }
      break;
      case 'text': {
        return 'Some text';
      }
      break;
      case 'list': {
        var options = service.options || false;
        if ( !options ) return 'List. No options configured!';
        if ( options.length === 1 ) return 'One choice: ' + options[0] +'. (Note. Yes/No would be better here)';

        // Construct a mesg listing the options for this service
        var msg = 'A choice from ';
        for (var i = 0; i < options.length; i++) {
          if ( i === options.length - 1 ) { // Last entry in list
            msg += ' or ';
          } else if ( i !== 0 ){ // Not the first entry in list
            msg += ', ';
          }
          msg += options[i];
        }
        return msg;
      }
      break;
    }

    return type; // Error state
  },
  editing: function(){
    return Session.equals('editing_servicename', this._id);
  }
});

Template.serviceRow.events(okCancelEvents(
  '.edit.service.name',
  {
    ok: function (value) {
      var service = this;
      Meteor.call('updateServiceName', Session.get('currentProject'), service._id, value, function(error, result){
        if ( err ) toastr.error(err.reason);
        else {
          Session.set('editing_servicename', null);
        }
      });
    },
    cancel: function () {
      Session.set('editing_servicename', null);
    }
  }));

Template.serviceRow.events(okCancelEvents(
  '.add.service.tag',
  {
    ok: function (value, event) {
      var service = this;
      
      var tag = {
        label: value
      };

      // Clear input
      $(event.currentTarget).val('');

      addServiceTag(service._id, tag);
    },
    cancel: function () {
      // cancel
    }
  }));

Template.serviceRow.events({
  'dblclick .display.service.name': function (event, template) { // start editing service name
    var service = this;
    Session.set('editing_servicename', service._id);
    Deps.flush(); // force DOM redraw, so we can focus the edit field
    activateInput(template.find(".edit.service.name"));
  },
  'click .remove.service.icon': function (event, template){
    var service = this;
    if ( confirm('Are you sure you want to delete this service?') ){
      Meteor.call('deleteService', Session.get('currentProject'), service._id, function(error, result){
        if ( err ) toastr.error(err.reason);
        else {
          // done
          toastr.info('Service deleted');
        }
      });
    }
    return false;
  }
});

Template.serviceRow.rendered = function() {
  initAutocomplete($(this.find('.add.tag')));
};

var initAutocomplete = function(element){
  element.semanticAutocomplete({
    source: function(request, callback){ // callback expects a single argument, the matching array
      Meteor.call('filterTags', request.term, function(err, result){
        if ( err ) toastr.error(err.reason);
        else {
          if (err) {
            console.error(err);
            callback([]);
          } else {
            callback(result);
          }
        }
      });
    },
    select: function(event, ui){
      var tag = ui.item;
      var serviceid = $(this).closest('.item').data('id');
      
      // Clear input
      $(event.target).val('');

      addServiceTag(serviceid, tag);

      return false; // prevent default
    }
  });
};

var addServiceTag = function(serviceid, tag){
  // Autocomplete will add a value property, remove it to keep things tidy; use label instead
  if ( tag.value ) delete tag.value;
  Meteor.call('addServiceTag', Session.get('currentProject'), serviceid, tag, function(error, result){
      if ( err ) toastr.error(err.reason);
      else {
        // done
      }
  });  
};



