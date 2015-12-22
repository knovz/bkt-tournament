Matches = new Mongo.Collection("matches");

if (Meteor.isClient) {

    Template.registerHelper("isAdmin",
        function () {
            if (Meteor.user()) {
                // console.log("isAdminUser");
                return (Meteor.user().username === "admin");
            } else {
                // console.log("isAdminFalse");
                return false;
            }
        }
    );

    Template.registerHelper("isEditor",
        function () {
            if (Meteor.user()) {
                // console.log("isAdminUser");
                return (Meteor.user().username === "result" || Meteor.user().username === "admin");
            } else {
                // console.log("isAdminFalse");
                return false;
            }
        }
    );

    Template.body.helpers({
        matches: function () {
            return Matches.find({}, {sort: {date: 1, pitch:1, time: 1}});
        },
        matchesbydate: function (dateselected) {
            return Matches.find({date: dateselected}, {sort: {pitch:1, time: 1}});
        },
        matchesbydatepitch: function (dateselected, pitchselected) {
            return Matches.find({date: dateselected, pitch: pitchselected}, {sort: {time: 1}});
        },
        matchesbyteam: function (teamselected) {
            if (teamselected && teamselected != "") {
                teamregexp = new RegExp(teamselected, "i");
                return Matches.find({$or: [{team1: teamregexp}, {team2: teamregexp}]}, {sort: {date: 1, pitch:1, time: 1}});
            }
            return Matches.find({}, {sort: {date: 1, pitch:1, time: 1}});
        },
        matchesbycategory: function (teamselected, categoryselected) {
            if (categoryselected != null && teamselected != null) {
                catregexp = new RegExp("^" + categoryselected, "i");
                teamregexp = new RegExp("^" + teamselected, "i");
                return Matches.find({$and: [ {category: catregexp} , {$or: [{team1: teamregexp}, {team2: teamregexp}]}]}, {sort: {date: 1, pitch:1, time: 1}});
            }

            return Matches.find({}, {sort: {date: 1, pitch:1, time: 1}});
        },
        matchesfiltered: function (dateselected, pitchselected, teamselected, categoryselected) {
            if(dateselected != null && pitchselected != null) {
                if (categoryselected != null && teamselected != null) {
                    catregexp = new RegExp("^" + categoryselected, "i");
                    teamregexp = new RegExp("^" + teamselected, "i");
                    return Matches.find({$and: [ {date: dateselected, pitch: pitchselected, category: catregexp} , {$or: [{team1: teamregexp}, {team2: teamregexp}]}]}, {sort: {time: 1}});
                }
                return Matches.find({date: dateselected, pitch: pitchselected}, {sort: {time: 1}});
            }
            return Matches.find({}, {sort: {date: 1, pitch:1, time: 1}});
        },
        selectedteam: function () {
            return Session.get("selectedteam");
        },
        selectedcategory: function () {
            return Session.get("selectedcategory");
        }
    });

    Template.body.events({
        "submit .new-match": function (event) {
            event.preventDefault();
            var date = (event.target.date.value.length === 0) ? "20016-01-02" : event.target.date.value;
            var time = (event.target.time.value.length === 0) ? "00:00" : event.target.time.value;
            var pitch = (event.target.pitch.value.length === 0) ? "A" : event.target.pitch.value;
            var matchnum = (event.target.matchnum.value.length === 0) ? "1" : event.target.matchnum.value;
            var team1 = (event.target.team1.value.length === 0) ? "team 1" : event.target.team1.value;
            var team2 = (event.target.team2.value.length === 0) ? "team 2" : event.target.team2.value;
            var category = (event.target.category.value.length === 0) ? "no category" : event.target.category.value;
            var level = (event.target.level.value.length === 0) ? "A" : event.target.level.value;

            Matches.insert({
                date: date,
                time: time,
                pitch: pitch,
                matchnum: matchnum,
                team1: team1,
                team2: team2,
                category: category,
                level: level,
                score1: "",
                score2: ""
            });
        },
        "change #filter-team" : function (event) {
            event.preventDefault();
            Session.set("selectedteam", event.target.value);
            if (Session.get("selectedcategory") == null) {
                Session.set("selectedcategory", "");
            }
        },
        "keyup #filter-team" : function (event) {
            event.preventDefault();
            Session.set("selectedteam", event.target.value);
            if (Session.get("selectedcategory") == null) {
                Session.set("selectedcategory", "");
            }
        },
        "click #clear-team" : function (event) {
            event.preventDefault();
            document.getElementById('filter-team').value = "";
            Session.set("selectedteam", "");
        },
        "change #filter-category" : function (event) {
            event.preventDefault();
            Session.set("selectedcategory", event.target.value);
            if (Session.get("selectedteam") == null) {
                Session.set("selectedteam", "");
            }
        },
        "keyup #filter-category" : function (event) {
            event.preventDefault();
            Session.set("selectedcategory", event.target.value);
            if (Session.get("selectedteam") == null) {
                Session.set("selectedteam", "");
            }
        },
        "click #clear-category" : function (event) {
            event.preventDefault();
            document.getElementById('filter-category').value = "";
            Session.set("selectedcategory", "");
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

    Template.matchcompact.events({
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

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
