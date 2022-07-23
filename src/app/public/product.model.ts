export interface Product {
  name: string,
  imageUrl: string,
  description: {
    features: string,
    specs: { name: string, value: string }[],
    brand: string,
    manufacturerID: string
  },
  price: number,
  discountPrice?: number,
  stock: number,
  amount: number,
}
