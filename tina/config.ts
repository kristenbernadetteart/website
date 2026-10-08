import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "main";

const slugify = (value?: string) =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default defineConfig({
  branch,
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ---------- Site-wide settings (single file) ----------
      {
        name: "settings",
        label: "Site settings",
        path: "content/settings",
        format: "json",
        match: { include: "site" },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/",
        },
        fields: [
          { type: "string", name: "artistName", label: "Artist name", required: true },
          {
            type: "string",
            name: "tagline",
            label: "Home headline",
            description: "The large line on the home page.",
            required: true,
          },
          {
            type: "string",
            name: "intro",
            label: "Home intro",
            ui: { component: "textarea" },
          },
          { type: "string", name: "contactEmail", label: "Contact email", required: true },
          {
            type: "object",
            name: "socials",
            label: "Social links",
            description: "Shown as white icons in the footer, in this order.",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.platform || "New link" }),
            },
            fields: [
              {
                type: "string",
                name: "platform",
                label: "Platform",
                required: true,
                options: [
                  { value: "bluesky", label: "Bluesky" },
                  { value: "x", label: "X" },
                  { value: "facebook", label: "Facebook" },
                  { value: "tiktok", label: "TikTok" },
                  { value: "instagram", label: "Instagram" },
                ],
              },
              {
                type: "string",
                name: "url",
                label: "Profile URL",
                required: true,
              },
            ],
          },
          { type: "string", name: "footerNote", label: "Footer note" },
        ],
      },

      // ---------- Pages (About, Commissions, Shipping, ...) ----------
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "mdx",
        ui: {
          router: ({ document }) => `/${document._sys.filename}`,
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "image", name: "portrait", label: "Portrait / side image" },
          { type: "string", name: "portraitAlt", label: "Image description (alt text)" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },

      // ---------- Paintings ----------
      {
        name: "painting",
        label: "Paintings",
        path: "content/paintings",
        format: "md",
        ui: {
          router: ({ document }) => `/work/${document._sys.filename}`,
          filename: {
            readonly: false,
            slugify: (values) => slugify(values?.title),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "image", name: "image", label: "Image", required: true },
          {
            type: "string",
            name: "imageAlt",
            label: "Image description (alt text)",
            description: "Briefly describe what the painting shows, for screen readers.",
          },
          { type: "number", name: "year", label: "Year" },
          { type: "string", name: "medium", label: "Medium", description: "e.g. Oil on linen" },
          { type: "string", name: "dimensions", label: "Dimensions", description: "e.g. 24 × 30 in" },
          { type: "number", name: "price", label: "Price (USD)" },
          {
            type: "string",
            name: "status",
            label: "Status",
            required: true,
            options: [
              { value: "available", label: "Available" },
              { value: "reserved", label: "Reserved" },
              { value: "sold", label: "Sold" },
            ],
          },
          {
            type: "boolean",
            name: "featured",
            label: "Feature on home page",
            description: "The first featured painting appears in the home page hero.",
          },
          {
            type: "string",
            name: "buyUrl",
            label: "Checkout link (optional)",
            description: "A Stripe Payment Link or similar. Leave empty to use email inquiry only.",
          },
          { type: "rich-text", name: "body", label: "Description", isBody: true },
        ],
      },
    ],
  },
});