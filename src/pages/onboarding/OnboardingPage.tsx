import { useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { useAuthUser } from "../../shared/lib/authSession";
import { navigateTo } from "../../shared/lib/router";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type OnboardingStep = "splash" | "themes" | "regions" | "style";

const onboardingSteps: OnboardingStep[] = ["themes", "regions", "style"];

const themeOptions = [
  "맛집 탐방",
  "숨은 명소",
  "역사 탐방",
  "힐링",
  "등산",
  "물놀이",
  "지역 축제",
  "계곡",
];

const regionOptions = [
  "수도권",
  "부산/경남",
  "강원도",
  "제주도",
  "전라도",
];

const travelTimeOptions = ["당일치기", "1박 2일"];
const companionOptions = ["혼자", "커플", "가족", "친구"];
const budgetOptions = ["알뜰", "보통", "여유롭게"];

type SelectionChipProps = {
  active: boolean;
  children: string;
  onClick: () => void;
};

function SelectionChip({ active, children, onClick }: SelectionChipProps) {
  return (
    <button
      className={[
        "rounded-full border px-3.5 py-2 text-sm font-medium transition",
        active
          ? "border-[#6354d8] bg-[#f0edff] text-[#4f42bb] shadow-[0_10px_24px_rgba(99,84,216,0.16)]"
          : "border-[#e6ddd0] bg-white text-slate-600 hover:border-[#d0c4b3] hover:bg-[#fffcf7]",
      ].join(" ")}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type SelectionRowProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

function SelectionRow({ active, label, onClick }: SelectionRowProps) {
  return (
    <button
      className={[
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition",
        active
          ? "border-[#7468eb] bg-[#f3f1ff] shadow-[0_12px_28px_rgba(116,104,235,0.14)]"
          : "border-[#ece2d7] bg-white hover:border-[#d5cabd] hover:bg-[#fffaf5]",
      ].join(" ")}
      type="button"
      onClick={onClick}
    >
      <span className={active ? "font-semibold text-[#4f42bb]" : "text-slate-700"}>
        {label}
      </span>
      <span
        className={[
          "h-5 w-5 rounded-full border transition",
          active ? "border-[#6354d8] bg-[#6354d8]" : "border-[#d8cfc4] bg-white",
        ].join(" ")}
      />
    </button>
  );
}

function OnboardingPhone({
  authNickname,
  budget,
  canFinishOnboarding,
  companion,
  currentStepIndex,
  regions,
  setBudget,
  setCompanion,
  setRegions,
  setStep,
  setThemes,
  setTravelTime,
  step,
  themes,
  travelTime,
  toggleMultiSelect,
}: {
  authNickname: string | null;
  budget: string;
  canFinishOnboarding: boolean;
  companion: string;
  currentStepIndex: number;
  regions: string[];
  setBudget: (value: string) => void;
  setCompanion: (value: string) => void;
  setRegions: (nextItems: string[]) => void;
  setStep: (step: OnboardingStep) => void;
  setThemes: (nextItems: string[]) => void;
  setTravelTime: (value: string) => void;
  step: OnboardingStep;
  themes: string[];
  travelTime: string;
  toggleMultiSelect: (
    items: string[],
    value: string,
    setItems: (nextItems: string[]) => void,
  ) => void;
}) {
  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      {step === "splash" ? (
        <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
          <div className="flex-1" />
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f1ecff] text-4xl shadow-[0_16px_32px_rgba(99,84,216,0.16)]">
            🐷
          </div>
          <div className="mt-7 text-center">
            <h2 className="text-[30px] font-semibold tracking-[-0.05em] text-slate-900">
              꼬잉꼬잉
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              당일치기 여행,
              <br />
              나한테 딱 맞게
            </p>
          </div>
          <div className="mt-12 space-y-3">
            <button
              className="w-full rounded-2xl bg-[#5f51d5] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(95,81,213,0.28)] transition hover:bg-[#5243c8]"
              type="button"
              onClick={() => setStep("themes")}
            >
              {authNickname ? `${authNickname}님 취향 설정 이어가기` : "시작하기"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <RouteLink
                className="inline-flex items-center justify-center rounded-2xl border border-[#ddd3c8] bg-white/75 px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
                href={buildPath.login()}
              >
                로그인
              </RouteLink>
              <RouteLink
                className="inline-flex items-center justify-center rounded-2xl border border-[#ddd3c8] bg-white/75 px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
                href={buildPath.signup()}
              >
                회원가입
              </RouteLink>
            </div>
            <button
              className="w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-500 transition hover:bg-[#faf7f2]"
              type="button"
              onClick={() => navigateTo(buildPath.home())}
            >
              게스트로 둘러보기
            </button>
          </div>
        </div>
      ) : null}

      {step !== "splash" ? (
        <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
          <div className="mb-6 flex items-center justify-center gap-2">
            {onboardingSteps.map((onboardingStep, index) => (
              <span
                key={onboardingStep}
                className={[
                  "block h-2.5 rounded-full transition",
                  currentStepIndex === index ? "w-7 bg-[#5f51d5]" : "w-2.5 bg-[#d8d2cb]",
                ].join(" ")}
              />
            ))}
          </div>

          {step === "themes" ? (
            <>
              <h2 className="text-[30px] font-semibold tracking-[-0.05em] text-slate-900">
                어떤 여행을
                <br />
                좋아하세요?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                테마를 선택해주세요. 복수 선택이 가능합니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {themeOptions.map((option) => (
                  <SelectionChip
                    key={option}
                    active={themes.includes(option)}
                    onClick={() => toggleMultiSelect(themes, option, setThemes)}
                  >
                    {option}
                  </SelectionChip>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between pt-10">
                <button
                  className="text-sm font-medium text-slate-400"
                  type="button"
                  onClick={() => setStep("splash")}
                >
                  이전
                </button>
                <button
                  className="rounded-2xl bg-[#5f51d5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(95,81,213,0.28)] transition hover:bg-[#5243c8] disabled:cursor-not-allowed disabled:bg-[#cec7f4] disabled:shadow-none"
                  disabled={themes.length === 0}
                  type="button"
                  onClick={() => setStep("regions")}
                >
                  다음
                </button>
              </div>
            </>
          ) : null}

          {step === "regions" ? (
            <>
              <h2 className="text-[30px] font-semibold tracking-[-0.05em] text-slate-900">
                자주 가는
                <br />
                지역이 어디에요?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                추천과 검색의 기본값으로 사용됩니다.
              </p>
              <div className="mt-7 space-y-3">
                {regionOptions.map((option) => (
                  <SelectionRow
                    key={option}
                    active={regions.includes(option)}
                    label={option}
                    onClick={() => toggleMultiSelect(regions, option, setRegions)}
                  />
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between pt-10">
                <button
                  className="text-sm font-medium text-slate-400"
                  type="button"
                  onClick={() => setStep("themes")}
                >
                  이전
                </button>
                <button
                  className="rounded-2xl bg-[#5f51d5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(95,81,213,0.28)] transition hover:bg-[#5243c8] disabled:cursor-not-allowed disabled:bg-[#cec7f4] disabled:shadow-none"
                  disabled={regions.length === 0}
                  type="button"
                  onClick={() => setStep("style")}
                >
                  다음
                </button>
              </div>
            </>
          ) : null}

          {step === "style" ? (
            <>
              <h2 className="text-[30px] font-semibold tracking-[-0.05em] text-slate-900">
                여행 스타일이
                <br />
                어떻게 돼요?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                맞춤 추천과 AI 루트 제안에 활용됩니다.
              </p>

              <div className="mt-7 space-y-6">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-slate-400">
                    이동 시간
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {travelTimeOptions.map((option) => (
                      <SelectionChip
                        key={option}
                        active={travelTime === option}
                        onClick={() => setTravelTime(option)}
                      >
                        {option}
                      </SelectionChip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-slate-400">
                    동행
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {companionOptions.map((option) => (
                      <SelectionChip
                        key={option}
                        active={companion === option}
                        onClick={() => setCompanion(option)}
                      >
                        {option}
                      </SelectionChip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-slate-400">
                    예산
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {budgetOptions.map((option) => (
                      <SelectionChip
                        key={option}
                        active={budget === option}
                        onClick={() => setBudget(option)}
                      >
                        {option}
                      </SelectionChip>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between pt-10">
                <button
                  className="text-sm font-medium text-slate-400"
                  type="button"
                  onClick={() => setStep("regions")}
                >
                  이전
                </button>
                <button
                  className="rounded-2xl bg-[#5f51d5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(95,81,213,0.28)] transition hover:bg-[#5243c8] disabled:cursor-not-allowed disabled:bg-[#cec7f4] disabled:shadow-none"
                  disabled={!canFinishOnboarding}
                  type="button"
                  onClick={() => navigateTo(buildPath.home())}
                >
                  꼬잉꼬잉 시작
                </button>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </PhoneFrame>
  );
}

export function OnboardingPage() {
  const authUser = useAuthUser();
  const [step, setStep] = useState<OnboardingStep>("splash");
  const [themes, setThemes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [travelTime, setTravelTime] = useState("");
  const [companion, setCompanion] = useState("");
  const [budget, setBudget] = useState("");

  const currentStepIndex = onboardingSteps.indexOf(step);
  const canFinishOnboarding =
    travelTime.length > 0 && companion.length > 0 && budget.length > 0;

  const toggleMultiSelect = (
    items: string[],
    value: string,
    setItems: (nextItems: string[]) => void,
  ) => {
    setItems(
      items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value],
    );
  };

  return (
    <ShowcaseLayout
      phone={
        <OnboardingPhone
          authNickname={authUser?.nickname ?? null}
          budget={budget}
          canFinishOnboarding={canFinishOnboarding}
          companion={companion}
          currentStepIndex={currentStepIndex}
          regions={regions}
          setBudget={setBudget}
          setCompanion={setCompanion}
          setRegions={setRegions}
          setStep={setStep}
          setThemes={setThemes}
          setTravelTime={setTravelTime}
          step={step}
          themes={themes}
          toggleMultiSelect={toggleMultiSelect}
          travelTime={travelTime}
        />
      }
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f1ecff] text-base">
          🐷
        </span>
        꼬잉꼬잉
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        오늘 떠날 여행을
        <br />
        고민보다 빠르게.
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
        취향, 지역, 여행 스타일만 고르면 꼬잉꼬잉이 메인 피드와 추천 루트를 더
        나답게 정리해드립니다. 로그인 없이 둘러보고, 마음에 들면 바로 저장까지
        이어질 수 있어요.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          className="inline-flex items-center justify-center rounded-full bg-[#5f51d5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(95,81,213,0.3)] transition hover:bg-[#5243c8]"
          type="button"
          onClick={() => setStep("themes")}
        >
          시작하기
        </button>
        <RouteLink
          className="inline-flex items-center justify-center rounded-full border border-[#d9cdbd] bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
          href={buildPath.login()}
        >
          로그인
        </RouteLink>
        <RouteLink
          className="inline-flex items-center justify-center rounded-full border border-[#d9cdbd] bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
          href={buildPath.signup()}
        >
          회원가입
        </RouteLink>
        <RouteLink
          className="inline-flex items-center justify-center rounded-full border border-[#d9cdbd] bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
          href={buildPath.home()}
        >
          둘러보기
        </RouteLink>
      </div>
    </ShowcaseLayout>
  );
}
