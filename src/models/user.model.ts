import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( 
    {
        _id: mongoose.Schema.Types.ObjectId,
        firstName: {
            type: String,
            required: [true, 'invalid first name']
        },
        lastName: {
            type: String,
            required: [true, 'invalid last name']
        },
        email: {
            type: String,
            required: [true, 'invalid email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'invalid password'],
        },
        emails: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mail'}]
    },{
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema);

export default User;