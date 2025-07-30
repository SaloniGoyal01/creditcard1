import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
// Fraud detection routes
import {
  getTransactions,
  blockTransaction,
  approveTransaction,
  getFraudAnalytics,
  simulateTransaction
} from "./routes/fraud";
import {
  sendEmail,
  sendOTP,
  sendFraudAlert,
  testSMTP
} from "./routes/smtp";
import {
  chatWithBot,
  getBotCapabilities,
  submitFeedback
} from "./routes/chatbot";
import {
  addToBlockchain,
  getBlockchain,
  getBlock,
  validateChain,
  getBlockchainStats,
  exportBlockchain
} from "./routes/blockchain";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // Fraud Detection API Routes
  app.get("/api/transactions", getTransactions);
  app.post("/api/transactions/block", blockTransaction);
  app.post("/api/transactions/approve", approveTransaction);
  app.get("/api/analytics", getFraudAnalytics);
  app.post("/api/transactions/simulate", simulateTransaction);

  // SMTP Email API Routes
  app.post("/api/email/send", sendEmail);
  app.post("/api/email/otp", sendOTP);
  app.post("/api/email/fraud-alert", sendFraudAlert);
  app.get("/api/email/test-smtp", testSMTP);

  // AI Chatbot API Routes
  app.post("/api/chatbot/message", chatWithBot);
  app.get("/api/chatbot/capabilities", getBotCapabilities);
  app.post("/api/chatbot/feedback", submitFeedback);

  return app;
}
