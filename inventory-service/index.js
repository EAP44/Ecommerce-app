const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3001;
require("./src/database/mongoose/mongoose");
const Inventory = require("./src/database/models/Inventory");

//----------------------------------------------------------Routes

// Create
app.post("/inventory", async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).send(inventory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get
app.get("/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get with id
app.get("/inventory/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).send({ error: "Inventory item not found" });
    }
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update
app.put("/inventory/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!inventory) {
      return res.status(404).send({ error: "Inventory item not found" });
    }
    res.status(200).send(inventory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete
app.delete("/inventory/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory) {
      return res.status(404).send({ error: "Inventory item not found" });
    }
    res.status(200).send({ message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`\nService de inventory en cours d'exécution sur le port ${port}`);
  console.log(`\n%c ->  URL : http://localhost:${port}`, "color:blue");
});
