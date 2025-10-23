// sanity/lib/queries.ts
import { groq } from "next-sanity";

export const featuredProjectsQuery = groq`
  *[_type == "portfolio" && isFeatured == true]
  | order(order asc, _createdAt desc){
    _id, title, slug, category, heroImage, description, gridClass, order, gallery
  }
`;
