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

const articleSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [commentSchemaType],
    likes: [mongoose.Types.ObjectId],
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
