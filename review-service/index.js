const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3002;
require("./src/database/mongoose/mongoose");
const Review = require("./src/database/models/review");

//--------------------------------------------------------Routes

// Create
app.post('/reviews', async (req, res) => {
    try {
      const review = new Review(req.body);
      await review.save();
      res.status(201).send(review);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
  
  // Get
  app.get('/reviews', async (req, res) => {
    try {
      const reviews = await Review.find();
      res.status(200).send(reviews);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
  // Get with id
  app.get('/reviews/:id', async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).send({ error: "Review not found" });
      }
      res.status(200).send(review);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
  // Update
  app.put('/reviews/:id', async (req, res) => {
    try {
      const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!review) {
        return res.status(404).send({ error: "Review not found" });
      }
      res.status(200).send(review);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
  
  // Delete
  app.delete('/reviews/:id', async (req, res) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) {
        return res.status(404).send({ error: "Review not found" });
      }
      res.status(200).send({ message: 'Review deleted' });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

app.listen(port, () => {
    console.log(`\nService de reviews en cours d'exécution sur le port ${port}`);
    console.log(`\n%c ->  URL : http://localhost:${port}`, "color:blue");
  });
