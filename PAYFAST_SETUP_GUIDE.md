# 💳 PayFast Payment Gateway Setup Guide

Complete guide to setting up PayFast payment gateway for ShopDaraz Hub.

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting PayFast Credentials](#getting-payfast-credentials)
- [Configuration Steps](#configuration-steps)
- [Testing in Sandbox](#testing-in-sandbox)
- [Going Live](#going-live)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

PayFast is a secure payment gateway that allows your customers to pay using:
- Credit/Debit Cards (Visa, Mastercard)
- Instant EFT / Bank Transfer
- Capitec Pay
- Zapper
- And more payment methods

This integration automatically verifies payments and updates order status.

---

## ✅ Prerequisites

Before starting, ensure you have:
- ✓ A business registered in South Africa (required for PayFast)
- ✓ Valid email address
- ✓ Business banking details
- ✓ ID document or company registration
- ✓ Access to your backend and frontend environment variables

---

## 🔑 Getting PayFast Credentials

### Step 1: Register with PayFast

**For Testing (Sandbox):**
1. Go to [https://sandbox.payfast.co.za](https://sandbox.payfast.co.za)
2. Click "Sign Up" or "Register"
3. Fill in your details (can use test data)
4. Verify your email address

**For Production (Live):**
1. Go to [https://www.payfast.co.za](https://www.payfast.co.za)
2. Click "Get Started" or "Sign Up"
3. Complete the registration with your business details
4. Submit required documents for verification
5. Wait for PayFast approval (usually 1-2 business days)

### Step 2: Get Your Credentials

After logging in to your PayFast dashboard:

1. **Get Merchant ID and Merchant Key:**
   - Go to **Settings** > **Integration**
   - You'll see:
     - **Merchant ID**: 10-digit number (e.g., `10000100`)
     - **Merchant Key**: 32-character string (e.g., `46f0cd694581a`)
   - Copy both values

2. **Set a Passphrase:**
   - In the same Integration page
   - Find the **Passphrase** section
   - Enter a secure passphrase (recommended: 16+ characters)
   - **IMPORTANT**: Save this passphrase - you'll need it!

### Step 3: Configure ITN (Instant Transaction Notification)

PayFast needs to notify your backend when payments are completed:

1. In PayFast Dashboard, go to **Settings** > **Integration**
2. Find **Notify URL** or **ITN URL**
3. Enter your backend notification URL:
   ```
   https://your-backend-domain.vercel.app/api/payfast/notify
   ```
   Replace `your-backend-domain` with your actual Vercel backend URL

4. Save the settings

---

## ⚙️ Configuration Steps

### Backend Configuration (Vercel)

1. Go to your Vercel Dashboard
2. Select your backend project
3. Go to **Settings** > **Environment Variables**
4. Add the following variables:

```env
PAYFAST_MERCHANT_ID=your-merchant-id-here
PAYFAST_MERCHANT_KEY=your-merchant-key-here
PAYFAST_PASSPHRASE=your-passphrase-here
PAYFAST_MODE=sandbox
```

**Example (Sandbox):**
```env
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=MySecurePassphrase123
PAYFAST_MODE=sandbox
```

5. Click **Save**
6. **Redeploy** your backend for changes to take effect

### Frontend Configuration (Hostinger)

1. In your local project, create/edit `.env` file
2. Add the following variables:

```env
VITE_API_URL=https://your-backend-domain.vercel.app
VITE_PAYFAST_MERCHANT_ID=your-merchant-id-here
VITE_PAYFAST_MERCHANT_KEY=your-merchant-key-here
VITE_PAYFAST_PASSPHRASE=your-passphrase-here
VITE_PAYFAST_MODE=sandbox
```

**Example:**
```env
VITE_API_URL=https://shopdaraz-backend.vercel.app
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=46f0cd694581a
VITE_PAYFAST_PASSPHRASE=MySecurePassphrase123
VITE_PAYFAST_MODE=sandbox
```

3. Build your frontend:
   ```bash
   npm run build
   ```

4. Upload the `dist/` folder to Hostinger

---

## 🧪 Testing in Sandbox

### Sandbox Credentials

For testing, PayFast provides default sandbox credentials:

```env
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=jt7NOE43FZPn
PAYFAST_MODE=sandbox
```

### Test Payment Flow

1. **Place a Test Order:**
   - Add products to cart
   - Go to checkout
   - Select **PayFast** as payment method
   - Fill in customer details
   - Click **Place Order**

2. **You'll be redirected to PayFast sandbox:**
   - You'll see a test payment page
   - DO NOT use real card details in sandbox!

3. **Test Card Details (Sandbox Only):**
   - **Card Number**: `4000000000000002` (Visa)
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Name**: Any name

4. **Complete Payment:**
   - Click **Pay Now**
   - You'll be redirected back to your site
   - Order status should update to "Confirmed"

### Verify Integration

Check these things after a test payment:

✅ User is redirected to success page
✅ Order status updated to "confirmed"
✅ Payment status updated to "paid"
✅ Payment reference is saved
✅ ITN callback received (check backend logs)

---

## 🚀 Going Live

### Prerequisites for Going Live

- ✅ PayFast account approved
- ✅ All testing completed successfully
- ✅ Business verified by PayFast
- ✅ Banking details confirmed

### Steps to Go Live

1. **Update Environment Variables:**

   **Backend (Vercel):**
   ```env
   PAYFAST_MERCHANT_ID=your-LIVE-merchant-id
   PAYFAST_MERCHANT_KEY=your-LIVE-merchant-key
   PAYFAST_PASSPHRASE=your-LIVE-passphrase
   PAYFAST_MODE=production
   ```

   **Frontend (.env):**
   ```env
   VITE_PAYFAST_MERCHANT_ID=your-LIVE-merchant-id
   VITE_PAYFAST_MERCHANT_KEY=your-LIVE-merchant-key
   VITE_PAYFAST_PASSPHRASE=your-LIVE-passphrase
   VITE_PAYFAST_MODE=production
   ```

2. **Update PayFast Settings:**
   - Login to **live** PayFast account (www.payfast.co.za)
   - Go to Settings > Integration
   - Set ITN URL: `https://your-backend-domain.vercel.app/api/payfast/notify`
   - Add your website domain

3. **Rebuild and Redeploy:**
   ```bash
   # Frontend
   npm run build
   # Upload dist/ to Hostinger
   
   # Backend - redeploy on Vercel after env vars updated
   ```

4. **Test with Small Real Payment:**
   - Place a real order with minimum amount
   - Complete payment with real card
   - Verify everything works correctly

5. **Monitor First Few Transactions:**
   - Check orders are being created
   - Verify payments are being received
   - Ensure ITN callbacks are working

---

## 🔧 Troubleshooting

### Issue: Payment Not Redirecting

**Symptoms:** User clicks "Place Order" but nothing happens

**Solutions:**
- Check browser console for errors
- Verify `VITE_PAYFAST_MERCHANT_ID` is set correctly
- Ensure PayFast service is imported in Checkout.tsx
- Check if PayFast is configured: Call `/api/payfast/status` endpoint

### Issue: Invalid Signature Error

**Symptoms:** Payment completes but order not updating

**Solutions:**
- Verify `PAYFAST_PASSPHRASE` matches in both frontend and backend
- Check passphrase in PayFast dashboard matches your env vars
- Ensure passphrase has no extra spaces or special characters
- Restart backend after updating env vars

### Issue: ITN Not Received

**Symptoms:** Payment successful but order status not updating

**Solutions:**
- Check ITN URL is set correctly in PayFast dashboard
- Verify backend `/api/payfast/notify` endpoint is accessible
- Check Vercel function logs for errors
- Ensure backend has proper CORS settings
- Test ITN URL manually: Should return 200 OK

### Issue: Amount Mismatch

**Symptoms:** Error message about payment amount not matching

**Solutions:**
- Check cart total calculation
- Verify currency is correct (ZAR for PayFast)
- Ensure no decimal precision issues
- Check order amount stored in database matches checkout amount

### Issue: CORS Errors

**Symptoms:** Cannot connect to PayFast or backend

**Solutions:**
- Add PayFast domains to CORS whitelist
- Check `ALLOWED_ORIGINS` includes your frontend domain
- Verify backend CORS middleware is configured correctly

---

## 📊 Monitoring Payments

### Check Payment Status

1. **In Your Application:**
   - Super Admin Dashboard
   - Orders list shows payment status
   - Payment reference from PayFast

2. **In PayFast Dashboard:**
   - View all transactions
   - Check transaction details
   - Download reports
   - Reconcile payments

### Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Order created, awaiting payment |
| `paid` | Payment successful and verified |
| `failed` | Payment failed or declined |
| `cancelled` | User cancelled payment |

---

## 🔒 Security Best Practices

1. **Never commit credentials to git**
   - Use .env files (add to .gitignore)
   - Use environment variables in Vercel/Hostinger

2. **Use strong passphrase**
   - Minimum 16 characters
   - Mix of letters, numbers, symbols
   - Change regularly

3. **Validate all payments**
   - Backend validates payment amounts
   - Signature verification on ITN
   - Check payment status before fulfilling orders

4. **Use HTTPS only**
   - Ensure frontend and backend use HTTPS
   - PayFast requires HTTPS for production

5. **Monitor transactions**
   - Regularly check PayFast dashboard
   - Reconcile with your orders
   - Set up fraud alerts

---

## 📞 Support

### PayFast Support
- **Email**: support@payfast.co.za
- **Phone**: 0861 729 327
- **Hours**: Mon-Fri, 8:00 AM - 5:00 PM (SAST)
- **Documentation**: https://developers.payfast.co.za

### Common Questions

**Q: Can I use PayFast outside South Africa?**
A: No, PayFast requires a South African business and bank account.

**Q: What are the transaction fees?**
A: Fees vary based on your plan. Check PayFast pricing: https://www.payfast.co.za/pricing

**Q: How long until funds are in my account?**
A: Usually 2-3 business days after successful payment.

**Q: Can I refund payments?**
A: Yes, through PayFast dashboard. Refunds are manual process.

---

## ✅ Pre-Launch Checklist

Before going live with PayFast:

- [ ] PayFast account approved and verified
- [ ] Sandbox testing completed successfully
- [ ] All environment variables set correctly
- [ ] ITN URL configured in PayFast
- [ ] Passphrase set and matching everywhere
- [ ] HTTPS enabled on all domains
- [ ] Test payment completed successfully
- [ ] Order status updates working
- [ ] Payment success page displays correctly
- [ ] Payment cancelled page displays correctly
- [ ] Email notifications working (if implemented)
- [ ] Error handling tested
- [ ] Monitoring/logging in place

---

## 📝 Notes

- PayFast payments are in **ZAR (South African Rand)** by default
- For Pakistan Rupee (PKR) or other currencies, you may need currency conversion
- Consider implementing exchange rate handling if selling internationally
- PayFast processes payments instantly - funds settle in 2-3 business days

---

**Last Updated:** November 2024
**Version:** 1.0

