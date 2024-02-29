const router = require("express").Router();
const product = require("../models/product");
const {verifyToken} = require("../validation");

module.exports = router;
// CREATE Product ---post

// router.post("/", (req, res) => {
//     data = req.body;

//     product.insertMany(data).then(data => res.send(data))
//     .catch(err => res.status(500).send({message: err.message}))
// });

// create Product
router.post("/", verifyToken,(req, res) => {
    const newData = req.body;
    product.create(newData)
        .then(createdData => res.status(201).res.send(createdData))
        .catch(err => res.status(500).send({message: err.message}));
});

// Get Products
router.get("/", (req, res) => 
{
    product.find()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({message: err.message}))
});
// Get products in stock
router.get("/inStock", (req, res) =>
{
    product.find({inStock: true})
    .then(data => res.send(data))
    .catch(err => res.status(500).send({message: err.message}))
});
// Get Products by ID
router.get("/:id", (req, res) => 
{
    product.findById(req.params.id)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({message: err.message}))
});

// Update product
router.put("/:id", (req, res) => {
    const { id } = req.params;
    product.findOneAndUpdate({ _id: id }, req.body, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: `Cannot update product with id=${id}` });
            }
            res.send({ message: "Product was successfully updated!" });
        })
        .catch(err => res.status(500).send({ message: `Error updating product with id=${id}` }));
});


// Delete Product by ID
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    product.findOneAndDelete({ _id: id })
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: `Cannot delete product with id=${id}` });
            }
            res.send({ message: "Product was successfully deleted!" });
        })
        .catch(err => res.status(500).send({ message: `Error deleting product with id=${id}` }));
});



