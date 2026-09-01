import { toast } from "sonner";

/**
 * The admin UI has no backend yet. Submits log their payload and say so plainly
 * rather than faking success — these call sites are where Server Actions go.
 */
export function reportUnsaved(label: string, payload: unknown): void {
  console.log(`[admin] ${label}`, payload);
  toast.warning("UI only — មិនទាន់រក្សាទុក", {
    description: "ផ្ទាំងនេះមិនទាន់ភ្ជាប់មូលដ្ឋានទិន្នន័យ។ សូមមើល console។",
  });
  
}
