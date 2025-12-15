import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, MessageSquare, Globe, Shield, HelpCircle, ArrowLeft, Copy, ExternalLink, Clock, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { toast } = useToast();

  // Auto-validation and keyboard shortcuts
  useEffect(() => {
    const isValid = formData.name && formData.email && formData.subject && formData.category && formData.message;
    setIsFormValid(Boolean(isValid));

    // Keyboard shortcuts for desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to submit form
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isValid) {
        e.preventDefault();
        handleSubmit(e as any);
      }
      // Escape to clear form
      if (e.key === 'Escape') {
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: ''
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData, isFormValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Since this is a privacy-first app with no backend data storage,
    // we'll provide instructions for contacting via email
    const emailSubject = `Wiki Truth Contact: ${formData.subject}`;
    const emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:support@wikitruth.app?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Email Client Opened",
      description: "Your default email application should open with the message pre-filled. If not, please copy the information and send to support@wikitruth.app",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email Copied",
      description: `${email} has been copied to your clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile & Desktop Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Wiki Truth</span>
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                Contact & Support
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
                <Clock className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">24-48h Response</span>
                <span className="sm:hidden">24h</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm text-blue-700 dark:text-blue-300 mb-4">
            <MessageSquare className="h-4 w-4" />
            Support Center
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get technical support, report issues, or share feedback. Our team is here to help you get the most out of Wiki Truth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="subscription">Subscription & Billing</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="privacy">Privacy & Data</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={!isFormValid}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                  <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>↵
                  </kbd>
                </Button>

                <div className="mt-2 text-center">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFormData({
                      name: '',
                      email: '',
                      subject: '',
                      category: '',
                      message: ''
                    })}
                    className="text-xs text-gray-500"
                  >
                    Clear Form <kbd className="ml-1 font-mono text-[10px]">ESC</kbd>
                  </Button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Privacy Note:</strong> This form opens your email client to send the message directly. 
                  We don't store form data on our servers to protect your privacy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="group cursor-pointer" onClick={() => copyEmailToClipboard('support@wikitruth.app')}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">General Support</h4>
                    <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600">support@wikitruth.app</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Response within 24-48 hours • Click to copy</p>
                </div>
                <div>
                  <h4 className="font-medium">Technical Issues</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">tech@wikitruth.app</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Priority support for technical problems</p>
                </div>
                <div>
                  <h4 className="font-medium">Billing & Subscriptions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">billing@wikitruth.app</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For subscription and payment inquiries</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Community & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/help" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Help & Documentation
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/report-issues" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Report Issues
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/privacy" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacy Policy
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">How is my data protected?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    All your data is stored locally in your browser. We don't collect or store personal information on our servers.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">What's the difference between free and premium?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Free users get unlimited AI comparisons. Premium ($5/month) offers enhanced analysis capabilities.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Can I cancel my subscription anytime?</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Yes, you can cancel through your payment provider. You'll retain access until the current period ends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}