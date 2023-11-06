import mongoose from "mongoose";

const videoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    channelName: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
