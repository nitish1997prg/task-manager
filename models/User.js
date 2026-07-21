import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
     },
     password: {
        type: String,
        required: true,
        minLength: 5
     }
},{timestamps: true});

const User = mongoose.model('user',userSchema);

export default User;