var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	text: {
        type: String,
        required: true
        },
	id: {
        type: Number,
        index: true,
        unique: true
        },
    type: {
        type: String,
        required: true
        },
    url: String,
    media: String,
    timestamp: {
        type: Date,
        required: true
        }
});

mongoose.model('Posts', postSchema);