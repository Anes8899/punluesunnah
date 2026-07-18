"use client";

import { useMemo, useState } from "react";

type Frac = { n: number; d: number };

interface Heir {
  key: string;
  label: string;
  count: number;
  fraction: Frac;
  arabic?: string;
  asaba?: boolean;
  note?: string;
}

interface HeirRow {
  key: string;
  label: string;
  arabic: string;
  count: number;
  shareLabel: string;
  amountFmt: string;
  eachFmt: string | null;
}

interface Excluded {
  label: string;
  reason: string;
}

interface CalcResult {
  rows: HeirRow[];
  excluded: Excluded[];
  notes: string[];
  bequestClamped: boolean;
  bequestCapFmt: string;
  hasAnyHeir: boolean;
  netFmt: string;
  totalAllocatedFmt: string;
}

interface CalcState {
  gross: string;
  debts: string;
  funeral: string;
  bequest: string;
  gender: "male" | "female";
  wives: number;
  husband: boolean;
  father: boolean;
  mother: boolean;
  grandfather: boolean;
  grandmothers: number;
  sons: number;
  daughters: number;
  gsons: number;
  gdaughters: number;
  fullBrothers: number;
  fullSisters: number;
  patBrothers: number;
  patSisters: number;
  maternalSibs: number;
}

