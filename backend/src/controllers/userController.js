import User from "../models/User.js";

export async function getUser (req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({"message": "User not found"});
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user: ", error);
        res.status(500).json({"message": "Server error"});
    }
}

export async function createUser (req, res) {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });

        await newUser.save();
        res.status(201).json({"message": "User created successfully"});
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({"message": "Server error"});
    }
}

export async function updateUser (req, res) {
    try {
        const email = req.body.email;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { email }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({"message": "User not found"});
        }

        res.status(200).json({"message": "User updated successfully"});
    } catch (error) {
        console.error("Error updating user: ", error);
        res.status(500).json({"message": "Server error"});
    }
}

export async function deleteUser (req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({"message": "User not found"});
        }

        res.status(200).json({"message": "User deleted successfully"});
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(500).json({"message": "Server error"});
    }
}