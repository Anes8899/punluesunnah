"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";

type Currency = "KHR" | "USD";

const CURRENCIES: Record<Currency, { symbol: string; label: string; decimals: number }> = {
  KHR: { symbol: "៛", label: "រៀល (៛)", decimals: 0 },
  USD: { symbol: "$", label: "ដុល្លារ ($)", decimals: 2 },
};

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
  currency: Currency;
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
  currency: "KHR",
};

interface ZakatResult {
  goldValueFmt: string;
  silverValueFmt: string;
  totalAssets: number;
  totalLiabilities: number;
  netWealth: number;
  zakatDue: number;
  totalAssetsFmt: string;
  totalLiabilitiesFmt: string;
  netWealthFmt: string;
  nisabThresholdFmt: string;
  zakatDueFmt: string;
  hasNisabInput: boolean;
  eligible: boolean;
}

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

function compute(s: ZakatState): ZakatResult {
  const num = (v: string) => Number(v) || 0;
  const fmt = (n: number) => format(n, s.currency);

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
    totalAssets,
    totalLiabilities,
    netWealth,
    zakatDue,
    totalAssetsFmt: fmt(totalAssets),
    totalLiabilitiesFmt: fmt(totalLiabilities),
    netWealthFmt: fmt(netWealth),
    nisabThresholdFmt: hasNisabInput ? fmt(nisabThreshold) : "—",
    zakatDueFmt: fmt(zakatDue),
    hasNisabInput,
    eligible,
  };
}

