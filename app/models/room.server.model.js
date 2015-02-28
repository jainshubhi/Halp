'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Room Schema
 */
var RoomSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Room name',
		trim: true
	},
	topic: [String],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Room', RoomSchema);
