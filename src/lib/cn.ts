import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * The theme's typography roles (`text-label`, `text-body`, …) are font
 * sizes. Without this, tailwind-merge reads them as text colours, so
 * `text-print text-label` kept only one of the two and dropped either the
 * colour or the size.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["display", "h2", "h3", "body", "small", "label", "annotation"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
