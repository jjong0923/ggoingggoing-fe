import { useEffect, useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { getRouteDetail } from "../../shared/apis/routes";
import type { RouteDetail } from "../../shared/apis/types";
import { PageSection } from "../../shared/ui/PageSection";
import { RouteLink } from "../../shared/ui/RouteLink";

type RouteResultPageProps = {
  routeId: string;
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

export function RouteResultPage({ routeId }: RouteResultPageProps) {
  const numericRouteId = useMemo(() => Number(routeId), [routeId]);
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <PageSection eyebrow="F4" title={route ? route.title : `AI 루트 결과 (${routeId})`}>
        {error ? <p>{error}</p> : null}
        {isLoading ? <p>루트 정보를 불러오는 중입니다.</p> : null}

        {route ? (
          <>
            <p className="text-sm leading-6 text-slate-600">{route.summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  일정
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {route.tripDurationType === "DAY_TRIP" ? "당일치기" : "1박 2일"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  거리
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {formatDistance(route.totalDistanceMeters)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  총 소요
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {formatDuration(route.totalDurationMinutes)}
                </p>
              </div>
            </div>

            <ol className="mt-5 space-y-3">
              {route.places.map((place) => (
                <li key={place.routePlaceId} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {place.visitOrder}. {place.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{place.address}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {place.placeType}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>체류 {place.estimatedStayMinutes}분</span>
                    <span>
                      이동 {place.moveMinutesFromPrevious === null ? "-" : `${place.moveMinutesFromPrevious}분`}
                    </span>
                    <span>Day {place.dayNumber}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {place.recommendationNote}
                  </p>
                  {place.contentId ? (
                    <RouteLink
                      className="mt-3 inline-flex rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                      href={buildPath.contentDetail(String(place.contentId))}
                    >
                      컨텐츠 상세 보기
                    </RouteLink>
                  ) : null}
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </PageSection>

      <PageSection eyebrow="Actions" title="후속 액션">
        <div className="flex flex-wrap gap-3">
          <RouteLink
            className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white"
            href={buildPath.collection()}
          >
            루트 저장 후 소장함
          </RouteLink>
          <RouteLink
            className="rounded-full bg-[#e38e3a] px-4 py-2 font-medium text-white"
            href={route?.contentId ? buildPath.contentDetail(String(route.contentId)) : buildPath.home()}
          >
            대표 컨텐츠 보기
          </RouteLink>
        </div>
      </PageSection>
    </div>
  );
}
