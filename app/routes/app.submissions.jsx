import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";
import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export async function loader() {
  const submissions = await prisma.discountRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return json({ submissions });
}

export default function SubmissionsPage() {
  const { submissions } = useLoaderData();

  return (
    <Page>
      <TitleBar title="Form Submissions" />

      <div className="submissions-page">
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Comments</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td>{s.product}</td>
                  <td>{s.quantity}</td>
                  <td>${s.price}</td>
                  <td>{s.comments}</td>
                  <td>{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Internal style */}
        <style>
          {`
          .submissions-page {
            max-width: 800px;
            margin: 2rem auto;
            font-family: sans-serif;
          }

          .submissions-page h1 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .submissions-page table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            overflow: hidden;
          }

          .submissions-page th, .submissions-page td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e1e1e1;
          }

          .submissions-page th {
            background: #f9f9f9;
            font-weight: 600;
          }

          .submissions-page tbody tr:hover {
            background-color: #f5f5f5;
          }

          .submissions-page p {
            color: #666;
          }
        `}
        </style>
      </div>
    </Page>
  );
}
