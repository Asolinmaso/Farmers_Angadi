// app/api/razorpayOrder/route.js

import Razorpay from 'razorpay';

export async function POST(req) {
  const { amount } = await req.json();

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return new Response(JSON.stringify({ orderId: order.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
