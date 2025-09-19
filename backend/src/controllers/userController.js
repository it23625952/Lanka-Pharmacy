import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { JWT_SECRET, JWT_OPTIONS } from "../config/jwt.js";

/**
 * Handles user registration by creating a new user account.
 * Validates email uniqueness, hashes password, and returns JWT token.
 * 
 * @param {Object} req - Request object containing user registration data
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with success message and JWT token
 */
export const signUp = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if user already exists with the provided email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        // Hash password with secure salt rounds
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user document
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address
        });

        await user.save();

        // Generate JWT token for immediate authentication
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            JWT_OPTIONS
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Sign Up error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

/**
 * Handles user authentication by validating credentials.
 * Verifies email and password match, then returns JWT token.
 * 
 * @param {Object} req - Request object containing login credentials
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with success message and JWT token
 */
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare provided password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token for authenticated session
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET, // Using imported JWT secret
            JWT_OPTIONS
        );

        res.json({
            message: 'Sign In successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Sign In error:', error);
        res.status(500).json({ message: 'Server error during Sign In' });
    }
};

/**
 * Retrieves the authenticated user's profile information.
 * Requires valid JWT token via authenticate middleware.
 * 
 * @param {Object} req - Request object with authenticated user data
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with user profile data
 */
export async function getUserProfile(req, res) {
    try {
        // Find user by ID from authenticated request, excluding password field
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Updates the authenticated user's profile information.
 * Requires valid JWT token via authenticate middleware.
 * 
 * @param {Object} req - Request object with update data and authenticated user
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with updated user profile
 */
export async function updateUserProfile(req, res) {
    try {
        const { name, phone, address } = req.body;
        
        // Update user profile and return the updated document
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, phone, address },
            { new: true, runValidators: true } // Return updated document and validate data
        ).select('-password'); // Exclude password field from response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'Profile updated successfully', 
            user // Return the updated user object
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Deletes user account with password confirmation for security.
 * Requires valid JWT token via authenticate middleware.
 * 
 * @param {Object} req - Request object with password confirmation
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with success message
 */
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { password } = req.body; // Get password from request body for confirmation

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password matches before deletion
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Delete user account
        await User.findByIdAndDelete(userId);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server error during account deletion' });
    }
};