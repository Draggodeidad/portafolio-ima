export const styles = {
  skipLink:
    "fixed left-2 top-2 z-[100] -translate-y-[150%] rounded-[6px] bg-accent px-4 py-2.5 font-bold text-accent-foreground focus:translate-y-0",
  header:
    "fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] min-h-[var(--nav-height)]",
  headerInner:
    "mx-auto flex min-h-[var(--nav-height)] w-full max-w-[1440px] items-center justify-between gap-5 px-[var(--page-gutter)] max-[1100px]:gap-3",
  brand: "inline-flex shrink-0 items-center gap-2 rounded-control",
  brandMonogram:
    "relative grid size-9 place-items-center rounded-control border border-control-border bg-control-surface font-mono text-[13px] font-bold tracking-[0.65px]",
  brandSignal:
    "absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-accent shadow-[0_0_0_2px_var(--glass-fallback)]",
  brandText:
    "flex flex-col whitespace-nowrap font-mono text-[10px] font-medium leading-none max-[420px]:text-[9px]",
  brandName: "tracking-[1px] text-accent",
  brandDetail: "mt-[3px] tracking-[-0.25px] text-navigation",
  desktopNav:
    "flex min-h-10 items-center gap-1 rounded-panel bg-navigation-surface p-1 max-[1100px]:gap-0 max-[900px]:hidden",
  navLink:
    "inline-flex min-h-6 items-center justify-center rounded-control px-4 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.07em] text-navigation transition-[background-color,color,box-shadow] duration-(--motion-fast) hover:text-foreground max-[1100px]:px-3 max-[1100px]:text-[10px]",
  navLinkActive:
    "min-h-8 bg-accent font-display text-[15px] font-bold text-accent-contrast shadow-[var(--shadow-accent)] max-[900px]:min-h-11 max-[900px]:text-[11px]",
  headerActions: "flex shrink-0 items-center gap-2 max-[900px]:hidden",
  mobileActions:
    "hidden shrink-0 items-center gap-2 max-[900px]:flex max-[420px]:gap-1.5",
  languageSwitch:
    "flex min-h-8 items-center gap-1 rounded-control border border-control-border bg-control-surface px-1.5 py-[3px] font-mono text-[10px] leading-none text-navigation/[0.42] max-[420px]:px-1",
  languageLink:
    "grid min-h-6 min-w-7 place-items-center rounded-[3px] font-mono text-[10px] font-medium text-navigation transition-[color,background-color] duration-(--motion-fast) hover:text-foreground max-[420px]:min-h-9",
  languageSelected:
    "bg-control-selected text-accent shadow-[inset_0_-1px_0_var(--portfolio-accent)]",
  contactLink:
    "inline-flex min-h-8 items-center justify-center rounded-control bg-accent px-4 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-accent-contrast transition-[box-shadow,filter] duration-(--motion-fast) hover:brightness-105 hover:shadow-[var(--shadow-accent-hover)]",
  profileLink:
    "grid size-9 place-items-center rounded-xl bg-foreground text-background",
  menuToggle:
    "flex size-11 flex-col items-center justify-center gap-[5px] rounded-control border border-control-border bg-control-surface",
  menuIconLine:
    "h-px w-4 bg-accent transition-[transform,translate] duration-(--motion-fast)",
  menuIconLineFirstOpen: "translate-y-[3px] rotate-45",
  menuIconLineLastOpen: "-translate-y-[3px] -rotate-45",
  mobileNav:
    "absolute inset-x-0 top-[var(--nav-height)] hidden max-h-[calc(100dvh-var(--nav-height))] flex-col gap-1 overflow-y-auto border-b border-border bg-[var(--glass-fallback)] px-[var(--page-gutter)] pb-5 pt-3 opacity-0 pointer-events-none -translate-y-1 transition-[opacity,transform] duration-(--motion-fast) max-[900px]:flex",
  mobileNavOpen: "pointer-events-auto translate-y-0 opacity-100",
  mobileNavLink: "min-h-11 justify-start px-3.5 text-[11px]",
  mobileContactLink: "mt-2 min-h-11",
} as const;
