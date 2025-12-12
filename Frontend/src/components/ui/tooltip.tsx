"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  delayDuration: number
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(
  undefined
)

function useTooltipContext() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error("Tooltip components must be used within a TooltipProvider")
  }
  return context
}

interface TooltipProviderProps {
  delayDuration?: number
  children: React.ReactNode
}

function TooltipProvider({
  delayDuration = 0,
  children,
}: TooltipProviderProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <TooltipContext.Provider value={{ open, setOpen, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  )
}

interface TooltipProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
}

function Tooltip({
  children,
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  delayDuration = 0,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const open = controlledOpen ?? internalOpen
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value)
      }
      onOpenChange?.(value)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <TooltipContext.Provider value={{ open, setOpen, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  )
}

interface TooltipTriggerProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

function TooltipTrigger({
  asChild,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: TooltipTriggerProps) {
  const context = useTooltipContext()
  const { setOpen, delayDuration } = context || { setOpen: () => {}, delayDuration: 0 }
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (delayDuration > 0) {
      timeoutRef.current = setTimeout(() => setOpen(true), delayDuration)
    } else {
      setOpen(true)
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpen(false)
    onMouseLeave?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    setOpen(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setOpen(false)
    onBlur?.(e)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    } as any)
  }

  return (
    <div
      data-slot="tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </div>
  )
}

interface TooltipContentProps extends React.ComponentPropsWithoutRef<"div"> {
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
  align?: "start" | "center" | "end"
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  children,
  ...props
}: TooltipContentProps) {
  const { open } = useTooltipContext()
  const [mounted, setMounted] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open || !contentRef.current) return

    // Find the trigger element
    const trigger = document.querySelector('[data-slot="tooltip-trigger"]')
    if (!trigger) return

    triggerRef.current = trigger as HTMLElement
    const triggerRect = trigger.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()

    let top = 0
    let left = 0

    switch (side) {
      case "top":
        top = triggerRect.top - contentRect.height - sideOffset
        left =
          align === "start"
            ? triggerRect.left
            : align === "end"
            ? triggerRect.right - contentRect.width
            : triggerRect.left + (triggerRect.width - contentRect.width) / 2
        break
      case "bottom":
        top = triggerRect.bottom + sideOffset
        left =
          align === "start"
            ? triggerRect.left
            : align === "end"
            ? triggerRect.right - contentRect.width
            : triggerRect.left + (triggerRect.width - contentRect.width) / 2
        break
      case "left":
        left = triggerRect.left - contentRect.width - sideOffset
        top =
          align === "start"
            ? triggerRect.top
            : align === "end"
            ? triggerRect.bottom - contentRect.height
            : triggerRect.top + (triggerRect.height - contentRect.height) / 2
        break
      case "right":
        left = triggerRect.right + sideOffset
        top =
          align === "start"
            ? triggerRect.top
            : align === "end"
            ? triggerRect.bottom - contentRect.height
            : triggerRect.top + (triggerRect.height - contentRect.height) / 2
        break
    }

    setPosition({ top, left })
  }, [open, side, sideOffset, align])

  if (!mounted || !open) return null

  const getSlideClass = () => {
    switch (side) {
      case "bottom":
        return "slide-in-from-top-2"
      case "left":
        return "slide-in-from-right-2"
      case "right":
        return "slide-in-from-left-2"
      case "top":
        return "slide-in-from-bottom-2"
    }
  }

  return createPortal(
    <div
      ref={contentRef}
      data-slot="tooltip-content"
      role="tooltip"
      className={cn(
        "bg-foreground text-background z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance animate-in fade-in-0 zoom-in-95",
        getSlideClass(),
        className
      )}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      {...props}
    >
      {children}
    </div>,
    document.body
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
