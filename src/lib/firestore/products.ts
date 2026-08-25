import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Product } from "@/types/product";
import { COLLECTIONS } from "@/lib/constants";

function getCollection(firestore: Firestore) {
  return collection(firestore, COLLECTIONS.PRODUCTS);
}

export async function getProducts(params?: {
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  if (!db) return [];

  let q = query(getCollection(db), orderBy("createdAt", "desc"));

  if (params?.category) {
    q = query(q, where("category", "==", params.category));
  }
  if (params?.isActive !== undefined) {
    q = query(q, where("isActive", "==", params.isActive));
  }
  if (params?.isFeatured !== undefined) {
    q = query(q, where("isFeatured", "==", params.isFeatured));
  }
  if (params?.limit) {
    q = query(q, limit(params.limit));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!db) return null;

  const q = query(getCollection(db), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!db) return null;

  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as Product;
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const now = Timestamp.now();
  const docRef = await addDoc(getCollection(db), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await deleteDoc(docRef);
}

export async function getFeaturedProducts(
  limitCount: number = 4
): Promise<Product[]> {
  return getProducts({ isFeatured: true, isActive: true, limit: limitCount });
}

export async function getRelatedProducts(
  currentSlug: string,
  category: string,
  fetchLimit: number = 8
): Promise<{ products: Product[]; hasMore: boolean }> {
  if (!db) return { products: [], hasMore: false };

  const sameCategory = await getProducts({ category, isActive: true });
  let related = sameCategory.filter((p) => p.slug !== currentSlug);

  const hasMore = related.length > fetchLimit;

  // If less than limit, fill with products from other categories
  if (related.length < fetchLimit) {
    const otherProducts = await getProducts({ isActive: true });
    const additional = otherProducts
      .filter((p) => p.slug !== currentSlug && !related.find((r) => r.slug === p.slug))
      .slice(0, fetchLimit - related.length);
    related = [...related, ...additional];
  }

  return {
    products: related.slice(0, fetchLimit),
    hasMore: hasMore || related.length > fetchLimit,
  };
}

export async function getOtherProducts(
  currentSlug: string,
  excludeCategory: string,
  fetchLimit: number = 8
): Promise<{ products: Product[]; hasMore: boolean }> {
  if (!db) return { products: [], hasMore: false };

  const allProducts = await getProducts({ isActive: true });
  const other = allProducts.filter(
    (p) => p.slug !== currentSlug && p.category !== excludeCategory
  );

  return {
    products: other.slice(0, fetchLimit),
    hasMore: other.length > fetchLimit,
  };
}

export async function searchProducts(params: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  maxCapacity?: number;
  sortBy?: string;
}): Promise<Product[]> {
  if (!db) return [];

  const allProducts = await getProducts({ isActive: true });
  let filtered = allProducts;

  if (params.search) {
    const keyword = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.shortDescription.toLowerCase().includes(keyword)
    );
  }

  if (params.category) {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  if (params.minCapacity !== undefined) {
    filtered = filtered.filter((p) => p.capacityValue >= params.minCapacity!);
  }
  if (params.maxCapacity !== undefined) {
    filtered = filtered.filter((p) => p.capacityValue <= params.maxCapacity!);
  }

  if (params.sortBy) {
    filtered.sort((a, b) => {
      switch (params.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "capacity-asc":
          return a.capacityValue - b.capacityValue;
        case "capacity-desc":
          return b.capacityValue - a.capacityValue;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  return filtered;
}
