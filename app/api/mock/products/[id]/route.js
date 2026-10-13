import { NextResponse } from "next/server";
import { ANJUCIA_PRODUCTS } from "../../../../data/products";

export async function GET(request, { params }) {
  const { id } = await params;
  const product = ANJUCIA_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json(
      {
        status: 404,
        success: false,
        message: `Product with ID '${id}' not found.`
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: 200,
    success: true,
    data: product
  });
}
