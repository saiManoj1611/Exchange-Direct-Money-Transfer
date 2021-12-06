const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name: { type: String, required: true },
    loggedOn: { type: String, required: true },
    priority: { type: String, required: true },
    description: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
    testerId: { type: mongoose.Schema.Types.ObjectId, ref: "testers" }
}, { collection: 'bugs' });

const createModel = function () {
    return mongoose.model("bugs", bugSchema)
}

module.exports.createModel = createModel;
