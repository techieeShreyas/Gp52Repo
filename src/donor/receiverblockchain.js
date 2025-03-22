const crypto = require('crypto');
const connectToMongoDB = require('./mongodb');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash)
      .digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.initBlockchain();
  }

  async initBlockchain() {
    this.collection = await connectToMongoDB(receiver);
    await this.loadBlockchain();
  }

  async loadBlockchain() {
    const blocks = await this.collection.find().toArray();
    if (blocks.length === 0) {
      // If no blocks exist, create the genesis block
      const genesisBlock = this.createGenesisBlock();
      await this.collection.insertOne(genesisBlock);
      this.chain.push(genesisBlock);
    } else {
      // Load existing blocks from MongoDB
      this.chain = blocks;
    }
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), 'Genesis Block', '0');
  }

  async addBlock(data) {
    const latestBlock = this.chain[this.chain.length - 1];
    const newBlock = new Block(latestBlock.index + 1, Date.now(), data, latestBlock.hash);
    this.chain.push(newBlock);
    await this.collection.insertOne(newBlock);
  }

  async isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Blockchain;