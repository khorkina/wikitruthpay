import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function PrivacyPolicyDialog({ isOpen, onClose, onAccept }: PrivacyPolicyDialogProps) {
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const handleAccept = () => {
    if (hasAcceptedPrivacy && hasAcceptedTerms) {
      onAccept();
      onClose();
    }
  };

  const isAcceptEnabled = hasAcceptedPrivacy && hasAcceptedTerms;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-800">
            Privacy Policy & Terms of Service
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            
            {/* Privacy Policy Section */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Privacy Policy</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Local Data Storage</h4>
                  <p className="text-gray-700">
                    <strong>All your data is stored locally in your browser only.</strong> We do not collect, store, 
                    or transmit any personal information to our servers. Your search history, comparison results, 
                    and subscription status are saved exclusively in your browser's local storage (IndexedDB).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Data Control</h4>
                  <p className="text-gray-700">
                    You have complete control over your data. You can export all your data or permanently 
                    delete it at any time through the Settings menu. Clearing your browser data will 
                    permanently remove all stored information.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Third-Party Services</h4>
                  <p className="text-gray-700">
                    We use external APIs (Wikipedia, OpenAI, OpenRouter) to provide our services. 
                    Article content is sent to these services for analysis but is not stored by us. 
                    Please review their respective privacy policies.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Data Loss Risks</h4>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <strong>Important:</strong> Since all data is stored locally, you may lose your subscription 
                    status and comparison history if you:
                    <ul className="list-disc ml-4 mt-2">
                      <li>Clear your browser data/cookies</li>
                      <li>Use private/incognito browsing</li>
                      <li>Switch to a different browser or device</li>
                      <li>Experience browser issues or computer problems</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>

            {/* Terms of Service Section */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Terms of Service</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Subscription Terms</h4>
                  <p className="text-gray-700">
                    Premium subscriptions are processed through NowPayments secure payment system. 
                    Subscription status is validated locally in your browser for 30 days. 
                    No automatic renewals - you maintain control over your subscription.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Service Availability</h4>
                  <p className="text-gray-700">
                    Our service depends on external APIs (Wikipedia, AI services) which may 
                    experience downtime or rate limiting. We cannot guarantee 100% service availability.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Content Accuracy</h4>
                  <p className="text-gray-700">
                    AI-generated comparisons are for informational purposes only. We do not guarantee 
                    the accuracy of comparisons and recommend verifying important information from 
                    original sources.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Acceptable Use</h4>
                  <p className="text-gray-700">
                    Use our service responsibly and in compliance with Wikipedia's terms of service 
                    and applicable laws. Do not use the service for harmful, illegal, or abusive purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Agreement Checkboxes */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="privacy-agreement"
              checked={hasAcceptedPrivacy}
              onCheckedChange={(checked) => setHasAcceptedPrivacy(checked as boolean)}
            />
            <label htmlFor="privacy-agreement" className="text-sm leading-relaxed cursor-pointer">
              I understand that all my data is stored locally in my browser and I accept the 
              risks of potential data loss as outlined in the Privacy Policy.
            </label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms-agreement"
              checked={hasAcceptedTerms}
              onCheckedChange={(checked) => setHasAcceptedTerms(checked as boolean)}
            />
            <label htmlFor="terms-agreement" className="text-sm leading-relaxed cursor-pointer">
              I agree to the Terms of Service and understand the limitations of the service.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!isAcceptEnabled}
            className="wiki-button-primary"
          >
            Accept & Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}