
import { db } from './db';
import { productsTable, salesTable } from './schema'


export async function seed() {

    await db.insert(productsTable).values([
        { name: "laptop", category: "Electronics", price: 10000, stock: 50 },
        { name: "smartphone", category: "Electronics", price: 8000, stock: 120 },
        { name: "headphones", category: "Accessories", price: 1500, stock: 200 },
        { name: "tablet", category: "Electronics", price: 6000, stock: 75 },
        { name: "keyboard", category: "Accessories", price: 1200, stock: 90 },
        { name: "monitor", category: "Electronics", price: 7000, stock: 40 },
        { name: "camera", category: "Electronics", price: 15000, stock: 25 },
        { name: "smartwatch", category: "Wearables", price: 5000, stock: 60 },
        { name: "printer", category: "Electronics", price: 4000, stock: 30 },
        { name: "gaming_console", category: "Electronics", price: 20000, stock: 15 }
    ])

    await db.insert(salesTable).values([
        { productId: 1, quantity: 5, totalAmount: 130, customerName: "chiku", region: "south" },
        { productId: 2, quantity: 3, totalAmount: 250, customerName: "arjun", region: "north" },
        { productId: 3, quantity: 7, totalAmount: 560, customerName: "meera", region: "east" },
        { productId: 4, quantity: 2, totalAmount: 90, customerName: "rahul", region: "west" },
        { productId: 5, quantity: 10, totalAmount: 1200, customerName: "sneha", region: "south" }
    ])
    
}

seed()