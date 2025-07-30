import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Fingerprint, 
  Mic, 
  MicOff,
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Smartphone
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login"); // login, otp, success
  const [authMethod, setAuthMethod] = useState<"email" | "voice" | "biometric">("email");
  
  // Voice authentication states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "processing" | "success" | "failed">("idle");
  
  // Biometric states
  const [biometricStatus, setBiometricStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle");
  const [fingerprintProgress, setFingerprintProgress] = useState(0);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        setStep("otp");
        setLoading(false);
        // Simulate sending OTP email
        simulateEmailOTP();
      } else {
        setLoading(false);
      }
    }, 1500);
  };

  const simulateEmailOTP = async () => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      console.log('OTP sent:', data);
    } catch (error) {
      console.log('OTP simulation complete');
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      if (otp === "123456" || otp.length === 6) {
        setStep("success");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      setLoading(false);
    }, 1000);
  };

  const simulateVoiceAuth = () => {
    setVoiceStatus("recording");
    setIsRecording(true);
    setVoiceProgress(0);
    
    const interval = setInterval(() => {
      setVoiceProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          setVoiceStatus("processing");
          
          // Simulate processing
          setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            if (success) {
              setVoiceStatus("success");
              setStep("success");
              setTimeout(() => navigate("/"), 2000);
            } else {
              setVoiceStatus("failed");
              setTimeout(() => setVoiceStatus("idle"), 3000);
            }
          }, 2000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateBiometricAuth = () => {
    setBiometricStatus("scanning");
    setFingerprintProgress(0);
    
    const interval = setInterval(() => {
      setFingerprintProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Simulate WebAuthn or fingerprint verification
          setTimeout(() => {
            const success = Math.random() > 0.15; // 85% success rate
            if (success) {
              setBiometricStatus("success");
              setStep("success");
              setTimeout(() => navigate("/"), 2000);
            } else {
              setBiometricStatus("failed");
              setTimeout(() => {
                setBiometricStatus("idle");
                setFingerprintProgress(0);
              }, 3000);
            }
          }, 1000);
          
          return 100;
        }
        return prev + 8;
      });
    }, 150);
  };

  const getVoiceStatusColor = () => {
    switch (voiceStatus) {
      case "recording": return "text-neon-cyan";
      case "processing": return "text-neon-yellow";
      case "success": return "text-neon-green";
      case "failed": return "text-neon-red";
      default: return "text-gray-400";
    }
  };

  const getBiometricStatusColor = () => {
    switch (biometricStatus) {
      case "scanning": return "text-neon-purple";
      case "success": return "text-neon-green";
      case "failed": return "text-neon-red";
      default: return "text-gray-400";
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background cyber-grid">
        <Card className="w-full max-w-md border-neon-green neon-border">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <CheckCircle className="h-16 w-16 text-neon-green neon-glow mb-4" />
            <h2 className="text-2xl font-bold text-neon-green mb-2">Authentication Successful!</h2>
            <p className="text-muted-foreground text-center mb-4">
              Welcome to FraudGuard AI. Redirecting to dashboard...
            </p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-neon-green h-2 rounded-full animate-pulse" style={{width: "100%"}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background cyber-grid">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-neon-cyan neon-glow" />
          </div>
          <h1 className="text-3xl font-bold text-neon-cyan animate-pulse-neon">FraudGuard AI</h1>
          <p className="text-muted-foreground mt-2">Advanced Fraud Detection System</p>
        </div>

        {step === "login" && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-center text-foreground">Secure Authentication</CardTitle>
              <CardDescription className="text-center">
                Choose your preferred authentication method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-1">
                    <Mic className="h-4 w-4" />
                    Voice
                  </TabsTrigger>
                  <TabsTrigger value="biometric" className="flex items-center gap-1">
                    <Fingerprint className="h-4 w-4" />
                    Biometric
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Login with Email
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <div className={`p-8 border-2 border-dashed rounded-full ${voiceStatus === "recording" ? "border-neon-cyan animate-pulse" : "border-muted"}`}>
                        {voiceStatus === "recording" ? (
                          <Mic className={`h-16 w-16 ${getVoiceStatusColor()} neon-glow`} />
                        ) : voiceStatus === "processing" ? (
                          <Loader2 className={`h-16 w-16 ${getVoiceStatusColor()} animate-spin`} />
                        ) : voiceStatus === "success" ? (
                          <CheckCircle className={`h-16 w-16 ${getVoiceStatusColor()} neon-glow`} />
                        ) : voiceStatus === "failed" ? (
                          <XCircle className={`h-16 w-16 ${getVoiceStatusColor()}`} />
                        ) : (
                          <MicOff className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {voiceStatus === "recording" && (
                      <div className="space-y-2">
                        <p className="text-neon-cyan">Recording voice sample...</p>
                        <Progress value={voiceProgress} className="w-full" />
                        <p className="text-sm text-muted-foreground">
                          Say: "Authenticate my FraudGuard AI account"
                        </p>
                      </div>
                    )}
                    
                    {voiceStatus === "processing" && (
                      <div className="space-y-2">
                        <p className="text-neon-yellow">Processing voice pattern...</p>
                        <div className="flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-neon-yellow" />
                        </div>
                      </div>
                    )}
                    
                    {voiceStatus === "failed" && (
                      <Alert className="border-neon-red">
                        <XCircle className="h-4 w-4 text-neon-red" />
                        <AlertDescription className="text-neon-red">
                          Voice authentication failed. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {voiceStatus === "success" && (
                      <Alert className="border-neon-green">
                        <CheckCircle className="h-4 w-4 text-neon-green" />
                        <AlertDescription className="text-neon-green">
                          Voice authentication successful!
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      onClick={simulateVoiceAuth}
                      disabled={voiceStatus === "recording" || voiceStatus === "processing"}
                      className="w-full bg-neon-purple text-background hover:bg-neon-purple/90"
                    >
                      {voiceStatus === "recording" ? "Recording..." : 
                       voiceStatus === "processing" ? "Processing..." : 
                       "Start Voice Authentication"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="biometric" className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <div className={`p-8 border-2 border-dashed rounded-full ${biometricStatus === "scanning" ? "border-neon-purple animate-pulse" : "border-muted"}`}>
                        <Fingerprint className={`h-16 w-16 ${getBiometricStatusColor()} ${biometricStatus === "scanning" ? "neon-glow" : ""}`} />
                      </div>
                    </div>
                    
                    {biometricStatus === "scanning" && (
                      <div className="space-y-2">
                        <p className="text-neon-purple">Scanning fingerprint...</p>
                        <Progress value={fingerprintProgress} className="w-full" />
                        <p className="text-sm text-muted-foreground">
                          Keep your finger on the sensor
                        </p>
                      </div>
                    )}
                    
                    {biometricStatus === "failed" && (
                      <Alert className="border-neon-red">
                        <XCircle className="h-4 w-4 text-neon-red" />
                        <AlertDescription className="text-neon-red">
                          Biometric authentication failed. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {biometricStatus === "success" && (
                      <Alert className="border-neon-green">
                        <CheckCircle className="h-4 w-4 text-neon-green" />
                        <AlertDescription className="text-neon-green">
                          Biometric authentication successful!
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      onClick={simulateBiometricAuth}
                      disabled={biometricStatus === "scanning"}
                      className="w-full bg-neon-green text-background hover:bg-neon-green/90"
                    >
                      {biometricStatus === "scanning" ? "Scanning..." : "Start Biometric Scan"}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground">
                      Uses WebAuthn API for secure biometric authentication
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {step === "otp" && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-center text-foreground">OTP Verification</CardTitle>
              <CardDescription className="text-center">
                Enter the 6-digit code sent to {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the code? <button className="text-neon-cyan hover:underline" type="button" onClick={simulateEmailOTP}>Resend</button>
                  </p>
                </div>
                <Button type="submit" className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/90" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Quick Demo Access */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Quick Demo Access</p>
              <Button 
                variant="outline" 
                className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background"
                onClick={() => navigate("/")}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Continue as Demo User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
