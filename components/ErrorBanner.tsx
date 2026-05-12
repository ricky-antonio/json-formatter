interface ErrorBannerProps {
  message: string | null | undefined
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
    >
      <span className="font-medium">Parse error: </span>
      {message}
    </div>
  )
}
