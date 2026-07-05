import { Video } from "@/lib/getUstazData";
import Image from "next/image";

interface VideoThumbnailProp {
  index: number;
  video: Video;
  name: string;
  videos: Video[];
  onClick: () => void;
}

export function VideoThumbnail({ video, index, name, videos, onClick }: VideoThumbnailProp) {
  return (
    <div
      key={video.id}
      className="flex w-full gap-2 p-2 rounded-lg cursor-pointer hover:bg-black/5 transition-colors"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-40 sm:w-42 lg:w-42 aspect-video rounded-md overflow-hidden shrink-0 bg-zinc-200">
        <Image
          src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover"
          width={100}
          height={100}
        />
        {index === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="size-7 bg-white rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-10 border-l-black border-b-[6px] border-b-transparent ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-sm font-medium line-clamp-2 leading-snug">
          {video.title}
        </p>
        <p className="text-xs text-black/50 mt-1">{name}</p>
        <p className="text-xs text-black/40">
          {index + 1} នៃ {videos.length}
        </p>
      </div>
    </div>
  );
}
