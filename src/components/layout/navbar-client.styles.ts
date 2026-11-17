export const styles = {
  skipLink:
    "fixed left-2 top-2 z-[100] -translate-y-[150%] rounded-[6px] bg-accent px-4 py-2.5 font-bold text-accent-foreground focus:translate-y-0",
  header:
    "fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] min-h-[var(--nav-height)]",
  headerInner:
    "mx-auto flex min-h-[var(--nav-height)] w-full max-w-[1440px] items-center justify-between gap-5 px-[var(--page-gutter)] max-[1160px]:gap-3",
  brand: "inline-flex shrink-0 items-center gap-2 rounded-control",
  brandMonogram:
    "relative grid size-9 place-items-center rounded-control border border-control-border bg-control-surface font-mono text-[13px] font-bold tracking-[0.65px]",
  brandSignal:
    "absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-accent shadow-[0_0_0_2px_var(--glass-fallback)]",
  brandText:
    "flex flex-col whitespace-nowrap font-mono text-xs font-medium leading-none",
  brandName: "tracking-[1px] text-accent",
  brandDetail: "mt-[3px] tracking-[-0.25px] text-navigation",
  desktopNav:
    "flex items-center gap-1 rounded-panel bg-navigation-surface p-1 max-[1160px]:gap-0 max-[1023px]:hidden",
  navLink:
    "inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-control px-4 font-mono text-xs font-medium uppercase leading-none tracking-[0.07em] text-navigation transition-[background-color,color] duration-(--motion-fast) hover:bg-control-selected hover:text-foreground max-[1160px]:px-2.5 max-[1160px]:tracking-[0.03em]",
  // Only the surface and text colour change; size, family and weight stay
  // identical so the bar never reflows when the active section changes.
  navLinkActive:
    "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
  headerActions: "flex shrink-0 items-center gap-2 max-[1023px]:hidden",
  mobileActions:
    "hidden shrink-0 items-center gap-2 max-[1023px]:flex max-[420px]:gap-1.5",
  languageSwitch:
    "flex items-center gap-1 rounded-control border border-control-border bg-control-surface p-[3px] font-mono text-xs leading-none text-navigation/[0.42]",
  languageLink:
    "grid min-h-8 min-w-8 place-items-center rounded-[3px] font-mono text-xs font-medium text-navigation transition-[color,background-color] duration-(--motion-fast) hover:text-foreground max-[420px]:min-h-9 max-[420px]:min-w-9",
  languageSelected:
    "bg-control-selected text-accent shadow-[inset_0_-1px_0_var(--portfolio-accent)]",
  contactLink:
    "inline-flex min-h-9 items-center justify-center rounded-control bg-accent px-4 max-[1160px]:px-3 font-mono text-xs font-bold uppercase leading-none tracking-[0.08em] text-accent-foreground transition-[box-shadow,filter] duration-(--motion-fast) hover:brightness-105 hover:shadow-[var(--shadow-accent-hover)]",
  githubLink:
    "inline-flex min-h-9 items-center gap-2 rounded-control border border-control-border bg-control-surface px-3 font-mono text-xs font-medium uppercase leading-none tracking-[0.08em] text-navigation transition-[color,border-color] duration-(--motion-fast) hover:border-navigation hover:text-foreground",
  githubMark: "size-3.5 shrink-0",
  menuToggle:
    "flex size-11 flex-col items-center justify-center gap-[5px] rounded-control border border-control-border bg-control-surface",
  menuIconLine:
    "h-px w-4 bg-accent transition-[transform,translate] duration-(--motion-fast)",
  menuIconLineFirstOpen: "translate-y-[3px] rotate-45",
  menuIconLineLastOpen: "-translate-y-[3px] -rotate-45",
  mobileNav:
    "absolute inset-x-0 top-[var(--nav-height)] hidden max-h-[calc(100dvh-var(--nav-height))] flex-col gap-1 overflow-y-auto border-b border-border bg-[var(--glass-fallback)] px-[var(--page-gutter)] pb-5 pt-3 opacity-0 pointer-events-none -translate-y-1 transition-[opacity,transform] duration-(--motion-fast) max-[1023px]:flex",
  mobileNavOpen: "pointer-events-auto translate-y-0 opacity-100",
  mobileNavLink: "min-h-11 justify-start px-3.5 text-xs",
  mobileContactLink: "mt-2 min-h-11",
} as const;
