import { createProduct } from "./src/lib/firestore/products";
import sampleProducts from "./SAMPLE-PRODUCTS.json";
import { Product } from "./src/types/product";

async function main() {
  for (const product of sampleProducts as Product[]) {
    try {
      const id = await createProduct(product);
      console.log(`✅ Product added: ${product.name} (${id})`);
    } catch (error) {
      console.error(`❌ Failed to add ${product.name}:`, error);
    }
  }
  console.log("\n🎉 Seed complete! Visit http://localhost:3000/produk to view products.");
}

main().catch(console.error);