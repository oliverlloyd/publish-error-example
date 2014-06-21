


Template.tag.events({
  'click .delete.tag.icon': function (event, template){
    var tag = this;
    console.log(tag)
    if ( tag && tag.parent && tag.parent.pursuasion ){
      var callSign = false;
      switch ( tag.parent.pursuasion ){
        case 'project': {
          callSign = 'deleteProjectTag';
        }
        break;
        case 'service': {
          callSign = 'deleteServiceTag';
        }
        break;
      }

      if ( callSign ){
        Meteor.call(callSign, Session.get('currentProject'), tag.parent._id, tag.name, function(error, result){
          // done
        });
      }      
    } else {
      console.error('nah');
      return false;
    }
    return false;
  }
});
