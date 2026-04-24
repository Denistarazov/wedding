import WeddingApp from "@/components/wedding-app";

const templateSlugs = [
  "editorial",
  "swiss",
  "garden",
  "dark",
  "brutalist",
  "letterpress",
  "wabisabi",
  "polaroid",
  "artdeco",
  "bauhaus",
  "celestial",
  "mediterranean",
  "groovy",
  "neon",
  "botanical",
];

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ["templates"] },
    { slug: ["contact"] },
    ...templateSlugs.map((slug) => ({ slug: ["templates", slug] })),
  ];
}

export default function Page() {
  return <WeddingApp />;
}