const initialState: CalcState = {
  gross: "",
  debts: "",
  funeral: "",
  bequest: "",
  gender: "male",
  wives: 0,
  husband: false,
  father: false,
  mother: false,
  grandfather: false,
  grandmothers: 0,
  sons: 0,
  daughters: 0,
  gsons: 0,
  gdaughters: 0,
  fullBrothers: 0,
  fullSisters: 0,
  patBrothers: 0,
  patSisters: 0,
  maternalSibs: 0,
};

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}
function F(n: number, d: number): Frac {
  if (d === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
}
const fadd = (a: Frac, b: Frac): Frac => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fsub = (a: Frac, b: Frac): Frac => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fmul = (a: Frac, b: Frac): Frac => F(a.n * b.n, a.d * b.d);
const fscaleInt = (a: Frac, k: number): Frac => F(a.n * k, a.d);
const fval = (a: Frac): number => a.n / a.d;
const fstr = (a: Frac): string => {
  if (a.n === 0) return "0";
  if (a.d === 1) return String(a.n);
  return `${a.n}/${a.d}`;
};
const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

function compute(s: CalcState): CalcResult {
  const num = (v: string) => Number(v) || 0;

  const gross = num(s.gross);
  const debts = num(s.debts);
  const funeral = num(s.funeral);
  const bequestCapVal = Math.max(gross - debts - funeral, 0) / 3;
  const bequestClamped = num(s.bequest) > bequestCapVal + 0.001;
  const bequest = Math.min(num(s.bequest), bequestCapVal);
  const net = Math.max(gross - debts - funeral - bequest, 0);

  const { sons, daughters, gsons, gdaughters } = s;
  const hasSon = sons > 0;
  const hasDescendant = sons > 0 || daughters > 0 || gsons > 0 || gdaughters > 0;

  const heirs: Heir[] = [];
  const excluded: Excluded[] = [];
  const notes: string[] = [];
  const spousePresent = s.gender === "male" ? s.wives > 0 : !!s.husband;
  const spouseKeys = ["wives", "husband"];

  if (s.gender === "male" && s.wives > 0) {
    const fr = hasDescendant ? F(1, 8) : F(1, 4);
    heirs.push({
      key: "wives",
      label: s.wives > 1 ? `ប្រពន្ធ (${s.wives} នាក់)` : "ប្រពន្ធ",
      count: s.wives,
      fraction: fr,
      arabic: "Zawjah",
    });
  } else if (s.gender === "female" && s.husband) {
    const fr = hasDescendant ? F(1, 4) : F(1, 2);
    heirs.push({ key: "husband", label: "ប្តី", count: 1, fraction: fr, arabic: "Zawj" });
  }

  let daughterFixedPresent = false;
  if (!hasSon && daughters > 0) {
    daughterFixedPresent = true;
    if (daughters === 1) heirs.push({ key: "daughter", label: "កូនស្រី", count: 1, fraction: F(1, 2), arabic: "Bint" });
    else heirs.push({ key: "daughters", label: `កូនស្រី (${daughters} នាក់)`, count: daughters, fraction: F(2, 3), arabic: "Banat" });
  }

  if (!hasSon && gsons === 0 && gdaughters > 0) {
    if (daughters === 0) {
      daughterFixedPresent = true;
      if (gdaughters === 1) heirs.push({ key: "gdaughter", label: "ចៅស្រី (តាមកូនប្រុស)", count: 1, fraction: F(1, 2), arabic: "Bint al-Ibn" });
      else heirs.push({ key: "gdaughters", label: `ចៅស្រី (តាមកូនប្រុស, ${gdaughters} នាក់)`, count: gdaughters, fraction: F(2, 3), arabic: "Bint al-Ibn" });
    } else if (daughters === 1) {
      heirs.push({ key: "gdaughters", label: `ចៅស្រី (តាមកូនប្រុស, ${gdaughters} នាក់)`, count: gdaughters, fraction: F(1, 6), arabic: "Bint al-Ibn" });
    } else {
      excluded.push({
        label: "ចៅស្រី (តាមកូនប្រុស)",
        reason: "ត្រូវបានរាំង — កូនស្រីចាប់ពី ២ នាក់ឡើងទៅបានទទួលចំណែក ២/៣ ពេញលេញរួចហើយ ហើយគ្មានចៅប្រុស(តាមកូនប្រុស)ដើម្បីធ្វើឲ្យពួកគេទទួលចំណែកនៅសល់ទេ។",
      });
    }
  }
  if (hasSon && (gsons > 0 || gdaughters > 0)) {
    excluded.push({ label: "ចៅ (តាមកូនប្រុស)", reason: "ត្រូវបានរាំង — មានកូនប្រុសនៅរស់ ដែលជាកូនចៅខិតជិតជាង។" });
  }

  const siblingExistCount = s.fullBrothers + s.fullSisters + s.patBrothers + s.patSisters + s.maternalSibs;
  if (s.mother) {
    if (hasDescendant || siblingExistCount >= 2) {
      heirs.push({ key: "mother", label: "ម្តាយ", count: 1, fraction: F(1, 6), arabic: "Umm" });
    } else if (s.father && spousePresent) {
      const spouseH = heirs.find((h) => spouseKeys.includes(h.key));
      const spouseFrac = spouseH ? spouseH.fraction : F(0, 1);
      const remainder = fsub(F(1, 1), spouseFrac);
      const mFrac = fmul(remainder, F(1, 3));
      heirs.push({
        key: "mother",
        label: "ម្តាយ",
        count: 1,
        fraction: mFrac,
        arabic: "Umm",
        note: "១/៣ នៃចំណែកនៅសល់បន្ទាប់ពីចំណែកប្តី/ប្រពន្ធ (អ៊ូម៉ារីយ៉ាថែន)",
      });
      notes.push(
        "ករណីហ្គារ៉ាវ៉ែន / អ៊ូម៉ារីយ៉ាថែនត្រូវបានអនុវត្ត៖ ពេលមានតែប្តី/ប្រពន្ធ ឪពុក និងម្តាយនៅរស់ ម្តាយទទួល ១/៣ នៃចំណែកនៅសល់បន្ទាប់ពីចំណែកថេររបស់ប្តី/ប្រពន្ធ (មិនមែន ១/៣ នៃទ្រព្យទាំងមូលទេ) តាមទស្សនៈភាគច្រើន។"
      );
    } else {
      heirs.push({ key: "mother", label: "ម្តាយ", count: 1, fraction: F(1, 3), arabic: "Umm" });
    }
  }

  if (s.father) {
    if (hasDescendant) heirs.push({ key: "father", label: "ឪពុក", count: 1, fraction: F(1, 6), arabic: "Ab" });
  } else if (s.grandfather) {
    if (hasDescendant) heirs.push({ key: "grandfather", label: "ជីតាខាងឪពុក", count: 1, fraction: F(1, 6), arabic: "Jadd" });
  }
  if (s.father && s.grandfather) excluded.push({ label: "ជីតាខាងឪពុក", reason: "ត្រូវបានរាំង — ឪពុកនៅរស់។" });

  if (s.mother && s.grandmothers > 0) {
    excluded.push({ label: "ជីដូន", reason: "ត្រូវបានរាំង — ម្តាយនៅរស់។" });
  } else if (s.grandmothers > 0) {
    heirs.push({
      key: "grandmothers",
      label: s.grandmothers > 1 ? `ជីដូន (${s.grandmothers} នាក់)` : "ជីដូន",
      count: s.grandmothers,
      fraction: F(1, 6),
      arabic: "Jaddah",
    });
  }

  const maleDescBlocks = hasSon || gsons > 0;
  const fatherOrGfBlocks = s.father || (!s.father && s.grandfather);
  const fullConsangBlocked = maleDescBlocks || fatherOrGfBlocks;
  const uterineBlocked = hasDescendant || fatherOrGfBlocks;

  let fullAsaba = false;
  if (!fullConsangBlocked) {
    if (s.fullBrothers > 0) {
      fullAsaba = true;
    } else if (s.fullSisters > 0) {
      if (daughterFixedPresent) {
        fullAsaba = true;
      } else if (s.fullSisters === 1) heirs.push({ key: "fullSister", label: "បងប្អូនស្រីបង្កើត", count: 1, fraction: F(1, 2), arabic: "Ukht Shaqiqah" });
      else heirs.push({ key: "fullSisters", label: `បងប្អូនស្រីបង្កើត (${s.fullSisters} នាក់)`, count: s.fullSisters, fraction: F(2, 3), arabic: "Akhawat Shaqiqat" });
    }
  } else if (s.fullBrothers > 0 || s.fullSisters > 0) {
    excluded.push({
      label: "បងប្អូនបង្កើត",
      reason: maleDescBlocks ? "ត្រូវបានរាំង — មានកូនចៅប្រុស (កូនប្រុស/ចៅប្រុស) នៅរស់។" : `ត្រូវបានរាំង — ${s.father ? "ឪពុក" : "ជីតា"}នៅរស់។`,
    });
  }

  const consangBlockedByFull = s.fullBrothers > 0 || s.fullSisters >= 2;
  let patAsaba = false;
  if (!fullConsangBlocked && !consangBlockedByFull) {
    if (s.patBrothers > 0) {
      patAsaba = true;
    } else if (s.patSisters > 0) {
      if (daughterFixedPresent && s.fullSisters === 0) {
        patAsaba = true;
      } else if (s.fullSisters === 0) {
        if (s.patSisters === 1) heirs.push({ key: "patSister", label: "បងប្អូនស្រីខាងឪពុក", count: 1, fraction: F(1, 2), arabic: "Ukht li-Ab" });
        else heirs.push({ key: "patSisters", label: `បងប្អូនស្រីខាងឪពុក (${s.patSisters} នាក់)`, count: s.patSisters, fraction: F(2, 3), arabic: "Akhawat li-Ab" });
      } else {
        excluded.push({
          label: "បងប្អូនស្រីខាងឪពុក",
          reason: "ករណីពិសេស — មានបងប្អូនស្រីបង្កើតតែម្នាក់ ដោយគ្មានបងប្អូនប្រុសដើម្បីបង្កើតចំណែកនៅសល់ទេ សូមផ្ទៀងផ្ទាត់ជាមួយអ្នកប្រាជ្ញ។",
        });
      }
    }
  } else if (s.patBrothers > 0 || s.patSisters > 0) {
    excluded.push({
      label: "បងប្អូនខាងឪពុក",
      reason: fullConsangBlocked
        ? maleDescBlocks
          ? "ត្រូវបានរាំង — មានកូនចៅប្រុសនៅរស់។"
          : "ត្រូវបានរាំង — ឪពុក/ជីតានៅរស់។"
        : "ត្រូវបានរាំង — បងប្អូនបង្កើតនៅរស់។",
    });
  }

  if (s.maternalSibs > 0) {
    if (uterineBlocked) {
      excluded.push({ label: "បងប្អូនខាងម្តាយ", reason: hasDescendant ? "ត្រូវបានរាំង — មានកូនចៅនៅរស់។" : "ត្រូវបានរាំង — ឪពុក/ជីតានៅរស់។" });
    } else if (s.maternalSibs === 1) {
      heirs.push({ key: "uterine", label: "បងប្អូនខាងម្តាយ", count: 1, fraction: F(1, 6), arabic: "Akh/Ukht li-Umm" });
    } else {
      heirs.push({ key: "uterines", label: `បងប្អូនខាងម្តាយ (${s.maternalSibs} នាក់)`, count: s.maternalSibs, fraction: F(1, 3), arabic: "Ikhwah li-Umm" });
    }
  }

  let sumFixed = F(0, 1);
  heirs.forEach((h) => {
    sumFixed = fadd(sumFixed, h.fraction);
  });

  if (fval(sumFixed) > 1 + 1e-9) {
    const scale = F(sumFixed.d, sumFixed.n);
    heirs.forEach((h) => {
      h.fraction = fmul(h.fraction, scale);
    });
    notes.push(
      `ការកែតម្រូវ Awl ត្រូវបានអនុវត្ត៖ ចំណែកថេររួមមានលើសពីទ្រព្យទាំងមូល (${fstr(sumFixed)} នៃ ១) ដូច្នេះចំណែកនីមួយៗត្រូវបានបន្ថយសមាមាត្រគ្នាដើម្បីឲ្យសមនឹងទ្រព្យសរុប។`
    );
  } else {
    const residue = fsub(F(1, 1), sumFixed);
    if (residue.n > 0) {
      let asabaAssigned = false;
      if (hasSon) {
        const units = sons * 2 + daughters * 1;
        const unit = F(residue.n, residue.d * units);
        heirs.push({ key: "sons", label: sons > 1 ? `កូនប្រុស (${sons} នាក់)` : "កូនប្រុស", count: sons, fraction: fscaleInt(unit, 2 * sons), arabic: "Ibn", asaba: true });
        if (daughters > 0) heirs.push({ key: "daughters_res", label: daughters > 1 ? `កូនស្រី (${daughters} នាក់)` : "កូនស្រី", count: daughters, fraction: fscaleInt(unit, 1 * daughters), arabic: "Bint", asaba: true });
        asabaAssigned = true;
      } else if (gsons > 0) {
        const units = gsons * 2 + gdaughters * 1;
        const unit = F(residue.n, residue.d * units);
        heirs.push({ key: "gsons", label: gsons > 1 ? `ចៅប្រុស (${gsons} នាក់)` : "ចៅប្រុស", count: gsons, fraction: fscaleInt(unit, 2 * gsons), arabic: "Ibn al-Ibn", asaba: true });
        if (gdaughters > 0) heirs.push({ key: "gdaughters_res", label: gdaughters > 1 ? `ចៅស្រី (${gdaughters} នាក់)` : "ចៅស្រី", count: gdaughters, fraction: fscaleInt(unit, 1 * gdaughters), arabic: "Bint al-Ibn", asaba: true });
        asabaAssigned = true;
      } else if (s.father) {
        const existing = heirs.find((h) => h.key === "father");
        if (existing) {
          existing.fraction = fadd(existing.fraction, residue);
          existing.asaba = true;
          existing.note = "១/៦ + ចំណែកនៅសល់ (អាសាបា)";
        } else heirs.push({ key: "father", label: "ឪពុក", count: 1, fraction: residue, arabic: "Ab", asaba: true });
        asabaAssigned = true;
      } else if (s.grandfather) {
        const existing = heirs.find((h) => h.key === "grandfather");
        if (existing) {
          existing.fraction = fadd(existing.fraction, residue);
          existing.asaba = true;
          existing.note = "១/៦ + ចំណែកនៅសល់ (អាសាបា)";
        } else heirs.push({ key: "grandfather", label: "ជីតាខាងឪពុក", count: 1, fraction: residue, arabic: "Jadd", asaba: true });
        asabaAssigned = true;
      } else if (fullAsaba) {
        if (s.fullBrothers > 0) {
          const units = s.fullBrothers * 2 + s.fullSisters * 1;
          const unit = F(residue.n, residue.d * units);
          heirs.push({ key: "fullBrothers", label: s.fullBrothers > 1 ? `បងប្អូនប្រុសបង្កើត (${s.fullBrothers} នាក់)` : "បងប្អូនប្រុសបង្កើត", count: s.fullBrothers, fraction: fscaleInt(unit, 2 * s.fullBrothers), arabic: "Akh Shaqiq", asaba: true });
          if (s.fullSisters > 0) heirs.push({ key: "fullSisters_res", label: s.fullSisters > 1 ? `បងប្អូនស្រីបង្កើត (${s.fullSisters} នាក់)` : "បងប្អូនស្រីបង្កើត", count: s.fullSisters, fraction: fscaleInt(unit, 1 * s.fullSisters), arabic: "Ukht Shaqiqah", asaba: true });
        } else {
          const unit = F(residue.n, residue.d * s.fullSisters);
          heirs.push({
            key: "fullSisters_res",
            label: s.fullSisters > 1 ? `បងប្អូនស្រីបង្កើត (${s.fullSisters} នាក់)` : "បងប្អូនស្រីបង្កើត",
            count: s.fullSisters,
            fraction: fscaleInt(unit, s.fullSisters),
            arabic: "Ukht Shaqiqah",
            asaba: true,
            note: "អាសាបា ម៉ាអាល ហ្គែរ (ចំណែកនៅសល់រួមជាមួយកូនស្រី)",
          });
        }
        asabaAssigned = true;
      } else if (patAsaba) {
        if (s.patBrothers > 0) {
          const units = s.patBrothers * 2 + s.patSisters * 1;
          const unit = F(residue.n, residue.d * units);
          heirs.push({ key: "patBrothers", label: s.patBrothers > 1 ? `បងប្អូនប្រុសខាងឪពុក (${s.patBrothers} នាក់)` : "បងប្អូនប្រុសខាងឪពុក", count: s.patBrothers, fraction: fscaleInt(unit, 2 * s.patBrothers), arabic: "Akh li-Ab", asaba: true });
          if (s.patSisters > 0) heirs.push({ key: "patSisters_res", label: s.patSisters > 1 ? `បងប្អូនស្រីខាងឪពុក (${s.patSisters} នាក់)` : "បងប្អូនស្រីខាងឪពុក", count: s.patSisters, fraction: fscaleInt(unit, 1 * s.patSisters), arabic: "Ukht li-Ab", asaba: true });
        } else {
          const unit = F(residue.n, residue.d * s.patSisters);
          heirs.push({
            key: "patSisters_res",
            label: s.patSisters > 1 ? `បងប្អូនស្រីខាងឪពុក (${s.patSisters} នាក់)` : "បងប្អូនស្រីខាងឪពុក",
            count: s.patSisters,
            fraction: fscaleInt(unit, s.patSisters),
            arabic: "Ukht li-Ab",
            asaba: true,
            note: "អាសាបា ម៉ាអាល ហ្គែរ (ចំណែកនៅសល់រួមជាមួយកូនស្រី)",
          });
        }
        asabaAssigned = true;
      }

      if (!asabaAssigned) {
        const nonSpouse = heirs.filter((h) => !spouseKeys.includes(h.key));
        let sumNonSpouse = F(0, 1);
        nonSpouse.forEach((h) => {
          sumNonSpouse = fadd(sumNonSpouse, h.fraction);
        });
        if (sumNonSpouse.n > 0) {
          const factor = fadd(F(1, 1), F(residue.n * sumNonSpouse.d, residue.d * sumNonSpouse.n));
          nonSpouse.forEach((h) => {
            h.fraction = fmul(h.fraction, factor);
          });
          notes.push(
            "ការកែតម្រូវ Radd (ត្រឡប់ចំណែកនៅសល់) ត្រូវបានអនុវត្ត៖ គ្មានអ្នកទទួលចំណែកនៅសល់ (អាសាបា) ទេ ដូច្នេះចំណែកនៅសល់ត្រូវបានប្រគល់ត្រឡប់ទៅសាច់ញាតិខាងឈាមខាងលើវិញតាមសមាមាត្រ (ចំណែកថេររបស់ប្តី/ប្រពន្ធមិនត្រូវបានបង្កើនដោយ Radd ទេ តាមទស្សនៈនេះ)។"
          );
        } else if (heirs.length > 0) {
          notes.push(
            `គ្មានអ្នកទទួលចំណែកនៅសល់ដើម្បីទទួលចំណែកនៅសល់ ${fstr(residue)} នៃទ្រព្យសរុបនោះទេ ហើយក្បួននេះមិនត្រឡប់ចំណែកនៅសល់ទៅប្តី/ប្រពន្ធតែម្នាក់ឯងឡើយ។ តាមការអនុវត្ត ចំណែកនៅសល់នេះនឹងទៅដល់សាច់ញាតិផ្សេងទៀត ឬឃ្លាំងសាធារណៈ (Bayt al-mal) — សូមពិគ្រោះជាមួយអ្នកប្រាជ្ញ។`
          );
        }
      }
    }
  }

  const heirAmounts = heirs.filter((h) => h.fraction.n > 0).map((h) => ({ h, amount: net * fval(h.fraction) }));

  const rows: HeirRow[] = heirAmounts.map(({ h, amount }) => ({
    key: h.key,
    label: h.label,
    arabic: h.arabic || "",
    count: h.count,
    shareLabel: h.asaba ? h.note || "ចំណែកនៅសល់ (អាសាបា)" : fstr(h.fraction) + (h.note ? ` — ${h.note}` : ""),
    amountFmt: fmt(amount),
    eachFmt: h.count > 1 ? fmt(amount / h.count) : null,
  }));

  const totalAllocated = heirAmounts.reduce((a, { amount }) => a + amount, 0);

  return {
    rows,
    excluded,
    notes,
    bequestClamped,
    bequestCapFmt: fmt(bequestCapVal),
    hasAnyHeir: rows.length > 0,
    netFmt: fmt(net),
    totalAllocatedFmt: fmt(totalAllocated),
  };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">
        {label} {hint && <span className="text-slate-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value === 0 ? "" : value}
      placeholder="0"
      onChange={(e) => {
        let v = parseInt(e.target.value, 10);
        if (isNaN(v)) v = 0;
        v = Math.max(min, Math.min(max, v));
        onChange(v);
      }}
      className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-[#00966b] focus:outline-none focus:ring-1 focus:ring-[#00966b]"
    />
  );
}

function MoneyInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="number"
      min={0}
      placeholder="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-[#00966b] focus:outline-none focus:ring-1 focus:ring-[#00966b]"
    />
  );
}

