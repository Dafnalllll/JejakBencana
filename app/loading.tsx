import GlobalLoadingView from "@/components/GlobalLoadingView";

export default function Loading() {
  return (
    <div className="global-loading-overlay" aria-busy="true">
      <GlobalLoadingView />
    </div>
  );
}
