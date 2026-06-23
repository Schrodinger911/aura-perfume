import amber from "@/assets/bottle-amber.jpg";
import rose from "@/assets/bottle-rose.jpg";
import citrus from "@/assets/bottle-citrus.jpg";
import noir from "@/assets/bottle-noir.jpg";

const map: Record<string, string> = {
  "santal-majestic": amber,
  "rose-inconnue": rose,
  "bergamote-02": citrus,
  "ambre-noir": noir,
  "figue-noir": amber,
  "cuir-de-nuit": noir,
  "iris-blanc": rose,
  "vetiver-04": citrus,
  "oud-sultan": noir,
  "jardin-anglais": citrus,
  "encens-blanc": rose,
  "chypre-noir": amber,
};

export function productImage(slug: string): string {
  return map[slug] ?? amber;
}

export const bottleImages = { amber, rose, citrus, noir };
