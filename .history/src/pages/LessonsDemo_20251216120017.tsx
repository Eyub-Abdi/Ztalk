import { clsx } from "clsx";
import {
  useLessons,
  useStartLesson,
  useEndLesson,
  useLessonStats,
} from "../features/lessons/api/useLessons";
import type { LessonSummary } from "../features/lessons/api/lessonTypes";

function useToast() {
  return {
    show: (options: { title: string; description?: string; status?: string }) =>
      console.log(`[Toast ${options.status}]:`, options.title, options.description || ""),
  };
}

export default function LessonsDemoPage() {
  const {
    data: lessons,
    isLoading,
    isError,
    refetch,
  } = useLessons({ status: "confirmed" });
  const stats = useLessonStats();
  const startLesson = useStartLesson();
  const endLesson = useEndLesson();
  const toast = useToast();

  const handleStart = (id: string) => {
    startLesson.mutate(id, {
      onSuccess: () => toast.show({ title: "Started", status: "success" }),
      onError: (e: unknown) => {
        const message = e instanceof Error ? e.message : "Unknown error";
        toast.show({
          title: "Failed to start",
          description: message,
          status: "error",
        });
      },
    });
  };

  const handleEnd = (id: string) => {
    endLesson.mutate(id, {
      onSuccess: () => toast.show({ title: "Ended", status: "success" }),
      onError: (e: unknown) => {
        const message = e instanceof Error ? e.message : "Unknown error";
        toast.show({
          title: "Failed to end",
          description: message,
          status: "error",
        });
      },
    });
  };

  return (
    <div className="px-4 md:px-8 py-10 md:py-14 max-w-5xl mx-auto">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lessons Demo</h1>

        {/* Stats Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Stats</h2>
          {stats.isLoading && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading stats...</p>
          )}
          {stats.data && (
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Total: {stats.data.total_lessons}</span>
              <span>Completed: {stats.data.completed_lessons}</span>
              <span>Upcoming: {stats.data.upcoming_lessons}</span>
              {stats.data.average_rating && (
                <span>Avg Rating: {stats.data.average_rating}</span>
              )}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="btn btn-primary btn-sm"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Error Message */}
        {isError && (
          <p className="text-red-500 dark:text-red-400">Failed to load lessons.</p>
        )}

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons?.length === 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">No lessons found.</p>
          )}
          {lessons?.map((l: LessonSummary) => (
            <div
              key={l.id}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Lesson #{l.id.slice(0, 8)}
                </h3>
                <span
                  className={clsx(
                    "badge capitalize",
                    l.status === "confirmed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  )}
                >
                  {l.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Type: {l.lesson_type}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Start: {l.scheduled_start}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                End: {l.scheduled_end}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStart(l.id)}
                  disabled={startLesson.isPending}
                  className="btn btn-primary btn-sm"
                >
                  {startLesson.isPending ? "..." : "Start"}
                </button>
                <button
                  onClick={() => handleEnd(l.id)}
                  disabled={endLesson.isPending}
                  className="btn btn-outline btn-sm"
                >
                  {endLesson.isPending ? "..." : "End"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
