const Razorpay = require('razorpay');

module.exports = async function handler(req, res) {
  // 1. Only allow secure POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Connect to Razorpay using the Vercel Vault
  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_SECRET
  });

  try {
    // 3. Create the order
    const order = await rzp.orders.create({
      amount: req.body.amount * 100, // Converting Rupee total to Paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });
    
    // 4. Send ONLY the safe details back to the browser
    res.status(200).json({ 
      orderId: order.id, 
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};