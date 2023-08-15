const { Schema, model } = require('mongoose')

const CodeSchema = new Schema(
    {
        code: { type: String, required: true },
        email: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);


module.exports = model('Code', CodeSchema)
