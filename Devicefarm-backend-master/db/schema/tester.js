const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testerSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String, required: false },
    contact_num: { type: String, required: false },
    skills: { type: String, required: false },
    address: { type: String, required: false },
    blocked: { type: Boolean, required: true, default: false },
}, { collection: 'testers' });

const createModel = function () {
    return mongoose.model("testers", testerSchema)
}

module.exports.createModel = createModel;
