const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userTasksSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String },
})

const userSchema = new Schema({
    userName: {
        type: String,
    },
    userEmail: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [userTasksSchema]
}, {
    timestamps: true,
});

const User = mongoose.model('UsersData', userSchema);

module.exports = User;