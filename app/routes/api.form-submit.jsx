import { json } from "@remix-run/node";

export async function loader() {
  return json({
    ok: true,
    message: "Test",
  });
}

export async function action({ request }) {
  
    const method = request.method;

    switch (method) {
        case "POST":
            return json({message: "Success", method: "POST" });
        case "PATCH":
            return json({message: "Success", method: "PATCH" });
        default:
            return new Response({message: "Method Not Allowed", method: "405" });
    }
}
