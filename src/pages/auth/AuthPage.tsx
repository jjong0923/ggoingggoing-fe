import { useEffect, useRef, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import {
  login,
  logout,
  signup,
} from "../../shared/apis/auth";
import type { AxiosError } from "axios";
import {
  clearAuthSession,
  getRefreshToken,
  setAuthSession,
  useAuthUser,
} from "../../shared/lib/authSession";
import { navigateTo } from "../../shared/lib/router";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type AuthMode = "login" | "signup";

type AuthPageProps = {
  mode: AuthMode;
};

type InputFieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: "email" | "password" | "text";
  value: string;
};

function InputField({
  label,
  onChange,
  placeholder,
  required = true,
  type = "text",
  value,
}: InputFieldProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[13px] font-semibold text-slate-700">{label}</span>
        {required ? (
          <span className="rounded-full bg-[#f2efff] px-2 py-0.5 text-[10px] font-semibold text-[#5f51d5]">
            required
          </span>
        ) : null}
      </div>
      <input
        className="h-12 w-full rounded-[18px] border border-[#eadfce] bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8d80ef] focus:ring-4 focus:ring-[#eeebff]"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function AuthPhone({ mode }: { mode: AuthMode }) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const isSubmitDisabled =
    email.trim().length === 0 ||
    password.trim().length === 0 ||
    (mode === "signup" && nickname.trim().length === 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const tokenData = await login({ email, password });
        const nextNickname = email.split("@")[0] || "여행자";

        setAuthSession({
          user: {
            id: String(tokenData.userId),
            email,
            nickname: nextNickname,
          },
          tokens: {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            tokenType: tokenData.tokenType,
            accessTokenExpiresInSeconds: tokenData.accessTokenExpiresInSeconds,
          },
        });

        setFeedback({
          tone: "success",
          text: "로그인이 완료되었습니다. 홈으로 이동합니다.",
        });
      } else {
        const signupData = await signup({ nickname, email, password });
        const tokenData = await login({ email, password });

        setAuthSession({
          user: {
            id: String(signupData.userId),
            email: signupData.email,
            nickname: signupData.nickname,
          },
          tokens: {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            tokenType: tokenData.tokenType,
            accessTokenExpiresInSeconds: tokenData.accessTokenExpiresInSeconds,
          },
        });

        setFeedback({
          tone: "success",
          text: `${signupData.nickname}님 회원가입이 완료되었습니다. 바로 홈으로 이동합니다.`,
        });
      }

      redirectTimerRef.current = window.setTimeout(() => {
        navigateTo(buildPath.home());
      }, 700);
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errorCode?: string | null;
      }>;

      setFeedback({
        tone: "error",
        text:
          axiosError.response?.data?.message ??
          (error instanceof Error
            ? error.message
            : "인증 처리 중 문제가 발생했어요."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#fff2dc_0%,#f4efff_50%,#ddfff2_100%)] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c97c2e]">
              auth
            </span>
            <span className="text-2xl">🐷</span>
          </div>
          <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
            {mode === "login" ? "로그인" : "회원가입"}
          </h2>
        </div>

        <div className="mt-4 inline-flex rounded-[20px] bg-[#f6f0e7] p-1">
          {[
            { key: "login" as const, label: "로그인", href: buildPath.login() },
            { key: "signup" as const, label: "회원가입", href: buildPath.signup() },
          ].map((item) => (
            <RouteLink
              key={item.key}
              className={[
                "flex-1 rounded-[16px] px-4 py-2.5 text-center text-[14px] font-semibold transition",
                item.key === mode
                  ? "bg-white text-[#5f51d5] shadow-[0_10px_24px_rgba(99,84,216,0.12)]"
                  : "text-slate-500",
              ].join(" ")}
              href={item.href}
            >
              {item.label}
            </RouteLink>
          ))}
        </div>

        <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
          <>
            <div className="space-y-4">
              {mode === "signup" ? (
                <InputField
                  label="닉네임"
                  value={nickname}
                  placeholder="예: 여행돼지"
                  onChange={setNickname}
                />
              ) : null}

              <InputField
                label="이메일"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={setEmail}
              />

              <InputField
                label="비밀번호"
                type="password"
                value={password}
                placeholder="비밀번호를 입력해주세요"
                onChange={setPassword}
              />
            </div>

            {feedback ? (
              <div
                className={[
                  "mt-4 rounded-[18px] px-4 py-3 text-[13px] leading-6",
                  feedback.tone === "success"
                    ? "bg-[#eefbf5] text-[#227a54]"
                    : "bg-[#fff1ee] text-[#b3543d]",
                ].join(" ")}
              >
                {feedback.text}
              </div>
            ) : null}

            <button
              className="mt-5 w-full rounded-[20px] bg-[#5f51d5] px-4 py-3.5 text-[15px] font-semibold text-white shadow-[0_18px_36px_rgba(95,81,213,0.28)] transition hover:bg-[#5243c8] disabled:cursor-not-allowed disabled:bg-[#cec7f4] disabled:shadow-none"
              disabled={isSubmitDisabled || isSubmitting}
              type="button"
              onClick={() => void handleSubmit()}
            >
              {isSubmitting
                ? "처리 중..."
                : mode === "login"
                  ? "로그인하기"
                  : "회원가입하고 시작하기"}
            </button>
          </>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#efe7dc] pt-4 text-[13px] text-slate-500">
          <RouteLink href={buildPath.onboarding()} className="font-medium text-slate-500">
            온보딩으로
          </RouteLink>
          <RouteLink href={buildPath.home()} className="font-medium text-slate-700">
            게스트로 둘러보기
          </RouteLink>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function AuthPage({ mode }: AuthPageProps) {
  const authUser = useAuthUser();

  useEffect(() => {
    if (!authUser) {
      return;
    }

    navigateTo(buildPath.home());
  }, [authUser]);

  return (
    <ShowcaseLayout phone={<AuthPhone mode={mode} />}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          AUTH
        </span>
        {mode === "login" ? "로그인" : "회원가입"}
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        여행 기록을
        <br />
        내 계정으로 이어가기.
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
        실제 인증 API에 맞춰 회원가입, 로그인, 로그아웃, 토큰 저장과 갱신까지
        브라우저 흐름에 연결했습니다.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {authUser ? (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6dff0] bg-white/80 px-5 py-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{authUser.nickname}</span>
              <span className="text-slate-400">·</span>
              {authUser.email}
            </div>
            <button
              className="inline-flex items-center justify-center rounded-full border border-[#d9cdbd] bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
              type="button"
              onClick={async () => {
                const refreshToken = getRefreshToken();

                try {
                  if (refreshToken) {
                    await logout(refreshToken);
                  }
                } catch (error) {
                  console.error("Failed to logout", error);
                } finally {
                  clearAuthSession();
                }
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <RouteLink
              className="inline-flex items-center justify-center rounded-full bg-[#5f51d5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(95,81,213,0.3)] transition hover:bg-[#5243c8]"
              href={buildPath.login()}
            >
              <p className="text-white">
                로그인
              </p>
            </RouteLink>
            <RouteLink
              className="inline-flex items-center justify-center rounded-full border border-[#d9cdbd] bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
              href={buildPath.signup()}
            >
              회원가입
            </RouteLink>
          </>
        )}
      </div>

    </ShowcaseLayout>
  );
}
