const express = require("express");
const mongoose = require("mongoose");
const simCard = require("./models/simCard");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());




// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/simcarddb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));







// Activate SIM Card
app.post('/api/activate', async (req, res) => {
  const { sim_number } = req.body;

  try {
    let simCard = await simCard.findOne({ sim_number });

    if (!simCard) {
      return res.status(404).json({ error: 'SIM card not found' });
    }

    if (simCard.status === 'active') {
      return res.status(400).json({ error: 'SIM card is already active' });
    }

    simCard.status = 'active';
    simCard.activation_date = new Date();
    await simCard.save();

    res.status(200).json({ message: 'SIM card activated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Deactivate SIM Card
app.post('/api/deactivate', async (req, res) => {
  const { sim_number } = req.body;

  try {
    let simCard = await simCard.findOne({ sim_number });
//edge case1
    if (!simCard) {
      return res.status(404).json({ error: 'SIM card not found' });
    }
//edge case2
    if (simCard.status === 'inactive') {
      return res.status(400).json({ error: 'SIM card is already inactive' });
    }

    simCard.status = 'inactive';
    simCard.activation_date = null;
    await simCard.save();

    res.status(200).json({ message: 'SIM card deactivated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get SIM Details
app.get('/api/sim-details/:simNumber', async (req, res) => {
  try {
    const simCard = await simCard.findOne({ sim_number: req.params.simNumber });

    if (!simCard) {
      return res.status(404).json({ error: 'SIM card not found' });
    }

    res.status(200).json(simCard);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


