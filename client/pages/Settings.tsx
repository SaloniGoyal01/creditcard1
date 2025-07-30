import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Settings as SettingsIcon,
  Bell,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  Download,
  CheckCircle,
  AlertTriangle,
  Link as Chain,
  Activity,
  BarChart3,
  Database,
  Fingerprint,
  Mic,
  MapPin,
  Languages,
  Palette,
  Moon,
  Sun,
  Volume2,
  Zap,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

interface BlockchainBlock {
  id: string;
  transactionId: string;
  blockHash: string;
  timestamp: string;
  data: {
    action: string;
    amount: number;
    merchant: string;
    riskScore: number;
    reason?: string;
  };
  nonce: number;
}

export default function Settings() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    whatsappAlerts: true,
    voiceAlerts: true,
    pushNotifications: false,
    biometricAuth: true,
    voiceAuth: true,
    geoTracking: true,
    alertLanguage: "hindi",
    riskThreshold: 70,
    autoBlock: true,
    darkMode: true,
  });

  const [blockchain, setBlockchain] = useState<BlockchainBlock[]>([]);
  const [blockchainStats, setBlockchainStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chainValid, setChainValid] = useState(true);

  useEffect(() => {
    fetchBlockchain();
    fetchBlockchainStats();
  }, []);

  const fetchBlockchain = async () => {
    try {
      const response = await fetch("/api/blockchain");
      const data = await response.json();
      if (data.success) {
        setBlockchain(data.blockchain.slice(0, 10)); // Show latest 10 blocks
        setChainValid(data.isValid);
      }
    } catch (error) {
      console.error("Failed to fetch blockchain:", error);
    }
  };

  const fetchBlockchainStats = async () => {
    try {
      const response = await fetch("/api/blockchain/stats");
      const data = await response.json();
      if (data.success) {
        setBlockchainStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch blockchain stats:", error);
    }
  };

  const validateBlockchain = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blockchain/validate");
      const data = await response.json();
      if (data.success) {
        setChainValid(data.isValid);
        alert(
          data.isValid
            ? "✅ Blockchain integrity verified!"
            : "❌ Blockchain validation failed!",
        );
      }
    } catch (error) {
      alert("❌ Validation failed - Check console");
    }
    setLoading(false);
  };

  const exportBlockchain = async () => {
    try {
      const response = await fetch("/api/blockchain/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "blockchain_export.json";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("❌ Export failed - Check console");
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getBlockActionColor = (action: string) => {
    switch (action) {
      case "block":
        return "text-neon-red";
      case "approve":
        return "text-neon-green";
      case "flag":
        return "text-neon-yellow";
      case "create":
        return "text-neon-cyan";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-neon-cyan neon-glow" />
              <h1 className="text-2xl font-bold text-neon-cyan animate-pulse-neon">
                Settings & Security
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neon-green text-neon-green hover:bg-neon-green hover:text-background"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-background"
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm">
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-neon-cyan data-[state=active]:text-background"
            >
              Alert Settings
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-neon-purple data-[state=active]:text-background"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-neon-green data-[state=active]:text-background"
            >
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="blockchain"
              className="data-[state=active]:bg-neon-yellow data-[state=active]:text-background"
            >
              Blockchain Logs
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-neon-pink data-[state=active]:text-background"
            >
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Bell className="h-5 w-5 text-neon-cyan" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive fraud alerts and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Alerts</Label>
                      <div className="text-sm text-muted-foreground">
                        SMTP-based instant fraud notifications
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting("emailAlerts", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">WhatsApp Alerts</Label>
                      <div className="text-sm text-muted-foreground">
                        Real-time messaging for critical alerts
                      </div>
                    </div>
                    <Switch
                      checked={settings.whatsappAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting("whatsappAlerts", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Voice Alerts</Label>
                      <div className="text-sm text-muted-foreground">
                        Multilingual voice notifications
                      </div>
                    </div>
                    <Switch
                      checked={settings.voiceAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting("voiceAlerts", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <div className="text-sm text-muted-foreground">
                        Browser and mobile push alerts
                      </div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("pushNotifications", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Languages className="h-5 w-5 text-neon-purple" />
                    Language & Risk Settings
                  </CardTitle>
                  <CardDescription>
                    Customize alert language and risk thresholds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Alert Language</Label>
                    <select
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                      value={settings.alertLanguage}
                      onChange={(e) =>
                        updateSetting("alertLanguage", e.target.value)
                      }
                    >
                      <option value="english">English</option>
                      <option value="hindi">हिंदी (Hindi)</option>
                      <option value="tamil">தமிழ் (Tamil)</option>
                      <option value="bengali">বাংলা (Bengali)</option>
                      <option value="gujarati">ગુજરાતી (Gujarati)</option>
                      <option value="marathi">मराठी (Marathi)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Risk Alert Threshold: {settings.riskThreshold}
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.riskThreshold}
                      onChange={(e) =>
                        updateSetting("riskThreshold", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low Risk</span>
                      <span>High Risk</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-block High Risk</Label>
                      <div className="text-sm text-muted-foreground">
                        Automatically block transactions above threshold
                      </div>
                    </div>
                    <Switch
                      checked={settings.autoBlock}
                      onCheckedChange={(checked) =>
                        updateSetting("autoBlock", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Lock className="h-5 w-5 text-neon-green" />
                    Authentication Methods
                  </CardTitle>
                  <CardDescription>
                    Configure biometric and voice authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        <Fingerprint className="h-4 w-4" />
                        Biometric Authentication
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Fingerprint and behavioral biometrics
                      </div>
                    </div>
                    <Switch
                      checked={settings.biometricAuth}
                      onCheckedChange={(checked) =>
                        updateSetting("biometricAuth", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Voice Authentication
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Voice pattern recognition for high-value transactions
                      </div>
                    </div>
                    <Switch
                      checked={settings.voiceAuth}
                      onCheckedChange={(checked) =>
                        updateSetting("voiceAuth", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location Tracking
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        Geo-behavioral analysis for fraud detection
                      </div>
                    </div>
                    <Switch
                      checked={settings.geoTracking}
                      onCheckedChange={(checked) =>
                        updateSetting("geoTracking", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="h-5 w-5 text-neon-red" />
                    Security Status
                  </CardTitle>
                  <CardDescription>
                    Current security configuration overview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        Multi-factor Authentication
                      </span>
                      <Badge className="bg-neon-green text-background">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Verification</span>
                      <Badge className="bg-neon-green text-background">
                        Verified
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Voice Print</span>
                      <Badge className="bg-neon-green text-background">
                        Registered
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fingerprint</span>
                      <Badge className="bg-neon-green text-background">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Location Services</span>
                      <Badge className="bg-neon-yellow text-background">
                        Monitoring
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-2">
                      Security Score
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={95} className="flex-1" />
                      <span className="text-sm font-bold text-neon-green">
                        95/100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Palette className="h-5 w-5 text-neon-pink" />
                  App Preferences
                </CardTitle>
                <CardDescription>
                  Customize your FraudGuard AI experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark Mode
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Cyber-themed dark interface
                        </div>
                      </div>
                      <Switch
                        checked={settings.darkMode}
                        onCheckedChange={(checked) =>
                          updateSetting("darkMode", checked)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Dashboard Refresh Rate</Label>
                      <select className="w-full p-2 border border-border rounded-lg bg-background text-foreground">
                        <option value="5">5 seconds</option>
                        <option value="10" selected>
                          10 seconds
                        </option>
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sound Alerts</Label>
                      <select className="w-full p-2 border border-border rounded-lg bg-background text-foreground">
                        <option value="enabled">Enabled</option>
                        <option value="critical">Critical Only</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Transaction Display</Label>
                      <select className="w-full p-2 border border-border rounded-lg bg-background text-foreground">
                        <option value="10">10 recent transactions</option>
                        <option value="25" selected>
                          25 recent transactions
                        </option>
                        <option value="50">50 recent transactions</option>
                        <option value="100">100 recent transactions</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Chain className="h-5 w-5 text-neon-yellow" />
                      Chain Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Chain Integrity
                        </span>
                        <Badge
                          className={`${chainValid ? "bg-neon-green" : "bg-neon-red"} text-background`}
                        >
                          {chainValid ? "Valid" : "Invalid"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total Blocks
                        </span>
                        <span className="text-sm font-medium">
                          {blockchainStats?.totalBlocks || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Chain Size
                        </span>
                        <span className="text-sm font-medium">
                          {blockchainStats?.chainSize
                            ? `${(blockchainStats.chainSize / 1024).toFixed(1)} KB`
                            : "0 KB"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <BarChart3 className="h-5 w-5 text-neon-purple" />
                      Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Blocked Txns
                        </span>
                        <span className="text-sm font-medium text-neon-red">
                          {blockchainStats?.actionBreakdown?.block || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Approved Txns
                        </span>
                        <span className="text-sm font-medium text-neon-green">
                          {blockchainStats?.actionBreakdown?.approve || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Flagged Txns
                        </span>
                        <span className="text-sm font-medium text-neon-yellow">
                          {blockchainStats?.actionBreakdown?.flag || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Zap className="h-5 w-5 text-neon-cyan" />
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={validateBlockchain}
                      disabled={loading}
                      className="w-full bg-neon-green hover:bg-neon-green/80 text-background"
                      size="sm"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Validate Chain
                    </Button>
                    <Button
                      onClick={exportBlockchain}
                      variant="outline"
                      className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Chain
                    </Button>
                    <Button
                      onClick={fetchBlockchain}
                      variant="outline"
                      className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-background"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Database className="h-5 w-5 text-neon-yellow" />
                    Recent Blockchain Transactions
                  </CardTitle>
                  <CardDescription>
                    Immutable log of all fraud detection actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {blockchain.map((block, index) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-xs text-muted-foreground">
                            #{blockchain.length - index}
                          </div>
                          <div className="flex flex-col">
                            <div className="font-mono text-sm text-foreground">
                              {block.blockHash.substring(0, 16)}...
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {block.transactionId}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div
                              className={`text-sm font-medium ${getBlockActionColor(block.data.action)}`}
                            >
                              {block.data.action.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {block.data.merchant}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-foreground">
                              ₹{block.data.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Risk: {block.data.riskScore}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(block.timestamp).toLocaleString()}
                          </div>
                          <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan">
                            Nonce: {block.nonce}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Activity className="h-5 w-5 text-neon-green" />
                    System Information
                  </CardTitle>
                  <CardDescription>
                    FraudGuard AI system status and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Version
                      </div>
                      <div className="font-medium">v2.1 CYBER</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Build</div>
                      <div className="font-medium">2024.01.15</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        AI Model
                      </div>
                      <div className="font-medium">FraudNet v3.2</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Accuracy
                      </div>
                      <div className="font-medium text-neon-green">94.7%</div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-neon-green text-background">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SMTP Service</span>
                      <Badge className="bg-neon-green text-background">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">WhatsApp API</span>
                      <Badge className="bg-neon-yellow text-background">
                        Testing
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Blockchain</span>
                      <Badge className="bg-neon-green text-background">
                        Validated
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ExternalLink className="h-5 w-5 text-neon-purple" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    System maintenance and utility functions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-neon-cyan hover:bg-neon-cyan/80 text-background">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh ML Model
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-neon-green text-neon-green hover:bg-neon-green hover:text-background"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Transaction Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-background"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Security Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-background"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Test Alert System
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
