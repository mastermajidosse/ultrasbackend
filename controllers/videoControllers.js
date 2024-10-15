import asyncHandler from "express-async-handler";
import Video from "../models/Video.js";

export const getVideos = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const count = await Video.countDocuments({});
    const videos = await Video.find()
      .limit(pageSize)
      .sort({ _id: -1 })
      .skip(pageSize * (page - 1));
    res.status(200).json({ videos, page, pages: Math.ceil(count / pageSize) });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

export const createVideo = async (req, res) => {
  const { name, url, thumbnail, channelName } = req.body;

  const newVideo = new Video({
    name,
    url,
    thumbnail,
    channelName,
  });

  try {
    await newVideo.save();
    res.status(200).json(newVideo);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const getVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Video.findById(id);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const updateVideo = async (req, res) => {
  const { id } = req.params;
  const { name, url, thumbnail, channelName } = req.body;

  const video = await Video.findById(id);
  if (video) {
    video.name = name || video.name;
    video.url = url || video.url;
    video.thumbnail = thumbnail || video.thumbnail;
    video.channelName = channelName || video.channelName;

    const updatedVideo = await video.save();

    res.status(200).json(updatedVideo);
  } else {
    return res.status(404).send(`No video with id: ${id}`);
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video) {
    await Video.deleteOne({ _id: video._id });
    res.json({ message: "Article deleted successfully." });
  } else {
    return res.status(404).send(`No video with id: ${id}`);
  }
};
