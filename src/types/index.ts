export interface User {
  id: string;
  nickname: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface Post {
  id: string;
  creatorId: string;
  title: string;
  content: string;
  category: string;
  previewImage: string | ArrayBuffer | null;
  images?: (string | ArrayBuffer | null)[];
}

export interface PostPagination {
  data: Post[];
  first: number | null;
  items: number | null;
  last: number | null;
  next: number | null;
  pages: number | null;
  prev: number | null;
}
