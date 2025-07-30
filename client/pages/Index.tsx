import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Smartphone,
  Send,
  Mail,
  MessageSquare,
  Zap,
  Activity,
  Target,
  Settings,
  BarChart3,
  PieChart,
  Loader2,
  Eye,
  Ban,
  ThumbsUp,
  ThumbsDown,
  Download,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  riskScore: number;
  status: 'safe' | 'warning' | 'blocked' | 'flagged';
  timestamp: string;
  method: string;
  ipAddress?: string;
  userLocation?: string;
}

interface Merchant {
  name: string;
  trustScore: number;
  totalTransactions: number;
  flaggedCount: number;
}

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  isUser: boolean;
}

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [merchants] = useState<Merchant[]>([
    { name: "Amazon India", trustScore: 95, totalTransactions: 1250, flaggedCount: 2 },
    { name: "Flipkart", trustScore: 92, totalTransactions: 980, flaggedCount: 5 },
    { name: "Electronics World", trustScore: 23, totalTransactions: 45, flaggedCount: 18 },
    { name: "Local Store", trustScore: 78, totalTransactions: 125, flaggedCount: 8 }
  ]);

  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    fetchTransactions();
    fetchAnalytics();
    
    // Add welcome message to chat
    setChatMessages([{
      id: "welcome",
      message: "",
      response: "👋 Hello! I'm your AI Fraud Detection Assistant. I can help explain transaction risks, analyze fraud patterns, and answer security questions. How can I help you today?",
      timestamp: new Date().toISOString(),
      isUser: false
    }]);

    // Real-time transaction simulation
    const interval = setInterval(() => {
      simulateNewTransaction();
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
        setAlertCount(data.transactions.filter((t: Transaction) => 
          t.status === 'blocked' || t.status === 'flagged').length);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Fallback to sample data
      setTransactions([
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
          userLocation: "Mumbai, India"
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
          userLocation: "Mumbai, India"
        }
      ]);
      setAlertCount(1);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const simulateNewTransaction = async () => {
    try {
      const response = await fetch('/api/transactions/simulate', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(prev => [data.transaction, ...prev.slice(0, 9)]);
        if (data.transaction.status === 'flagged' || data.transaction.status === 'blocked') {
          setAlertCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to simulate transaction:', error);
    }
  };

  const handleBlockTransaction = async (transactionId: string, reason: string = "High risk score detected") => {
    setLoading(true);
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const response = await fetch('/api/transactions/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          reason,
          userEmail: "user@example.com"
        })
      });

      const data = await response.json();
      if (data.success) {
        setTransactions(prev =>
          prev.map(t => t.id === transactionId ? { ...t, status: 'blocked' as const } : t)
        );

        // Add to blockchain
        await addToBlockchain(transactionId, 'block', transaction, reason);

        // Send fraud alert email
        await sendFraudAlert(transactionId, reason);

        // Update analytics
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Failed to block transaction:', error);
    }
    setLoading(false);
  };

  const handleApproveTransaction = async (transactionId: string) => {
    setLoading(true);
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const response = await fetch('/api/transactions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });

      const data = await response.json();
      if (data.success) {
        setTransactions(prev =>
          prev.map(t => t.id === transactionId ? { ...t, status: 'safe' as const } : t)
        );
        setAlertCount(prev => Math.max(0, prev - 1));

        // Add to blockchain
        await addToBlockchain(transactionId, 'approve', transaction, "User approved transaction");

        fetchAnalytics();
      }
    } catch (error) {
      console.error('Failed to approve transaction:', error);
    }
    setLoading(false);
  };

  const addToBlockchain = async (transactionId: string, action: string, transaction: Transaction, reason: string) => {
    try {
      await fetch('/api/blockchain/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          action,
          amount: transaction.amount,
          merchant: transaction.merchant,
          location: transaction.location,
          riskScore: transaction.riskScore,
          reason,
          userAction: `Transaction ${action}ed by user`
        })
      });
    } catch (error) {
      console.error('Failed to add to blockchain:', error);
    }
  };

  const sendFraudAlert = async (transactionId: string, reason: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    try {
      await fetch('/api/email/fraud-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "user@example.com",
          transactionId,
          amount: transaction.amount,
          merchant: transaction.merchant,
          location: transaction.location,
          riskScore: transaction.riskScore,
          reason
        })
      });
    } catch (error) {
      console.error('Failed to send fraud alert:', error);
    }
  };

  const testSMTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email/test-smtp');
      const data = await response.json();
      alert(data.success ? "✅ SMTP Test Successful!" : "❌ SMTP Test Failed");
    } catch (error) {
      alert("❌ SMTP Test Failed - Check console");
    }
    setLoading(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput("");
    setChatLoading(true);
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      message: userMessage,
      response: "",
      timestamp: new Date().toISOString(),
      isUser: true
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          transactionId: selectedTransaction?.id,
          context: 'fraud-analysis'
        })
      });
      
      const data = await response.json();
      
      // Add bot response
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        message: "",
        response: data.response,
        timestamp: new Date().toISOString(),
        isUser: false
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        message: "",
        response: "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toISOString(),
        isUser: false
      }]);
    }
    
    setChatLoading(false);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-neon-red";
    if (score >= 60) return "text-neon-yellow"; 
    if (score >= 30) return "text-neon-yellow";
    return "text-neon-green";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      safe: "bg-neon-green text-background",
      warning: "bg-neon-yellow text-background", 
      blocked: "bg-neon-red text-background",
      flagged: "bg-neon-pink text-background"
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants] || "bg-gray-500"} neon-glow`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-neon-green";
    if (score >= 60) return "text-neon-yellow";
    return "text-neon-red";
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-neon-cyan neon-glow" />
              <h1 className="text-2xl font-bold text-neon-cyan animate-pulse-neon">FraudGuard AI</h1>
              <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple">
                v2.1 CYBER
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({alertCount})
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testSMTP}
                disabled={loading}
                className="border-neon-green text-neon-green hover:bg-neon-green hover:text-background"
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                Test SMTP
              </Button>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-background">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link to="/login">
                <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-background font-semibold neon-glow">
                  SG
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Alerts */}
        {alertCount > 0 && (
          <Alert className="mb-6 border-neon-red bg-neon-red/10 neon-border">
            <AlertTriangle className="h-4 w-4 text-neon-red" />
            <AlertDescription className="text-neon-red">
              <strong>🚨 FRAUD ALERT:</strong> {alertCount} suspicious transactions detected. Immediate action required.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 neon-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Risk Score</CardTitle>
              <Brain className="h-4 w-4 text-neon-purple neon-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-yellow">68/100</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
              <Progress value={68} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 neon-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Transactions Today</CardTitle>
              <CreditCard className="h-4 w-4 text-neon-cyan neon-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics?.totalTransactions || 1247}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-neon-green">+8.2%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 neon-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Blocked Frauds</CardTitle>
              <XCircle className="h-4 w-4 text-neon-red neon-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-red">{analytics?.blockedCount || 23}</div>
              <p className="text-xs text-muted-foreground">
                Saved ₹2,45,000 today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 neon-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">System Health</CardTitle>
              <Activity className="h-4 w-4 text-neon-green neon-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-green">99.8%</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-background">
              Live Transactions
            </TabsTrigger>
            <TabsTrigger value="merchants" className="data-[state=active]:bg-neon-purple data-[state=active]:text-background">
              Merchant Trust
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-neon-green data-[state=active]:text-background">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="data-[state=active]:bg-neon-pink data-[state=active]:text-background">
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Activity className="h-5 w-5 text-neon-cyan" />
                      Real-time Transaction Monitoring
                    </CardTitle>
                    <CardDescription>
                      Live feed with AI-powered fraud detection and instant blocking
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => simulateNewTransaction()}
                    variant="outline"
                    size="sm"
                    className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-background"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Simulate Transaction
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm neon-border">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="font-semibold text-foreground">₹{transaction.amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{transaction.merchant}</div>
                          <div className="text-xs text-muted-foreground">{transaction.method}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{transaction.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getRiskColor(transaction.riskScore)} neon-glow`}>
                            {transaction.riskScore}
                          </div>
                          <div className="text-xs text-muted-foreground">Risk Score</div>
                        </div>
                        {getStatusBadge(transaction.status)}
                        <div className="flex space-x-2">
                          {(transaction.status === 'flagged' || transaction.status === 'warning') && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleBlockTransaction(transaction.id)}
                                disabled={loading}
                                className="bg-neon-red hover:bg-neon-red/80 text-background"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveTransaction(transaction.id)}
                                disabled={loading}
                                className="border-neon-green text-neon-green hover:bg-neon-green hover:text-background"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTransaction(transaction)}
                            className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-background"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merchants">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-neon-purple" />
                  Merchant Trust Score Engine
                </CardTitle>
                <CardDescription>
                  ML-powered merchant reputation analysis with risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {merchants.map((merchant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm neon-border">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{merchant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {merchant.totalTransactions} transactions • {merchant.flaggedCount} flagged
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fraud Rate: {((merchant.flaggedCount / merchant.totalTransactions) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getTrustScoreColor(merchant.trustScore)} neon-glow`}>
                            {merchant.trustScore}
                          </div>
                          <div className="text-xs text-muted-foreground">Trust Score</div>
                        </div>
                        <Progress value={merchant.trustScore} className="w-24" />
                        <Badge className={`${merchant.trustScore >= 80 ? 'bg-neon-green' : merchant.trustScore >= 60 ? 'bg-neon-yellow' : 'bg-neon-red'} text-background`}>
                          {merchant.trustScore >= 80 ? 'TRUSTED' : merchant.trustScore >= 60 ? 'CAUTION' : 'HIGH RISK'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Fraud Detection Analytics</CardTitle>
                  <CardDescription>Pattern analysis and risk trends</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart3 className="h-16 w-16 text-neon-green mx-auto neon-glow" />
                    <div>
                      <p className="text-foreground">Advanced Analytics Dashboard</p>
                      <p className="text-sm text-muted-foreground">Real-time anomaly detection visualization</p>
                      <div className="flex justify-center space-x-4 mt-4">
                        <Badge className="bg-neon-red/20 text-neon-red">High Risk: {analytics?.riskDistribution?.high || 5}</Badge>
                        <Badge className="bg-neon-yellow/20 text-neon-yellow">Medium: {analytics?.riskDistribution?.medium || 12}</Badge>
                        <Badge className="bg-neon-green/20 text-neon-green">Low: {analytics?.riskDistribution?.low || 83}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Geographic Risk Heatmap</CardTitle>
                  <CardDescription>Location-based fraud patterns and geo-behavioral analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Globe className="h-16 w-16 text-neon-cyan mx-auto neon-glow" />
                    <div>
                      <p className="text-foreground">Geo-behavioral Mismatch Detection</p>
                      <p className="text-sm text-muted-foreground">Interactive map visualization</p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <Badge className="bg-neon-green/20 text-neon-green">Mumbai: Safe</Badge>
                        <Badge className="bg-neon-yellow/20 text-neon-yellow">Delhi: Medium</Badge>
                        <Badge className="bg-neon-red/20 text-neon-red">Moscow: High Risk</Badge>
                        <Badge className="bg-neon-purple/20 text-neon-purple">London: Blocked</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chatbot">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Brain className="h-5 w-5 text-neon-pink neon-glow" />
                  AI Fraud Detection Assistant
                </CardTitle>
                <CardDescription>
                  Get instant insights about transactions, risk analysis, and security recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border border-border/50 rounded-lg bg-background/30">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.isUser 
                            ? 'bg-neon-cyan text-background' 
                            : 'bg-card border border-border/50 text-foreground'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm">
                            {msg.isUser ? msg.message : msg.response}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-card border border-border/50 text-foreground p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about fraud detection, risk analysis, or security..."
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1"
                      disabled={chatLoading}
                    />
                    <Button 
                      onClick={sendChatMessage}
                      disabled={chatLoading || !chatInput.trim()}
                      className="bg-neon-pink hover:bg-neon-pink/80 text-background"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Why was my transaction flagged?", "How do risk scores work?", "Security tips", "What is geo-behavioral analysis?"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setChatInput(suggestion)}
                        className="text-xs border-neon-purple/50 text-neon-purple hover:bg-neon-purple hover:text-background"
                      >
                        {suggestion}
                      </Button>
                    ))}
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
