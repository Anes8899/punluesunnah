export type FighContentBlock =
  | { type: "text"; text: string }
  | { type: "definition"; label: string; text: string }
  | { type: "divider"; text: string }
  | { type: "callout"; text: string; tone?: FighTone }
  | {
      type: "evidence";
      kind: "quran" | "hadith";
      arabic: string;
      intro?: string;
      source?: string;
      translation?: string;
      translation_source?: string;
    }
  | {
      type: "section";
      title: string;
      blocks: FighContentBlock[];
      number?: string;
      tone?: FighTone;
    };

export type FighTone = "highlight" | "success";

export interface FighLesson {
  id: number;
  arabic_title: string;
  khmer_title: string;
  content: FighContentBlock[];
}

export interface FighBook {
  id: number;
  arabic_title: string;
  khmer_title: string;
  lessons: FighLesson[];
}

export const FIGH_BOOKS: FighBook[] = [
  {
    id: 1,
    arabic_title: "كِتَابُ الطَّهَارَةِ",
    khmer_title: "សៀវភៅស្តីពីការសម្អាត",
    lessons: [
      {
        id: 1,
        arabic_title: "تَعْرِيفُ الطَّهَارَةِ",
        khmer_title: "ការយល់ដឹងអំពី តហើរ៉ោះ",
        content: [
          {
            type: "definition",
            label: "ន័យភាសា",
            text: "ការមានអនាម័យ និង ជ្រះស្អាតអំពីអ្វីដែលកខ្វក់។",
          },
          {
            type: "definition",
            label: "ន័យសាសនា",
            text: "គឺជាការលើក ហាហ្ទេសចេញ និង កាសម្អាត ណាជីស។",
          },
          {
            type: "divider",
            text: "តហើរ៉ោះ មាន ២ ផ្នែក",
          },
          {
            type: "section",
            number: "១",
            title: "តហើរ៉ោះ ផ្នែកខាងក្នុង",
            blocks: [
              {
                type: "text",
                text: "គឺជាការជ្រះស្អាតចិត្ត អំពីប្រការ ស្ហីរិក ប្រការម៉ាក់ស៊ីយ៉ាត់ (អំពើបាប) និងប្រការទាំងឡាយដែលនាំឲ្យចិត្ត មានស្នឹមខ្មៅ។ ហើយការជ្រះស្អាត មិនមាននោះទេ ដរាបណា មានណាជីសស្ហីរិក នៅក្នុងចិត្ត។",
              },
              {
                type: "callout",
                text: "ដូច្នេះ តហើរ៉ោះ ផ្នែកខាងក្នុង គឺសំខាន់ជាង តហើរ៉ោះ ផ្នែកខាងក្រៅ។",
                tone: "highlight",
              },
              {
                type: "evidence",
                kind: "quran",
                intro: "ដូចដែល អល់ឡោះ ដ៏ខ្ពង់ខ្ពស់ ទ្រង់មានបន្ទូលថា៖",
                arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّمَا الْمُشْرِكُونَ نَجَسٌ",
                source: "التوبة: ٢٨",
                translation: "ឱ បណ្តាអ្នកដែលមានជំនឿទាំងឡាយ! ពិតប្រាកដណាស់ ពួកអ្នកមូស្រីគិន គឺជាណាជីស",
                translation_source: "អាត់តាវហ្ពះ : 28",
              },
              {
                type: "evidence",
                kind: "hadith",
                intro: "ហើយ រ៉សូលលុលឡោះ ﷺ មានប្រសាសន៍ថា៖",
                arabic: "إِنَّ الْمُؤْمِنَ لَا يَنْجُسُ",
                source: "متفق عليه",
                translation: "ពិតប្រាកដណាស់ អ្នកដែលមានជំនឿ មិនណាជីស ឡើយ",
                translation_source: "មុត្តាហ្វាកុនអាឡៃ",
              },
            ],
          },
          {
            type: "section",
            number: "២",
            title: "តហើរ៉ោះ ផ្នែកខាងក្រៅ",
            blocks: [
              {
                type: "text",
                text: "គឺជាការជ្រះស្អាតខ្លួនប្រាណ អំពី ហាហ្ទេស និង ណាជីស។",
              },
              {
                type: "divider",
                text: "តហើរ៉ោះ ផ្នែកខាងក្រៅ មាន ២ ៖",
              },
              {
                type: "section",
                number: "១",
                title: "ការជ្រះស្អាតអំពី ហាហ្ទេស",
                blocks: [
                  {
                    type: "definition",
                    label: "ហាហ្ទេស មានន័យថា",
                    text: "គឺជាអ្វីដែលរារាំង អ្នកមូស្លីម អំពីការធ្វើ អ៊ីហ្ពើហ្ទះណាដែលតម្រូវឲ្យមានលក្ខខណ្ឌ តហើរ៉ោះ (ជ្រះស្អាត) ដូចជា សឡាត និង តវ៉ាហ្វ ។ល។",
                  },
                  {
                    type: "divider",
                    text: "ហាហ្ទេស មាន ២",
                  },
                  {
                    type: "section",
                    number: "ក",
                    title: "ហាហ្ទេសតូច",
                    blocks: [
                      {
                        type: "text",
                        text: "គឺជាអ្វីដែលតម្រូវឱ្យយក វូឌូ ដូចជា បត់ជើងតូច បត់ជើងធំ និង អ្វីៗផ្សេងទៀតដែលធ្វើឱ្យខូច វូឌូ។",
                      },
                      {
                        type: "callout",
                        text: "ការជ្រះស្អាត គឺតាមរយៈការយក វូហ្ទុ",
                        tone: "success",
                      },
                      {
                        type: "evidence",
                        kind: "quran",
                        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ...",
                        translation: "ឱ បណ្តាអ្នកដែលមានជំនឿទាំងឡាយ! នៅពេលដែលពួកអ្នកក្រោកទៅធ្វើការសឡាត ចូរពួកអ្នកលាងមុខរបស់ពួកអ្នក...",
                        translation_source: "អាល់ ម៉ាអ៊ីហ្ទះ : 6",
                      },
                    ],
                  },
                  {
                    type: "section",
                    number: "ខ",
                    title: "ហាហ្ទេស ធំ",
                    blocks: [
                      {
                        type: "text",
                        text: "គឺជាអ្វីដែលតម្រូវឱ្យធ្វើការងូតទឹក ដូចជា រួមភេទ មានរដូវ ឈាមបន្ទាប់ពីសម្រាលកូនរួច ។ល។",
                      },
                      {
                        type: "callout",
                        text: "ការជ្រះស្អាត គឺតាមរយៈការងូតទឹក",
                        tone: "success",
                      },
                      {
                        type: "evidence",
                        kind: "quran",
                        arabic: "وَإِن كُنتُمْ جُنُبًا فَاطَّهَّرُوا",
                        translation: "ហើយប្រសិនបើពួកអ្នកមានជូនុប ពួកអ្នកត្រូវសំអាត ខ្លួនប្រាណ (ដោយងូតទឹក)",
                        translation_source: "អាល់ ម៉ាអ៊ីហ្ទះ: 6",
                      },
                    ],
                  },
                  {
                    type: "section",
                    title: "ពេលគ្មានទឹក ឬ ប្រើមិនបាន?",
                    tone: "highlight",
                    blocks: [
                      {
                        type: "text",
                        text: "ការជ្រះស្អាត គឺតាមរយៈ តាយ៉ាំមុំ",
                      },
                      {
                        type: "evidence",
                        kind: "quran",
                        arabic: "...فَتَيَمَّمُوا صَعِيدًا طَيِّبًا",
                        translation_source: "អាល់ ម៉ាអ៊ីហ្ទះ: 6",
                      },
                    ],
                  },
                ],
              },
              {
                type: "section",
                number: "២",
                title: "ការជ្រះស្អាតអំពី ណាជីស",
                blocks: [
                  {
                    type: "text",
                    text: "គឺការលាងសម្អាត ណាជីស ចេញពីរាងកាយ សម្លៀកបំពាក់ និងទីកន្លែង។",
                  },
                  {
                    type: "callout",
                    text: "ការលាងសម្អាត ណាជីស គឺវ៉ាជីប (កាតព្វកិច្ច)",
                    tone: "highlight",
                  },
                  {
                    type: "evidence",
                    kind: "quran",
                    arabic: "وَثِيَابَكَ فَطَهِّرْ",
                    translation: "ហើយចូរសម្អាតសម្លៀកបំពាក់របស់អ្នក",
                    translation_source: "អាល់មុតទើស្សសៀរ៍ : 4",
                  },
                  {
                    type: "evidence",
                    kind: "hadith",
                    arabic: "أَكْثَرُ عَذَابِ الْقَبْرِ مِنَ الْبَوْلِ",
                    translation: "ភាគច្រើននៃការដាក់ទណ្ឌកម្មនៅក្នុងផ្នូរ គឺបណ្តាលមកពីទឹកនោម...",
                    translation_source: "អ៊ិបនូម៉ាហ្ជះ",
                  },
                  {
                    type: "evidence",
                    kind: "hadith",
                    arabic: "...فَإِنْ رَأَى فِي نَعْلَيْهِ قَذَرًا أَوْ أَذًى فَلْيَمْسَحْهُ...",
                    translation: "ប្រសិនបើឃើញណាជីសលើស្បែកជើង ត្រូវជូតវាចេញ...",
                    translation_source: "អាពូឌាវូត",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        arabic_title: "أَحْكَامُ الْمِيَاهِ",
        khmer_title: "វិធាននៃទឹក",
        content: [],
      },
      {
        id: 3,
        arabic_title: "آنِيَةُ الذَّهَبِ وَالْفِضَّةِ",
        khmer_title: "ការប្រើប្រាស់ភាជន៍",
        content: [],
      },
    ],
  },
  {
    id: 2,
    arabic_title: "كِتَابُ الصَّلَاةِ",
    khmer_title: "សៀវភៅស្តីពីការសឡាត",
    lessons: [
      {
        id: 1,
        arabic_title: "مَوَاقِيتُ الصَّلَاةِ",
        khmer_title: "ពេលវេលានៃការសឡាត",
        content: [],
      },
      {
        id: 2,
        arabic_title: "صِفَةُ الصَّلَاةِ",
        khmer_title: "របៀបនៃការសឡាត",
        content: [],
      },
      {
        id: 3,
        arabic_title: "صَلَاةُ الْجَمَاعَةِ",
        khmer_title: "សឡាតជាម៉ាអាត់",
        content: [],
      },
    ],
  },
];

export function getFighBook(id: number): FighBook | undefined {
  return FIGH_BOOKS.find((book) => book.id === id);
}

export function getFighLesson(
  bookId: number,
  lessonId: number,
): { book: FighBook; lesson: FighLesson } | undefined {
  const book = getFighBook(bookId);
  const lesson = book?.lessons.find((l) => l.id === lessonId);

  if (!book || !lesson) return undefined;

  return { book, lesson };
}
