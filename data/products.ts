export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

export const productsData: Product[] = [
  { id: "1", name: "Laptop Pro 15", category: "Electronics", price: 35000, imageUrl: "https://picsum.photos/seed/1/300/200" },
  { id: "2", name: "Wireless Mouse", category: "Electronics", price: 850, imageUrl: "https://picsum.photos/seed/2/300/200" },
  { id: "3", name: "Mechanical Keyboard", category: "Electronics", price: 2900, imageUrl: "https://picsum.photos/seed/3/300/200" },
  { id: "4", name: "Ergonomic Chair", category: "Furniture", price: 5500, imageUrl: "https://picsum.photos/seed/4/300/200" },
  { id: "5", name: "Desk Lamp LED", category: "Furniture", price: 650, imageUrl: "https://picsum.photos/seed/5/300/200" },
  { id: "6", name: "Monitor 27-inch 4K", category: "Electronics", price: 12900, imageUrl: "https://picsum.photos/seed/6/300/200" },
  { id: "7", name: "USB-C Hub Multi-port", category: "Accessories", price: 1200, imageUrl: "https://picsum.photos/seed/7/300/200" },
  { id: "8", name: "Standing Desk Electric", category: "Furniture", price: 14500, imageUrl: "https://picsum.photos/seed/8/300/200" }
];