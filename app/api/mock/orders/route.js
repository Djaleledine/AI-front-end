import { NextResponse } from "next/server";

// Simulated orders storage in runtime memory
const ordersStore = [];

export async function GET() {
  return NextResponse.json({
    status: 200,
    success: true,
    count: ordersStore.length,
    data: ordersStore
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { customerName, customerPhone, customerAddress, wilaya, items, totalDZD } = payload || {};

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: "Customer name and phone number are required for Cash on Delivery confirmation."
        },
        { status: 400 }
      );
    }

    const orderNumber = `DZ-ANJ-${Date.now().toString().slice(-6)}`;
    const trackingCode = `YAL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: orderNumber,
      trackingCode,
      customerName,
      customerPhone,
      customerAddress: customerAddress || "Non spécifié",
      wilaya: wilaya || "16 - Alger",
      items: items || [],
      totalDZD: totalDZD || 1800,
      paymentMethod: "COD (Paiement Main à Main à la Livraison)",
      carrier: "Yalidine Express / ZR Express",
      estimatedDelivery: "24h - 48h ouvrées",
      status: "CONFIRMED_PREPARING",
      createdAt: new Date().toISOString()
    };

    ordersStore.unshift(newOrder);

    return NextResponse.json({
      status: 201,
      success: true,
      message: "Order placed successfully! Cash on Delivery verified.",
      data: newOrder
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: 400, success: false, message: "Invalid order data", error: error.message },
      { status: 400 }
    );
  }
}
