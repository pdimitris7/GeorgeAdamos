// schemas/portfolio.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolio",
  title: "Portfolio Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Write any category (free text)",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    // Masonry gallery — drag to reorder, pick size per image
    defineField({
      name: "gallery",
      title: "Gallery Images",
      description:
        "Add items with '+ Add item'. Delete any old invalid items and re-add them to get the size picker.",
      type: "array",
      of: [
        // ── New format: image + size + alt ──
        {
          type: "object",
          name: "galleryItem",
          title: "Image with size",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              initialValue: "1x1",
              options: {
                list: [
                  { title: "Standard (1×1)", value: "1x1" },
                  { title: "Wide (2×1 — landscape)", value: "2x1" },
                  { title: "Tall (1×2 — portrait)", value: "1x2" },
                  { title: "Large (2×2 — featured)", value: "2x2" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "alt",
              title: "Alt text (optional)",
              type: "string",
            }),
          ],
          preview: {
            select: {
              media: "image",
              size: "size",
              alt: "alt",
            },
            prepare({ media, size, alt }) {
              return {
                title: alt || "Image",
                subtitle: size || "1x1",
                media,
              };
            },
          },
        },
        // ── Legacy format: plain image (kept so old items don't error) ──
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "isFeatured",
      title: "Show on Homepage",
      type: "boolean",
      description: "Select to display this project on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "gridClass",
      title: "Grid Layout (for Homepage)",
      type: "string",
      options: {
        list: [
          { title: "Large (2x2)", value: "col-span-2 row-span-2" },
          { title: "Wide (2x1)", value: "col-span-2 row-span-1" },
          { title: "Tall (1x2)", value: "col-span-1 row-span-2" },
          { title: "Small (1x1)", value: "col-span-1 row-span-1" },
        ],
      },
      hidden: ({ document }) => !document?.isFeatured,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "heroImage",
      isFeatured: "isFeatured",
    },
    prepare({ title, category, media, isFeatured }) {
      return {
        title,
        subtitle: `${category || "—"}${isFeatured ? " • Featured" : ""}`,
        media,
      };
    },
  },
});
