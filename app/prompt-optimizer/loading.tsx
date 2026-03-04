/**
 * Loading skeleton for the Prompt Optimizer page
 * Shows placeholder UI while the main component loads
 */

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96 mx-auto" />
      </div>

      {/* Token counter skeleton */}
      <div className="flex gap-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-px" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-px" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>

      {/* Two column layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          <div className="h-64 md:h-80 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>

        {/* Output skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32" />
          <div className="h-64 md:h-80 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}
