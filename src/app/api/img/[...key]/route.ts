import { getImage } from "@/lib/storage";

export async function GET(_: Request, { params }: { params: Promise<{ key: string[] }> }) {
  try {
    const o = await getImage((await params).key.join("/"));
    return new Response(o.Body!.transformToWebStream(), {
      headers: { "Content-Type": o.ContentType ?? "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
