export interface IProduct {
  id: number;
  name: string;
  imgSrc: string;
}

export interface IMockProductCategory {
  id: number;
  name: string;
  image: string;
  types: {
    id: number;
    category: string;
    subcategories: {
      id: string;
      name: string;
      products: IMockProduct[];
    }[];
  }[];
}

export interface IMockProduct {
  id: string | number;
  name: string;
  price: number;
  image: string;
}
