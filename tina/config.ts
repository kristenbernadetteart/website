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
          // Global: listed under "Site" in the sidebar, opening the document
          // directly. The visual editor never auto-opens global forms, so each
          // page's own content opens there instead of this.
          global: true,
          // No router: this appears on every page, so there's no one page to preview.
        },
        fields: [
          { type: "string", name: "artistName", label: "Artist name", required: true },
          {
            type: "image",
            name: "logo",
            label: "Header logo",
            description: "Optional. Shown at the left of the header. A transparent PNG or SVG works best.",
          },
          {
            type: "image",
            name: "favicon",
            label: "Favicon",
            description: "The small icon in the browser tab. A square PNG or SVG, at least 64 × 64, works best.",
          },
          {
            type: "number",
            name: "logoHeight",
            label: "Logo height (px)",
            description: "How tall the logo appears in the header, from 20 to 120. Default 44.",
          },
          {
            type: "string",
            name: "headerText",
            label: "Header text",
            description: "Shown in the header when there is no logo (and read aloud to screen readers when there is). Leave empty to use the artist name.",
          },
          {
            type: "string",
            name: "tagline",
            label: "Home headline",
            description: "The large line on the home page.",
            required: true,
          },
          {
            type: "string",
            name: "galleryLabel",
            label: "Gallery label",
            description: "The first menu tab and the heading above the gallery. Default \"Work\".",
          },
          {
            type: "string",
            name: "intro",
            label: "Home intro",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "heroButtonText",
            label: "Home button text",
            description: "The main button under the home intro, which jumps to the gallery. Default \"View the work\".",
          },
          {
            type: "boolean",
            name: "hideHeroButton",
            label: "Hide home button",
            description: "Hide the main button under the home intro.",
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
              },
            ],
          },
          { type: "string", name: "footerNote", label: "Footer note" },
        ],
      },

      // ---------- Header menu (single file) ----------
      {
        name: "menu",
        label: "Menu",
        path: "content/menu",
        format: "json",
        match: { include: "menu" },
        ui: {
          allowedActions: { create: false, delete: false },
          // Global: listed under "Site" in the sidebar, opening the document
          // directly. The visual editor never auto-opens global forms, so each
          // page's own content opens there instead of this.
          global: true,
          // No router: this appears on every page, so there's no one page to preview.
        },
        fields: [
          {
            type: "object",
            name: "links",
            label: "Menu links",
            description: "The links in the header menu, in this order. Drag to reorder; delete one to hide it. Leave empty for the default menu.",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.label || item?.link || "New link",
              }),
            },
            fields: [
              {
                type: "string",
                name: "link",
                label: "Goes to",
                options: [
                  { value: "gallery", label: "Gallery (home)" },
                  { value: "prints", label: "Prints" },
                  { value: "about", label: "About" },
                  { value: "commissions", label: "Commissions page" },
                  { value: "contact", label: "Contact email" },
                ],
              },
              {
                type: "string",
                name: "label",
                label: "Label",
                description: "The text shown in the menu. Leave empty for the default (the gallery label from Site settings, \"Prints\", \"About\", \"Commissions\" or \"Contact\").",
              },
            ],
          },
        ],
      },

      // ---------- About page (single file) ----------
      {
        name: "page",
        label: "About page",
        path: "content/pages",
        format: "mdx",
        match: { include: "about" },
        ui: {
          allowedActions: { create: false, delete: false },
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
          {
            type: "image",
            name: "image",
            label: "Main image",
            description: "Shown in the gallery, on the home page, and first on the painting's page.",
            required: true,
          },
          {
            type: "string",
            name: "imageAlt",
            label: "Main image description (alt text)",
            description: "Briefly describe what the painting shows, for screen readers.",
          },
          {
            type: "object",
            name: "moreImages",
            label: "More images",
            description: "Optional extra photos, such as close-up details or the painting on a wall. Shown as thumbnails on the painting's page, in this order.",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.imageAlt || item?.image?.split("/").pop() || "New image",
              }),
            },
            fields: [
              { type: "image", name: "image", label: "Image" },
              {
                type: "string",
                name: "imageAlt",
                label: "Image description (alt text)",
                description: "e.g. Close-up of the brushwork in the sky",
              },
            ],
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

      // ---------- Commissions page (single file) ----------
      {
        name: "commissionsPage",
        label: "Commissions page",
        path: "content/commissions-page",
        format: "md",
        match: { include: "commissions" },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/commissions",
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Heading",
            description: "The title at the top of the page. Default \"Commissions\".",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description",
            description: "Shown below the heading, above the questions.",
            isBody: true,
          },
          {
            type: "object",
            name: "questions",
            label: "Questions",
            description: "Each question gets a text box for the visitor's answer. Shown in this order.",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.question || "New question" }),
            },
            fields: [
              { type: "string", name: "question", label: "Question" },
              {
                type: "string",
                name: "placeholder",
                label: "Hint text (optional)",
                description: "Faint example text inside the empty box.",
              },
              {
                type: "boolean",
                name: "required",
                label: "Required",
                description: "The visitor must answer this before sending.",
              },
            ],
          },
          {
            type: "string",
            name: "email",
            label: "Send to email",
            description: "Where commission requests go. Leave empty to use the contact email from Site settings.",
          },
          {
            type: "string",
            name: "subject",
            label: "Email subject",
            description: "Default \"Commission request\".",
          },
          {
            type: "string",
            name: "buttonText",
            label: "Button text",
            description: "Default \"Send request\".",
          },
          {
            type: "string",
            name: "note",
            label: "Note under the button",
            description: "Optional. e.g. \"This opens your email app with your answers filled in.\"",
          },
        ],
      },

      // ---------- Prints page (single file) ----------
      {
        name: "printsPage",
        label: "Prints page",
        path: "content/prints-page",
        format: "md",
        match: { include: "prints" },
        ui: {
          allowedActions: { create: false, delete: false },
          router: () => "/prints",
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Heading",
            description: "The title at the top of the Prints page. Default \"Prints\".",
          },
          {
            type: "number",
            name: "borderWidth",
            label: "Print border width (px)",
            description: "The white border around print images (not original paintings), from 0 to 40. 0 for no border. Default 12.",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description",
            description: "Shown below the heading.",
            isBody: true,
          },
        ],
      },

      // ---------- Prints ----------
      {
        name: "print",
        label: "Prints",
        path: "content/prints",
        format: "md",
        defaultItem: () => ({ status: "available" }),
        ui: {
          router: ({ document }) => `/prints/${document._sys.filename}`,
          filename: {
            readonly: false,
            slugify: (values) => slugify(values?.title),
          },
        },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "image", name: "image", label: "Image" },
          {
            type: "string",
            name: "imageAlt",
            label: "Image description (alt text)",
            description: "Briefly describe what the print shows, for screen readers.",
          },
          {
            type: "reference",
            name: "painting",
            label: "Original painting (optional)",
            description: "Links the print and the painting to each other.",
            collections: ["painting"],
          },
          {
            type: "string",
            name: "printType",
            label: "Print type",
            description: "e.g. Giclée on cotton rag paper",
          },
          {
            type: "string",
            name: "edition",
            label: "Edition",
            description: "e.g. Open edition, or Limited edition of 50",
          },
          {
            type: "object",
            name: "sizes",
            label: "Sizes and prices",
            description: "Shown in this order. The lowest price appears on the Prints page.",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: [item?.size, item?.price != null ? `$${item.price}` : null]
                  .filter(Boolean)
                  .join(" — ") || "New size",
              }),
            },
            fields: [
              // Not required: an empty required field inside a list item makes the
              // whole prints query fail. Incomplete rows are skipped on the site.
              { type: "string", name: "size", label: "Size", description: "e.g. 8 × 10 in" },
              { type: "number", name: "price", label: "Price (USD)" },
            ],
          },
          {
            type: "string",
            name: "shopUrl",
            label: "Shopify product link",
            description: "The product's page on your Shopify store. The Buy button goes here.",
          },
          {
            type: "string",
            name: "status",
            label: "Status",
            description: "Hidden prints don't appear on the site, but stay here to edit or show again later.",
            options: [
              { value: "available", label: "Available" },
              { value: "hidden", label: "Hidden" },
            ],
          },
          {
            type: "number",
            name: "order",
            label: "Sort order",
            description: "Lower numbers appear first on the Prints page. Leave empty to sort by title.",
          },
          { type: "rich-text", name: "body", label: "Description", isBody: true },
        ],
      },
    ],
  },
});