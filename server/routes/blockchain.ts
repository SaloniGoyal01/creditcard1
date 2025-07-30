import { RequestHandler } from "express";
import * as crypto from "crypto";

interface BlockchainTransaction {
  id: string;
  transactionId: string;
  blockHash: string;
  previousHash: string;
  timestamp: string;
  data: {
    action: "block" | "approve" | "flag" | "create";
    amount: number;
    merchant: string;
    location: string;
    riskScore: number;
    reason?: string;
    userAction?: string;
  };
  nonce: number;
  merkleRoot: string;
}

// In-memory blockchain storage (use persistent storage in production)
let blockchain: BlockchainTransaction[] = [];

// Genesis block
if (blockchain.length === 0) {
  const genesisBlock: BlockchainTransaction = {
    id: "genesis",
    transactionId: "genesis",
    blockHash:
      "0000000000000000000000000000000000000000000000000000000000000000",
    previousHash: "0",
    timestamp: new Date().toISOString(),
    data: {
      action: "create",
      amount: 0,
      merchant: "System Genesis",
      location: "System",
      riskScore: 0,
      reason: "Blockchain initialization",
    },
    nonce: 0,
    merkleRoot: "genesis",
  };
  blockchain.push(genesisBlock);
}

// Calculate SHA-256 hash
function calculateHash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// Mine block with proof of work (simplified)
function mineBlock(
  transactionId: string,
  previousHash: string,
  data: BlockchainTransaction["data"],
): BlockchainTransaction {
  const timestamp = new Date().toISOString();
  let nonce = 0;
  let hash = "";

  // Simple proof of work - find hash starting with "0000"
  do {
    nonce++;
    const blockString = `${transactionId}${previousHash}${timestamp}${JSON.stringify(data)}${nonce}`;
    hash = calculateHash(blockString);
  } while (!hash.startsWith("0000"));

  // Calculate Merkle root (simplified - just hash the data)
  const merkleRoot = calculateHash(JSON.stringify(data));

  const block: BlockchainTransaction = {
    id: `block_${blockchain.length}`,
    transactionId,
    blockHash: hash,
    previousHash,
    timestamp,
    data,
    nonce,
    merkleRoot,
  };

  return block;
}

// Add transaction to blockchain
export const addToBlockchain: RequestHandler = (req, res) => {
  const {
    transactionId,
    action,
    amount,
    merchant,
    location,
    riskScore,
    reason,
    userAction,
  } = req.body;

  if (!transactionId || !action) {
    return res.status(400).json({
      success: false,
      message: "Transaction ID and action are required",
    });
  }

  const previousBlock = blockchain[blockchain.length - 1];
  const previousHash = previousBlock.blockHash;

  const blockData = {
    action,
    amount: amount || 0,
    merchant: merchant || "Unknown",
    location: location || "Unknown",
    riskScore: riskScore || 0,
    reason,
    userAction,
  };

  console.log("⛓️  BLOCKCHAIN MINING STARTED ⛓️");
  console.log("=".repeat(50));
  console.log("Transaction ID:", transactionId);
  console.log("Action:", action);
  console.log("Previous Hash:", previousHash);
  console.log("Mining new block...");

  const newBlock = mineBlock(transactionId, previousHash, blockData);
  blockchain.push(newBlock);

  console.log("✅ Block mined successfully!");
  console.log("Block Hash:", newBlock.blockHash);
  console.log("Nonce:", newBlock.nonce);
  console.log("Block Height:", blockchain.length - 1);
  console.log("=".repeat(50));

  res.json({
    success: true,
    message: "Transaction added to blockchain",
    block: newBlock,
    blockHeight: blockchain.length - 1,
    chainLength: blockchain.length,
  });
};

// Get blockchain history
export const getBlockchain: RequestHandler = (req, res) => {
  res.json({
    success: true,
    blockchain: blockchain.slice().reverse(), // Show newest first
    chainLength: blockchain.length,
    lastBlockHash: blockchain[blockchain.length - 1].blockHash,
    isValid: validateBlockchain(),
  });
};

