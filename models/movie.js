const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    releaseYear: { type: Number },
    genres: [String], // Array of strings
    inTheaters: { type: Boolean, default: false }
});

module.exports = mongoose.model("Movie", movieSchema);
