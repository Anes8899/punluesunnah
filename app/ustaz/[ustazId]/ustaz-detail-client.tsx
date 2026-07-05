"use client";

import { VideoThumbnail } from "@/app/components/features/category/VideoThumbnail";
import { AspectRatio } from "@/app/components/ui/aspect-ratio";
import { Button } from "@/app/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { useHorizontalScroll } from "@/app/hook/useHorizontalScroll";
import { Video } from "@/lib/getUstazData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";

interface UstazDetailClientProp {
  videos: Video[];
  name: string;
}

const subject = ["Fiqh", "Hadith"];
export function UstazDetailClient({ videos, name }: UstazDetailClientProp) {
  const { scrollRef, scroll } = useHorizontalScroll();
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  if (!videos) {
    notFound();
  }

  const [activeVideo] = videos;

  return (
    <div className="flex flex-col lg:flex-row px-3 gap-5 bg-white">
      <div className="basis-2/3">
        <AspectRatio
          ratio={16 / 9}
          className="w-full rounded-lg bg-muted overflow-hidden"
        >
          <iframe
            src={`https://www.youtube.com/embed/${currentVideo?.id}`}
            title={currentVideo?.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </AspectRatio>

        {/* Title */}
        <h1 className="text-lg mt-5 font-semibold leading-snug line-clamp-2">
          {currentVideo?.title ?? "វីដេអូ"}
        </h1>

        <div className="flex items-center gap-3 mt-3 pb-3 border-b border-black/10">
          <div className="size-9 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
            {name?.[0] ?? "U"}
          </div>
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-gray-600">{videos.length} វីដេអូ</p>
          </div>
        </div>
      </div>
      <div className="basis-1/3">
        <div className="relative flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="size-5" />
          </Button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth gap-2 scrollbar-hide"
          >
            <ToggleGroup type="single" variant="outline" defaultValue="all">
              {subject.map((sub, index) => (
                <ToggleGroupItem
                  key={index}
                  value={sub}
                  aria-label={`Toggle ${sub}`}
                  className="text-2xl p-5 shrink-0"
                >
                  {sub}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
        <div className="px-3 py-2 mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-black/40">
            វីដេអូបន្ទាប់
          </p>
        </div>

        {videos.map((video, i) => (
          <VideoThumbnail
            key={i}
            video={video}
            index={i}
            name={name}
            videos={videos}
            isActive={video.id === currentVideo.id}
            onClick={() => setCurrentVideo(video)}
          />
        ))}
      </div>
    </div>
  );
}
