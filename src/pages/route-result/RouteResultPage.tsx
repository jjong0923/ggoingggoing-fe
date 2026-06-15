import { useEffect, useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { getRouteDetail } from "../../shared/apis/routes";
import type {
  ContentType,
  RouteDetail,
  TripDurationType,
} from "../../shared/apis/types";
import {
  saveRouteDetailAsCustomRoute,
  useCustomRoutes,
} from "../../shared/lib/customRoutes";
import { navigateTo } from "../../shared/lib/router";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type RouteResultPageProps = {
  routeId: string;
};

const placeTypeLabel: Record<ContentType, string> = {
  ATTRACTION: "명소",
  RESTAURANT: "맛집",
  CAFE: "카페",
  ACCOMMODATION: "숙소",
  FESTIVAL: "축제",
  SHOPPING: "쇼핑",
  ETC: "기타",
};

const tripTypeLabel: Record<TripDurationType, string> = {
  DAY_TRIP: "당일치기",
  OVERNIGHT: "숙박",
  ONE_NIGHT_TWO_DAYS: "1박 2일",
};

function formatDistance(distanceMeters: number) {
  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(1)}km`;
  }

  return `${distanceMeters}m`;
}

function formatDuration(durationMinutes: number) {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  return `${hours}시간 ${minutes}분`;
}

function RouteResultPhone({
  error,
  isSaved,
  isSaving,
  isLoading,
  onSaveRoute,
  route,
  saveMessage,
}: {
  error: string | null;
  isSaved: boolean;
  isSaving: boolean;
  isLoading: boolean;
  onSaveRoute: () => void;
  route: RouteDetail | null;
  saveMessage: string | null;
}) {
  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
          <section className="overflow-hidden rounded-[28px] border border-[#d8d1c7] bg-white shadow-[0_16px_40px_rgba(91,72,40,0.08)]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#ffcfbf_0%,#ffd77b_48%,#cfd4ff_100%)] px-5 py-5">
              <div className="absolute -top-12 right-0 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-white/80 uppercase">
                      Route Result
                    </p>
                    <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-white">
                      {isLoading
                        ? "루트를 불러오는 중..."
                        : (route?.title ?? "AI 루트 결과")}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-[#d4822f]">
                    {route ? tripTypeLabel[route.tripDurationType] : "루트"}
                  </span>
                </div>

                <p className="mt-3 max-w-[280px] text-[12px] leading-5 text-white/90">
                  {route?.summary ??
                    "여행지와 동선을 한 화면에서 보고 다음 이동까지 이어갈 수 있어요."}
                </p>

                {route ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-[18px] bg-white/88 px-3 py-3">
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        거리
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-slate-900">
                        {formatDistance(route.totalDistanceMeters)}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-white/88 px-3 py-3">
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        소요
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-slate-900">
                        {formatDuration(route.totalDurationMinutes)}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-white/88 px-3 py-3">
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        장소
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-slate-900">
                        {route.places.length}곳
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="px-5 py-5">
              {error ? (
                <div className="rounded-[18px] bg-[#fff1ee] px-4 py-4 text-[13px] text-[#b3543d]">
                  {error}
                </div>
              ) : null}

              {isLoading ? (
                <div className="rounded-[20px] bg-[#fbf7f1] px-4 py-8 text-center text-[13px] text-slate-500">
                  루트 정보를 정리하고 있어요.
                </div>
              ) : null}

              {route ? (
                <>
                  <div className="rounded-[22px] bg-[#fbf7f1] px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] font-semibold text-slate-900">
                        지도 중심 좌표
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
                        {route.mapCenterLatitude.toFixed(4)},{" "}
                        {route.mapCenterLongitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="mt-3 rounded-[20px] bg-[linear-gradient(135deg,#9ee0d3_0%,#cfd4ff_50%,#ffe0c7_100%)] px-4 py-8 text-center">
                      <p className="text-[12px] font-semibold text-slate-800">
                        지도 목업
                      </p>
                      <p className="mt-2 text-[11px] leading-5 text-slate-600">
                        중심 좌표를 기준으로 전체 동선이 배치되는 영역입니다.
                      </p>
                    </div>
                  </div>

                  <section className="mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-semibold text-slate-900">
                        일정 순서
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        Day 기준 정리
                      </span>
                    </div>

                    <ol className="mt-3 space-y-3">
                      {route.places.map((place) => (
                        <li
                          key={place.routePlaceId}
                          className="rounded-[22px] border border-[#e8dfd3] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(99,75,43,0.04)]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f1eeff] text-[13px] font-semibold text-[#5f51d5]">
                              {place.visitOrder}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
                                    Day {place.dayNumber}
                                  </p>
                                  <h4 className="mt-1 text-[15px] font-semibold text-slate-900">
                                    {place.name}
                                  </h4>
                                </div>
                                <span className="rounded-full bg-[#f7f1e8] px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                                  {placeTypeLabel[place.placeType]}
                                </span>
                              </div>

                              <p className="mt-2 text-[12px] leading-5 text-slate-500">
                                ⌖ {place.address}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                                <span className="rounded-full bg-[#fbf7f1] px-2.5 py-1">
                                  체류 {place.estimatedStayMinutes}분
                                </span>
                                <span className="rounded-full bg-[#fbf7f1] px-2.5 py-1">
                                  이동{" "}
                                  {place.moveMinutesFromPrevious === null
                                    ? "-"
                                    : `${place.moveMinutesFromPrevious}분`}
                                </span>
                              </div>

                              <p className="mt-3 text-[12px] leading-5 text-slate-600">
                                {place.recommendationNote}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      className={[
                        "flex items-center justify-center rounded-[18px] border px-4 py-4 text-[14px] font-semibold shadow-[0_10px_20px_rgba(91,72,40,0.06)] transition",
                        isSaved
                          ? "border-[#d8d0ff] bg-[#f5f1ff] text-[#5f51d5]"
                          : "border-[#d5d0c7] bg-white text-slate-900",
                      ].join(" ")}
                      disabled={isSaving}
                      type="button"
                      onClick={onSaveRoute}
                    >
                      {isSaved ? "♡ 찜한 루트" : isSaving ? "저장 중..." : "♡ 찜하기"}
                    </button>
                    <RouteLink
                      className="flex items-center justify-center rounded-[18px] bg-[#5f51d5] px-4 py-4 text-[14px] font-semibold text-white shadow-[0_16px_30px_rgba(95,81,213,0.24)]"
                      href={
                        route.contentId
                          ? buildPath.contentDetail(String(route.contentId))
                          : buildPath.home()
                      }
                    >
                      <p className="text-white">대표 컨텐츠 보기</p>
                    </RouteLink>
                  </div>

                  {saveMessage ? (
                    <p className="mt-3 text-[12px] font-medium text-[#5f51d5]">
                      {saveMessage}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function RouteResultPage({ routeId }: RouteResultPageProps) {
  const numericRouteId = useMemo(() => Number(routeId), [routeId]);
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const customRoutes = useCustomRoutes();
  const isSavedRoute = useMemo(
    () =>
      customRoutes.some(
        (customRoute) =>
          customRoute.routeId === numericRouteId ||
          customRoute.sourceRouteId === numericRouteId,
      ),
    [customRoutes, numericRouteId],
  );

  useEffect(() => {
    if (!Number.isFinite(numericRouteId)) {
      setRoute(null);
      setError("현재 루트 상세 API는 숫자 routeId 기준으로 연결되어 있어요.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadRoute = async () => {
      setIsLoading(true);
      setError(null);
      setSaveMessage(null);

      try {
        const nextRoute = await getRouteDetail(numericRouteId);

        if (!isMounted) {
          return;
        }

        setRoute(nextRoute);
      } catch (loadError) {
        console.error("Failed to load route detail", loadError);
        if (isMounted) {
          setRoute(null);
          setError("루트 상세 정보를 불러오지 못했어요.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadRoute();

    return () => {
      isMounted = false;
    };
  }, [numericRouteId]);

  const handleSaveRoute = async () => {
    if (!route) {
      return;
    }

    if (isSavedRoute) {
      navigateTo(`${buildPath.collection()}#route`);
      return;
    }

    setIsSavingRoute(true);
    setSaveMessage(null);

    try {
      saveRouteDetailAsCustomRoute(route, numericRouteId);
      setSaveMessage("소장함 루트에 담았어요.");
      navigateTo(`${buildPath.collection()}#route`);
    } catch (saveError) {
      console.error("Failed to save route", saveError);
      setSaveMessage("루트를 찜하지 못했어요.");
    } finally {
      setIsSavingRoute(false);
    }
  };

  return (
    <ShowcaseLayout
      phone={
        <RouteResultPhone
          error={error}
          isLoading={isLoading}
          isSaved={isSavedRoute}
          isSaving={isSavingRoute}
          onSaveRoute={() => {
            void handleSaveRoute();
          }}
          route={route}
          saveMessage={saveMessage}
        />
      }
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          ROUTE
        </span>
        AI 추천 동선
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        한눈에 보는
        <br />
        여행 동선 결과.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
        루트의 핵심 요약, 총 이동 거리, 장소별 메모를 한 번에 보면서 컨텐츠
        상세와 소장 흐름까지 자연스럽게 이어지는 결과 화면입니다.
      </p>

      {route ? (
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/80 bg-white/75 px-5 py-5 shadow-[0_16px_36px_rgba(99,75,43,0.08)] backdrop-blur">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
              Trip Type
            </p>
            <p className="mt-2 text-[18px] font-semibold text-slate-900">
              {tripTypeLabel[route.tripDurationType]}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/80 bg-white/75 px-5 py-5 shadow-[0_16px_36px_rgba(99,75,43,0.08)] backdrop-blur">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
              Main Stops
            </p>
            <p className="mt-2 text-[18px] font-semibold text-slate-900">
              {route.places[0]?.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {route.places[route.places.length - 1]?.name}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/80 bg-white/75 px-5 py-5 shadow-[0_16px_36px_rgba(99,75,43,0.08)] backdrop-blur">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
              Route Note
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {route.summary}
            </p>
          </div>
        </div>
      ) : null}
    </ShowcaseLayout>
  );
}
