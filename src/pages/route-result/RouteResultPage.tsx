import { buildPath } from "../../app/router/routePaths";
import { PageSection } from "../../shared/ui/PageSection";
import { RouteLink } from "../../shared/ui/RouteLink";

type RouteResultPageProps = {
  routeId: string;
};

export function RouteResultPage({ routeId }: RouteResultPageProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <PageSection eyebrow="F4" title={`AI 루트 결과 (${routeId})`}>
        <ul className="space-y-2">
          <li>상단 지도 영역 + 번호 핀 + 경로선</li>
          <li>총 시간, 거리, 장소 수 요약 카드</li>
          <li>세로 스크롤 장소 목록과 지도 핀 연동</li>
        </ul>
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
            href={buildPath.contentDetail("route-stop-001")}
          >
            경유지 상세 보기
          </RouteLink>
        </div>
      </PageSection>
    </div>
  );
}
