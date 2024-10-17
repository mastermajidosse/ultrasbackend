import asyncHandler from "express-async-handler";
import Song from "../models/Song.js";
import Teams from "../models/Teams.js";

export const getSongs = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const count = await Song.countDocuments({});
    const songs = await Song.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({ songs, page, pages: Math.ceil(count / pageSize) });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

export const createSong = async (req, res) => {
  const { title, url, teamId, releaseDate, lyrics,thumbnail } = req.body;



  try {
    const team = await Teams.findById(teamId
     //req.body.team
    );
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    const newSong = new Song({
      title: title,
      url: url,
      team: teamId,
      releaseDate: releaseDate,
      lyrics: lyrics,
      thumbnail: thumbnail 
    });

    await newSong.save();

    team.song.push(newSong._id);

    await team.save();

    res.status(200).json(newSong);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const getSong = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Song.findById(id);
    res.status(200).json(data);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const updateSong = async (req, res) => {
  const { id } = req.params;
  const { title, url, teamName, releaseDate, lyrics } = req.body;

  const song = await Song.findById(id);
  if (song) {
    song.title = title || Song.title;
    song.url = url || Song.url;
    song.teamName = teamName || Song.teamName;
    song.releaseDate = releaseDate || Song.releaseDate;
    song.lyrics = lyrics || Song.lyrics;

    const updatedSong = await song.save();

    res.status(200).json(updatedSong);
  } else {
    return res.status(404).send(`No song with id: ${id}`);
  }
};

export const deleteSong = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findById(id);
  if (song) {
    await song.deleteOne({ _id: Song._id });
    res.json({ message: "Song deleted successfully." });
  } else {
    return res.status(404).send(`No song with id: ${id}`);
  }
};