// Get specific block
export const getBlock: RequestHandler = (req, res) => {
  const { blockHash } = req.params;

  const block = blockchain.find((b) => b.blockHash === blockHash);

  if (!block) {
    return res.status(404).json({
      success: false,
      message: "Block not found",
    });
  }

  res.json({
    success: true,
    block,
    position: blockchain.indexOf(block),
    nextBlock: blockchain[blockchain.indexOf(block) + 1]?.blockHash || null,
    previousBlock: blockchain[blockchain.indexOf(block) - 1]?.blockHash || null,
  });
};

// Validate blockchain integrity
export const validateChain: RequestHandler = (req, res) => {
  const isValid = validateBlockchain();
  const validationResult = performDetailedValidation();

  res.json({
    success: true,
    isValid,
    validationDetails: validationResult,
    totalBlocks: blockchain.length,
    lastValidated: new Date().toISOString(),
  });
};

// Helper function to validate blockchain
function validateBlockchain(): boolean {
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    // Check if current block's previous hash matches previous block's hash
    if (currentBlock.previousHash !== previousBlock.blockHash) {
      return false;
    }

    // Verify the hash
    const blockString = `${currentBlock.transactionId}${currentBlock.previousHash}${currentBlock.timestamp}${JSON.stringify(currentBlock.data)}${currentBlock.nonce}`;
    const calculatedHash = calculateHash(blockString);

    if (currentBlock.blockHash !== calculatedHash) {
      return false;
    }

    // Check proof of work
    if (!currentBlock.blockHash.startsWith("0000")) {
      return false;
    }
  }

  return true;
}

// Detailed validation for audit purposes
function performDetailedValidation() {
  const results = [];

  for (let i = 0; i < blockchain.length; i++) {
    const block = blockchain[i];
    const validation = {
      blockIndex: i,
      blockHash: block.blockHash,
      isValid: true,
      issues: [] as string[],
    };

    if (i > 0) {
      const previousBlock = blockchain[i - 1];

      // Check previous hash link
      if (block.previousHash !== previousBlock.blockHash) {
        validation.isValid = false;
        validation.issues.push("Previous hash mismatch");
      }
    }

    // Verify hash
    const blockString = `${block.transactionId}${block.previousHash}${block.timestamp}${JSON.stringify(block.data)}${block.nonce}`;
    const calculatedHash = calculateHash(blockString);

    if (block.blockHash !== calculatedHash) {
      validation.isValid = false;
      validation.issues.push("Hash verification failed");
    }

    // Check proof of work (except genesis)
    if (i > 0 && !block.blockHash.startsWith("0000")) {
      validation.isValid = false;
      validation.issues.push("Proof of work validation failed");
    }

    results.push(validation);
  }

  return results;
}

// Get blockchain statistics
export const getBlockchainStats: RequestHandler = (req, res) => {
  const stats = {
    totalBlocks: blockchain.length,
    totalTransactions: blockchain.length - 1, // Exclude genesis
    actionBreakdown: blockchain.reduce(
      (acc, block) => {
        if (block.data.action) {
          acc[block.data.action] = (acc[block.data.action] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    ),
    averageBlockTime: calculateAverageBlockTime(),
    chainSize: JSON.stringify(blockchain).length,
    lastBlockTime: blockchain[blockchain.length - 1].timestamp,
    isChainValid: validateBlockchain(),
  };

  res.json({
    success: true,
    stats,
  });
};

function calculateAverageBlockTime(): number {
  if (blockchain.length < 2) return 0;

  let totalTime = 0;
  for (let i = 1; i < blockchain.length; i++) {
    const currentTime = new Date(blockchain[i].timestamp).getTime();
    const previousTime = new Date(blockchain[i - 1].timestamp).getTime();
    totalTime += currentTime - previousTime;
  }

  return totalTime / (blockchain.length - 1);
}

// Export blockchain data for audit
export const exportBlockchain: RequestHandler = (req, res) => {
  const exportData = {
    exportTime: new Date().toISOString(),
    chainLength: blockchain.length,
    isValid: validateBlockchain(),
    blockchain: blockchain,
    integrity: {
      totalHashes: blockchain.length,
      validHashes: blockchain.filter(
        (b) => b.blockHash.startsWith("0000") || b.id === "genesis",
      ).length,
      lastValidation: new Date().toISOString(),
    },
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=blockchain_export.json",
  );
  res.json(exportData);
};
