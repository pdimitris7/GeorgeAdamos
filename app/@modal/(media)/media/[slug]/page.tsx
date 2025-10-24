// app/media/@modal/(.)[slug]/page.tsx
import { notFound } from "next/navigation";
import { getMediaBySlug } from "@/lib/sanity.base";
import MediaModal from "@/components/media-modal";

type Props = { params: { slug: string } };

export default async function MediaModalIntercept({ params }: Props) {
  const post = await getMediaBySlug(params.slug);
  if (!post) return notFound();
  // Δεν περνάμε onClose -> το MediaModal θα κάνει router.back()
  return <MediaModal post={post} />;
}
