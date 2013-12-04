var thinky = require('thinky');

var User = thinky.createModel('users', {
    name: String,
    idHuman: String,
    "displayName":  String,
    "email": String,
    "githubId": Number,
    "test": Number,
    "username": String,
    watches: Array
});

module.exports = User;