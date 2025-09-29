import User from "../Models/userModels.js"; // Import User schema/model
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import jwtToken from "../utils/jwtwebToken.js";

// Controller function for user registration
export const userRegister = async (req, res) => {
    try {
        // Destructure incoming request body
        const { fullname, username, email, gender, password, profileimage } = req.body;

        // Check if a user with the same username or email already exists

        const user = await User.findOne({ username, email });
        if (user) {
            return res.status(500).send({
                success: false,
                message: "Username or Email is already exist" // Send error if duplicate
            });
        }

        // Hash the password before saving to DB
        const hashPassword = bcrypt.hashSync(password, 10);

        // Set default profile image based on gender if profileimage is not provided
        const profileBoy = profileimage || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profileimage || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Create a new User object
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword, // Save hashed password
            gender,
            profileimage: gender === "Male" ? profileBoy : profileGirl // Conditional profile image
        });
        
        // Save new user to the database
        if (newUser) {
            await newUser.save(); // Persist user
            jwtToken(newUser._id,res);
        } else {
            res.status(500).send({
                success: false,
                message: "Invalid User data" // Fallback in case user object not created
            });
        }

        // Send successful response with user info (without password)
        res.status(201).send({
            _id: newUser._id,
            fullname:newUser.fullname,
            username: newUser.fullname,
            email: newUser.email,
            profileimage: newUser.profileimage
        });

    } catch (error) {
        // Handle any unexpected errors
        res.status(500).send({
            success: false,
            message: error
        });
        console.log(error); // Log error in console for debugging
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send({ success: false, message: "Email is not registered" });

        const comparePassword = await bcrypt.compare(password, user.password || "");
        if (!comparePassword) return res.status(401).send({ success: false, message: "Email or password doesn't match" });

        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username, // ✅ fixed (was fullname)
            email: user.email,
            profileimage: user.profileimage,
            message: "Successfully Login"
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || "Internal Server Error" // ✅ send readable message
        });
        console.log(error);
    }
};

export const userLogOut=async(req,res)=>{
    try{
        res.cookie("jwt",'',{
            maxAge:0
        })
        res.status(200).send({message:"User Logout"})
    }
    catch(error){
          res.status(500).send({
            success: false,
            message: error.message || "Internal Server Error" // ✅ send readable message
        });
        console.log(error);
    }
}