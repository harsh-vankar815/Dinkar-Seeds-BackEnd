const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true,
            trim: true,
        },
        lastName: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        googleId: String,
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        }
    }
)

module.exports = mongoose.model("User", userSchema)