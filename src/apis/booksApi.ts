import { serverApi } from './_serverApi';

export interface Book {
  id: number;
  title: string;
  category_id: number;
  authors: string[];
  cover_url: string;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
  audio_length: number;
}

export const getBookList = (
  params: { categoryId?: number; size?: number; page?: number } = {
    categoryId: 1,
    page: 0,
    size: 10,
  },
) =>
  serverApi.get<Book[]>('/fee-assessment-books', {
    params: { categoryId: params.categoryId, page: params.page ?? 0, size: params.size },
  });
