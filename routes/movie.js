const router = require("express").Router();
const Movie = require("../models/movie"); // Adjust the path according to your structure
const { verifyToken } = require("../validation"); // Assuming you want to protect some routes

// CREATE a new movie
router.post("/", verifyToken, (req, res) => {
    const newMovie = req.body;
    Movie.create(newMovie)
        .then(movie => res.status(201).send(movie))
        .catch(err => res.status(500).send({ message: err.message }));
});

// GET all movies
router.get("/", (req, res) => {
    Movie.find()
        .then(movies => res.send(movies))
        .catch(err => res.status(500).send({ message: err.message }));
});

// GET movies currently in theaters
router.get("/inTheaters", (req, res) => {
    Movie.find({ inTheaters: true })
        .then(movies => res.send(movies))
        .catch(err => res.status(500).send({ message: err.message }));
});

// GET a single movie by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    Movie.findById(id)
        .then(movie => {
            if (!movie) {
                return res.status(404).send({ message: `Movie with id=${id} not found` });
            }
            res.send(movie);
        })
        .catch(err => res.status(500).send({ message: `Error retrieving movie with id=${id}` }));
});

// UPDATE a movie by ID
router.put("/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    Movie.findByIdAndUpdate(id, req.body, { new: true })
        .then(movie => {
            if (!movie) {
                return res.status(404).send({ message: `Cannot update movie with id=${id}` });
            }
            res.send({ message: "Movie was successfully updated!" });
        })
        .catch(err => res.status(500).send({ message: `Error updating movie with id=${id}` }));
});

// DELETE a movie by ID
router.delete("/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    Movie.findByIdAndDelete(id)
        .then(movie => {
            if (!movie) {
                return res.status(404).send({ message: `Cannot delete movie with id=${id}` });
            }
            res.send({ message: "Movie was successfully deleted!" });
        })
        .catch(err => res.status(500).send({ message: `Error deleting movie with id=${id}` }));
});

module.exports = router;
