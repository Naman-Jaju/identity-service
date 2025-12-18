import { Schema, model, Document} from "mongoose"

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    }
},{timestamps: true}
)

UserSchema.index({email: 1})
export const UserModel = model<IUser>("User", UserSchema)