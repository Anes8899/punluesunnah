import ustazData from "@/data/ustaz.json";
import { notFound } from "next/navigation";

export default async function UstazDetailPage({
  params,
}: {
  params: { ustazId: string };
}) {
  const { ustazId } = await params;
  const ustaz = ustazData.find((u) => u.id === Number(ustazId));
  if (!ustaz) notFound();

  const videos = ustaz?.videos ?? [];
  const [activeVideo] = videos; // default to first video

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-[1600px] mx-auto px-4 py-4 flex gap-6">
        
        {/* ── Left: Player + Info ── */}
        <div className="flex-1 min-w-0">
          
          {/* Player */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo?.id}`}
              title={activeVideo?.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Title */}
          <h1 className="mt-3 text-lg font-semibold leading-snug line-clamp-2">
            {activeVideo?.title ?? "វីដេអូ"}
          </h1>

          {/* Ustaz info row */}
          <div className="flex items-center gap-3 mt-3 pb-3 border-b border-white/10">
            <div className="size-9 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
              {ustaz?.name?.[0] ?? "U"}
            </div>
            <div>
              <p className="text-sm font-medium">{ustaz?.name}</p>
              <p className="text-xs text-black">{videos.length} វីដេអូ</p>
            </div>
          </div>
        </div>

        {/* ── Right: Playlist ── */}
        <div className="w-[360px] shrink-0 flex flex-col gap-1 self-start sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          
          {/* Playlist header */}
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-black">
              វីដេអូបន្ទាប់
            </p>
          </div>

          {videos.map((video, i) => (
            <div
              key={video.id}
              className={`flex gap-2 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${
                i === 0 ? "bg-white/10" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-[168px] aspect-video rounded-md overflow-hidden shrink-0 bg-zinc-800">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="size-7 bg-black rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0 py-0.5">
                <p className="text-sm font-medium line-clamp-2 leading-snug">
                  {video.title}
                </p>
                <p className="text-xs text-black mt-1">{ustaz?.name}</p>
                <p className="text-xs text-black">{i + 1} នៃ {videos.length}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}