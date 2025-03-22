const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const blockchain = new Blockchain();

// Endpoint to add data to the blockchain
app.post('/addData', async (req, res) => {
  const { data } = req.body;
  await blockchain.addBlock(data);
  res.json({ message: 'Data added to the blockchain!' });
});

// Endpoint to view the blockchain
app.get('/blockchain', async (req, res) => {
  res.json(blockchain.chain);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});