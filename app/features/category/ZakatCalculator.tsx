"use client";

import { useMemo, useState } from "react";

interface ZakatState {
  cash: string;
  goldWeight: string;
  goldPrice: string;
  silverWeight: string;
  silverPrice: string;
  business: string;
  receivable: string;
  payable: string;
  nisabStandard: "silver" | "gold";
}

const initialState: ZakatState = {
  cash: "",
  goldWeight: "",
  goldPrice: "",
  silverWeight: "",
  silverPrice: "",
  business: "",
  receivable: "",
  payable: "",
  nisabStandard: "silver",
};

interface ZakatResult {
  goldValueFmt: string;
  silverValueFmt: string;
  totalAssetsFmt: string;
  totalLiabilitiesFmt: string;
  netWealthFmt: string;
  nisabThresholdFmt: string;
  zakatDueFmt: string;
  hasNisabInput: boolean;
  eligible: boolean;
}

const fmt = (n: number) => "៛" + Math.round(n || 0).toLocaleString("en-US");

function compute(s: ZakatState): ZakatResult {
  const num = (v: string) => Number(v) || 0;

  const goldWeight = num(s.goldWeight);
  const goldPrice = num(s.goldPrice);
  const silverWeight = num(s.silverWeight);
  const silverPrice = num(s.silverPrice);

  const goldValue = goldWeight * goldPrice;
  const silverValue = silverWeight * silverPrice;
  const totalAssets = num(s.cash) + goldValue + silverValue + num(s.business) + num(s.receivable);
  const totalLiabilities = num(s.payable);
  const netWealth = totalAssets - totalLiabilities;
  const nisabThreshold = s.nisabStandard === "gold" ? 85 * goldPrice : 595 * silverPrice;
  const hasNisabInput = nisabThreshold > 0;
  const eligible = hasNisabInput && netWealth >= nisabThreshold;
  const zakatDue = eligible ? netWealth * 0.025 : 0;

  return {
    goldValueFmt: fmt(goldValue),
    silverValueFmt: fmt(silverValue),
    totalAssetsFmt: fmt(totalAssets),
    totalLiabilitiesFmt: fmt(totalLiabilities),
    netWealthFmt: fmt(netWealth),
    nisabThresholdFmt: hasNisabInput ? fmt(nisabThreshold) : "—",
    zakatDueFmt: fmt(zakatDue),
    hasNisabInput,
    eligible,
  };
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
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

export default function ZakatCalculator() {
  const [state, setState] = useState<ZakatState>(initialState);

  const patch = <K extends keyof ZakatState>(key: K, value: ZakatState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const result = useMemo(() => compute(state), [state]);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">ម៉ាស៊ីនគណនាហ្សកាត</h1>
          <span className="inline-flex items-center rounded-full bg-[#00966b]/10 px-3 py-1 text-xs font-medium text-[#00966b]">
            ឧបករណ៍ហិរញ្ញវត្ថុអ៊ីស្លាម
          </span>
        </div>
        <p className="mt-2 max-w-[70ch] text-sm text-slate-500">
          សូមបញ្ចូលទ្រព្យសម្បត្តិ និងបំណុលរបស់អ្នកខាងក្រោម។ ហ្សកាតត្រូវបង់នឹងត្រូវបានគណនាដោយស្វ័យប្រវត្តិ
          ក្នុងអត្រា ២.៥% នៃទ្រព្យសម្បត្តិសុទ្ធ នៅពេលដែលវាលើសពីកម្រិតនិសាប។ ចំនួនទឹកប្រាក់គិតជារៀល (៛)។
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Card kicker="សាច់ប្រាក់" title="សាច់ប្រាក់ និងសមតុល្យធនាគារ">
            <Field label="សាច់ប្រាក់ក្នុងដៃ និងសមតុល្យធនាគារ">
              <MoneyInput value={state.cash} onChange={(v) => patch("cash", v)} />
            </Field>
          </Card>

          <Card kicker="លោហធាតុមានតម្លៃ" title="មាស និងប្រាក់">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="ទម្ងន់មាស (ក្រាម)">
                <MoneyInput value={state.goldWeight} onChange={(v) => patch("goldWeight", v)} />
              </Field>
              <Field label="តម្លៃមាស/ក្រាម (៛)">
                <MoneyInput value={state.goldPrice} onChange={(v) => patch("goldPrice", v)} />
              </Field>
              <Field label="ទម្ងន់ប្រាក់ (ក្រាម)">
                <MoneyInput value={state.silverWeight} onChange={(v) => patch("silverWeight", v)} />
              </Field>
              <Field label="តម្លៃប្រាក់/ក្រាម (៛)">
                <MoneyInput value={state.silverPrice} onChange={(v) => patch("silverPrice", v)} />
              </Field>
            </div>
            <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              តម្លៃមាស៖ <strong className="text-slate-700">{result.goldValueFmt}</strong>
            </p>
            <p className="text-xs text-slate-500">
              តម្លៃប្រាក់៖ <strong className="text-slate-700">{result.silverValueFmt}</strong>
            </p>
          </Card>

          <Card kicker="ជំនួញ" title="ទ្រព្យសម្បត្តិជំនួញ និងទំនិញសន្និធិ">
            <Field label="តម្លៃទីផ្សារបច្ចុប្បន្ននៃទំនិញជំនួញ">
              <MoneyInput value={state.business} onChange={(v) => patch("business", v)} />
            </Field>
          </Card>

          <Card kicker="បំណុល" title="ប្រាក់ជំពាក់">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="គេជំពាក់អ្នក (បូក)">
                <MoneyInput value={state.receivable} onChange={(v) => patch("receivable", v)} />
              </Field>
              <Field label="អ្នកជំពាក់គេ (ដក)">
                <MoneyInput value={state.payable} onChange={(v) => patch("payable", v)} />
              </Field>
            </div>
          </Card>

          <Card kicker="កម្រិត" title="ស្តង់ដារនិសាប">
            <p className="text-xs leading-relaxed text-slate-500">
              និសាបគឺជាទ្រព្យសម្បត្តិអប្បបរមាដែលធ្វើឱ្យហ្សកាតក្លាយជាកាតព្វកិច្ច — ស្មើនឹងប្រាក់ ៥៩៥ ក្រាម
              ឬមាស ៨៥ ក្រាម។
            </p>
            <div className="mt-2">
              <Segmented
                name="nisabStandard"
                value={state.nisabStandard}
                onChange={(v) => patch("nisabStandard", v)}
                options={[
                  { value: "silver", label: "ប្រាក់ (៥៩៥ក្រាម)" },
                  { value: "gold", label: "មាស (៨៥ក្រាម)" },
                ]}
              />
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
            <div className="mt-1">
              <p className="text-xs text-slate-500">ហ្សកាតត្រូវបង់ (២.៥%)</p>
              <p className="mt-1 text-3xl font-bold text-[#00966b]">{result.zakatDueFmt}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {!result.hasNisabInput && (
                <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-500">
                  សូមបញ្ចូលតម្លៃមាស/ប្រាក់ ដើម្បីគណនានិសាប
                </span>
              )}
              {result.hasNisabInput && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    result.eligible ? "bg-[#00966b]/10 text-[#00966b]" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {result.eligible ? "លើសនិសាប · ត្រូវបង់ហ្សកាត" : "ក្រោមនិសាប · មិនទាន់ជាកាតព្វកិច្ច"}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">ទ្រព្យសម្បត្តិសរុប</span>
                <span className="text-slate-800">{result.totalAssetsFmt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">បំណុលសរុប</span>
                <span className="text-slate-800">{result.totalLiabilitiesFmt}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">ទ្រព្យសម្បត្តិសុទ្ធសម្រាប់គណនាហ្សកាត</span>
                <span className="text-slate-800">{result.netWealthFmt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">កម្រិតនិសាប</span>
                <span className="text-slate-800">{result.nisabThresholdFmt}</span>
              </div>
            </div>
          </div>

          <p className="px-2 text-[11.5px] leading-relaxed text-slate-400">
            ឧបករណ៍នេះមានគោលបំណងអប់រំតែប៉ុណ្ណោះ ដោយផ្អែកលើអត្រាហ្សកាតស្តង់ដារ ២.៥% នៃទ្រព្យសម្បត្តិសុទ្ធ។
            វាមិនមែនជាសាសនកិច្ចវិនិច្ឆ័យ (ហ្វាត់វ៉ា) ទេ សូមផ្ទៀងផ្ទាត់ជាមួយអ្នកប្រាជ្ញសាសនាដែលមានសមត្ថភាពជានិច្ច
            ជាពិសេសចំពោះទ្រព្យសកម្មពិសេស ដូចជាភាគហ៊ុន ឬសន្សំសម្រាប់និវត្តន៍។
          </p>
        </div>
      </div>
    </div>
  );
}
