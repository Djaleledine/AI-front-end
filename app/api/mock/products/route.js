import { NextResponse } from "next/server";
import { ANJUCIA_PRODUCTS } from "../../../data/products";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const heroOnly = searchParams.get("hero");

  let products = [...ANJUCIA_PRODUCTS];

  if (category && category !== "all") {
    products = products.filter((p) => p.category === category);
  }

  if (heroOnly === "true") {
    products = products.filter((p) => p.isHero);
  }

  return NextResponse.json({
    status: 200,
    success: true,
    count: products.length,
    data: products
  });
}
