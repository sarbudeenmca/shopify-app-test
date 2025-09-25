import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function action({ request }) {
  try {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const data = await request.json(); // <--- parse JSON payload
    const { product, quantity, price, comments } = data;

    if (!product || !quantity || !price) {
      return json({ error: "Invalid input" }, { status: 400 });
    }

    const newRequest = await prisma.discountRequest.create({
      data: {
        product,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        comments,
      },
    });

    return json({ message: "Discount request saved", request: newRequest });
  } catch (err) {
    console.error(err);
    return json({ error: "Server error", details: err.message }, { status: 500 });
  }
}

export async function loader() {
  return json({
    ok: true,
    message: "Send POST to save discount request",
  });
}
