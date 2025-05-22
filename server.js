// Entry point for Express.js server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loanledger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const loanSchema = new mongoose.Schema({
  borrower: String,
  amount: Number,
  interest: Number,
  dueDate: String,
  status: String,
});

const Loan = mongoose.model('Loan', loanSchema);

// CRUD APIs
app.get('/api/loans', async (req, res) => {
  const loans = await Loan.find();
  res.json(loans);
});

app.post('/api/loans', async (req, res) => {
  const loan = new Loan(req.body);
  await loan.save();
  res.json(loan);
});

app.put('/api/loans/:id', async (req, res) => {
  const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(loan);
});

app.delete('/api/loans/:id', async (req, res) => {
  await Loan.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
