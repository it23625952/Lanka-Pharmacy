import mongoose from "mongoose";

/**
 * Mongoose schema definition for User entities.
 * Defines the structure and validation rules for user documents in MongoDB.
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures email uniqueness at the database level
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['Owner', 'Manager', 'Staff', 'Wholesale Customer', 'Retail Customer'],
            default: 'Retail Customer',
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the User model based on the schema
const User = mongoose.model("User", userSchema);

export default User;