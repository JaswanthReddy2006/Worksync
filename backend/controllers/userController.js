const User = require('../models/userModel');

// Signup (Create User)
const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                 message: "User already exists"
                 });
        }

        const newUser = await User.create({ name, email, password });
        res.status(201).json({
             success: true,
              message: "User registered successfully", 
              data: newUser
             });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        res.status(200).json({ success: true, message: "Login successful", data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}



// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { signupUser, loginUser, deleteUser };