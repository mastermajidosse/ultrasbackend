import mongoose from "mongoose";


const replySchemaType = mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [mongoose.Types.ObjectId],
  },
  { timestamps: true }
);
const commentSchemaType = mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [mongoose.Types.ObjectId],
    replies: [replySchemaType],
  },
  { timestamps: true }
);

const songSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teams',
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    lyrics: {
      type: String,
      default: ""
    },
    thumbnail: {
      type: String,
      required: true,
    },
    comments: [commentSchemaType],
    likes: [mongoose.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema);

export default Song;
