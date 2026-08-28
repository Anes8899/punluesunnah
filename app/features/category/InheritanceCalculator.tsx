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
  amount: number;
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

type Currency = "KHR" | "USD";

const CURRENCIES: Record<Currency, { symbol: string; label: string; caption: string; decimals: number }> = {
  KHR: { symbol: "៛", label: "រៀល (៛)", caption: "រៀល (KHR)", decimals: 0 },
  USD: { symbol: "$", label: "ដុល្លារ ($)", caption: "ដុល្លារ (USD)", decimals: 2 },
};

interface CalcState {
  currency: Currency;
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
  currency: "KHR",
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
const format = (n: number, currency: Currency) => {
  const { symbol, decimals } = CURRENCIES[currency];
  return (
    symbol +
    (n || 0).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
};

function compute(s: CalcState): CalcResult {
  const num = (v: string) => Number(v) || 0;
  const fmt = (n: number) => format(n, s.currency);

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
    amount,
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


const inputClass =
  "w-full rounded-xl border border-surface-border bg-surface-soft px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-muted/50 focus:border-amber focus:bg-card focus:outline-none focus:ring-1 focus:ring-amber";

const SHARE_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
  "bg-chart-7",
  "bg-chart-8",
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1">
        <label className="text-xs font-medium text-ink">{label}</label>
        {hint && <span className="text-[11px] text-ink-muted">{hint}</span>}
      </div>
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
      className={inputClass}
    />
  );
}

function MoneyInput({
  value,
  onChange,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        min={0}
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${suffix ? "pr-10" : ""}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-ink-muted">
          {suffix}
        </span>
      )}
    </div>
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
    <div
      role="radiogroup"
      aria-label={name}
      className="inline-flex gap-1 rounded-xl border border-surface-border bg-surface-soft p-1"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
            value === opt.value ? "bg-amber text-amber-foreground" : "text-ink-muted hover:bg-card"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function InheritanceCalculator() {
  const [state, setState] = useState<CalcState>(initialState);

  const patch = <K extends keyof CalcState>(key: K, value: CalcState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const result = useMemo(() => compute(state), [state]);

  const bar = useMemo(() => {
    const total = result.rows.reduce((a, r) => a + Math.max(r.amount, 0), 0);
    return result.rows.map((r, i) => ({
      key: r.key,
      color: SHARE_COLORS[i % SHARE_COLORS.length],
      width:
        total > 0
          ? `${Math.max((Math.max(r.amount, 0) / total) * 100, r.amount > 0 ? 3 : 0)}%`
          : `${100 / result.rows.length}%`,
    }));
  }, [result]);

  const symbol = CURRENCIES[state.currency].symbol;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="rounded-3xl bg-card p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ink sm:text-3xl">ម៉ាស៊ីនគណនាមរតកឥស្លាម</h1>
                <p className="mt-1 text-[11.5px] text-ink-muted">
                  ហ្វារ៉ាអ៊ីត — Shafi&apos;i · Maliki · Hanbali
                </p>
              </div>
              <div className="sm:w-[210px]">
                <label htmlFor="currency" className="mb-1.5 block text-[11px] text-ink-muted">
                  ជ្រើសរើសរូបិយប័ណ្ណ
                </label>
                <select
                  id="currency"
                  value={state.currency}
                  onChange={(e) => patch("currency", e.target.value as Currency)}
                  className="w-full rounded-xl border border-surface-border bg-card px-3 py-2.5 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                >
                  <option value="KHR">{CURRENCIES.KHR.label}</option>
                  <option value="USD">{CURRENCIES.USD.label}</option>
                </select>
              </div>
            </div>

            <h2 className="mt-8 mb-4 text-xl font-bold text-ink">ទ្រព្យសម្បត្តិ និងការកាត់ចេញ</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              <Field label="តម្លៃទ្រព្យសរុប">
                <MoneyInput value={state.gross} onChange={(v) => patch("gross", v)} suffix={symbol} />
              </Field>
              <Field label="បំណុលនៅសល់">
                <MoneyInput value={state.debts} onChange={(v) => patch("debts", v)} suffix={symbol} />
              </Field>
              <Field label="ចំណាយបុណ្យសព">
                <MoneyInput value={state.funeral} onChange={(v) => patch("funeral", v)} suffix={symbol} />
              </Field>
              <Field label="ព័ន្ធកិច្ច / Wasiyyah" hint="(អតិបរមា ១/៣)">
                <MoneyInput value={state.bequest} onChange={(v) => patch("bequest", v)} suffix={symbol} />
              </Field>
            </div>
            {result.bequestClamped && (
              <p className="mt-3 rounded-xl border border-surface-border bg-surface-soft px-3 py-2 text-[11.5px] leading-relaxed text-ink-muted">
                ព័ន្ធកិច្ចត្រូវបានកំណត់ត្រឹម ១/៣ នៃទ្រព្យបន្ទាប់ពីកាត់បំណុល និងចំណាយបុណ្យសព ({result.bequestCapFmt}) —
                Wasiyyah មិនអាចលើសពីនេះបានទេ បើគ្មានការយល់ព្រមពីអ្នកទទួលមរតក។
              </p>
            )}

            <h2 className="mt-8 mb-4 text-xl font-bold text-ink">ប្តី/ប្រពន្ធ និងជំនាន់មុន</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
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
                <Field label="ប្រពន្ធនៅរស់" hint="(០–៤ នាក់)">
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

            <h2 className="mt-8 mb-4 text-xl font-bold text-ink">កូន និងចៅ</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              <Field label="កូនប្រុស">
                <NumberInput value={state.sons} onChange={(v) => patch("sons", v)} />
              </Field>
              <Field label="កូនស្រី">
                <NumberInput value={state.daughters} onChange={(v) => patch("daughters", v)} />
              </Field>
              <Field label="ចៅប្រុស" hint="(តាមកូនប្រុស)">
                <NumberInput value={state.gsons} onChange={(v) => patch("gsons", v)} />
              </Field>
              <Field label="ចៅស្រី" hint="(តាមកូនប្រុស)">
                <NumberInput value={state.gdaughters} onChange={(v) => patch("gdaughters", v)} />
              </Field>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
              មានតែចៅតាមកូនប្រុសទេដែលរាប់ជាអ្នកទទួលមរតក (ច្បាប់ហ្វារ៉ាអ៊ីតសុន្នីមិនរាប់ចៅតាមកូនស្រីទេ)។
            </p>

            <h2 className="mt-8 mb-4 text-xl font-bold text-ink">បងប្អូនប្រុសស្រី</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
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
          </div>

          <aside className="w-full rounded-3xl bg-surface-soft p-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:w-[360px] lg:overflow-y-auto">
            <div className="rounded-2xl bg-card p-5 text-center shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                {CURRENCIES[state.currency].caption}
              </p>
              <p className="mt-2 text-4xl font-bold text-ink">{result.netFmt}</p>
              <p className="mt-3 text-sm font-semibold text-ink">ទ្រព្យសរុបសម្រាប់ចែក</p>
              <p className="mt-1 text-[11px] text-ink-muted">
                បន្ទាប់ពីកាត់បំណុល ចំណាយបុណ្យសព និងព័ន្ធកិច្ច
              </p>
            </div>

            {result.hasAnyHeir ? (
              <>
                <div className="mt-4 flex h-1.5 gap-1 overflow-hidden">
                  {bar.map((p) => (
                    <span
                      key={p.key}
                      style={{ width: p.width }}
                      className={`rounded-full ${p.color}`}
                      aria-hidden
                    />
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {result.rows.map((r, i) => (
                    <div
                      key={r.key}
                      className="rounded-xl border border-surface-border bg-card px-3 py-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-ink">
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              SHARE_COLORS[i % SHARE_COLORS.length]
                            }`}
                            aria-hidden
                          />
                          <span className="truncate">{r.label}</span>
                        </p>
                        <p className="shrink-0 text-sm font-semibold text-ink">{r.amountFmt}</p>
                      </div>
                      <div className="mt-1 flex items-start justify-between gap-2 text-[10.5px] text-ink-muted">
                        <span className="min-w-0 flex-1">
                          {r.arabic && <span className="mr-1">{r.arabic} ·</span>}
                          {r.shareLabel}
                        </span>
                        {r.eachFmt && <span className="shrink-0">ម្នាក់ៗ {r.eachFmt}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-center text-[11px] text-ink-muted">
                  សរុបបានបែងចែក៖ {result.totalAllocatedFmt}
                </p>
              </>
            ) : (
              <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-muted">
                សូមបញ្ចូលព័ត៌មានសាច់ញាតិដើម្បីមើលការបែងចែកចំណែក។
              </p>
            )}

            {result.notes.length > 0 && (
              <div className="mt-4 rounded-2xl border border-surface-border bg-card p-4">
                <p className="text-[11px] font-semibold text-ink">ការកែតម្រូវដែលបានអនុវត្ត</p>
                {result.notes.map((n, i) => (
                  <p key={i} className="mt-2 text-[11px] leading-relaxed text-ink-muted">
                    {n}
                  </p>
                ))}
              </div>
            )}

            {result.excluded.length > 0 && (
              <div className="mt-3 rounded-2xl border border-surface-border bg-card p-4">
                <p className="text-[11px] font-semibold text-ink">អ្នកទទួលមរតកដែលត្រូវបានរាំង (ហាជាប៊ុ)</p>
                {result.excluded.map((x, i) => (
                  <p key={i} className="mt-2 text-[11px] leading-relaxed text-ink-muted">
                    <strong className="font-semibold text-ink">{x.label}</strong> — {x.reason}
                  </p>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setState((prev) => ({ ...initialState, currency: prev.currency }))}
              className="mt-4 w-full rounded-full bg-amber px-4 py-3 text-sm font-semibold text-amber-foreground transition hover:opacity-90"
            >
              គណនាឡើងវិញ
            </button>

            <p className="mt-4 text-center text-[10.5px] leading-relaxed text-ink-muted">
              ឧបករណ៍នេះមានគោលបំណងអប់រំតែប៉ុណ្ណោះ ដោយផ្អែកលើក្បួនហ្វារ៉ាអ៊ីតស្តង់ដារនៃគណិកា
              Shafi&apos;i/Maliki/Hanbali។ វាមិនមែនជាសាសនកិច្ចវិនិច្ឆ័យ (ហ្វាត់វ៉ា) ទេ
              ហើយអាចនឹងមិនឆ្លុះបញ្ចាំងគ្រប់ស្ថានភាពគ្រួសារ — សូមផ្ទៀងផ្ទាត់ជាមួយអ្នកប្រាជ្ញសាសនាដែលមានសមត្ថភាពជានិច្ច។
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
