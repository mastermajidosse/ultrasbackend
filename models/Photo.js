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

const photoSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true
    },
    isThumbnail: {
      type: Boolean,
      required: true,
      default: false
    },
    comments: [commentSchemaType],
    likes: [mongoose.Types.ObjectId],
  },
  { timestamps: true }
);

const Photo = mongoose.model("Photo", photoSchema);
export default Photo;
