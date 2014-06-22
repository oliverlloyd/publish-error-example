


Template.tag.events({
  'click .delete.tag.icon': function (event, template){
    var tag = this;
    var id = $(event.currentTarget).closest('.item').data('id');
    if ( tag ){
      Meteor.call('deleteServiceTag', Session.get('currentProject'), id, tag.label, function(error, result){
        // done
      });
    } else {
      console.error('nah');
      return false;
    }
    return false;
  }
});
