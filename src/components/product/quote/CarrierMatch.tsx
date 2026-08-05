"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import EyebrowPill from "@/components/common/EyebrowPill";
import SearchableSelect, {
  type SelectOption,
} from "@/components/common/SearchableSelect";
import {
  loadIndustryOptions,
  POLICY_TYPE_OPTIONS,
  STATE_OPTIONS,
} from "@/lib/appetiteFormOptions";

type AppetiteStatus =
  | "IN_APPETITE"
  | "MAYBE_IN_APPETITE"
  | "NOT_IN_APPETITE";

type Carrier = {
  id: string;
  name: string;
  logo?: string;
};

type MatchedCarrier = Carrier & {
  status: AppetiteStatus;
};

const MAX_VISIBLE = 15;
const MAX_VISIBLE_RESULTS = 7;
const VIEW_MORE_HREF = "/product/intelligence#appetite";

function PolicyTypeTabs({
  value,
  onChange,
  isBlue,
}: {
  value: string;
  onChange: (policyType: string) => void;
  isBlue: boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-2 block font-mono text-sm font-medium uppercase text-[#2A297C]">
        Policy Type
      </legend>
      <div
        className="grid grid-cols-2 gap-2.5"
        role="tablist"
        aria-label="Policy Type"
      >
        {POLICY_TYPE_OPTIONS.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-lg border px-3 py-3 text-left font-heading text-sm font-medium transition-colors ${
                selected
                  ? isBlue
                    ? "border-[#5B35E0] bg-[#F5F3FF] text-[#5B35E0] ring-1 ring-[#5B35E0]/30"
                    : "border-[#E25E2F] bg-[#FFF4EF] text-[#E25E2F] ring-1 ring-[#E25E2F]/30"
                  : isBlue
                    ? "border-[#DDDDDD] bg-white text-[#1A1A1A] hover:border-[#5B35E0]/50 hover:bg-[#F5F3FF] hover:text-[#5B35E0]"
                    : "border-[#DDDDDD] bg-white text-[#1A1A1A] hover:border-[#E25E2F]/50 hover:bg-[#FFF8F5]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function CarrierLogoCell({ carrier }: { carrier: Carrier }) {
  const [showFallback, setShowFallback] = useState(!carrier.logo);

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[#ECEEF2] bg-white px-2 py-3">
      {showFallback || !carrier.logo ? (
        <span className="font-heading text-[10px] font-semibold text-[#2A297C] md:text-xs">
          {carrier.name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={carrier.logo}
          alt={`${carrier.name} logo`}
          loading="lazy"
          onError={() => setShowFallback(true)}
          className="h-4 w-auto max-w-full object-contain md:h-8"
        />
      )}
    </div>
  );
}

function CarrierGrid({
  carriers,
  viewMoreHref = VIEW_MORE_HREF,
  maxVisible = MAX_VISIBLE,
}: {
  carriers: Carrier[];
  viewMoreHref?: string;
  maxVisible?: number;
}) {
  const visible = carriers.slice(0, maxVisible);
  const hasMore = carriers.length > maxVisible;

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-2.5">
      {visible.map((carrier) => (
        <CarrierLogoCell key={carrier.id} carrier={carrier} />
      ))}
      {hasMore ? (
        <button
          className="flex items-center justify-center rounded-lg border border-dashed border-[#5B35E0]/40 bg-[#F5F3FF] px-2 py-3 font-heading text-xs font-semibold text-[#5B35E0] transition-colors hover:border-[#5B35E0] hover:bg-[#EDE9FE] md:text-sm"
        >
          View more
        </button>
      ) : null}
    </div>
  );
}

function MatchResultsCard({
  policyType,
  industry,
  state,
  allCarriers,
  inAppetite,
  outOfAppetite,
  isChecking,
  hasChecked,
  error,
}: {
  policyType: string;
  industry: string;
  state: string;
  allCarriers: Carrier[];
  inAppetite: MatchedCarrier[];
  outOfAppetite: MatchedCarrier[];
  isChecking: boolean;
  hasChecked: boolean;
  error: string | null;
}) {
  const summaryParts = [policyType, industry, state].filter(Boolean);

  return (
    <div className="rounded-2xl border border-[#ECEEF2] bg-white p-5 md:p-6 lg:p-7">
      <div className="border-b border-[#ECEEF2] pb-5">
        <p className="font-sans text-lg font-regular text-[#2A297C]">
          {hasChecked
            ? `${inAppetite.length} carriers in appetite`
            : allCarriers.length
              ? `${allCarriers.length} carriers available`
              : "Carriers available"}
        </p>
        {summaryParts.length > 0 ? (
          <p className="mt-1 font-mono text-sm font-medium text-[#444444]">
            {summaryParts.join(" / ")}
          </p>
        ) : !isChecking && !error ? (
          <p className="mt-1 font-mono text-sm font-medium text-[#444444]">
            Choose a policy type, industry, and state to check appetite.
          </p>
        ) : null}
      </div>

      {isChecking ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2
            className="size-8 animate-spin text-[#5B35E0]"
            aria-hidden
          />
          <p className="font-heading text-sm font-medium text-[#2A297C]">
            Checking Appetite...
          </p>
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="font-heading text-sm font-medium text-[#D64545]">
            {error}
          </p>
        </div>
      ) : hasChecked ? (
        <>
          <div className="py-5">
            <p className="mb-3 font-mono text-sm font-medium uppercase text-[#5F950C]">
              IN APPETITE ({inAppetite.length})
            </p>
            {inAppetite.length > 0 ? (
              <CarrierGrid
                carriers={inAppetite}
                maxVisible={MAX_VISIBLE_RESULTS}
              />
            ) : (
              <p className="font-sans text-sm text-[#9CA3AF]">
                No carriers in appetite for this selection.
              </p>
            )}
          </div>

          <div className="border-t border-[#ECEEF2] pt-5">
            <p className="mb-3 font-mono text-sm font-medium uppercase text-[#393939]">
              OUT OF APPETITE ({outOfAppetite.length})
            </p>
            {outOfAppetite.length > 0 ? (
              <CarrierGrid
                carriers={outOfAppetite}
                maxVisible={MAX_VISIBLE_RESULTS}
              />
            ) : (
              <p className="font-sans text-sm text-[#9CA3AF]">
                No carriers out of appetite for this selection.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="py-5">
          {allCarriers.length > 0 ? (
            <CarrierGrid carriers={allCarriers} />
          ) : (
            <div className="flex items-center justify-center py-10">
              <Loader2
                className="size-6 animate-spin text-[#5B35E0]"
                aria-hidden
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-[#ECEEF2] pt-5 sm:flex-row sm:items-center">
        <p className="font-mono text-sm font-medium uppercase text-[#444444]">
          QUOTES AVAILABLE IN MINUTES
        </p>
        <Button href="/contact" variant="primary" className="shrink-0">
          Get quotes
        </Button>
      </div>
    </div>
  );
}

function optionLabel(
  options: readonly SelectOption[],
  value: string,
  fallback: string
) {
  return options.find((option) => option.value === value)?.label ?? fallback;
}

const CarrierMatch = ({eyepilllabel}:{eyepilllabel:String}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const checkIdRef = useRef(0);
  const [policyType, setPolicyType] = useState<string>("");
  const [industryOptions, setIndustryOptions] = useState<SelectOption[]>([]);
  const [industry, setIndustry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [allCarriers, setAllCarriers] = useState<Carrier[]>([]);
  const [inAppetite, setInAppetite] = useState<MatchedCarrier[]>([]);
  const [outOfAppetite, setOutOfAppetite] = useState<MatchedCarrier[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const canClear = Boolean(policyType || industry || state || hasChecked);
  const isBlue = eyepilllabel === "Appetite Checker";

  const clearAll = () => {
    checkIdRef.current += 1;
    setPolicyType("");
    setIndustry("");
    setState("");
    setInAppetite([]);
    setOutOfAppetite([]);
    setIsChecking(false);
    setHasChecked(false);
    setCheckError(null);
  };

  useEffect(() => {
    let cancelled = false;

    const loadIndustryCodes = async () => {
      try {
        const nextOptions = await loadIndustryOptions();
        if (!nextOptions.length || cancelled) return;

        setIndustryOptions(nextOptions);
        setIndustry((current) =>
          nextOptions.some((option) => option.value === current) ? current : ""
        );
      } catch (error) {
        console.error("[carrier-match-industry-codes]", error);
      }
    };

    void loadIndustryCodes();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCarriers = async () => {
      try {
        const response = await fetch("/api/appetite-carriers", {
          cache: "force-cache",
        });
        if (!response.ok) {
          throw new Error(`Carriers failed: ${response.status}`);
        }

        const payload = (await response.json()) as {
          carriers?: {
            id?: string;
            name?: string;
            logo?: string;
          }[];
        };

        if (cancelled) return;

        setAllCarriers(
          (payload.carriers ?? [])
            .map((carrier) => ({
              id: String(carrier.id ?? "").trim(),
              name: String(carrier.name ?? "").trim(),
              logo: carrier.logo ? String(carrier.logo).trim() : undefined,
            }))
            .filter((carrier) => carrier.id && carrier.name)
        );
      } catch (error) {
        console.error("[carrier-match-carriers]", error);
      }
    };

    void loadCarriers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!policyType || !industry || !state) {
      setInAppetite([]);
      setOutOfAppetite([]);
      setHasChecked(false);
      setCheckError(null);
      setIsChecking(false);
      return;
    }

    if (!allCarriers.length) return;

    const checkId = ++checkIdRef.current;
    let cancelled = false;

    const runCheck = async () => {
      setIsChecking(true);
      setCheckError(null);
      setHasChecked(false);

      try {
        const response = await fetch("/api/check-appetite", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carriers: allCarriers.map((carrier) => carrier.id),
            policyType,
            state,
            naicsCode: industry,
          }),
          cache: "no-store",
        });

        const payload = (await response.json()) as {
          checkedCarriers?: { id: string; status: string }[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? `Check failed: ${response.status}`);
        }

        if (cancelled || checkId !== checkIdRef.current) return;

        const statusById = new Map<string, AppetiteStatus>();
        for (const item of payload.checkedCarriers ?? []) {
          const id = String(item.id ?? "").trim();
          const status = String(item.status ?? "").trim();
          if (
            id &&
            (status === "IN_APPETITE" ||
              status === "MAYBE_IN_APPETITE" ||
              status === "NOT_IN_APPETITE")
          ) {
            statusById.set(id, status);
          }
        }

        const nextIn: MatchedCarrier[] = [];
        const nextOut: MatchedCarrier[] = [];

        for (const carrier of allCarriers) {
          const status = statusById.get(carrier.id);
          if (!status) continue;

          const matched: MatchedCarrier = {
            ...carrier,
            status,
          };

          if (status === "NOT_IN_APPETITE") {
            nextOut.push(matched);
          } else {
            nextIn.push(matched);
          }
        }

        setInAppetite(nextIn);
        setOutOfAppetite(nextOut);
        setHasChecked(true);
      } catch (error) {
        if (cancelled || checkId !== checkIdRef.current) return;
        console.error("[carrier-match-check-appetite]", error);
        setCheckError("Unable to check appetite. Please try again.");
        setInAppetite([]);
        setOutOfAppetite([]);
        setHasChecked(false);
      } finally {
        if (!cancelled && checkId === checkIdRef.current) {
          setIsChecking(false);
        }
      }
    };

    void runCheck();

    return () => {
      cancelled = true;
    };
  }, [policyType, industry, state, allCarriers]);

  const policyTypeLabel = optionLabel(
    POLICY_TYPE_OPTIONS,
    policyType,
    policyType
  );
  const industryLabel = optionLabel(industryOptions, industry, "Industry");
  const stateLabel = optionLabel(STATE_OPTIONS, state, "State");

  return (
    <section ref={sectionRef} className="bg-[#F6F8F9] text-[#0a143b]">
      <Container borderColor="#53535340">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="max-w-lg">
              <div className="mb-8">
                <EyebrowPill
                  surface="light"
                  background= {eyepilllabel === "Appetite Checker" ? "linear-gradient(135deg, #322696 0%, #322696 48%, #5E3FD0 100%)" : "linear-gradient(45deg, #E25E2F 0%, #DE5943 50%, #FC976B 100%)"}
                  className="mb-4 shadow-[0_8px_24px_rgba(226,94,47,0.2)]"
                >
                  {eyepilllabel ?? "Interactive tool"}
                </EyebrowPill>
                <h3 className="font-heading text-xl font-semibold text-[#2A297C] md:text-2xl">
                  CoverForce Carrier Match
                </h3>
                <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-[#444444] md:text-base">
                  Adjust the risk details and find matching carriers - try it live
                  below.
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={clearAll}
                    disabled={!canClear}
                    className={`font-mono text-xs font-medium uppercase tracking-wide transition-colors ${
                      canClear
                        ? isBlue
                          ? "text-[#5B35E0] hover:text-[#322696]"
                          : "text-[#E25E2F] hover:text-[#D62B1C]"
                        : "cursor-not-allowed text-[#9CA3AF]"
                    }`}
                  >
                    Clear all
                  </button>
                </div>

                <PolicyTypeTabs
                  value={policyType}
                  onChange={setPolicyType}
                  isBlue={isBlue}
                />

                <SearchableSelect
                  id="carrier-match-industry"
                  label="Industry"
                  value={industry}
                  options={industryOptions}
                  onChange={setIndustry}
                />

                <SearchableSelect
                  id="carrier-match-state"
                  label="State"
                  value={state}
                  options={STATE_OPTIONS}
                  onChange={setState}
                />
              </form>
            </div>

            <MatchResultsCard
              policyType={policyType ? policyTypeLabel : ""}
              industry={industry ? industryLabel : ""}
              state={state ? stateLabel : ""}
              allCarriers={allCarriers}
              inAppetite={inAppetite}
              outOfAppetite={outOfAppetite}
              isChecking={isChecking}
              hasChecked={hasChecked}
              error={checkError}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CarrierMatch;