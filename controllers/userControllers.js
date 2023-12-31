import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'



// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    login
// @route   GET /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    if(!user.blocked) {
      res.json({user,token: generateToken(user._id),
})
    } else {
    res.status(401).json({ message: 'You account is blocked' })
    }
  } else {
    res.status(401).json({ message: 'Invalid email or password' })
  }
})
// @desc    register
// @route   GET /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, country } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  }

  const user = await User.create({
    name,
    email,
    password,
    country
  })

  if (user) {
    res.status(201).json({
      user,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    res.json({ message: 'Invalid user data' })
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      user
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      user,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.deleteOne()
    res.json({ message: 'User removed' })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})


export {
    getUserById,
    getUserProfile,
    getUsers,
    login,
    register,
    updateUserProfile,
    deleteUser,
    
}