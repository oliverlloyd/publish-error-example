/* ---------------------------------------------------- +/

## Publications ##

These are the possible publications that a client can subscribe to.

For now, subscriptions happen in router.js and look a bit like:

Meteor.subscribe('aProject', this.params._id);

/+ ---------------------------------------------------- */
if (Meteor.isServer) {
  Meteor.startup(function () {
    Things.remove();
      Things.insert({
        // "owner" : {
        //   "_id" : "uwibCgddSJtM3ZHXm",
        //   "email" : "test@test.com"
        // },
        "collaborators" : [ ]
      });
    
  });
}

Meteor.publish("allMyThings", function () {
  return Things.find(
    {'collaborators.userId': this.userId});
});