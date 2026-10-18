
export type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number | string;
  product: {
    id: number;
    name: string;
    image: string | null;
  } | null;
};

export type Order = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  total: number | string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  orderitem: OrderItem[];
};