function Field({
  label,
  hint,
  suffix,
  value,
  onChange,
  help,
}: {
  label: string;
  hint?: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1">
        <label className="text-xs font-medium text-ink">{label}</label>
        {hint && (
          <span title={hint} className="text-ink-muted/70">
            <Info className="h-3 w-3" aria-hidden />
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          min={0}
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-surface-border bg-surface-soft px-3 py-2.5 text-sm text-ink transition placeholder:text-ink-muted/50 focus:border-amber focus:bg-card focus:outline-none focus:ring-1 focus:ring-amber ${
            suffix ? "pr-16" : ""
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-ink-muted">
            {suffix}
          </span>
        )}
      </div>
      {help && <p className="mt-1 text-[11px] text-ink-muted">{help}</p>}
    </div>
  );
}

function Tile({ value, label, dot }: { value: string; label: string; dot: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-card px-3 py-2.5">
      <p className="truncate text-sm font-semibold text-ink">{value}</p>
      <p className="mt-1 flex items-center gap-1.5 text-[10.5px] text-ink-muted">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
        <span className="truncate">{label}</span>
      </p>
    </div>
  );
}

export default function ZakatCalculator() {
  const [state, setState] = useState<ZakatState>(initialState);

  const patch = <K extends keyof ZakatState>(key: K, value: ZakatState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const result = useMemo(() => compute(state), [state]);

  const bar = useMemo(() => {
    const parts = [
      { key: "assets", value: Math.max(result.totalAssets, 0), color: "bg-chart-1" },
      { key: "liabilities", value: Math.max(result.totalLiabilities, 0), color: "bg-chart-2" },
      { key: "net", value: Math.max(result.netWealth, 0), color: "bg-chart-3" },
      { key: "zakat", value: Math.max(result.zakatDue, 0), color: "bg-chart-4" },
    ];
    const total = parts.reduce((sum, p) => sum + p.value, 0);
    return parts.map((p) => ({
      ...p,
      width: total > 0 ? `${Math.max((p.value / total) * 100, p.value > 0 ? 4 : 0)}%` : "25%",
    }));
  }, [result]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="rounded-3xl bg-card p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">ម៉ាស៊ីនគណនាហ្សកាត</h1>
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

            <h2 className="mt-8 mb-4 text-xl font-bold text-ink">ទ្រព្យសម្បត្តិ</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              <Field
                label="សាច់ប្រាក់"
                hint="សាច់ប្រាក់ក្នុងដៃ និងសមតុល្យធនាគារ"
                value={state.cash}
                onChange={(v) => patch("cash", v)}
              />
              <Field
                label="មាស"
                hint="ទម្ងន់មាសសរុបដែលអ្នកកាន់កាប់"
                suffix="ក្រាម"
                value={state.goldWeight}
                onChange={(v) => patch("goldWeight", v)}
              />
              <Field
                label="ប្រាក់"
                hint="ទម្ងន់ប្រាក់សរុបដែលអ្នកកាន់កាប់"
                suffix="ក្រាម"
                value={state.silverWeight}
                onChange={(v) => patch("silverWeight", v)}
              />
              <Field
                label={`តម្លៃមាស/ក្រាម (${CURRENCIES[state.currency].symbol})`}
                hint={`តម្លៃទីផ្សារបច្ចុប្បន្នក្នុងមួយក្រាម (${CURRENCIES[state.currency].symbol})`}
                value={state.goldPrice}
                onChange={(v) => patch("goldPrice", v)}
                help={`តម្លៃមាស៖ ${result.goldValueFmt}`}
              />
              <Field
                label={`តម្លៃប្រាក់/ក្រាម (${CURRENCIES[state.currency].symbol})`}
                hint={`តម្លៃទីផ្សារបច្ចុប្បន្នក្នុងមួយក្រាម (${CURRENCIES[state.currency].symbol})`}
                value={state.silverPrice}
                onChange={(v) => patch("silverPrice", v)}
                help={`តម្លៃប្រាក់៖ ${result.silverValueFmt}`}
              />
              <Field
                label="ទ្រព្យសម្បត្តិជំនួញ"
                hint="តម្លៃទីផ្សារបច្ចុប្បន្ននៃទំនិញសន្និធិ"
                value={state.business}
                onChange={(v) => patch("business", v)}
              />
              <div className="sm:col-span-2">
                <Field
                  label="គេជំពាក់អ្នក"
                  hint="ប្រាក់កម្ចីដែលអ្នករំពឹងថានឹងទទួលបានមកវិញ"
                  value={state.receivable}
                  onChange={(v) => patch("receivable", v)}
                />
              </div>
            </div>

            <h2 className="mt-8 mb-4 text-xl font-bold text-ink">បំណុល</h2>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              <Field
                label="អ្នកជំពាក់គេ"
                hint="បំណុលដល់កំណត់សង ដែលត្រូវដកចេញ"
                value={state.payable}
                onChange={(v) => patch("payable", v)}
              />
            </div>
          </div>

          <aside className="w-full rounded-3xl bg-surface-soft p-4 lg:sticky lg:top-6 lg:w-[360px]">
            <div className="rounded-2xl bg-card p-5 text-center shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                {state.currency === "USD" ? "ដុល្លារ (USD)" : "រៀល (KHR)"}
              </p>
              <p className="mt-2 text-4xl font-bold text-ink">{result.zakatDueFmt}</p>
              <p className="mt-3 text-sm font-semibold text-ink">ការគណនាហ្សកាត</p>
              <p className="mt-1 text-[11px] text-ink-muted">
                គិតតាមអត្រា ២.៥% នៃទ្រព្យសម្បត្តិសុទ្ធ
              </p>
            </div>

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

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Tile value={result.totalAssetsFmt} label="ទ្រព្យសម្បត្តិសរុប" dot="bg-chart-1" />
              <Tile value={result.totalLiabilitiesFmt} label="បំណុលសរុប" dot="bg-chart-2" />
              <Tile value={result.netWealthFmt} label="ទ្រព្យសម្បត្តិសុទ្ធ" dot="bg-chart-3" />
              <Tile value={result.zakatDueFmt} label="ហ្សកាតត្រូវបង់" dot="bg-chart-4" />
            </div>

            <div className="mt-4">
              <label
                htmlFor="nisabStandard"
                className="mb-1.5 block text-[11px] text-ink-muted"
              >
                ស្តង់ដារនិសាប
              </label>
              <select
                id="nisabStandard"
                value={state.nisabStandard}
                onChange={(e) => patch("nisabStandard", e.target.value as ZakatState["nisabStandard"])}
                className="w-full rounded-xl border border-surface-border bg-card px-3 py-2.5 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              >
                <option value="silver">ប្រាក់ (៥៩៥ ក្រាម)</option>
                <option value="gold">មាស (៨៥ ក្រាម)</option>
              </select>
            </div>

            <p className="mt-3 text-center text-[11.5px] leading-relaxed text-ink-muted">
              {result.hasNisabInput
                ? result.eligible
                  ? `ទ្រព្យសម្បត្តិសុទ្ធរបស់អ្នកលើសកម្រិតនិសាប (${result.nisabThresholdFmt}) ដូច្នេះហ្សកាតជាកាតព្វកិច្ច។`
                  : `ហ្សកាតមិនទាន់ជាកាតព្វកិច្ចទេ ព្រោះទ្រព្យសម្បត្តិសុទ្ធនៅក្រោមកម្រិតនិសាប (${result.nisabThresholdFmt})។`
                : "សូមបញ្ចូលតម្លៃមាស ឬប្រាក់ក្នុងមួយក្រាម ដើម្បីគណនាកម្រិតនិសាប។"}
            </p>

            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-ink">តើអ្នកគណនាហ្សកាតរួចរាល់ហើយឬនៅ?</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-muted">
                សូមប្រគល់ហ្សកាតរបស់អ្នកទៅកាន់អ្នកដែលសក្តិសមទទួល។
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setState((prev) => ({
                  ...initialState,
                  currency: prev.currency,
                  nisabStandard: prev.nisabStandard,
                }))
              }
              className="mt-4 w-full rounded-full bg-amber px-4 py-3 text-sm font-semibold text-amber-foreground transition hover:opacity-90"
            >
              គណនាឡើងវិញ
            </button>

            <p className="mt-4 text-center text-[10.5px] leading-relaxed text-ink-muted">
              ឧបករណ៍នេះមានគោលបំណងអប់រំតែប៉ុណ្ណោះ មិនមែនជាសាសនកិច្ចវិនិច្ឆ័យ (ហ្វាត់វ៉ា) ទេ
              សូមផ្ទៀងផ្ទាត់ជាមួយអ្នកប្រាជ្ញសាសនាដែលមានសមត្ថភាព ជាពិសេសចំពោះទ្រព្យសកម្មពិសេស
              ដូចជាភាគហ៊ុន ឬសន្សំសម្រាប់និវត្តន៍។
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
