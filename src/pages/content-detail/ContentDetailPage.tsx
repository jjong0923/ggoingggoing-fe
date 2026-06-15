import { useEffect, useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { getContentDetail } from "../../shared/apis/contents";
import type { ContentDetail } from "../../shared/apis/types";
import { navigateTo } from "../../shared/lib/router";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type ContentDetailPageProps = {
  contentId: string;
};

const categoryTone = {
  맛집: "bg-[#f2efff] text-[#6d58d8]",
  명소: "bg-[#edf7e9] text-[#5f8f4a]",
  루트: "bg-[#eaf3ff] text-[#3d78ce]",
} as const;

const contentTypeLabel: Record<ContentDetail["contentType"], keyof typeof categoryTone> = {
  RESTAURANT: "맛집",
  CAFE: "맛집",
  ATTRACTION: "명소",
  ACCOMMODATION: "루트",
  FESTIVAL: "루트",
  SHOPPING: "루트",
  ETC: "루트",
};

function DetailMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] bg-[#f6f1e8] px-3 py-3">
      <p className="text-[11px] font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-[12px] font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ContentDetailPhone({
  contentId,
  detail,
  error,
  isLoading,
}: {
  contentId: string;
  detail: ContentDetail | null;
  error: string | null;
  isLoading: boolean;
}) {
  const category: keyof typeof categoryTone = detail
    ? contentTypeLabel[detail.contentType]
    : "명소";

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
          <section className="overflow-hidden rounded-[28px] border border-[#d8d1c7] bg-white shadow-[0_16px_40px_rgba(91,72,40,0.08)]">
            <div
              className="relative flex h-52 items-start justify-between bg-[#ffb9a5] bg-cover bg-center px-5 py-5"
              style={{
                backgroundImage: detail?.thumbnailUrl
                  ? `linear-gradient(rgba(25,23,20,0.16),rgba(25,23,20,0.16)), url(${detail.thumbnailUrl})`
                  : undefined,
              }}
            >
              <button
                aria-label="뒤로가기"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[21px] text-slate-700 shadow-[0_8px_18px_rgba(64,54,40,0.08)]"
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                    return;
                  }

                  navigateTo(buildPath.home());
                }}
              >
                ←
              </button>

              <div className="flex gap-2">
                <button
                  aria-label="공유하기"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[20px] text-slate-700 shadow-[0_8px_18px_rgba(64,54,40,0.08)]"
                  type="button"
                >
                  ⌘
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-5 px-5 text-white">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/80">
                  Content {contentId}
                </p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em]">
                  {isLoading ? "상세 정보를 불러오는 중..." : detail?.title ?? "컨텐츠 상세"}
                </h2>
              </div>
            </div>

            <div className="px-5 py-5">
              {error ? (
                <div className="rounded-[18px] bg-[#fff1ee] px-4 py-4 text-[13px] text-[#b3543d]">
                  {error}
                </div>
              ) : null}

              {detail ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
                        <span>⌖ {detail.address}</span>
                        <span>♡ {detail.bookmarkCount}</span>
                        <span>◔ 조회 {detail.viewCount}</span>
                      </div>
                    </div>
                    <span
                      className={[
                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        categoryTone[category],
                      ].join(" ")}
                    >
                      {category}
                    </span>
                  </div>

                  <p className="mt-4 text-[13px] leading-6 text-slate-600">
                    {detail.summary}
                  </p>
                  <p className="mt-3 text-[13px] leading-6 text-slate-600">
                    {detail.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <DetailMetric label="지역" value={detail.regionName} />
                    <DetailMetric label="테마" value={detail.themeName} />
                    <DetailMetric label="하위 테마" value={detail.subThemeName} />
                    <DetailMetric label="HOT 여부" value={detail.hot ? "HOT" : "일반"} />
                  </div>
                </>
              ) : null}
            </div>
          </section>

          {detail ? (
            <section className="mt-4 rounded-[28px] border border-[#d8d1c7] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(91,72,40,0.06)]">
              <h3 className="text-[14px] font-semibold text-slate-900">카드뉴스</h3>
              <div className="mt-4 space-y-3">
                {detail.cards
                  .slice()
                  .sort((left, right) => left.displayOrder - right.displayOrder)
                  .map((card, index) => (
                    <div
                      key={`${card.id}-${index}`}
                      className="overflow-hidden rounded-[20px] border border-[#e8dfd3] bg-[#fffaf4]"
                    >
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(rgba(25,23,20,0.08),rgba(25,23,20,0.08)), url(${card.imageUrl})`,
                        }}
                      />
                      <div className="px-4 py-4">
                        <p className="text-[14px] font-semibold text-slate-900">
                          {card.title}
                        </p>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">
                          {card.body}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-5 border-t border-[#ede6dc] pt-4">
                <h3 className="text-[14px] font-semibold text-slate-900">태그</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-[#f2efff] px-3 py-1.5 text-[12px] font-semibold text-[#6d58d8]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <RouteLink
                  className="flex items-center justify-center rounded-[18px] border border-[#d5d0c7] bg-white px-4 py-4 text-[15px] font-semibold text-slate-900 shadow-[0_10px_20px_rgba(91,72,40,0.06)]"
                  href={buildPath.home()}
                >
                  홈으로 가기
                </RouteLink>
                <RouteLink
                  className="flex items-center justify-center rounded-[18px] border border-[#d5d0c7] bg-white px-4 py-4 text-[15px] font-semibold text-slate-900 shadow-[0_10px_20px_rgba(91,72,40,0.06)]"
                  href={buildPath.search()}
                >
                  검색 계속하기
                </RouteLink>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  const numericContentId = useMemo(() => Number(contentId), [contentId]);
  const [detail, setDetail] = useState<ContentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(numericContentId)) {
      setDetail(null);
      setError("현재 상세 API는 숫자 컨텐츠 ID 기준으로 연결되어 있어요.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextDetail = await getContentDetail(numericContentId);

        if (!isMounted) {
          return;
        }

        setDetail(nextDetail);
      } catch (loadError) {
        console.error("Failed to load content detail", loadError);
        if (isMounted) {
          setDetail(null);
          setError("컨텐츠 상세 정보를 불러오지 못했어요.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [numericContentId]);

  return (
    <ShowcaseLayout
      phone={
        <ContentDetailPhone
          contentId={contentId}
          detail={detail}
          error={error}
          isLoading={isLoading}
        />
      }
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          DETAIL
        </span>
        카드뉴스 + 태그
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        컨텐츠 상세를
        <br />
        실제 응답 기준으로.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
        `/api/contents/{'{contentId}'}` 응답에 맞춰 제목, 요약, 설명, 카드뉴스, 태그,
        조회수와 북마크 수를 실제 데이터로 렌더링하도록 바꿨습니다.
      </p>
    </ShowcaseLayout>
  );
}
