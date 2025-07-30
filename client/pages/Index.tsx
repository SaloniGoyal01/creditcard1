import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Globe, 
  CreditCard, 
  Users, 
  Brain,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Smartphone
} from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  riskScore: number;
  status: 'safe' | 'warning' | 'blocked' | 'flagged';
  timestamp: string;
  method: string;
}

interface Merchant {
  name: string;
  trustScore: number;
  totalTransactions: number;
  flaggedCount: number;
}

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx_001",
      amount: 2500,
      merchant: "Amazon India",
      location: "Mumbai, India",
      riskScore: 15,
      status: "safe",
      timestamp: "2024-01-15 14:30:22",
      method: "Credit Card ****1234"
    },
    {
      id: "tx_002", 
      amount: 50000,
      merchant: "Electronics World",
      location: "Moscow, Russia",
      riskScore: 89,
      status: "blocked",
      timestamp: "2024-01-15 14:28:15",
      method: "Credit Card ****1234"
    },
    {
      id: "tx_003",
      amount: 1200,
      merchant: "Coffee House",
      location: "Delhi, India", 
      riskScore: 45,
      status: "warning",
      timestamp: "2024-01-15 14:25:10",
      method: "Debit Card ****5678"
    }
  ]);

  const [merchants] = useState<Merchant[]>([
    { name: "Amazon India", trustScore: 95, totalTransactions: 1250, flaggedCount: 2 },
    { name: "Flipkart", trustScore: 92, totalTransactions: 980, flaggedCount: 5 },
    { name: "Electronics World", trustScore: 23, totalTransactions: 45, flaggedCount: 18 },
    { name: "Local Store", trustScore: 78, totalTransactions: 125, flaggedCount: 8 }
  ]);

  const [alertCount, setAlertCount] = useState(3);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time transaction monitoring
      const newTransaction: Transaction = {
        id: `tx_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.floor(Math.random() * 10000) + 100,
        merchant: ["Amazon", "Flipkart", "PayTM", "Google Pay", "Unknown Merchant"][Math.floor(Math.random() * 5)],
        location: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Unknown"][Math.floor(Math.random() * 5)] + ", India",
        riskScore: Math.floor(Math.random() * 100),
        status: Math.random() > 0.7 ? "flagged" : Math.random() > 0.5 ? "warning" : "safe",
        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
        method: `Credit Card ****${Math.floor(Math.random() * 9000) + 1000}`
      } as Transaction;
      
      setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-fraud-high-risk";
    if (score >= 60) return "text-fraud-medium-risk"; 
    if (score >= 30) return "text-fraud-low-risk";
    return "text-fraud-safe";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      safe: "bg-fraud-safe text-white",
      warning: "bg-fraud-warning text-white", 
      blocked: "bg-fraud-high-risk text-white",
      flagged: "bg-fraud-alert text-white"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-500"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-trust-high";
    if (score >= 60) return "text-trust-medium";
    return "text-trust-low";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-security-primary" />
              <h1 className="text-2xl font-bold text-gray-900">FraudGuard AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({alertCount})
              </Button>
              <Button variant="outline" size="sm">
                <Smartphone className="h-4 w-4 mr-2" />
                Voice Auth
              </Button>
              <div className="w-8 h-8 bg-security-primary rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Alerts */}
        {transactions.filter(t => t.status === 'blocked' || t.status === 'flagged').length > 0 && (
          <Alert className="mb-6 border-fraud-alert bg-red-50">
            <AlertTriangle className="h-4 w-4 text-fraud-alert" />
            <AlertDescription className="text-fraud-alert">
              <strong>Fraud Alert:</strong> {transactions.filter(t => t.status === 'blocked' || t.status === 'flagged').length} suspicious transactions detected in the last hour.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fraud-medium-risk">68/100</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
              <Progress value={68} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-fraud-safe">+8.2%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked Frauds</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fraud-high-risk">23</div>
              <p className="text-xs text-muted-foreground">
                Saved ₹2,45,000 today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-fraud-safe">99.8%</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Live Transactions</TabsTrigger>
            <TabsTrigger value="merchants">Merchant Trust</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Real-time Transaction Monitoring
                </CardTitle>
                <CardDescription>
                  Live feed of transactions with AI-powered fraud detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="font-semibold">₹{transaction.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{transaction.merchant}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{transaction.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getRiskColor(transaction.riskScore)}`}>
                            {transaction.riskScore}
                          </div>
                          <div className="text-xs text-gray-500">Risk Score</div>
                        </div>
                        {getStatusBadge(transaction.status)}
                        <div className="text-xs text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {transaction.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merchants">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Merchant Trust Score Engine
                </CardTitle>
                <CardDescription>
                  ML-powered merchant reputation analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {merchants.map((merchant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold">{merchant.name}</div>
                        <div className="text-sm text-gray-500">
                          {merchant.totalTransactions} transactions • {merchant.flaggedCount} flagged
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getTrustScoreColor(merchant.trustScore)}`}>
                            {merchant.trustScore}
                          </div>
                          <div className="text-xs text-gray-500">Trust Score</div>
                        </div>
                        <Progress value={merchant.trustScore} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fraud Detection Analytics</CardTitle>
                  <CardDescription>Pattern analysis and risk trends</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mb-4" />
                  <div className="text-center">
                    <p>Advanced analytics dashboard</p>
                    <p className="text-sm">Anomaly detection visualization coming soon</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Risk Heatmap</CardTitle>
                  <CardDescription>Location-based fraud patterns</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center text-gray-500">
                  <Globe className="h-12 w-12 mb-4" />
                  <div className="text-center">
                    <p>Geo-behavioral mismatch detection</p>
                    <p className="text-sm">Interactive map visualization</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chatbot">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Fraud Prediction AI Assistant
                </CardTitle>
                <CardDescription>
                  Get instant insights about transactions and security recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-security-primary" />
                    <h3 className="text-lg font-semibold mb-2">AI Fraud Detection Chatbot</h3>
                    <p className="mb-4">Ask me about transaction risks, security recommendations, or fraud patterns</p>
                    <Button className="bg-security-primary hover:bg-security-secondary">
                      Start Conversation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
