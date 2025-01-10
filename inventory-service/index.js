const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3001;
require("./src/database/mongoose/mongoose");
const Inventory = require("./src/database/models/Inventory");



app.get("/health", (req, res) => {
  res.status(200).send({ status: "API is running" });
});



app.post("/inventory", async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).send(inventory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


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

app.get("/inventory/page", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const inventory = await Inventory.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).send(inventory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


app.get("/inventory/stats", async (req, res) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const totalValue = await Inventory.aggregate([
      { $group: { _id: null, totalValue: { $sum: "$price" } } }
    ]);

    res.status(200).send({
      totalItems,
      totalValue: totalValue[0]?.totalValue || 0
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.put("/inventory/archive/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true, runValidators: true }
    );
    if (!inventory) {
      return res.status(404).send({ error: "Inventory item not found" });
    }
    res.status(200).send(inventory);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/inventory/archived", async (req, res) => {
  try {
    const inventory = await Inventory.find({ archived: true });
    res.status(200).send(inventory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`\nService de inventory en cours d'exécution sur le port ${port}`);
  console.log(`\n%c ->  URL : http://localhost:${port}`, "color:blue");
});
