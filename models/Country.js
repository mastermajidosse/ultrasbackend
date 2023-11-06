import mongoose from "mongoose";


const countrySchema = mongoose.Schema(
  {
    countryId: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    flagname: {
      type: String,
      default: "ma"
    },
    // Add a reference to teams in this country
    teams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
    }],
  },
  {
    timestamps: true,
  }
);

const Country = mongoose.model("Country", countrySchema);

export default Country;
