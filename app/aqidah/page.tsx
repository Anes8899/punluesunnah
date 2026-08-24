import { Accordion } from "../ui/accordion";
import AccordionSection from "../components/AccordionSection";
import PageHeader from "../components/PageHeader";

type AqidahNode = {
  value: string;
  title: string;
  transliteration?: string;
  arabic?: string;
  content?: React.ReactNode;
  children?: AqidahNode[];
};

const LEVEL_LABELS = ["كتاب", "باب", "فصل", "مبحث", "مطلب"];
const LEVEL_NAMES = ["Book", "Chapter", "Section", "Topic", "Subtopic"];
const LEVEL_HEADING_CLASS = [
  "text-2xl font-bold text-slate-800",
  "text-2xl font-bold text-slate-800",
  "text-lg font-semibold text-slate-800",
  "text-base font-semibold text-slate-800",
  "text-sm font-semibold text-slate-800",
];

function renderAqidahNodes(nodes: AqidahNode[], level: number) {
  return (
    <Accordion type="single" collapsible>
      {nodes.map((node, i) => (
        <AccordionSection
          key={node.value}
          value={node.value}
          className={i > 0 ? (level === 0 ? "mt-10" : "mt-5") : undefined}
          trigger={
            <div>
              <span className="block text-[10px] font-semibold tracking-[0.14em] text-[#00966b] uppercase">
                <span className="font-arabic normal-case">
                  {LEVEL_LABELS[level]}
                </span>{" "}
                · {LEVEL_NAMES[level]} {i + 1}
              </span>
              <h2 className={LEVEL_HEADING_CLASS[level]}>
                {node.title}
                {node.transliteration && (
                  <span className="ml-1.5 text-sm font-normal italic text-slate-400">
                    — {node.transliteration}
                  </span>
                )}
                {node.arabic && (
                  <span className="font-arabic ml-2 text-lg text-[#00966b]">
                    {node.arabic}
                  </span>
                )}
              </h2>
            </div>
          }
        >
          {node.content}
          {node.children && node.children.length > 0 && (
            <div className="mt-4">
              {renderAqidahNodes(node.children, level + 1)}
            </div>
          )}
        </AccordionSection>
      ))}
    </Accordion>
  );
}

