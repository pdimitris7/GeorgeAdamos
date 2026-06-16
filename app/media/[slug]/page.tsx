// app/media/[slug]/page.tsx
// Redirect direct URL visits to /media — the modal is the only way to view a post.
import { redirect } from "next/navigation";

export default function MediaPostPage() {
  redirect("/media");
}
