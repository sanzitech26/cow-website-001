import { db } from "@/db";
import { categories } from "@/db/schema";
import { ProductForm } from "@/components/ProductForm";

export default async function NewProduct() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">New product</h1>
      <ProductForm vs={[]} cats={await db.select().from(categories)} />
    </div>
  );
}
