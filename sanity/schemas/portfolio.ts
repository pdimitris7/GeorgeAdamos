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

    // Free text (Ο χρήστης γράφει ό,τι θέλει)
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

    // Εμφανίζεται κανονικά στο Studio
    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
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
