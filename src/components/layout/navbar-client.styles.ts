export const styles = {
  skipLink:
    "fixed left-2 top-2 z-[100] -translate-y-[150%] bg-ink px-4 py-2.5 font-bold text-white focus:translate-y-0",
  header:
    "fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] bg-desk text-graphite",
  headerInner:
    "mx-auto flex h-full w-full max-w-[var(--content-width)] items-center justify-between gap-5 px-[var(--page-gutter)]",
  brand: "inline-flex min-h-11 shrink-0 items-center text-lg font-extrabold",
  desktopNav: "flex items-center gap-10 max-[1023px]:hidden",
  navLink:
    "group relative inline-flex min-h-11 items-center whitespace-nowrap text-label font-bold text-graphite [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink",
  navLinkActive: "text-ink [&_svg]:opacity-100",
  underline:
    "pointer-events-none absolute inset-x-0 bottom-1 h-1.5 w-full text-ink opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100",
  headerActions: "flex shrink-0 items-center max-[1023px]:hidden",
  mobileActions: "hidden shrink-0 items-center max-[1023px]:flex",
  languageSwitch: "flex items-center text-label font-bold text-graphite",
  languageLink:
    "grid min-h-11 min-w-11 place-items-center [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink",
  languageSelected: "text-ink underline decoration-2 underline-offset-4",
  menuToggle:
    "flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px]",
  menuIconLine:
    "h-0.5 w-5 bg-graphite transition-transform duration-200 ease-[var(--ease-out-ui)] motion-reduce:transition-none",
  menuIconLineFirstOpen: "translate-y-[3.5px] rotate-45",
  menuIconLineLastOpen: "-translate-y-[3.5px] -rotate-45",
  mobileNav:
    "absolute inset-x-0 top-[var(--nav-height)] hidden max-h-[calc(100dvh-var(--nav-height))] flex-col items-start overflow-y-auto border-b border-graphite bg-desk px-[var(--page-gutter)] pb-5 pointer-events-none invisible -translate-y-2 opacity-0 [transition:opacity_150ms_var(--ease-out-ui),transform_150ms_var(--ease-out-ui),visibility_0s_150ms] motion-reduce:translate-y-0 motion-reduce:[transition:opacity_150ms_var(--ease-out-ui),visibility_0s_150ms] max-[1023px]:flex",
  mobileNavOpen:
    "pointer-events-auto visible translate-y-0 opacity-100 [transition:opacity_200ms_var(--ease-out-ui),transform_200ms_var(--ease-out-ui),visibility_0s] motion-reduce:[transition:opacity_150ms_var(--ease-out-ui),visibility_0s]",
  mobileNavLink: "min-h-11",
} as const;
