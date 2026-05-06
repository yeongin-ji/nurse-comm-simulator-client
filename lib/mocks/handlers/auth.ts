import { http, HttpResponse } from "msw";

const MOCK_USERS = [
  {
    id: 1,
    name: "김간호",
    email: "student@example.com",
    password: "test1234",
    role: "learner",
  },
  {
    id: 2,
    name: "이교수",
    email: "educator@example.com",
    password: "test1234",
    role: "educator",
  },
];

export const authHandlers = [
  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
    };
    const user = MOCK_USERS.find(
      (u) => u.email === body.email && u.password === body.password,
    );
    if (!user) {
      return HttpResponse.json(
        { error: "invalid email or password" },
        { status: 401 },
      );
    }
    const { password: _, ...res } = user;
    return HttpResponse.json(res);
  }),
];
