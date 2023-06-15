import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'



const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image:{
        type:String,
        default:"https://res.cloudinary.com/senyou/image/upload/v1686446644/60111_yb3ljq.jpg",
        required:true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    blocked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User