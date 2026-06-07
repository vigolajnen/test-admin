// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

let newsDb = [
  {
    id: "1",
    title: "Первая новость",
    content: "Это содержимое первой новости...",
    imageUrl: "https://picsum.photos/300/200",
    status: "published",
    createdAt: "2024-01-15T10:00:00.000Z",
    views: 150,
    authorId: "1",
  }
];

let usersDb = [
  {
    id: "1",
    email: "admin@admin.com",
    password: "123",
    name: "Администратор",
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    email: "editor@editor.com",
    password: "123",
    name: "Редактор",
    role: "editor",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

const findIndexById = (arr, id) => arr.findIndex((item) => item.id === id);

// Определяем базовый URL в зависимости от окружения
const baseUrl = import.meta.env.PROD ? 'https://vigolajnen.github.io/news' : '';

export const handlers = [
  // НОВОСТИ
  http.get(`${baseUrl}/news`, () => {
    return HttpResponse.json(newsDb);
  }),
  
  http.post(`${baseUrl}/news`, async ({ request }) => {
    const newNews = await request.json();
    const createdNews = {
      ...newNews,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      views: 0,
      authorId: "1",
    };
    newsDb.unshift(createdNews);
    return HttpResponse.json(createdNews, { status: 201 });
  }),
  
  http.put(`${baseUrl}/news/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const index = findIndexById(newsDb, id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    newsDb[index] = { ...newsDb[index], ...updates };
    return HttpResponse.json(newsDb[index]);
  }),
  
  http.delete(`${baseUrl}/news/:id`, ({ params }) => {
    const { id } = params;
    const index = findIndexById(newsDb, id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    newsDb.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
  
  http.patch(`${baseUrl}/news/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const index = findIndexById(newsDb, id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    newsDb[index] = { ...newsDb[index], ...updates };
    return HttpResponse.json(newsDb[index]);
  }),
  
  // ПОЛЬЗОВАТЕЛИ
  http.get(`${baseUrl}/users`, () => {
    const safeUsers = usersDb.map(({ password, ...user }) => user);
    return HttpResponse.json(safeUsers);
  }),
  
  http.post(`${baseUrl}/users`, async ({ request }) => {
    const newUser = await request.json();
    const createdUser = {
      ...newUser,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    usersDb.push(createdUser);
    const { password, ...safeUser } = createdUser;
    return HttpResponse.json(safeUser, { status: 201 });
  }),
  
  http.put(`${baseUrl}/users/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const index = findIndexById(usersDb, id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    usersDb[index] = { ...usersDb[index], ...updates };
    const { password, ...safeUser } = usersDb[index];
    return HttpResponse.json(safeUser);
  }),
  
  http.delete(`${baseUrl}/users/:id`, ({ params }) => {
    const { id } = params;
    const index = findIndexById(usersDb, id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    usersDb.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];