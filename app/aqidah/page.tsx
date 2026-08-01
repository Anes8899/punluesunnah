import AqidahPillar from "../features/category/AqidahPillar";
import AccordionList from "../components/AccordionList";
import PageHeader from "../components/PageHeader";

const tawhidCategories = [
  {
    title: "Tawḥīd al-Rubūbiyyah",
    transliteration: "Oneness of Lordship",
    description:
      "Affirming Allah alone as Creator, Sustainer, and Sovereign of all existence.",
    citation:
      'Cf. Qur\'an 7:54 — "Unquestionably, His is the creation and command."',
  },
  {
    title: "Tawḥīd al-Ulūhiyyah",
    transliteration: "Oneness of Worship",
    description:
      "Directing all acts of worship — prayer, supplication, reliance, vows — to Allah alone, without intermediary.",
    citation:
      'Cf. Qur\'an 1:5 — "It is You we worship and You we ask for help."',
  },
  {
    title: "Tawḥīd al-Asmāʾ wa-l-Ṣifāt",
    transliteration: "Oneness of Names & Attributes",
    description:
      "Affirming what Allah has described of Himself in revelation, as befitting His majesty, without distortion, denial, or anthropomorphic comparison.",
    citation: 'Cf. Qur\'an 42:11 — "There is nothing like unto Him."',
  },
];

const pillarsOfIman = [
  {
    title: "Belief in Allah",
    arabic: "الإيمان بالله",
    description:
      "Certainty in His existence, His exclusive right to worship, and the perfection of His names and attributes.",
  },
  {
    title: "Belief in the Angels",
    arabic: "الإيمان بالملائكة",
    description:
      "Created from light, honored servants who carry out Allah's commands without disobedience.",
    citation: "Qur'an 66:6",
  },
  {
    title: "Belief in the Revealed Books",
    arabic: "الإيمان بالكتب",
    description:
      "Scriptures sent to earlier prophets — the Tawrāh, Zabūr, Injīl — culminating in the Qur'an as the final, preserved revelation.",
    citation: "Qur'an 15:9",
  },
  {
    title: "Belief in the Messengers",
    arabic: "الإيمان بالرسل",
    description:
      "All prophets, from Ādam to Muḥammad ﷺ, were sent with the same core call to worship Allah alone; Muḥammad ﷺ is the final messenger.",
    citation: "Qur'an 33:40",
  },
  {
    title: "Belief in the Last Day",
    arabic: "الإيمان باليوم الآخر",
    description:
      "Resurrection, judgment, and eternal recompense — the accountability that gives worldly life its moral weight.",
    citation: "Qur'an 22:7",
  },
  {
    title: "Belief in Divine Decree",
    arabic: "الإيمان بالقدر",
    description:
      "All that occurs — good and difficult alike — proceeds by Allah's knowledge, will, and decree, without negating human responsibility for one's choices.",
    citation: "Qur'an 57:22",
  },
];

