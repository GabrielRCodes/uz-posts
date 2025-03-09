import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => {
        const isCompleted = currentStep > index
        const isCurrent = currentStep === index

        return (
          <div key={step.title} className="flex items-center">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                (isCompleted || isCurrent)
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="h-[2px] w-12 bg-muted mx-3" />
            )}
          </div>
        )
      })}
    </div>
  )
} 