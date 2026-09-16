"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function QuranError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-[#00966b]">មាតិកា</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-800">អាល់គុរអាន</h1>
      <p className="mt-3 text-sm text-red-500">
        មិនអាចទាញយកទិន្នន័យគម្ពីរគូរអានបានទេ សូមព្យាយាមម្តងទៀត
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-4 rounded-md bg-[#00966b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#00966b]/85"
      >
        ព្យាយាមម្តងទៀត
      </button>
    </section>
  );
}
