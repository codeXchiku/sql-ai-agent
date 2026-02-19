import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const productsTable = sqliteTable("products", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    price: real("price").notNull(),
    stock: integer("stock").notNull().default(0),
    created_at: text("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});


export const salesTable = sqliteTable("sales", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id")
        .notNull()
        .references(() => productsTable.id),
    totalAmount: real("total_amount").notNull(),
    quantity: integer("quantity").notNull(),
    saleDate: text("sale_date")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    region: text("region").notNull(),
    customerName: text("customer_name").notNull(),
}); 