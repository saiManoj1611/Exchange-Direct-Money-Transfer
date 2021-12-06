const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const managerSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    blocked: { type: Boolean, required: true, default: false }
}, { collection: 'managers' });

const createModel = function () {
    return mongoose.model("managers", managerSchema)
}

module.exports.createModel = createModel;
