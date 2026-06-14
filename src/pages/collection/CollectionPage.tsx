import { buildPath } from "../../app/router/routePaths";
import { FlowCard } from "../../shared/ui/FlowCard";
import { PageSection } from "../../shared/ui/PageSection";
import { RouteLink } from "../../shared/ui/RouteLink";

export function CollectionPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <PageSection eyebrow="F5" title="소장함 구조">
        <div className="grid gap-3 md:grid-cols-3">
          <FlowCard title="폴더 탭">
            <p>사용자 폴더 목록, 생성/수정/삭제</p>
          </FlowCard>
          <FlowCard title="전체 탭">
            <p>찜한 콘텐츠 Masonry 목록</p>
          </FlowCard>
          <FlowCard title="루트 탭">
            <p>저장한 AI 루트 목록</p>
          </FlowCard>
        </div>
      </PageSection>

      <PageSection eyebrow="Connections" title="연결 페이지">
        <p>
          F2와 F4의 저장 액션 종착점이므로, 탭 페이지로 유지하는 것이 좋습니다.
          상세 재진입도 많아서 카드 클릭 시 F2/F4로 다시 빠져나가도록 설계하면
          자연스럽습니다.
        </p>
        <div className="flex flex-wrap gap-3">
          <RouteLink
            className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white"
            href={buildPath.contentDetail("saved-content-003")}
          >
            저장한 콘텐츠 보기
          </RouteLink>
          <RouteLink
            className="rounded-full bg-[#e38e3a] px-4 py-2 font-medium text-white"
            href={buildPath.routeResult("saved-route-002")}
          >
            저장한 루트 보기
          </RouteLink>
        </div>
      </PageSection>
    </div>
  );
}
