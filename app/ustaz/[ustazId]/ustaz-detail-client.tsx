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

const subjects = [
  { value: "all", label: "ទាំងអស់" },
  { value: "figh", label: "Fiqh" },
  { value: "hadith", label: "Hadith" },
  { value: "akida", label: "Akida" },
];
export function UstazDetailClient({ videos, name }: UstazDetailClientProp) {
  const { scrollRef, scroll, isOverflowing } = useHorizontalScroll();
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [subject, setSubject] = useState("all");

  if (!videos) {
    notFound();
  }

  const filteredVideos =
    subject === "all" ? videos : videos.filter((video) => video.type === subject);

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
          {isOverflowing && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="size-5" />
            </Button>
          )}

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth gap-2 scrollbar-hide"
          >
            <ToggleGroup
              type="single"
              variant="outline"
              value={subject}
              onValueChange={(value) => {
                if (value) setSubject(value);
              }}
            >
              {subjects.map((sub) => (
                <ToggleGroupItem
                  key={sub.value}
                  value={sub.value}
                  aria-label={`Toggle ${sub.label}`}
                  className="text-2xl p-5 shrink-0"
                >
                  {sub.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {isOverflowing && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="size-5" />
            </Button>
          )}
        </div>
        <div className="px-3 py-2 mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-black/40">
            វីដេអូបន្ទាប់
          </p>
        </div>

        {filteredVideos.map((video, i) => (
          <VideoThumbnail
            key={video.id}
            video={video}
            index={i}
            name={name}
            videos={filteredVideos}
            isActive={video.id === currentVideo.id}
            onClick={() => setCurrentVideo(video)}
          />
        ))}
      </div>
    </div>
  );
}
