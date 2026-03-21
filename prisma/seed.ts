import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import products from "../example-products.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type Species = "dog" | "cat";

const CATEGORIES: Record<string, string> = {
  food:        "Concentrados / Comida",
  hygiene:     "Higiene",
  supplement:  "Medicamentos / Suplementos",
  accessories: "Accesorios",
  accesories:  "Accesorios", // handle typo in example data
  dewormers:   "Desparasitantes",
};

const PLACEHOLDER_PRICES: Record<string, number> = {
  food:        35000,
  hygiene:     25000,
  supplement:  45000,
  accessories: 50000,
  accesories:  50000,
  dewormers:   30000,
};

async function main() {
  console.log("Seeding database…");

  const categoryMap: Record<string, string> = {};
  const uniqueCategorySlugs = [...new Set(products.map((p) => p.category))];

  for (const slug of uniqueCategorySlugs) {
    const normalizedSlug = slug === "accesories" ? "accessories" : slug;
    const category = await prisma.category.upsert({
      where: { slug: normalizedSlug },
      update: {},
      create: {
        slug: normalizedSlug,
        name: CATEGORIES[slug] ?? slug,
      },
    });
    categoryMap[slug] = category.id;
  }

  for (const p of products) {
    const categoryId = categoryMap[p.category];
    const price = PLACEHOLDER_PRICES[p.category] ?? 30000;

    await prisma.product.upsert({
      where: { slug: p.id },
      update: {},
      create: {
        slug:         p.id,
        name:         p.name,
        brand:        p.brand,
        description:  p.description,
        price,
        presentation: `${p.presentation}${p.weight ? ` - ${p.weight}` : ""}`,
        imageUrl:     p.image,
        active:       p.active,
        categoryId,
        species:      p.species as Species[],
      },
    });
  }

  console.log(`✓ Seeded ${products.length} products and ${uniqueCategorySlugs.length} categories.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
