Matches = new Mongo.Collection("matches");

if (Meteor.isClient) {
    
    Template.body.helpers({
        matches: function () {
            return Matches.find({}, {sort: {date: 1, time: 1}});
        }
    });
    
    Template.body.events({
        "submit .new-match": function (event) {
            event.preventDefault();
            var date = (event.target.date.value.length === 0) ? "20016-01-02" : event.target.date.value;
            var time = (event.target.time.value.length === 0) ? "00:00" : event.target.time.value;
            var pitch = (event.target.pitch.value.length === 0) ? "A" : event.target.pitch.value;
            var team1 = (event.target.team1.value.length === 0) ? "team 1" : event.target.team1.value;
            var team2 = (event.target.team2.value.length === 0) ? "team 2" : event.target.team2.value;
            var category = (event.target.category.value.length === 0) ? "no category" : event.target.category.value;
            
            Matches.insert({
                date: date,
                time: time,
                pitch: pitch,
                team1: team1,
                team2: team2,
                category: category,
                score1: "-",
                score2: "-"
            });
        }
    });
    
    Template.match.events({
       "click .delete": function (event) {
            event.preventDefault();
            Matches.remove(this._id);
        },
        "submit .matchdata": function (event) {
            event.preventDefault();
            var score1 = event.target.score1.value;
            var score2 = event.target.score2.value;
            Matches.update(this._id, {
                $set: {score1: score1, score2: score2}
            });
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
