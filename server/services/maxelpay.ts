import CryptoJS from 'crypto-js';

const MAXELPAY_API_KEY = process.env.MAXELPAY_API_KEY || '';
const MAXELPAY_SECRET_KEY = process.env.MAXELPAY_SECRET_KEY || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const MAXELPAY_CHECKOUT_URL = IS_PRODUCTION 
  ? 'https://api.maxelpay.com/v1/prod/merchant/order/checkout'
  : 'https://api.maxelpay.com/v1/stg/merchant/order/checkout';

interface CheckoutPayload {
  orderID: string;
  amount: string;
  currency: string;
  timestamp: string;
  userName: string;
  siteName: string;
  userEmail: string;
  redirectUrl: string;
  websiteUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

function encryptPayload(secretKey: string, payload: string): string {
  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const iv = CryptoJS.enc.Utf8.parse(secretKey.substr(0, 16));
  const encrypted = CryptoJS.AES.encrypt(payload, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

export async function createCheckoutSession(params: {
  orderId: string;
  amount: string;
  userEmail: string;
  userName: string;
  baseUrl: string;
}): Promise<{ checkoutUrl: string; orderId: string }> {
  const { orderId, amount, userEmail, userName, baseUrl } = params;

  if (!MAXELPAY_API_KEY || !MAXELPAY_SECRET_KEY) {
    throw new Error('MaxelPay API credentials not configured');
  }

  const payload: CheckoutPayload = {
    orderID: orderId,
    amount: amount,
    currency: 'USD',
    timestamp: Math.floor(Date.now() / 1000).toString(),
    userName: userName || 'WikiTruth User',
    siteName: 'WikiTruth',
    userEmail: userEmail,
    redirectUrl: `${baseUrl}/billing/success?orderId=${orderId}`,
    websiteUrl: baseUrl,
    cancelUrl: `${baseUrl}/billing/cancel?orderId=${orderId}`,
    webhookUrl: `${baseUrl}/api/maxelpay/webhook`
  };

  const encryptedPayload = encryptPayload(MAXELPAY_SECRET_KEY, JSON.stringify(payload));

  const response = await fetch(MAXELPAY_CHECKOUT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': MAXELPAY_API_KEY
    },
    body: JSON.stringify({ data: encryptedPayload })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('MaxelPay checkout error:', errorText);
    throw new Error('Failed to create checkout session');
  }

  const data = await response.json();
  
  // Handle different response formats from MaxelPay
  const checkoutUrl = data.result || data.data?.checkout_url;
  
  if (!checkoutUrl) {
    console.error('MaxelPay response error:', data);
    throw new Error(data.message || 'Failed to create checkout session');
  }

  return {
    checkoutUrl: checkoutUrl,
    orderId: orderId
  };
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!MAXELPAY_SECRET_KEY) return false;
  const expectedSignature = CryptoJS.HmacSHA256(payload, MAXELPAY_SECRET_KEY).toString();
  return signature === expectedSignature;
}
