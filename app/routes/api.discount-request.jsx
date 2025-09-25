import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function action({ request }) {
  const method = request.method;

  if (method === "POST") {
    const formData = await request.formData();

    const product = formData.get("product");
    const quantity = parseInt(formData.get("quantity"), 10);
    const price = parseFloat(formData.get("price"));
    const comments = formData.get("comments");

    const newRequest = await prisma.discountRequest.create({
      data: {
        product,
        quantity,
        price,
        comments,
      },
    });

    return json({
      message: "Discount request saved",
      request: newRequest,
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

export async function loader() {
  return json({
    ok: true,
    message: "Send POST to save discount request",
  });
}
