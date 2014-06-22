


Meteor.methods({
  // Used by autocomplete
  filterTags: function(term) {
    check(term, nonEmptyString);
    var query = {label: { $regex: term, $options: 'i'}};
    return Tags.find(query).fetch();
  }
});

var nonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});