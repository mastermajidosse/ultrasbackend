import asyncHandler from "express-async-handler";
import express from "express";
import Teams from "../models/Teams.js";
import Country from "../models/Country.js";


export const createTeam = async (req, res) => {
  try {
    // Find the country by ID (assuming you have the country ID in the request body)
    const country = await Country.findById(req.body.country);

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Create a new team and associate it with the country
    const team = new Teams({
      name: req.body.name,
      country: country._id, // Assign the country's ID
      logo: req.body.logo,
      teamId: req.body.teamId,
    });

    // Save the team
    await team.save();

    // Add the team's ID to the country's teams array (optional)
    country.teams.push(team._id);
    await country.save();

    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Teams.find().populate('country', 'countryId name flagname').sort({ "teamId": 1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a team by ID
export const getTeamById = async (req, res) => {
  try {
    const team = await Teams.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Teams not found' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, country, photo, song } = req.body;

  const team = await Teams.findById(id);
  if (team) {
    team.name = name || Teams.name;
    team.country = country || Teams.country;
    team.photo = photo || Teams.photo;
    team.song = song || Teams.song;

    const updatedTeams = await team.save();

    res.status(200).json(updatedTeams);
  } else {
    return res.status(404).send(`No team with id: ${id}`);
  }
};


export const deleteTeam = async (req, res) => {
  const { id } = req.params;
  const team = await Teams.findById(id);
  if (team) {
    await team.deleteOne({ _id: Teams._id });
    res.json({ message: "Teams deleted successfully." });
  } else {
    return res.status(404).send(`No Teams with id: ${id}`);
  }
};

