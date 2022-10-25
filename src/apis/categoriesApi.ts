import { serverApi } from './_serverApi';

export interface Category {
  id: number;
  name: string;
}

export const getCategoryList = () => serverApi.get<Category[]>('/fee-assessment-categories');
