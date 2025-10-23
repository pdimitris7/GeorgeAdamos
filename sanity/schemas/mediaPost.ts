import { defineField, defineType } from "sanity";

export default defineType({
  name: "mediaPost",
  title: "Media Post",
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
      name: "publication",
      title: "Publication",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // ✅ Free-text category (χωρίς options)
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Free text. We'll summarize/group categories on the site.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    // Gallery για το modal / άρθρο
    defineField({
      name: "gallery",
      title: "Gallery Images",
      description: "Images to display in the modal/gallery layout.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    // Προαιρετικό rich content
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    defineField({
      name: "externalLink",
      title: "External Link",
      type: "url",
      description: "Link to the original article",
    }),

    // ✅ ΝΕΟ: κουμπί για εμφάνιση στην αρχική σελίδα (HOME)
    defineField({
      name: "showOnHome",
      title: "Show on Home",
      type: "boolean",
      description: "Enable to display this post on the homepage Media section",
      initialValue: false,
    }),

    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],

  preview: {
    select: {
      title: "title",
      publication: "publication",
      media: "featuredImage",
      showOnHome: "showOnHome",
      category: "category",
    },
    prepare({ title, publication, showOnHome, category, media }) {
      const homeTag = showOnHome ? " • HOME" : "";
      const cat = category ? ` • ${category}` : "";
      return {
        title,
        subtitle: `${publication || ""}${homeTag}${cat}`,
        media,
      };
    },
  },
});
