import { BookOpen, MoveRight } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function HadithPanel() {
  return (
    <div className="rounded-lg bg-white shadow-md flex flex-col p-5 items-center">
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 mb-5">
          ហាទីសប្រចាំថ្ងៃ
        </Badge>
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance font-arabic">
          خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
        </h1>
        <p className="text-sm text-muted-foreground font-arabic">[ رواه البخاري : ٥٠٢٧ ]</p>
      </div>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        អ្នកដែលប្រសើរជាងគេក្នុងចំណោមពួកអ្នក គឺអ្នកដែលរៀនអាល់គួរអាន និងបង្រៀនវា
      </blockquote>
      <div className="flex flex-col gap-2 mt-5">
        <span className="h-10 inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-whiteborder border-white text-sm text-foreground relative bg-gray-100">
          {/* decorative dots */}
          <BookOpen style={{ width: 20, height: 20 }} className="text-orange-400" />
          ប្រភព៖ អាល់ពូខរី (៥០២៧)
        </span>

        <Button className="bg-green-700 h-14 rounded-full">
          អានបន្ថែម
          <MoveRight />
        </Button>
      </div>
    </div>
  );
}
