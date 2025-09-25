import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Grid,
  LegacyCard,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <TitleBar title="Discount Request Manager"></TitleBar>
      <Grid>
        {/* Card 1: Submissions */}
        <Grid.Cell columnSpan={{ xs: 2, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <LegacyCard title="Submissions" sectioned>
            <p>View all discount requests submitted by users.</p>
            <div style={{ marginTop: '12px' }}>
            <Button url="/app/submissions">Go to Submissions</Button>
            </div>
          </LegacyCard>
        </Grid.Cell>

        {/* Card 2: Settings */}
        <Grid.Cell columnSpan={{ xs: 2, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <LegacyCard title="Settings" sectioned>
            <p>Configure your discount request form and app preferences.</p>
            <div style={{ marginTop: '12px' }}>
            <Button url="/app/settings">Go to Settings</Button>
            </div>
          </LegacyCard>
        </Grid.Cell>
        {/* Future Cards Template */}
        {/*
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
          <LegacyCard title="Another Feature" sectioned>
            <p>Description of feature.</p>
            <Link to="/app/another">Go</Link>
          </LegacyCard>
        </Grid.Cell>
        */}
      </Grid>
    </Page>
  );
}