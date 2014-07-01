


Template.tag.events({
  'click .delete.tag.icon': function (event, template){
    var tag = {label: this.toString()};
    var id = $(event.currentTarget).closest('.item').data('id');
    if ( tag ){
      Meteor.call('deleteServiceTag', Session.get('currentProject'), id, tag.label, function(err, result){
        if ( err ) toastr.error(err.reason);
        else {
          // done
        }
      });
    }
    return false;
  }
});