const aqidahBook: AqidahNode = {
  value: "kitab-aqidah",
  title: "The Book of Creed",
  arabic: "كتاب العقيدة",
  children: [
    {
      value: "bab-what-is-aqidah",
      title: "What is Aqidah?",
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
      value: "bab-tawhid",
      title: "Tawḥīd — The Oneness of Allah",
      content: (
        <>
          <p className="mt-3 leading-7 text-slate-600">
            Tawḥīd (
            <span className="font-arabic text-lg text-[#00966b]">توحيد</span>)
            is the central axis of Islamic belief: the assertion that Allah
            is one in His lordship, His right to worship, and His names and
            attributes. Scholars traditionally divide it into three
            categories:
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
        </>
      ),
      children: [
        {
          value: "fasl-rububiyyah",
          title: "Tawḥīd al-Rubūbiyyah",
          transliteration: "Oneness of Lordship",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                Affirming Allah alone as Creator, Sustainer, and Sovereign of
                all existence.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Cf. Qur&apos;an 7:54 — &quot;Unquestionably, His is the
                creation and command.&quot;
              </p>
            </>
          ),
        },
        {
          value: "fasl-uluhiyyah",
          title: "Tawḥīd al-Ulūhiyyah",
          transliteration: "Oneness of Worship",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                Directing all acts of worship — prayer, supplication,
                reliance, vows — to Allah alone, without intermediary.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Cf. Qur&apos;an 1:5 — &quot;It is You we worship and You we
                ask for help.&quot;
              </p>
            </>
          ),
        },
        {
          value: "fasl-asma-wa-sifat",
          title: "Tawḥīd al-Asmāʾ wa-l-Ṣifāt",
          transliteration: "Oneness of Names & Attributes",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                Affirming what Allah has described of Himself in revelation,
                as befitting His majesty, without distortion, denial, or
                anthropomorphic comparison.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Cf. Qur&apos;an 42:11 — &quot;There is nothing like unto
                Him.&quot;
              </p>
            </>
          ),
        },
      ],
    },
    {
      value: "bab-pillars",
      title: "The Six Pillars of Īmān",
      transliteration: "Arkān al-Īmān",
      content: (
        <p className="mt-3 leading-7 text-slate-600">
          The Prophet ﷺ defined faith when asked by the angel Jibrīl:{" "}
          <em>
            &quot;That you believe in Allah, His angels, His books, His
            messengers, the Last Day, and that you believe in divine decree,
            its good and its evil.&quot;
          </em>{" "}
          <span className="text-xs text-slate-400">— Ṣaḥīḥ Muslim 8</span>
        </p>
      ),
      children: [
        {
          value: "fasl-belief-allah",
          title: "Belief in Allah",
          arabic: "الإيمان بالله",
          content: (
            <p className="mt-3 leading-6 text-sm text-slate-600">
              Certainty in His existence, His exclusive right to worship, and
              the perfection of His names and attributes.
            </p>
          ),
        },
        {
          value: "fasl-belief-angels",
          title: "Belief in the Angels",
          arabic: "الإيمان بالملائكة",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                Created from light, honored servants who carry out Allah&apos;s
                commands without disobedience.
              </p>
              <p className="mt-1 text-xs text-slate-400">Qur&apos;an 66:6</p>
            </>
          ),
        },
        {
          value: "fasl-belief-books",
          title: "Belief in the Revealed Books",
          arabic: "الإيمان بالكتب",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                Scriptures sent to earlier prophets — the Tawrāh, Zabūr,
                Injīl — culminating in the Qur&apos;an as the final,
                preserved revelation.
              </p>
              <p className="mt-1 text-xs text-slate-400">Qur&apos;an 15:9</p>
            </>
          ),
        },
        {
          value: "fasl-belief-messengers",
          title: "Belief in the Messengers",
          arabic: "الإيمان بالرسل",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                All prophets, from Ādam to Muḥammad ﷺ, were sent with the
                same core call to worship Allah alone; Muḥammad ﷺ is the
                final messenger.
              </p>
              <p className="mt-1 text-xs text-slate-400">Qur&apos;an 33:40</p>
            </>
          ),
        },
        {
          value: "fasl-belief-last-day",
          title: "Belief in the Last Day",
          arabic: "الإيمان باليوم الآخر",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                Resurrection, judgment, and eternal recompense — the
                accountability that gives worldly life its moral weight.
              </p>
              <p className="mt-1 text-xs text-slate-400">Qur&apos;an 22:7</p>
            </>
          ),
        },
        {
          value: "fasl-belief-decree",
          title: "Belief in Divine Decree",
          arabic: "الإيمان بالقدر",
          content: (
            <>
              <p className="mt-3 leading-6 text-sm text-slate-600">
                All that occurs — good and difficult alike — proceeds by
                Allah&apos;s knowledge, will, and decree, without negating
                human responsibility for one&apos;s choices.
              </p>
              <p className="mt-1 text-xs text-slate-400">Qur&apos;an 57:22</p>
            </>
          ),
        },
      ],
    },
    {
      value: "bab-closing",
      title: "Closing Reflection",
      content: (
        <>
          <p className="mt-3 leading-7 text-slate-600">
            Aqidah is not an abstract checklist but the ground beneath
            practice: Tawḥīd orders whom one worships and how one understands
            God, while the Six Pillars frame the unseen realities — angels,
            revelation, prophethood, the Hereafter, and decree — that give
            worship its meaning. Correct belief, the scholars note, is what
            the Prophet ﷺ and his companions were upon, before doctrinal
            factions multiplied; it is preserved not through innovation but
            through recourse to the Qur&apos;an and authenticated Sunnah,
            understood as the earliest generations understood them.
          </p>

          <p className="mt-8 border-t border-slate-200 pt-3 text-xs text-slate-400">
            Personal notes compiled for study. Qur&apos;anic citations are
            paraphrased for brevity; consult a complete muṣḥaf and its
            tafsīr, and a scholar, for full context and rulings.
          </p>
        </>
      ),
    },
  ],
};

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

      {renderAqidahNodes([aqidahBook], 0)}
    </div>
  );
}
