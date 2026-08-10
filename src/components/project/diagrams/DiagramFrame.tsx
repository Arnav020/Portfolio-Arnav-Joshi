'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Maximize2, X } from 'lucide-react'

export function DiagramFrame({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <figure className="not-prose overflow-hidden rounded-2xl border border-border bg-surface" role="group" aria-label={title}>
      <div className="relative overflow-x-auto p-4 md:p-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="View diagram fullscreen"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground-strong md:hidden"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        {children}
      </div>
      <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground md:px-6">
        {title}
      </figcaption>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-200 ease-[var(--ease-out)] data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
          <Dialog.Content className="fixed inset-4 z-50 overflow-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl transition-[transform,opacity] duration-200 ease-[var(--ease-out)] data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100">
            <Dialog.Title className="sr-only">{title}</Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground-strong"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
            <div className="pt-6">{children}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </figure>
  )
}
