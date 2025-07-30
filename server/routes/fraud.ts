import { RequestHandler } from "express";

interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  riskScore: number;
  status: "safe" | "warning" | "blocked" | "flagged";
  timestamp: string;
  method: string;
  ipAddress?: string;
  userLocation?: string;
}

interface FraudBlockRequest {
  transactionId: string;
  reason: string;
  userEmail: string;
}

// In-memory storage for demo (use database in production)
let transactions: Transaction[] = [
  {
    id: "tx_001",
    amount: 2500,
    merchant: "Amazon India",
    location: "Mumbai, India",
    riskScore: 15,
    status: "safe",
    timestamp: new Date().toISOString(),
    method: "Credit Card ****1234",
    ipAddress: "192.168.1.1",
    userLocation: "Mumbai, India",
  },
  {
    id: "tx_002",
    amount: 50000,
    merchant: "Electronics World",
    location: "Moscow, Russia",
    riskScore: 89,
    status: "flagged",
    timestamp: new Date().toISOString(),
    method: "Credit Card ****1234",
    ipAddress: "185.220.101.45",
    userLocation: "Mumbai, India",
  },
];

// Get all transactions
export const getTransactions: RequestHandler = (req, res) => {
  res.json({
    success: true,
    transactions: transactions.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    ),
  });
};

// Block a fraudulent transaction
export const blockTransaction: RequestHandler = (req, res) => {
  const { transactionId, reason, userEmail } = req.body as FraudBlockRequest;

  const transaction = transactions.find((t) => t.id === transactionId);
  if (!transaction) {
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  }

  // Update transaction status
  transaction.status = "blocked";

  // Log the block action
  console.log(
    `Transaction ${transactionId} blocked by user. Reason: ${reason}`,
  );

  // Simulate sending fraud alert email
  sendFraudAlert(userEmail, transaction, reason);

  res.json({
    success: true,
    message: "Transaction blocked successfully",
    transaction,
  });
};

// Approve a flagged transaction
export const approveTransaction: RequestHandler = (req, res) => {
  const { transactionId } = req.body;

  const transaction = transactions.find((t) => t.id === transactionId);
  if (!transaction) {
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  }

  transaction.status = "safe";

  res.json({
    success: true,
    message: "Transaction approved successfully",
    transaction,
  });
};

// Get fraud analytics
export const getFraudAnalytics: RequestHandler = (req, res) => {
  const totalTransactions = transactions.length;
  const blockedCount = transactions.filter(
    (t) => t.status === "blocked",
  ).length;
  const flaggedCount = transactions.filter(
    (t) => t.status === "flagged",
  ).length;
  const safeCount = transactions.filter((t) => t.status === "safe").length;

  const avgRiskScore =
    transactions.reduce((sum, t) => sum + t.riskScore, 0) / totalTransactions;

  // Geographic analysis
  const locationCounts = transactions.reduce(
    (acc, t) => {
      acc[t.location] = (acc[t.location] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  res.json({
    success: true,
    analytics: {
      totalTransactions,
      blockedCount,
      flaggedCount,
      safeCount,
      avgRiskScore: Math.round(avgRiskScore),
      locationDistribution: locationCounts,
      riskDistribution: {
        high: transactions.filter((t) => t.riskScore >= 80).length,
        medium: transactions.filter(
          (t) => t.riskScore >= 40 && t.riskScore < 80,
        ).length,
        low: transactions.filter((t) => t.riskScore < 40).length,
      },
    },
  });
};

// Simulate adding a new transaction (for demo)
export const simulateTransaction: RequestHandler = (req, res) => {
  const newTransaction: Transaction = {
    id: `tx_${Math.random().toString(36).substr(2, 9)}`,
    amount: Math.floor(Math.random() * 50000) + 100,
    merchant: [
      "Amazon",
      "Flipkart",
      "PayTM",
      "Google Pay",
      "Unknown Merchant",
      "Electronics World",
    ][Math.floor(Math.random() * 6)],
    location:
      ["Mumbai", "Delhi", "Bangalore", "Chennai", "Moscow", "London"][
        Math.floor(Math.random() * 6)
      ] +
      ", " +
      (Math.random() > 0.7
        ? "India"
        : ["Russia", "UK", "USA"][Math.floor(Math.random() * 3)]),
    riskScore: Math.floor(Math.random() * 100),
    status:
      Math.random() > 0.7
        ? "flagged"
        : Math.random() > 0.5
          ? "warning"
          : "safe",
    timestamp: new Date().toISOString(),
    method: `Credit Card ****${Math.floor(Math.random() * 9000) + 1000}`,
    ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userLocation: "Mumbai, India",
  } as Transaction;

  // Auto-block high-risk transactions
  if (newTransaction.riskScore >= 85) {
    newTransaction.status = "blocked";
  }

  transactions.unshift(newTransaction);

  res.json({
    success: true,
    transaction: newTransaction,
  });
};

// Helper function to simulate sending fraud alert
function sendFraudAlert(
  email: string,
  transaction: Transaction,
  reason: string,
) {
  console.log("🚨 FRAUD ALERT EMAIL SIMULATION 🚨");
  console.log("To:", email);
  console.log("Subject: URGENT - Fraudulent Transaction Blocked");
  console.log("Body:");
  console.log(`
    Dear User,
    
    A potentially fraudulent transaction has been blocked on your account:
    
    Transaction ID: ${transaction.id}
    Amount: ₹${transaction.amount.toLocaleString()}
    Merchant: ${transaction.merchant}
    Location: ${transaction.location}
    Risk Score: ${transaction.riskScore}/100
    Reason: ${reason}
    Time: ${new Date(transaction.timestamp).toLocaleString()}
    
    Your account remains secure. No action is required from your side.
    
    Best regards,
    FraudGuard AI Security Team
  `);
  console.log("=".repeat(50));
}
