import asyncHandler from "express-async-handler";
import express from "express";
import Article from "../models/Article.js";

const router = express.Router();

export const getArticles = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  try {
    const count = await Article.countDocuments({});
    const articles = await Article.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res
      .status(200)
      .json({ articles, page, pages: Math.ceil(count / pageSize) });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

export const createArticle = async (req, res) => {
  const { title, content, image } = req.body;
  const newArticle = new Article({
    owner: req.user._id,
    title,
    content,
    image
  });

  try {
    await newArticle.save();
    res.status(200).json(newArticle);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const getArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Article.findById(id);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, image } = req.body;

  const article = await Article.findById(id);
  if (article) {
    article.title = title || article.title;
    article.image = image || article.image;
    article.content = content || article.content;
    const updatedArticle = await article.save();

    res.status(200).json(updatedArticle);
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (article) {
    await Article.deleteOne({ _id: article._id });
    res.json({ message: "Article deleted successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const addLike = async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);
  if (article) {
    if (article.likes.includes(req.user._id)) {
      return res
        .status(404)
        .send(`User already like the article with id: ${id}`);
    }
    article.likes = [...article.likes, req.user._id];
    await article.save();

    res.json({ message: "Article liked successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const removeLike = async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);

  if (article) {
    const likeIndex = article.likes.findIndex((ele) => {
      return ele.toString() == req.user._id;
    });
    if (likeIndex !== -1) {
      article.likes.splice(likeIndex, 1);
    } else {
      return res.status(404).send(`No user with id: ${req.user._id}`);
    }

    await article.save();

    res.json({ message: "Like removed successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const article = await Article.findById(id);
  if (article) {
    article.comments = [...article.comments, { owner: req.user._id, content }];
    await article.save();

    res.json({ message: "Comment added successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const removeComment = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;

  const article = await Article.findById(id);
  if (article) {
    const commentIndex = article.comments.findIndex(
      (comment) => comment._id == commentId
    );
    if (commentIndex !== -1) {
      article.comments.splice(commentIndex, 1);
    } else {
      return res.status(404).send(`No comment with id: ${commentId}`);
    }
    await article.save();

    res.json({ message: "Comment removed successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const likeComment = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;

  const article = await Article.findById(id);
  if (article) {
    const comment = article.comments.id(commentId);
    if (!comment)
      return res.status(404).send(`No comment with id: ${commentId}`);

    if (comment.likes.includes(req.user._id)) {
      return res
        .status(404)
        .send(`User already like the comment with id: ${commentId}`);
    }

    comment.likes.push(req.user._id);
    await article.save();
    res.json({ message: "Comment liked successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const removeCommentLike = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;

  const article = await Article.findById(id);
  if (article) {
    const comment = article.comments.id(commentId);
    if (!comment)
      return res.status(404).send(`No comment with id: ${commentId}`);
    const likeIndex = comment.likes.findIndex(
      (ele) => ele.toString() == req.user._id
    );
    if (likeIndex !== -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      return res
        .status(404)
        .send(`User not liked a comment with id: ${commentId}`);
    }
    await article.save();

    res.json({ message: "Like removed from comment successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const addReply = async (req, res) => {
  const { id } = req.params;
  const { commentId, content } = req.body;

  const article = await Article.findById(id);
  if (article) {
    const comment = article.comments.id(commentId);

    if (!comment)
      return res.status(404).send(`No comment with id: ${commentId}`);

    comment.replies.push({ owner: req.user._id, content });
    await article.save();

    res.json({ message: "Reply added successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};

export const removeReply = async (req, res) => {
  const { id } = req.params;
  const { commentId, replyId } = req.body;

  const article = await Article.findById(id);
  if (article) {
    const comment = article.comments.id(commentId);

    if (!comment)
      return res.status(404).send(`No comment with id: ${commentId}`);

    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id == replyId
    );
    if (replyIndex !== -1) {
      comment.replies.splice(replyIndex, 1);
    } else {
      return res.status(404).send(`No reply with id: ${replyId}`);
    }

    await article.save();

    res.json({ message: "Reply removed successfully." });
  } else {
    return res.status(404).send(`No article with id: ${id}`);
  }
};
export default router;
