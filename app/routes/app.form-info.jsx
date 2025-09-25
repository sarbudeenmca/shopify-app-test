import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function loader() {
  const settings = await prisma.settings.findFirst();
  return json(settings, {
      headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}