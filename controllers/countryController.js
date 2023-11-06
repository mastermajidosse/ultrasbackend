import asyncHandler from "express-async-handler";
import express from "express";
import Country from "../models/Country.js";

export const createCountry = async (req, res) => {
  try {
    const country = await Country.create(req.body);
    res.status(201).json(country);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all countries
export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a country by ID
export const getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCountry = async (req, res) => {
  const { id } = req.params;
  const { name, flagname, teams } = req.body;

  const country = await Country.findById(id);
  if (country) {
    country.name = name || Country.name;
    country.flagname = flagname || Country.flagname;
    country.teams = teams || Country.teams;

    const updatedCountry = await country.save();

    res.status(200).json(updatedCountry);
  } else {
    return res.status(404).send(`No country with id: ${id}`);
  }
};


export const deleteCountry = async (req, res) => {
  const { id } = req.params;
  const country = await Country.findById(id);
  if (country) {
    await country.deleteOne({ _id: Country._id });
    res.json({ message: "Country deleted successfully." });
  } else {
    return res.status(404).send(`No Country with id: ${id}`);
  }
}; 
