import { RequestHandler } from "express";

interface ChatRequest {
  message: string;
  transactionId?: string;
  context?: 'fraud-analysis' | 'general' | 'transaction-inquiry';
}

interface ChatResponse {
  success: boolean;
  response: string;
  suggestions?: string[];
  riskFactors?: string[];
  confidence?: number;
}

// Pre-defined AI responses for fraud-related queries
const fraudResponses = {
  "why flagged": [
    "This transaction was flagged due to multiple risk factors:",
    "• **Location Mismatch**: Transaction location differs from your usual spending pattern",
    "• **High Amount**: Unusually large transaction amount compared to your history",
    "• **Merchant Risk**: This merchant has a lower trust score based on fraud patterns",
    "• **Time Pattern**: Transaction occurred outside your normal spending hours",
    "• **Device/IP**: Different device or IP address detected"
  ],
  
  "high risk score": [
    "The high risk score (80+) indicates multiple red flags:",
    "• **Geographic Anomaly**: Transaction from unusual location",
    "• **Behavioral Pattern**: Doesn't match your typical spending behavior",
    "• **Merchant Analysis**: Merchant flagged in our risk database",
    "• **Velocity Check**: Multiple transactions in short time frame",
    "• **AI Model Prediction**: Machine learning model detected suspicious patterns"
  ],
  
  "false positive": [
    "I understand this might be a legitimate transaction. Here's what you can do:",
    "• Click **'Mark as Safe'** to approve this transaction",
    "• This helps train our AI model for better accuracy",
    "• Your feedback improves future fraud detection",
    "• The merchant will be added to your trusted list",
    "• Similar transactions will have lower risk scores in future"
  ],
  
  "security tips": [
    "Here are key security tips to protect your account:",
    "• **Enable 2FA**: Use voice or biometric authentication",
    "• **Monitor Alerts**: Keep email and WhatsApp notifications on",
    "• **Review Transactions**: Check your account regularly",
    "• **Secure Networks**: Avoid public WiFi for transactions",
    "• **Update Contacts**: Keep your phone number and email current",
    "• **Report Suspicious**: Immediately report unknown transactions"
  ]
};

const responseTemplates = {
  greeting: [
    "Hello! I'm your AI Fraud Detection Assistant. How can I help you today?",
    "Hi there! I'm here to help with fraud analysis and security questions. What can I assist you with?",
    "Welcome! I can explain transaction risks, analyze fraud patterns, or answer security questions."
  ],
  
  transaction_analysis: [
    "Let me analyze this transaction for you...",
    "I'll break down the risk factors for this transaction:",
    "Here's my analysis of this potentially suspicious activity:"
  ],
  
  general_help: [
    "I can help with:",
    "• Explaining why transactions were flagged",
    "• Analyzing risk scores and fraud patterns", 
    "• Providing security recommendations",
    "• Helping with false positive reports",
    "• Explaining our AI detection methods"
  ]
};

