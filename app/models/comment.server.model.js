'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	// Comment model fields
	// ...
	link: {
		type: String,
		default: '',
		unique: true
	}
});

mongoose.model('Comment', CommentSchema);
