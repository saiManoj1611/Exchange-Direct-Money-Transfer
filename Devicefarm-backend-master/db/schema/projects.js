const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name: { type: String, required: true },
    description: { type: String, required: false },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "managers" },
    testers: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "testers" }
        }
    ],
    blocked: { type: Boolean, required: true, default: false },
}, { collection: 'projects' });

const createModel = function () {
    return mongoose.model("projects", projectSchema)
}

module.exports.createModel = createModel;
