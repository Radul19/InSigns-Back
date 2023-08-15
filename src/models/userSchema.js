const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        genre: { type: Number, required: true },
        birthdate: { type: String, required: true },
        avatar: { type: Number, required: true,default:0 },
        verify: { type: Boolean, required: true,default:false },
        class0:{type:Array,required:true,default:[]},
        class1:{type:Array,required:true,default:[]},
        class2:{type:Array,required:true,default:[]},
        class3:{type:Array,required:true,default:[]},
    },
    {
        timestamps: true,
    }
);

UserSchema.methods.changeName = function () {
    // console.log(`Testing name here ${this.name}`)
    return this.name = 'Testing here'
}
UserSchema.methods.presignedProfile = async function () {
    return this
}


module.exports = model('User', UserSchema)
