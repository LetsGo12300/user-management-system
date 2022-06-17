const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,        
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        required: true,        
        trim: true,
    },
    status: {
        type: Boolean,
        required: true
    },
    createdOn: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    lastUpdatedOn: {
        type: Date,
        default: () => Date.now()
    }
});

const User = mongoose.model("Users", UsersSchema);

module.exports = User;