import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";

export default function HadithPanel() {
  return (
    <div>
      <AspectRatio
        ratio={16 / 13}
        className="rounded-lg bg-white shadow-md flex flex-col p-5 items-center"
      >
        <div>
          <span>ហាទីសប្រចាំថ្ងៃ</span>
        </div>
        <div>
          <h1>خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</h1>
          <span>[ رواه البخاري : ٥٠٢٧ ]</span>
        </div>
        <h3>
          «អ្នកដែលប្រសើរជាងគេក្នុងចំណោមពួកអ្នក គឺអ្នកដែលរៀនអាល់គួរអាន
          និងបង្រៀនវា»
        </h3>
        <div>
          <span>ប្រភព៖ អាល់ពូខរី (៥០២៧)</span>
        </div>
        <Button>
          អានបន្ថែម<span>d</span>
        </Button>
      </AspectRatio>
    </div>
  );
}
