export type ArabicContentBlock =
  | { type: "text"; text: string }
  | { type: "definition"; label: string; text: string }
  | { type: "divider"; text: string }
  | { type: "callout"; text: string; tone?: ArabicTone }
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
      blocks: ArabicContentBlock[];
      number?: string;
      tone?: ArabicTone;
    };

export type ArabicTone = "highlight" | "success";

export interface ArabicLesson {
  id: number;
  arabic_title: string;
  khmer_title: string;
  content: ArabicContentBlock[];
}

export interface ArabicBook {
  id: number;
  arabic_title: string;
  khmer_title: string;
  lessons: ArabicLesson[];
}

export const ARABIC_BOOKS: ArabicBook[] = [
  {
    id: 1,
    arabic_title: "كِتَابُ النَّحْوِ",
    khmer_title: "សៀវភៅស្តីពីវេយ្យាករណ៍ណះវូ",
    lessons: [
      {
        id: 1,
        arabic_title: "الِاسْمُ وَالتَّذْكِيرُ وَالتَّأْنِيثُ",
        khmer_title: "នាម និង ភេទនៃនាម",
        content: [
          {
            type: "definition",
            label: "អ៊ិសម៍ (الاسم)",
            text: "គឺជាពាក្យដែលបញ្ជាក់ពីអត្ថន័យមួយដោយខ្លួនឯង ហើយមិនភ្ជាប់ជាមួយនឹងពេលវេលាឡើយ ដូចជា មនុស្ស សត្វ វត្ថុ ទីកន្លែង និង ឈ្មោះនានា។",
          },
          {
            type: "text",
            text: "នៅក្នុងភាសាអារ៉ាប់ នាមគ្រប់ពាក្យសុទ្ធតែមានភេទ គឺមិនភេទប្រុស (មូហ្សាក្កើរ) ក៏ភេទស្រី (មូអាន់ណះ)។ គ្មាននាមណាមួយឥតភេទឡើយ ទោះបីជាវាជាវត្ថុគ្មានជីវិតក៏ដោយ។",
          },
          {
            type: "divider",
            text: "នាមមាន ២ ភេទ",
          },
          {
            type: "section",
            number: "១",
            title: "មូហ្សាក្កើរ (الْمُذَكَّرُ) ភេទប្រុស",
            blocks: [
              {
                type: "text",
                text: "គឺជានាមដែលគ្មានសញ្ញាសម្គាល់ភេទស្រីនៅចុងពាក្យ។ វាជាទម្រង់ដើមនៃនាម ដូច្នេះយើងមិនចាំបាច់រកសញ្ញាអ្វីដើម្បីស្គាល់វានោះទេ។",
              },
              {
                type: "text",
                text: "ឧទាហរណ៍ ៖ كِتَابٌ (កីតាប - សៀវភៅ) ، بَيْتٌ (បៃត៍ - ផ្ទះ) ، قَلَمٌ (កឡាំ - ប៊ិច) ، رَجُلٌ (រ៉ជូល - បុរស)។",
              },
            ],
          },
          {
            type: "section",
            number: "២",
            title: "មូអាន់ណះ (الْمُؤَنَّثُ) ភេទស្រី",
            blocks: [
              {
                type: "text",
                text: "គឺជានាមដែលភាគច្រើនមានអក្សរ តាមើរបូតោះ (ة) នៅចុងពាក្យ។ អក្សរនេះជាសញ្ញាសម្គាល់ភេទស្រីដ៏ច្បាស់លាស់បំផុត។",
              },
              {
                type: "text",
                text: "ឧទាហរណ៍ ៖ مَدْرَسَةٌ (ម៉ាទ្រ៉ាសះ - សាលារៀន) ، سَيَّارَةٌ (សៃយ៉ារ៉ោះ - រថយន្ត) ، شَجَرَةٌ (សាចារ៉ោះ - ដើមឈើ) ، اِمْرَأَةٌ (អ៊ិមរ៉ាអះ - ស្ត្រី)។",
              },
              {
                type: "callout",
                text: "ប៉ុន្តែមាននាមខ្លះជាភេទស្រី ទោះបីគ្មាន ة ក៏ដោយ ដូចជា أُمٌّ (ម្តាយ) ، شَمْسٌ (ព្រះអាទិត្យ) ، يَدٌ (ដៃ) ، أَرْضٌ (ដី)។",
                tone: "highlight",
              },
            ],
          },
          {
            type: "callout",
            text: "ការស្គាល់ភេទនៃនាម គឺជាមូលដ្ឋានគ្រឹះ ព្រោះគុណនាម សព្វនាម និង កិរិយាសព្ទ ត្រូវតែស៊ីសង្វាក់គ្នាជាមួយភេទនៃនាមនោះ។",
            tone: "success",
          },
        ],
      },
      {
        id: 2,
        arabic_title: "أَدَاةُ التَّعْرِيفِ \"الْ\"",
        khmer_title: "អាល់ ៖ ធ្វើឲ្យនាមក្លាយជាជាក់លាក់",
        content: [
          {
            type: "definition",
            label: "ន័យភាសា",
            text: "الْ គឺជាបុព្វបទដែលភ្ជាប់ទៅនឹងខាងដើមនៃនាម។ វាមិនមែនជាពាក្យដាច់ដោយឡែកនោះទេ គឺត្រូវសរសេរជាប់គ្នាជាមួយនាមជានិច្ច។",
          },
          {
            type: "definition",
            label: "ន័យវេយ្យាករណ៍",
            text: "គឺជាឧបករណ៍ដែលប្តូរនាមពី នាក់កីរ៉ោះ (មិនជាក់លាក់) ទៅជា ម៉ាក់រីហ្វះ (ជាក់លាក់) ដូចនឹងការប្តូរពី «សៀវភៅមួយ» ទៅជា «សៀវភៅនោះ» ក្នុងភាសាខ្មែរ។",
          },
          {
            type: "divider",
            text: "របៀបប្រើប្រាស់",
          },
          {
            type: "text",
            text: "គ្រាន់តែបន្ថែម الْ ទៅខាងដើមនាម ជាការស្រេច។ ផ្នែកដែលនៅសល់នៃពាក្យមិនប្តូរឡើយ ហើយសញ្ញាតាន់វីន (ــٌ) នៅចុងពាក្យត្រូវប្តូរទៅជាដម្មះតែមួយ (ــُ) វិញ។",
          },
          {
            type: "section",
            title: "ឧទាហរណ៍ជាក់ស្តែង",
            blocks: [
              {
                type: "text",
                text: "សៀវភៅ ៖ كِتَابٌ (កីតាប) ← الْكِتَابُ (អាល់-កីតាប)។",
              },
              {
                type: "text",
                text: "ផ្ទះ ៖ بَيْتٌ (បៃត៍) ← الْبَيْتُ (អាល់-បៃត៍)។",
              },
              {
                type: "text",
                text: "ប៊ិច ៖ قَلَمٌ (កឡាំ) ← الْقَلَمُ (អាល់-កឡាំ)។",
              },
            ],
          },
          {
            type: "evidence",
            kind: "quran",
            intro: "សូមមើលការប្រើប្រាស់ الْ នៅក្នុងវាក្យខណ្ឌដំបូងនៃគម្ពីរគួរអាន ៖",
            arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            source: "الفاتحة: ٢",
            translation:
              "រាល់ការកោតសរសើរ គឺសម្រាប់អល់ឡោះ ជាម្ចាស់គ្រប់គ្រងពិភពទាំងអស់។",
          },
          {
            type: "text",
            text: "នៅក្នុងវាក្យខណ្ឌនេះ الْحَمْدُ និង الْعَالَمِينَ សុទ្ធតែមាន الْ នៅខាងដើម ដែលបញ្ជាក់ថាវាជានាមជាក់លាក់។",
          },
          {
            type: "divider",
            text: "ចំណុចត្រូវចងចាំ",
          },
          {
            type: "callout",
            text: "الْ មិនប្តូររូបរាងឡើយ ហើយមិនត្រូវសរសេរដាច់ពីនាមនោះទេ។ វាភ្ជាប់ជាមួយនាមដែលនៅពីក្រោយវាជានិច្ច។",
            tone: "highlight",
          },
          {
            type: "callout",
            text: "នាមណាដែលមាន الْ ហើយ គឺមិនត្រូវដាក់តាន់វីន (ــٌ ــٍ ــً) នៅចុងពាក្យទៀតឡើយ។",
            tone: "success",
          },
        ],
      },
      {
        id: 3,
        arabic_title: "الضَّمَائِرُ الشَّخْصِيَّةُ",
        khmer_title: "សព្វនាមបុគ្គល",
        content: [
          {
            type: "definition",
            label: "ដមៀរ (الضَّمِيرُ)",
            text: "គឺជាពាក្យដែលប្រើជំនួសនាម ដើម្បីកុំឲ្យយើងត្រូវនិយាយឈ្មោះនោះម្តងហើយម្តងទៀត។",
          },
          {
            type: "divider",
            text: "សព្វនាមមូលដ្ឋាន",
          },
          {
            type: "section",
            number: "១",
            title: "អ្នកនិយាយ (الْمُتَكَلِّمُ)",
            blocks: [
              {
                type: "text",
                text: "أَنَا (អាណា - ខ្ញុំ) សម្រាប់មនុស្សតែម្នាក់ ទាំងប្រុសទាំងស្រី។",
              },
              {
                type: "text",
                text: "نَحْنُ (ណះនូ - ពួកយើង) សម្រាប់ចាប់ពីពីរនាក់ឡើងទៅ។",
              },
            ],
          },
          {
            type: "section",
            number: "២",
            title: "អ្នកស្តាប់ (الْمُخَاطَبُ)",
            blocks: [
              {
                type: "text",
                text: "أَنْتَ (អាន់តា - អ្នក) សម្រាប់បុរសម្នាក់ ، أَنْتِ (អាន់តិ - អ្នក) សម្រាប់ស្ត្រីម្នាក់។",
              },
              {
                type: "text",
                text: "أَنْتُمْ (អាន់តុម - ពួកអ្នក) សម្រាប់បុរសច្រើននាក់ ، أَنْتُنَّ (អាន់តុន្នា - ពួកអ្នក) សម្រាប់ស្ត្រីច្រើននាក់។",
              },
            ],
          },
          {
            type: "section",
            number: "៣",
            title: "អ្នកដែលគេនិយាយអំពី (الْغَائِبُ)",
            blocks: [
              {
                type: "text",
                text: "هُوَ (ហ៊ូវ៉ា - គាត់ប្រុស) ، هِيَ (ហ៊ីយ៉ា - គាត់ស្រី)។",
              },
              {
                type: "text",
                text: "هُمْ (ហ៊ុម - ពួកគេប្រុស) ، هُنَّ (ហ៊ុន្នា - ពួកគេស្រី)។",
              },
            ],
          },
          {
            type: "callout",
            text: "ភាសាអារ៉ាប់បែងចែកភេទរបស់អ្នកស្តាប់ និង អ្នកដែលគេនិយាយអំពី ដែលខុសពីភាសាខ្មែរ។ ដូច្នេះត្រូវប្រុងប្រយ័ត្នពេលនិយាយទៅកាន់បុរស ឬ ស្ត្រី។",
            tone: "highlight",
          },
        ],
      },
      {
        id: 4,
        arabic_title: "الْجُمْلَةُ الِاسْمِيَّةُ",
        khmer_title: "ប្រយោគសាមញ្ញ",
        content: [],
      },
      {
        id: 5,
        arabic_title: "النَّعْتُ وَالْمُطَابَقَةُ",
        khmer_title: "គុណនាម និង ការស៊ីសង្វាក់គ្នា",
        content: [],
      },
      {
        id: 6,
        arabic_title: "أَسَاسِيَّاتُ الْجَمْعِ",
        khmer_title: "មូលដ្ឋានគ្រឹះនៃពហុវចនៈ",
        content: [],
      },
    ],
  },
  {
    id: 2,
    arabic_title: "كِتَابُ الصَّرْفِ",
    khmer_title: "សៀវភៅស្តីពីវេយ្យាករណ៍ សរ៉ហ្វ",
    lessons: [
      {
        id: 1,
        arabic_title: "الْمِيزَانُ الصَّرْفِيُّ",
        khmer_title: "ជញ្ជីងនៃពាក្យអារ៉ាប់",
        content: [],
      },
      {
        id: 2,
        arabic_title: "الْفِعْلُ الْمَاضِي",
        khmer_title: "កិរិយាសព្ទអតីតកាល",
        content: [],
      },
      {
        id: 3,
        arabic_title: "الْفِعْلُ الْمُضَارِعُ",
        khmer_title: "កិរិយាសព្ទបច្ចុប្បន្នកាល",
        content: [],
      },
    ],
  },
];

export function getArabicBook(id: number): ArabicBook | undefined {
  return ARABIC_BOOKS.find((book) => book.id === id);
}

export function getArabicLesson(
  bookId: number,
  lessonId: number,
): { book: ArabicBook; lesson: ArabicLesson } | undefined {
  const book = getArabicBook(bookId);
  const lesson = book?.lessons.find((l) => l.id === lessonId);

  if (!book || !lesson) return undefined;

  return { book, lesson };
}
