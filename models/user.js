var mongoose = require('mongoose');

module.exports = mongoose.model('user', {
	username: String,
	password: String,
	created: Date
});