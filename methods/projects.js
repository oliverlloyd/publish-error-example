/* ---------------------------------------------------- +/

## Server Methods ##

These are called by the client using Meteor.call()

They are where the crud work is done

Sending EMail - http://www.keysolutions.com/blogs/kenyee.nsf/d6plinks/KKYE-94VUVQ
Sending email notifications is an important part of any web application and that's easy to do with 
Meteor's authenticationed SMTP client support. You can use MailGun (default) or Gmail as the 
servers to send mail through. Once you've configured which server to send email through, sending 
it is a fairly simple function call:

  Email.send({
    from: fromEmail,
    to: toEmail,
    replyTo: fromEmail || undefined,
    subject: from.username + " sent you this email !",
    text: "Hello " + to.username + ",\n\n" + msg +
    "Thank you for using our site!\n\n" +
    Meteor.absoluteUrl()+"\n";
  });

/+ ---------------------------------------------------- */


Meteor.methods({
  createProject: function(project) {
    if( allowedTo.createProject(Meteor.user(), project) && isAcceptable(project) ){
      project.owner = this.userId;
      project.complete = project.complete || false;
      var id = Projects.insert(project);
      return id;
    } else {
      throw new Meteor.Error(403, 'You do not have permission to create this project.');
    }
  },
  removeProject: function(project) {
    check(arguments, [Match.Any])
    if( allowedTo.removeProject(Meteor.user(), project) ){
      Projects.remove({_id: project._id});
    } else {
      throw new Meteor.Error(403, 'You do not have permission to delete this project.');
    }
  },
  updateProject: function(project, fields) {
    if ( fields.hasOwnProperty('name') ) check(fields.name, nonEmptyString);
    if ( fields.hasOwnProperty('public') ) check(fields.public, Boolean);
    if ( fields.hasOwnProperty('_id') ) delete fields._id; // This property should never be present

    if( allowedTo.updateProject(Meteor.user(), project) ){
      Projects.update(project, {$set: fields});
    } else {
      throw new Meteor.Error(403, 'You do not have permission to update this project.');
    }
  }
});

// Validates the project object
var isAcceptable = function(project){
  check(project, {
    name: nonEmptyString,
    description: Match.Optional(String),
    public: Match.Optional(Boolean),
    complete: Match.Optional(Boolean),
    num: Number,
    _id: Match.Optional(nonEmptyString)
  });

  if (project.name.length > 64 )
    throw new Meteor.Error(413, "Name too long");
  if ( project.name.length < 3 )
    throw new Meteor.Error(413, "Name too short, it should be greater than 3 characters");
  if (! Meteor.user())
    throw new Meteor.Error(403, "You must be logged in");
  else 
    return true;
};

var nonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});
