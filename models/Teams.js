import mongoose from "mongoose";


const teamSchema = mongoose.Schema(
  {
    teamId: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    },
    logo: {
      type: String,
    },
    photo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
    }],
    song: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    }],
  },
  {
    timestamps: true,
  }
);

const Teams = mongoose.model("Teams", teamSchema);

export default Teams;
