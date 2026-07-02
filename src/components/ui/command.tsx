"use client"

import * as React from "react"
import { CheckIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Command({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandInput({
  className,
  value,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3">
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        data-slot="command-input"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        autoComplete="off"
        className={cn(
          "flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-list"
      className={cn(
        "max-h-56 scroll-py-1 overflow-x-hidden overflow-y-auto p-1",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CommandGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-group"
      className={cn(
        "scroll-my-1 p-1 text-foreground [&_[data-slot=command-group-heading]]:px-1.5 [&_[data-slot=command-group-heading]]:py-1 [&_[data-slot=command-group-heading]]:text-xs [&_[data-slot=command-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  selected,
  onSelect,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  selected?: boolean
  onSelect?: () => void
}) {
  return (
    <div
      data-slot="command-item"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm capitalize outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent/60 text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {selected && (
        <CheckIcon className="pointer-events-none size-4 shrink-0 text-primary" />
      )}
    </div>
  )
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
}
