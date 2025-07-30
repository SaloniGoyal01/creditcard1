import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  User,
  Smartphone,
  Fingerprint,
  VolumeX as Voice,
  MapPin,
  CreditCard,
  Settings,
  Bell,
} from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-security-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                User Profile & Security
              </h1>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-security-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  SG
                </div>
                <h3 className="text-lg font-semibold">Saloni Goyal</h3>
                <p className="text-gray-500">Premium Security Member</p>
                <Badge className="bg-fraud-safe text-white mt-2">
                  Verified
                </Badge>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Risk Level:</span>
                  <span className="text-sm font-medium text-fraud-low-risk">
                    Low
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Account Status:</span>
                  <span className="text-sm font-medium text-fraud-safe">
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Login:</span>
                  <span className="text-sm font-medium">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="biometric" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="biometric">Biometrics</TabsTrigger>
                <TabsTrigger value="voice">Voice Auth</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="biometric">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fingerprint className="h-5 w-5" />
                      Biometric Authentication
                    </CardTitle>
                    <CardDescription>
                      Advanced biometric security features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Fingerprint Login</span>
                          <Badge className="bg-fraud-safe text-white">
                            Enabled
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Secure biometric authentication for quick login
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Re-scan Fingerprint
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            Behavioral Biometrics
                          </span>
                          <Badge className="bg-fraud-safe text-white">
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Typing patterns and mouse movement analysis
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          View Patterns
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Security Score: 95/100
                      </h4>
                      <p className="text-sm text-blue-700">
                        Your biometric authentication is highly secure. All
                        systems are working optimally.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Voice className="h-5 w-5" />
                      Voice Authentication
                    </CardTitle>
                    <CardDescription>
                      Voice-based transaction verification and multilingual
                      alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Voice Print</span>
                          <Badge className="bg-fraud-safe text-white">
                            Registered
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Unique voice pattern for high-value transactions
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Update Voice Sample
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            Language Preference
                          </span>
                          <Badge variant="outline">Hindi</Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Fraud alerts in your preferred language
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Change Language
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border-l-4 border-security-primary bg-gray-50 rounded">
                      <h4 className="font-medium mb-2">Available Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Hindi",
                          "English",
                          "Tamil",
                          "Bengali",
                          "Gujarati",
                          "Marathi",
                        ].map((lang) => (
                          <Badge
                            key={lang}
                            variant="outline"
                            className="text-xs"
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location Monitoring
                    </CardTitle>
                    <CardDescription>
                      Geo-behavioral analysis and location-based security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Trusted Locations</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mumbai, Maharashtra</span>
                          <Badge className="bg-fraud-safe text-white text-xs">
                            Primary
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Delhi, India</span>
                          <Badge variant="outline" className="text-xs">
                            Frequent
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Bangalore, Karnataka</span>
                          <Badge variant="outline" className="text-xs">
                            Occasional
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                      >
                        Add New Location
                      </Button>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">
                        Location Mismatch Alert
                      </h4>
                      <p className="text-sm text-yellow-700">
                        We'll alert you if transactions occur outside your usual
                        locations or behavioral patterns.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Alert Preferences
                    </CardTitle>
                    <CardDescription>
                      Configure how you receive fraud alerts and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Email Alerts</span>
                          <Badge className="bg-fraud-safe text-white">
                            Enabled
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          SMTP-based instant fraud notifications
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          saloni@example.com
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">WhatsApp Alerts</span>
                          <Badge className="bg-fraud-safe text-white">
                            Enabled
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Real-time messaging for critical alerts
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          +91 98765 43210
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Voice Alerts</span>
                          <Badge className="bg-fraud-safe text-white">
                            Enabled
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Multilingual voice notifications
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Hindi preferred
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            Push Notifications
                          </span>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Browser and mobile push alerts
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Enable
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
