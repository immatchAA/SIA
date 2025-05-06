import { cn } from "@/lib/utils"

type SpinnerProps = {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-gray-200 border-t-red-600",
        sizeClasses[size],
        className,
      )}
    />
  )
}
