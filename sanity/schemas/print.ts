export default {
  name: "print",
  title: "Print",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Landscapes", value: "landscapes" },
          { title: "Food Photography", value: "food" },
          { title: "Portraits", value: "portraits" },
          { title: "Architecture", value: "architecture" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "availableSizes",
      title: "Available Sizes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: '8x10"', value: "8x10" },
                  { title: '11x14"', value: "11x14" },
                  { title: '16x20"', value: "16x20" },
                  { title: '20x24"', value: "20x24" },
                  { title: '24x36"', value: "24x36" },
                ],
              },
            },
            {
              name: "price",
              title: "Price ($)",
              type: "number",
              validation: (Rule: any) => Rule.required().min(0),
            },
          ],
          preview: {
            select: {
              size: "size",
              price: "price",
            },
            prepare(selection: any) {
              const { size, price } = selection
              return {
                title: `${size}" - $${price}`,
              }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "isAvailable",
      title: "Available for Purchase",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      description: "Order for display (lower numbers appear first)",
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "image",
    },
    prepare(selection: any) {
      const { title, category } = selection
      return {
        title,
        subtitle: category,
      }
    },
  },
}
