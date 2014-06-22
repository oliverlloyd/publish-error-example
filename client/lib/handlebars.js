/* ---------------------------------------------------- +/

## Handlebars Helpers ##

Custom Handlebars helpers.

Not restricted to a single template

/+ ---------------------------------------------------- */

Handlebars.registerHelper('sayHelloTo', function(myArgument){
  return "Hello, " + myArgument;
});

//  format an ISO date using Moment.js
//  http://momentjs.com/
//  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
//  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function(context, block) {
  if (window.moment) {
    var f = block.hash.format || "MMM DD, YYYY hh:mm:ss A";
    return moment(context).format(f); //had to remove Date(context)
  } else {
    return context;   //  moment plugin not available. return data as is.
  }
});

Handlebars.registerHelper('dateAgo', function(context) {
  if (window.moment) {
    return moment(context).fromNow();
  } else {
    return context;   //  moment plugin not available. return data as is.
  }
});