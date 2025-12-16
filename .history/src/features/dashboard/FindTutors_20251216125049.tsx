import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useTutors } from "../tutors/api/useTutors";
import { useBookSlot } from "../lessons/api/useBookingReschedule";

export default function FindTutors() {
  const { data, isLoading } = useTutors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [start, setStart] = useState("");
  const [duration, setDuration] = useState(60);
  const [lessonType, setLessonType] = useState<
    "trial" | "regular" | "package" | "group"
  >("trial");
  const [message, setMessage] = useState("");
  const { mutateAsync: bookAsync, isPending } = useBookSlot();

  const openBook = (id: number) => {
    setTeacherId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTeacherId(null);
    setStart("");
    setDuration(60);
    setLessonType("trial");
    setMessage("");
  };

  const submitBooking = async () => {
    if (!teacherId) return;
    await bookAsync({
      teacher_id: teacherId,
      start_datetime: start,
      duration_minutes: duration,
      lesson_type: lessonType,
      message,
    });
    closeModal();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Find Tutors
      </h1>

      {isLoading && (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((t) => (
          <div key={t.id} className="card overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.name}
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Languages: {t.languages.join(", ")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rate: ${t.ratePerHour}/hr
              </p>
              <button
                onClick={() => openBook(Number(t.id))}
                className="btn btn-primary text-sm"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            role="button"
            tabIndex={0}
            aria-label="Close booking modal"
            onClick={closeModal}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                closeModal();
              }
            }}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Book a lesson
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="book-start"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Start time
                </label>
                <input
                  id="book-start"
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="book-duration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Duration (minutes)
                </label>
                <input
                  id="book-duration"
                  type="number"
                  min={30}
                  max={180}
                  step={15}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 60)}
                  className="input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="book-type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Lesson type
                </label>
                <select
                  id="book-type"
                  value={lessonType}
                  onChange={(e) =>
                    setLessonType(
                      e.target.value as
                        | "trial"
                        | "regular"
                        | "package"
                        | "group"
                    )
                  }
                  className="input w-full"
                >
                  <option value="trial">Trial</option>
                  <option value="regular">Regular</option>
                  <option value="package">Package</option>
                  <option value="group">Group</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="book-message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Message (optional)
                </label>
                <input
                  id="book-message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button onClick={closeModal} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={submitBooking}
                disabled={isPending}
                className="btn btn-primary flex items-center gap-2"
              >
                {isPending && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