function Segmented<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="inline-flex overflow-hidden rounded-md border border-slate-200">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium transition ${
            i > 0 ? "border-l border-slate-200" : ""
          } ${value === opt.value ? "bg-[#00966b] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Card({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00966b]">{kicker}</p>
      <h3 className="mt-1 mb-3 text-base font-bold text-slate-800">{title}</h3>
      {children}
    </div>
  );
}

export default function InheritanceCalculator() {
  const [state, setState] = useState<CalcState>(initialState);

  const patch = <K extends keyof CalcState>(key: K, value: CalcState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const result = useMemo(() => compute(state), [state]);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">ម៉ាស៊ីនគណនាមរតកឥស្លាម</h1>
          <span className="inline-flex items-center rounded-full bg-[#00966b]/10 px-3 py-1 text-xs font-medium text-[#00966b]">
            ហ្វារ៉ាអ៊ីត — Shafi&apos;i · Maliki · Hanbali
          </span>
        </div>
        <p className="mt-2 max-w-[70ch] text-sm text-slate-500">
          សូមបញ្ចូលទ្រព្យសម្បត្តិមរតក និងសាច់ញាតិដែលនៅរស់រានមានជីវិត។ ចំណែកថេរ (ហ្វារដ) និងចំណែកនៅសល់
          (អាសាបា) នឹងត្រូវបានគណនាដោយស្វ័យប្រវត្តិ រួមទាំងការកែតម្រូវ Awl និង Radd ក្នុងករណីចាំបាច់។
        </p>
        <div className="mt-4 rounded-lg border border-[#00966b]/20 bg-[#00966b]/5 px-4 py-3">
          <p className="text-xs leading-relaxed text-slate-600">
            ឧបករណ៍នេះផ្តល់ការប៉ាន់ស្មានទូទៅតាមក្បួនហ្វារ៉ាអ៊ីតរបស់សុន្នី ហើយមិនអាចគ្របដណ្តប់រាល់ករណីពិសេស
            ឬទស្សនៈអ្នកប្រាជ្ញនីមួយៗបានទេ (ឧ. សាច់ញាតិឆ្ងាយៗ)។ វាមិនមែនជាសាសនកិច្ចវិនិច្ឆ័យ (ហ្វាត់វ៉ា) ទេ
            សូមពិគ្រោះជាមួយអ្នកប្រាជ្ញសាសនាដែលមានសមត្ថភាពជានិច្ច។
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Card kicker="ទ្រព្យសម្បត្តិ" title="តម្លៃ និងការកាត់ចេញ">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="តម្លៃទ្រព្យសរុប">
                <MoneyInput value={state.gross} onChange={(v) => patch("gross", v)} />
              </Field>
              <Field label="បំណុលនៅសល់">
                <MoneyInput value={state.debts} onChange={(v) => patch("debts", v)} />
              </Field>
              <Field label="ចំណាយបុណ្យសព">
                <MoneyInput value={state.funeral} onChange={(v) => patch("funeral", v)} />
              </Field>
              <Field label="ព័ន្ធកិច្ច / Wasiyyah (អតិបរមា ១/៣)">
                <MoneyInput value={state.bequest} onChange={(v) => patch("bequest", v)} />
              </Field>
            </div>
            {result.bequestClamped && (
              <p className="mt-2 text-xs text-[#00966b]">
                ព័ន្ធកិច្ចត្រូវបានកំណត់ត្រឹម ១/៣ នៃទ្រព្យបន្ទាប់ពីកាត់បំណុល និងចំណាយបុណ្យសព ({result.bequestCapFmt}) —
                Wasiyyah មិនអាចលើសពីនេះបានទេ បើគ្មានការយល់ព្រមពីអ្នកទទួលមរតក។
              </p>
            )}
            <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
              ទ្រព្យសរុបសម្រាប់ចែក៖ <strong className="text-lg text-slate-800">{result.netFmt}</strong>
            </p>
          </Card>

          <Card kicker="អ្នកទទួលមរណភាព" title="ប្តី/ប្រពន្ធដែលនៅរស់">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="អ្នកទទួលមរណភាពជា">
                <Segmented
                  name="gender"
                  value={state.gender}
                  onChange={(v) => patch("gender", v)}
                  options={[
                    { value: "male", label: "ប្រុស" },
                    { value: "female", label: "ស្រី" },
                  ]}
                />
              </Field>
              {state.gender === "male" ? (
                <Field label="ប្រពន្ធនៅរស់ (០–៤ នាក់)">
                  <NumberInput value={state.wives} max={4} onChange={(v) => patch("wives", v)} />
                </Field>
              ) : (
                <Field label="ប្តី">
                  <Segmented
                    name="husband"
                    value={state.husband ? "yes" : "no"}
                    onChange={(v) => patch("husband", v === "yes")}
                    options={[
                      { value: "yes", label: "មាន" },
                      { value: "no", label: "គ្មាន" },
                    ]}
                  />
                </Field>
              )}
            </div>
          </Card>

          <Card kicker="មាតាបិតា និងជីដូនជីតា" title="អ្នកជំនាន់មុន">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="ឪពុក">
                <Segmented
                  name="father"
                  value={state.father ? "yes" : "no"}
                  onChange={(v) => patch("father", v === "yes")}
                  options={[
                    { value: "yes", label: "មាន" },
                    { value: "no", label: "គ្មាន" },
                  ]}
                />
              </Field>
              <Field label="ម្តាយ">
                <Segmented
                  name="mother"
                  value={state.mother ? "yes" : "no"}
                  onChange={(v) => patch("mother", v === "yes")}
                  options={[
                    { value: "yes", label: "មាន" },
                    { value: "no", label: "គ្មាន" },
                  ]}
                />
              </Field>
              <Field label="ជីតាខាងឪពុក" hint="(បើឪពុកគ្មាន)">
                <Segmented
                  name="grandfather"
                  value={state.grandfather ? "yes" : "no"}
                  onChange={(v) => patch("grandfather", v === "yes")}
                  options={[
                    { value: "yes", label: "មាន" },
                    { value: "no", label: "គ្មាន" },
                  ]}
                />
              </Field>
              <Field label="ជីដូន" hint="(បើម្តាយគ្មាន)">
                <NumberInput value={state.grandmothers} max={2} onChange={(v) => patch("grandmothers", v)} />
              </Field>
            </div>
          </Card>

          <Card kicker="កូនចៅ" title="កូន និងចៅតាមកូនប្រុស">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="កូនប្រុស">
                <NumberInput value={state.sons} onChange={(v) => patch("sons", v)} />
              </Field>
              <Field label="កូនស្រី">
                <NumberInput value={state.daughters} onChange={(v) => patch("daughters", v)} />
              </Field>
              <Field label="ចៅប្រុស (តាមកូនប្រុស)">
                <NumberInput value={state.gsons} onChange={(v) => patch("gsons", v)} />
              </Field>
              <Field label="ចៅស្រី (តាមកូនប្រុស)">
                <NumberInput value={state.gdaughters} onChange={(v) => patch("gdaughters", v)} />
              </Field>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              មានតែចៅតាមកូនប្រុសទេដែលរាប់ជាអ្នកទទួលមរតក (ច្បាប់ហ្វារ៉ាអ៊ីតសុន្នីមិនរាប់ចៅតាមកូនស្រីទេ)។
            </p>
          </Card>

          <Card kicker="បងប្អូន" title="បងប្អូនប្រុសស្រី">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="បងប្អូនប្រុសបង្កើត">
                <NumberInput value={state.fullBrothers} onChange={(v) => patch("fullBrothers", v)} />
              </Field>
              <Field label="បងប្អូនស្រីបង្កើត">
                <NumberInput value={state.fullSisters} onChange={(v) => patch("fullSisters", v)} />
              </Field>
              <Field label="បងប្អូនប្រុសខាងឪពុក">
                <NumberInput value={state.patBrothers} onChange={(v) => patch("patBrothers", v)} />
              </Field>
              <Field label="បងប្អូនស្រីខាងឪពុក">
                <NumberInput value={state.patSisters} onChange={(v) => patch("patSisters", v)} />
              </Field>
              <Field label="បងប្អូនខាងម្តាយ" hint="(រួមបញ្ចូល)">
                <NumberInput value={state.maternalSibs} onChange={(v) => patch("maternalSibs", v)} />
              </Field>
            </div>
          </Card>

          <button
            type="button"
            onClick={() => setState(initialState)}
            className="w-fit rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            កំណត់ឡើងវិញទាំងអស់
          </button>
        </div>

        <div className="flex w-full flex-col gap-3 lg:sticky lg:top-4 lg:w-[380px]">
          <div className="rounded-lg bg-white p-5 shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00966b]">លទ្ធផល</p>
            <h3 className="mt-1 text-base font-bold text-slate-800">ការបែងចែកចំណែក</h3>
            <p className="mt-1 mb-3 text-xs text-slate-500">
              ទ្រព្យសរុប៖ <strong>{result.netFmt}</strong>
            </p>

            {result.hasAnyHeir ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border-b border-slate-200 px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          អ្នកទទួលមរតក
                        </th>
                        <th className="border-b border-slate-200 px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          ចំណែក (ហ្វារដ)
                        </th>
                        <th className="border-b border-slate-200 px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          ចំនួនទឹកប្រាក់
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((r) => (
                        <tr key={r.key} className="hover:bg-slate-50">
                          <td className="border-b border-slate-100 px-2 py-2 align-top">
                            {r.label}
                            <div className="text-[11px] text-slate-400">{r.arabic}</div>
                          </td>
                          <td className="border-b border-slate-100 px-2 py-2 align-top text-slate-600">{r.shareLabel}</td>
                          <td className="border-b border-slate-100 px-2 py-2 align-top text-slate-800">
                            {r.amountFmt}
                            {r.eachFmt && <div className="text-[11px] text-slate-400">ម្នាក់ៗ {r.eachFmt}</div>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-right text-xs text-slate-400">សរុបបានបែងចែក៖ {result.totalAllocatedFmt}</p>
              </>
            ) : (
              <p className="text-sm text-slate-400">សូមបញ្ចូលព័ត៌មានសាច់ញាតិដើម្បីមើលការបែងចែក។</p>
            )}
          </div>

          {result.notes.length > 0 && (
            <div className="rounded-lg border border-[#00966b]/20 bg-[#00966b]/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00966b]">ការកែតម្រូវដែលបានអនុវត្ត</p>
              {result.notes.map((n, i) => (
                <p key={i} className="mt-2 text-xs leading-relaxed text-slate-600">
                  {n}
                </p>
              ))}
            </div>
          )}

          {result.excluded.length > 0 && (
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#00966b]">
                អ្នកទទួលមរតកដែលត្រូវបានរាំង (ហាជាប៊ុ)
              </p>
              {result.excluded.map((x, i) => (
                <div key={i} className="mt-2 flex items-baseline gap-2">
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">ត្រូវបានរាំង</span>
                  <p className="text-xs leading-relaxed text-slate-600">
                    <strong className="text-slate-700">{x.label}</strong> — {x.reason}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="px-2 text-[11.5px] leading-relaxed text-slate-400">
            ឧបករណ៍នេះមានគោលបំណងអប់រំតែប៉ុណ្ណោះ ដោយផ្អែកលើក្បួនហ្វារ៉ាអ៊ីតស្តង់ដារនៃគណិកា Shafi&apos;i/Maliki/Hanbali។
            វាមិនមែនជាសាសនកិច្ចវិនិច្ឆ័យ (ហ្វាត់វ៉ា) ទេ ហើយអាចនឹងមិនឆ្លុះបញ្ចាំងគ្រប់ស្ថានភាពគ្រួសារ ឬទស្សនៈអ្នកប្រាជ្ញភាគតិចទាំងអស់នោះទេ —
            សូមផ្ទៀងផ្ទាត់ការបែងចែកមរតកជាក់ស្តែងជាមួយអ្នកប្រាជ្ញសាសនាដែលមានសមត្ថភាពជានិច្ច។
          </p>
        </div>
      </div>
    </div>
  );
}
