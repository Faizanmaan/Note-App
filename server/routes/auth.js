const express = require("express");
const Users = require("../models/auth");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getRandomId } = require("../config/global");
const { verifyToken } = require("../middlewares/auth");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", isError: true });
    }

    const user = await Users.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists", isError: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      uid: getRandomId(),
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new Users(userData);

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      isError: false,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", isError: true });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", isError: true });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", isError: true });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", isError: true });
    }

    if (user.status !== "active") {
      return res
        .status(400)
        .json({ message: "Your account is inactive, please contact the team", isError: true });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({ message: "User logged in successfully", token, isError: false });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", isError: true });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await Users.findById(req.uid).select("-password -tokens");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        isError: true,
      });
    }

    return res.status(200).json({
      message: "User Profile",
      user,
      isError: false,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      message: "Internal server error",
      isError: true,
    });
  }
});

router.patch("/update-user", verifyToken, async (req, res) => {
  const { uid } = req;
  try {
    const user = await Users.findById(req.uid);

    if (!user) {
      return res.status(404).json({ message: "User not found", isError: true });
    }

    const { name, nickname, gender, phone, address } = req.body;

    const updatedUser = await Users.findByIdAndUpdate(
      req.uid,
      { name, nickname, gender, phone, address },
      { new: true },
    );

    return res.status(200).json({
      message: "User Profile Updated",
      user: updatedUser,
      isError: false,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", isError: true });
  }
});

router.delete("/delete-user", verifyToken, async (req, res) => {
  const { uid } = req;
  try {
    const user = await Users.findById(req.uid);

    if (!user) {
      return res.status(404).json({ message: "User not found", isError: true });
    }

    const deleteUser = await Users.findByIdAndDelete(req.uid);

    return res.status(200).json({
      message: "User Profile Deleted",
      user: deleteUser,
      isError: false,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", isError: true });
  }
});

router.patch("/change-password", verifyToken, async (req, res) => {
  const { uid } = req;
  try {
    const user = await Users.findById(req.uid);

    if (!user) {
      return res.status(404).json({ message: "User not found", isError: true });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Password is required", isError: true });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid old password", isError: true });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await Users.findByIdAndUpdate(
      req.uid,
      { password: hashedNewPassword },
      { new: true },
    );

    return res.status(200).json({
      message: "Password Changed Successfully",
      user: updatedUser,
      isError: false,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", isError: true });
  }
});

router.patch("/change-email", verifyToken, async (req, res) => {
  const { uid } = req;
  try {
    const user = await Users.findById(req.uid);

    if (!user) {
      return res.status(404).json({ message: "User not found", isError: true });
    }

    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", isError: true });
    }

    const updatedUser = await Users.findByIdAndUpdate(
      req.uid,
      { email },
      { new: true },
    );

    return res.status(200).json({
      message: "Email Changed Successfully",
      user: updatedUser,
      isError: false,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", isError: true });
  }
});

// router.post("/reset-password", async (req, res) => {
//   try {
//     const {email} = req.body;
//     if(email) return res.status(400).json({message:"Email is required", isError:true});

//     const user = await Users.findOne({email});

//     if(!user) return res.status(404).json({message:"User not found", isError:true});

//     const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});

//     return res.status(200).json({message:"Password Reset Successfully", token, isError:false});
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", isError: true });
//   }
// });

module.exports = router;
