const SKELETON_KEYS = [
  "sk-a",
  "sk-b",
  "sk-c",
  "sk-d",
  "sk-e",
  "sk-f",
  "sk-g",
  "sk-h",
];

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {SKELETON_KEYS.map((key) => (
        <div
          key={key}
          className="bg-card rounded-xl overflow-hidden border border-border"
        >
          <div className="skeleton h-56 w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