const sections = [
  {
    value: "what-is-aqidah",
    trigger: (
      <h2 className="text-2xl font-bold text-slate-800">
        1. What is Aqidah?
      </h2>
    ),
    content: (
      <p className="mt-3 leading-7 text-slate-600">
        <em>Aqidah</em> (
        <span className="font-arabic text-lg text-[#00966b]">عقيدة</span>,
        <span className="italic text-slate-500">al-ʿaqīdah</span>
        &quot;creed&quot; or &quot;that which is firmly tied&quot;) denotes
        the body of belief a Muslim holds with certainty — matters of faith
        rather than practice. It is distinguished from <em>fiqh</em>{" "}
        (jurisprudence), which governs action; aqidah governs conviction.
        Classical scholars organized it around belief in Allah, His angels,
        His scriptures, His messengers, the Last Day, and divine decree (
        <em>al-qadar</em>) — collectively the Six Pillars of Īmān —
        underpinned throughout by <em>Tawḥīd</em>, the affirmation that
        Allah alone is God.
      </p>
    ),
  },
  {
    value: "tawhid",
    trigger: (
      <h2 className="text-2xl font-bold text-slate-800">
        2. Tawḥīd — The Oneness of Allah
      </h2>
    ),
    content: (
      <>
        <p className="mt-3 leading-7 text-slate-600">
          Tawḥīd (
          <span className="font-arabic text-lg text-[#00966b]">توحيد</span>)
          is the central axis of Islamic belief: the assertion that Allah is
          one in His lordship, His right to worship, and His names and
          attributes. Scholars traditionally divide it into three categories:
        </p>

        <blockquote className="mt-5 rounded-xl border-l-4 border-[#00966b] bg-[#00966b]/5 px-5 py-4">
          <p className="font-arabic text-xl leading-relaxed text-slate-800">
            قُلْ هُوَ اللَّهُ أَحَدٌ﴿١﴾ اللَّهُ الصَّمَدُ﴿٢﴾
          </p>
          <p className="mt-2 text-sm text-slate-600">
            &quot;Say, He is Allah, [who is] One. Allah, the Eternal
            Refuge.&quot; — <strong>Qur&apos;an 112:1–2</strong> (Sūrat
            al-Ikhlāṣ)
          </p>
        </blockquote>

        <div className="mt-6 space-y-6">
          {tawhidCategories.map((item, i) => (
            <AqidahPillar key={item.title} number={i + 1} {...item} />
          ))}
        </div>
      </>
    ),
  },
  {
    value: "pillars",
    trigger: (
      <h2 className="text-2xl font-bold text-slate-800">
        3. The Six Pillars of Īmān{" "}
        <span className="text-base font-normal italic text-slate-400">
          (Arkān al-Īmān)
        </span>
      </h2>
    ),
    content: (
      <>
        <p className="mt-3 leading-7 text-slate-600">
          The Prophet ﷺ defined faith when asked by the angel Jibrīl:{" "}
          <em>
            &quot;That you believe in Allah, His angels, His books, His
            messengers, the Last Day, and that you believe in divine decree,
            its good and its evil.&quot;
          </em>{" "}
          <span className="text-xs text-slate-400">— Ṣaḥīḥ Muslim 8</span>
        </p>

        <div className="mt-6 space-y-6">
          {pillarsOfIman.map((item, i) => (
            <AqidahPillar key={item.title} number={i + 1} {...item} />
          ))}
        </div>
      </>
    ),
  },
  {
    value: "closing",
    trigger: (
      <h2 className="text-2xl font-bold text-slate-800">
        4. Closing Reflection
      </h2>
    ),
    content: (
      <>
        <p className="mt-3 leading-7 text-slate-600">
          Aqidah is not an abstract checklist but the ground beneath
          practice: Tawḥīd orders whom one worships and how one understands
          God, while the Six Pillars frame the unseen realities — angels,
          revelation, prophethood, the Hereafter, and decree — that give
          worship its meaning. Correct belief, the scholars note, is what the
          Prophet ﷺ and his companions were upon, before doctrinal factions
          multiplied; it is preserved not through innovation but through
          recourse to the Qur&apos;an and authenticated Sunnah, understood as
          the earliest generations understood them.
        </p>

        <p className="mt-8 border-t border-slate-200 pt-3 text-xs text-slate-400">
          Personal notes compiled for study. Qur&apos;anic citations are
          paraphrased for brevity; consult a complete muṣḥaf and its tafsīr,
          and a scholar, for full context and rulings.
        </p>
      </>
    ),
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white px-6 py-8 shadow-sm sm:px-10">
      <PageHeader
        eyebrow="Personal Study Notes"
        title="Aqidah: The Foundations of Islamic Belief"
        arabic="العقيدة الإسلامية"
        description="An overview of Tawḥīd and the Six Pillars of Īmān, with supporting references from the Qur'an and Sunnah."
      />

      <hr className="my-8 border-slate-200" />

      <AccordionList sections={sections} />
    </div>
  );
}
