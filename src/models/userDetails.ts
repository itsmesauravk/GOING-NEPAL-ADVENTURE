import mongoose from "mongoose"

const userDetailsSchema = new mongoose.Schema(
  {
    // user name
    userName: {
      type: String,
    },
    // user email
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    // user phone
    userPhone: {
      type: String,
    },
    // user address
    userAddress: {
      type: String,
    },
    // user country
    userCountry: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const UserDetails = mongoose.model("UserDetails", userDetailsSchema)
export default UserDetails
