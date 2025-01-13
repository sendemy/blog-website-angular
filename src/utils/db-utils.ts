import { Post, PostPagination, User } from '../types';

async function fetchData(route: string, method: string = 'GET', body?: string) {
  const response = await fetch(`http://localhost:3000/${route}`, {
    method,
    body,
  });

  const data = await response.json();

  return data;
}

export async function getUsers(): Promise<User[]> {
  const data = await fetchData('users');

  return data;
}

export async function getUser(id: string): Promise<User[]> {
  return fetchData(`users?id=${id}`);
}

export async function createUser(data: string): Promise<string> {
  return fetchData('users', 'POST', data).then(async () => {
    const id = await dbHasUser(JSON.parse(data).email);

    return id;
  });
}

export async function deleteUser(id: string) {
  const posts = await fetchData(`posts?creatorId=${id}`, 'GET');

  for (const post of posts) {
    await fetchData(`posts/${post.id}`, 'DELETE');
  }

  sessionStorage.removeItem('authToken');

  return fetchData(`users/${id}`, 'DELETE');
}

export async function dbHasUser(email: string): Promise<string> {
  const user = await fetchData(`users?email=${email}`);

  if (user.length === 0) {
    return '';
  }

  return user[0].id;
}

export async function dbCheckUserPassword(
  email: string,
  password: string
): Promise<string | null> {
  const user = (await fetchData(`users?email=${email}`))[0];

  if (user.password === password) {
    return user.id;
  }

  return null;
}

export async function getPost(id: string): Promise<Post[]> {
  return fetchData(`posts?id=${id}`);
}

export async function getPosts(
  page: number = 1,
  amount: number = 6
): Promise<PostPagination> {
  return fetchData(`posts?_page=${page}&_per_page=${amount}`);
}

export async function getUserPosts({
  amount = 6,
  page = 1,
  id,
}: {
  amount?: number;
  page?: number;
  id: string;
}): Promise<PostPagination> {
  return fetchData(`posts?_page=${page}&_per_page=${amount}&creatorId=${id}`);
}

export async function createPost(data: string) {
  return fetchData('posts', 'POST', data);
}

export async function deletePost(id: string) {
  return fetchData(`posts/${id}`, 'DELETE');
}

export async function updatePost(id: string, newPost: string) {
  return fetchData(`posts/${id}`, 'PUT', newPost);
}

export async function setUserRole(id: string, role: 'user' | 'admin') {
  const user = (await fetchData(`users/${id}`))[0];

  if (!user) {
    throw new Error(`User with id ${id} not found.`);
  }

  user.role = role;

  return fetchData(`users/${id}`, 'PUT', JSON.stringify(user));
}

export async function changeUserData(
  id: string,
  {
    nickname,
    email,
    password,
  }: { nickname?: string; email?: string; password?: string }
) {
  const user = await fetchData(`users/${id}`);

  if (!user) {
    throw new Error(`User with id ${id} not found.`);
  }

  if (nickname) {
    user.nickname = nickname;
  }

  if (password) {
    user.password = password;
  }

  return fetchData(`users/${id}`, 'PUT', JSON.stringify(user));
}
