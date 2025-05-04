import React from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CREDIT_PACKAGES = [
  { id: '100', credits: 100, price: 10, label: '100 credits' },
  { id: '1000', credits: 1000, price: 50, label: '1000 credits' },
  { id: '2500', credits: 2500, price: 100, label: '2500 credits' },
];

export function CreditPackages() {
  const handlePurchase = async (packageId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to process purchase. Please try again.');
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {CREDIT_PACKAGES.map((pkg) => (
        <Card key={pkg.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{pkg.label}</CardTitle>
            <CardDescription>
              Best for users who need {pkg.credits} credits
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-4xl font-bold">${pkg.price}</div>
              <ul className="space-y-2 text-sm">
                <li>✓ {pkg.credits} AI generation credits</li>
                <li>✓ Never expires</li>
                <li>✓ Use across all AI models</li>
              </ul>
            </div>
            <Button 
              className="mt-6 w-full" 
              onClick={() => handlePurchase(pkg.id)}
            >
              Purchase Credits
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 