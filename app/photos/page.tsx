import { getEvents } from "@/app/actions/events";
import { PhotosContent } from "./components/photos-content";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PhotosPage() {
  const events = await getEvents();
  return <PhotosContent events={events} />;
}
