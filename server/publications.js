/* ---------------------------------------------------- +/

## Publications ##

These are the possible publications that a client can subscribe to.

For now, subscriptions happen in router.js and look a bit like:

Meteor.subscribe('aProject', this.params._id);

/+ ---------------------------------------------------- */


Meteor.publish("allProjects", function () {
  return Projects.find(
    {$or: [{'collaborators.userId': this.userId}, {'owner._id': this.userId}]});
});

Meteor.publish("aProject", function (id) {
  check(id, String);
  return Projects.find(
    {_id: id, $or: [{'collaborators.userId': this.userId}, {'owner._id': this.userId}]});
});