export const chatWithBot: RequestHandler = (req, res) => {
  const { message, transactionId, context = 'general' } = req.body as ChatRequest;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      response: "Please provide a message to analyze."
    });
  }
  
  const lowerMessage = message.toLowerCase();
  let response: ChatResponse;
  
  // Simulate AI processing delay
  setTimeout(() => {
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("help")) {
      response = {
        success: true,
        response: responseTemplates.greeting[Math.floor(Math.random() * responseTemplates.greeting.length)],
        suggestions: [
          "Why was my transaction flagged?",
          "How do I report a false positive?",
          "What security features are available?",
          "Explain risk scores"
        ],
        confidence: 95
      };
    }
    else if (lowerMessage.includes("why") && (lowerMessage.includes("flag") || lowerMessage.includes("block"))) {
      response = {
        success: true,
        response: fraudResponses["why flagged"].join("\n"),
        riskFactors: [
          "Location anomaly detected",
          "Merchant risk assessment",
          "Behavioral pattern mismatch",
          "Transaction velocity analysis"
        ],
        confidence: 88
      };
    }
    else if (lowerMessage.includes("risk score") || lowerMessage.includes("high risk")) {
      response = {
        success: true,
        response: fraudResponses["high risk score"].join("\n"),
        suggestions: [
          "How to improve my risk score?",
          "What affects risk calculation?",
          "Can I whitelist merchants?"
        ],
        confidence: 92
      };
    }
    else if (lowerMessage.includes("false positive") || lowerMessage.includes("legitimate") || lowerMessage.includes("not fraud")) {
      response = {
        success: true,
        response: fraudResponses["false positive"].join("\n"),
        suggestions: [
          "Mark transaction as safe",
          "Add merchant to trusted list",
          "Update location preferences"
        ],
        confidence: 96
      };
    }
    else if (lowerMessage.includes("security") || lowerMessage.includes("protect") || lowerMessage.includes("safe")) {
      response = {
        success: true,
        response: fraudResponses["security tips"].join("\n"),
        suggestions: [
          "Enable biometric authentication",
          "Set up voice verification", 
          "Configure alert preferences",
          "Review trusted locations"
        ],
        confidence: 94
      };
    }
    else if (lowerMessage.includes("location") || lowerMessage.includes("country") || lowerMessage.includes("moscow") || lowerMessage.includes("russia")) {
      response = {
        success: true,
        response: "🌍 **Location-based Risk Analysis:**\n\n" +
                 "I detected this transaction from an unusual location. Here's why it was flagged:\n\n" +
                 "• Your typical transactions are from **Mumbai, India**\n" +
                 "• This transaction originated from **Moscow, Russia**\n" +
                 "• **Geographic risk**: High-risk country for card fraud\n" +
                 "• **Travel pattern**: No recent travel history to this location\n" +
                 "• **IP analysis**: VPN or proxy usage detected\n\n" +
                 "**Recommendation**: If you're traveling, please update your travel plans in settings.",
        riskFactors: [
          "Geographic mismatch (7,000+ km from usual location)",
          "High-risk country classification",
          "No travel notification on file",
          "Suspicious IP characteristics"
        ],
        confidence: 91
      };
    }
    else if (lowerMessage.includes("merchant") || lowerMessage.includes("trust score") || lowerMessage.includes("electronics world")) {
      response = {
        success: true,
        response: "🏪 **Merchant Risk Analysis:**\n\n" +
                 "The merchant 'Electronics World' has triggered several risk indicators:\n\n" +
                 "• **Trust Score**: 23/100 (High Risk)\n" +
                 "• **Fraud History**: 18 flagged transactions out of 45 total\n" +
                 "• **Pattern Analysis**: Common in card cloning schemes\n" +
                 "• **Verification Status**: Unverified business credentials\n" +
                 "• **User Reports**: Multiple fraud complaints\n\n" +
                 "**Recommendation**: This merchant is not recommended for transactions.",
        riskFactors: [
          "Low merchant trust score (23/100)",
          "High fraud-to-transaction ratio (40%)",
          "Unverified business status",
          "Multiple user complaints"
        ],
        confidence: 89
      };
    }
    else if (lowerMessage.includes("amount") || lowerMessage.includes("50000") || lowerMessage.includes("large")) {
      response = {
        success: true,
        response: "💰 **Transaction Amount Analysis:**\n\n" +
                 "The transaction amount of ₹50,000 raised flags because:\n\n" +
                 "• **Historical Pattern**: Your average transaction is ₹2,500\n" +
                 "• **Spending Limit**: 20x higher than your usual amount\n" +
                 "• **Velocity Check**: Large amount in single transaction\n" +
                 "• **Risk Threshold**: Exceeds high-value transaction limit\n" +
                 "• **Behavioral Model**: Doesn't match your spending profile\n\n" +
                 "**Note**: Large transactions require additional verification.",
        suggestions: [
          "Set up high-value transaction alerts",
          "Enable voice confirmation for large amounts",
          "Update spending limits in preferences"
        ],
        confidence: 93
      };
    }
    else if (lowerMessage.includes("ai") || lowerMessage.includes("machine learning") || lowerMessage.includes("algorithm")) {
      response = {
        success: true,
        response: "🤖 **AI Fraud Detection Explained:**\n\n" +
                 "Our AI system uses advanced machine learning to detect fraud:\n\n" +
                 "• **Neural Networks**: Deep learning models analyze transaction patterns\n" +
                 "• **Real-time Scoring**: Each transaction gets instant risk assessment\n" +
                 "• **Behavioral Analysis**: Your spending habits create a unique profile\n" +
                 "• **Anomaly Detection**: Statistical methods identify unusual patterns\n" +
                 "• **Continuous Learning**: System improves with each transaction\n" +
                 "• **Multi-factor Analysis**: 50+ data points evaluated per transaction\n\n" +
                 "**Accuracy**: 94.7% fraud detection with 2.1% false positive rate",
        suggestions: [
          "Learn more about risk factors",
          "View your behavioral profile",
          "Understand scoring methodology"
        ],
        confidence: 97
      };
    }
    else {
      // General AI response for unrecognized queries
      response = {
        success: true,
        response: "🤔 I understand you're asking about fraud detection. Let me help:\n\n" +
                 responseTemplates.general_help.join("\n") + "\n\n" +
                 "Could you be more specific about what you'd like to know? I'm here to explain any aspect of our fraud detection system.",
        suggestions: [
          "Why was my transaction flagged?",
          "How do risk scores work?", 
          "What should I do if it's not fraud?",
          "How can I improve security?"
        ],
        confidence: 75
      };
    }
    
    res.json(response);
  }, Math.random() * 1000 + 500); // Simulate AI processing time
};

// Get chatbot capabilities
export const getBotCapabilities: RequestHandler = (req, res) => {
  res.json({
    success: true,
    capabilities: {
      fraud_analysis: [
        "Explain transaction flagging reasons",
        "Break down risk scores",
        "Analyze merchant trust scores",
        "Geographic risk assessment",
        "Behavioral pattern analysis"
      ],
      user_assistance: [
        "Handle false positive reports",
        "Security recommendations", 
        "Account protection tips",
        "Alert configuration help",
        "Travel notification guidance"
      ],
      technical_info: [
        "AI model explanations",
        "Machine learning insights",
        "Detection methodology",
        "Accuracy statistics",
        "System capabilities"
      ]
    },
    supported_languages: [
      "English",
      "Hindi (हिंदी)",
      "Tamil (தமிழ்)",
      "Bengali (বাংলা)"
    ],
    confidence_threshold: 70,
    response_time: "< 2 seconds",
    learning_enabled: true
  });
};

// Submit feedback to improve AI responses
export const submitFeedback: RequestHandler = (req, res) => {
  const { message, response, helpful, rating, comments } = req.body;
  
  console.log("🧠 AI FEEDBACK RECEIVED 🧠");
  console.log("=".repeat(40));
  console.log("User Message:", message);
  console.log("Bot Response Quality:", helpful ? "Helpful" : "Not Helpful");
  console.log("Rating:", rating + "/5");
  console.log("Comments:", comments);
  console.log("Timestamp:", new Date().toISOString());
  console.log("=".repeat(40));
  console.log("✅ Feedback logged for model improvement");
  
  res.json({
    success: true,
    message: "Thank you for your feedback! This helps improve our AI responses.",
    feedbackId: `feedback_${Math.random().toString(36).substr(2, 9)}`,
    modelUpdate: "Feedback will be included in next training cycle"
  });
};
