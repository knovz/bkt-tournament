Matches = new Mongo.Collection("matches");

if (Meteor.isClient) {
    
    Template.body.helpers({
        matches: function () {
            return Matches.find({}, {sort: {date: 1, time: 1}});
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
