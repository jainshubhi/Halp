'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Topic Schema
 */
var TopicSchema = new Schema({
	name: {
		type: String,
		default: '',
		unique: 'testing error'
	}
});

mongoose.model('Topic', TopicSchema);

/**
* Find possible not used topic
*/
TopicSchema.statics.findUniqueTopic = function(topic, callback) {
	var _this = this;
	var possibleTopic = topic;

	_this.findOne({
		topic: possibleTopic
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleTopic);
			} else {
				return _this.findUniqueTopic(topic, callback);
			}
		} else {
			callback(null);
		}
	});
};
