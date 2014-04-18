var mongoose = require('mongoose');

module.exports = mongoose.model('user', {
	username: String,
	password: String,
	collections: [String],
	cols: [String],
	created: Date
});