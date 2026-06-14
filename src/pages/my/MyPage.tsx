export function MyPage() {
  return (
    <div className="px-4 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <section className="w-full max-w-[430px] rounded-[32px] bg-white p-8 shadow-[0_18px_48px_rgba(95,73,38,0.1)]">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
            MY
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            프로필, 최근 본 여행지, 저장한 취향 요약이 들어올 자리입니다.
          </p>
        </section>
      </div>
    </div>
  );
}
