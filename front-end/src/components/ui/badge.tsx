import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/libs/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive:
          "border-transparent bg-red-500/10 text-red-500 hover:bg-red-500/20",
        outline: "text-slate-400 border-slate-800",
        success: 
          "border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20",
        warning: 
          "border-transparent bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        info:
          "border-transparent bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }