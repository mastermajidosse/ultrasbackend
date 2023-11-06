import asyncHandler from "express-async-handler";
import express from "express";
import mongoose from "mongoose";
import Photo from "../models/Photo.js";

const router = express.Router();

export const getPhotos = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  try {
    const count = await Photo.countDocuments({});
    const photos = await Photo.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({ photos, page, pages: Math.ceil(count / pageSize) });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
export const getPhotosThumb = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  try {
    const count = await Photo.countDocuments({});
    const photos = await Photo.find({ isThumbnail: true })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({ photos, page, pages: Math.ceil(count / pageSize) });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

export const createPhoto = async (req, res) => {
  const { title, imageUrl, isThumbnail, tags } = req.body;

  const newPhoto = new Photo({
    owner: req.user._id,
    title,
    imageUrl,
    tags,
    isThumbnail,
  });

  try {
    await newPhoto.save();
    res.status(200).json(newPhoto);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const getPhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Photo.findById(id);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title, imageUrl } = req.body;

  const photo = await Photo.findById(id);
  if (photo) {
    photo.title = title || photo.title;
    photo.imageUrl = imageUrl || photo.imageUrl;
    const updatedPhoto = await photo.save();

    res.status(200).json(updatedPhoto);
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(id);
  if (photo) {
    await Photo.deleteOne({ _id: photo._id });
    res.json({ message: "Photo deleted successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const addLike = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(id);
  if (photo) {
    if (photo.likes.includes(req.user._id)) {
      return res.status(404).send(`User already like the photo with id: ${id}`);
    }
    photo.likes = [...photo.likes, req.user._id];
    await photo.save();

    res.json({ message: "Photo liked successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const removeLike = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(id);
  if (photo) {
    const likeIndex = photo.likes.findIndex(
      (ele) => ele.toString() == req.user._id
    );
    if (likeIndex !== -1) {
      photo.likes.splice(likeIndex, 1);
    } else {
      return res.status(404).send(`No user with id: ${req.user._id}`);
    }

    await photo.save();

    res.json({ message: "Like removed successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const photo = await Photo.findById(id);
  if (photo) {
    photo.comments = [...photo.comments, { owner: req.user._id, content }];
    await photo.save();

    res.json({ message: "Comment added successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const removeComment = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;

  const photo = await Photo.findById(id);
  if (photo) {
    const commentIndex = photo.comments.findIndex(
      (comment) => comment._id == commentId
    );
    if (commentIndex !== -1) {
      photo.comments.splice(commentIndex, 1);
    } else {
      return res.status(404).send(`No comment with id: ${commentId}`);
    }

    await photo.save();

    res.json({ message: "Comment removed successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const likeComment = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;

  const photo = await Photo.findById(id);
  if (photo) {
    const comment = photo.comments.id(commentId);
    if (!comment)
      return res.status(404).send(`No comment with id: ${commentId}`);

    if (comment.likes.includes(req.user._id)) {
      return res
        .status(404)
        .send(`User already like the comment with id: ${commentId}`);
    }

    comment.likes.push(req.user._id);
    await photo.save();

    res.json({ message: "Comment liked successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const removeCommentLike = async (req, res) => {
  const { id } = req.params;
  const { commentId } = req.body;

  const photo = await Photo.findById(id);
  if (photo) {
    const comment = photo.comments.id(commentId);
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
        .send(`User not liked comment with id: ${commentId}`);
    }
    await photo.save();

    res.json({ message: "Like removed from comment successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};

export const addReply = async (req, res) => {
  const { id } = req.params;
  const { commentId, content } = req.body;

  const photo = await Photo.findById(id);
  if (photo) {
    const comment = photo.comments.id(commentId);

    if (!comment)
      return res.status(404).send(`No comment with id: ${commentId}`);

    comment.replies.push({ owner: req.user._id, content });
    await photo.save();

    res.json({ message: "Reply added successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};
export const removeReply = async (req, res) => {
  const { id } = req.params;
  const { commentId, replyId } = req.body;

  const photo = await Photo.findById(id);
  if (photo) {
    const comment = photo.comments.id(commentId);

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

    await photo.save();

    res.json({ message: "Reply removed successfully." });
  } else {
    return res.status(404).send(`No photo with id: ${id}`);
  }
};
export default router;
