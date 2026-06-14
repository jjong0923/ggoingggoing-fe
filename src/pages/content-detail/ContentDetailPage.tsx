import { buildPath } from "../../app/router/routePaths";
import { FlowCard } from "../../shared/ui/FlowCard";
import { PageSection } from "../../shared/ui/PageSection";
import { RouteLink } from "../../shared/ui/RouteLink";

type ContentDetailPageProps = {
  contentId: string;
};

export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <PageSection eyebrow="F2" title={`컨텐츠 상세 허브 (${contentId})`}>
        <p>
          상세 페이지는 서비스의 연결 허브입니다. B1 상세 조회를 중심으로 B2 추천,
          B3 루트, B5 찜, B7 해시태그가 함께 붙습니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <FlowCard title="유입 경로">
            <p>F1, F3, F5, F7, F8 카드 탭에서 진입</p>
          </FlowCard>
          <FlowCard title="핵심 CTA">
            <p>AI 루트 만들기, 소장하기, 같은 지역 루트 배너</p>
          </FlowCard>
        </div>
      </PageSection>

      <PageSection eyebrow="Outbound" title="상세 이후 플로우">
        <div className="flex flex-wrap gap-3">
          <RouteLink
            className="rounded-full bg-[#e38e3a] px-4 py-2 font-medium text-white"
            href={buildPath.routeResult(`route-for-${contentId}`)}
          >
            F4 AI 루트 결과
          </RouteLink>
          <RouteLink
            className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white"
            href={buildPath.collection()}
          >
            F5 소장함
          </RouteLink>
        </div>
      </PageSection>
    </div>
  );
}
