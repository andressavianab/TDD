let app = require("../src/app.js");
let supertest = require("supertest");
let request = supertest(app); //request object

let mainUser = {
  name: "Teste",
  email: "teste@gmail.com",
  password: "123456",
};

beforeAll(async () => {
  await request.post("/user").send(mainUser);
});

afterAll(async () => {
  await request.delete(`/user/${mainUser.name}`);
}, 20000);

describe("User registration", () => {
  test("Should register an user successfully", async () => {
    //generate fake emails
    let time = Date.now();
    let email = `${time}@gmail.com`;

    let user = { name: "Andressa", email: email, password: "123" };

    const res = await request.post("/user").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(email);
    expect(res.body.message).toEqual("User created succesfully.");
  });

  test("Should prevent a user from submitting empty fields", async () => {
    let user = { name: "", email: "", password: "" };

    const res = await request.post("/user").send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Please fill in all fields!");
  });

  test("Should prevent a repeated email from being registered", async () => {
    let time = Date.now();
    let email = `${time}@gmail.com`;

    let user = { name: "Andressa", email: email, password: "123" };

    const res = await request.post("/user").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(email);

    const resError = await request.post("/user").send(user);
    expect(resError.statusCode).toEqual(400);
    expect(resError.body.error).toEqual("E-mail alredy registered.");
  });
});

describe("Authentication", () => {
  test("Should prevent a user from submitting empty fields", async () => {
    const res = await request.post("/auth").send({ email: "", password: "" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Please fill in all fields!");
  });

  test("Should return a token & the user email/id when logging in", async () => {
    const res = await request
      .post("/auth")
      .send({ email: mainUser.email, password: mainUser.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
  });

  test("Should prevent an unregistered user from logging in", async () => {
    const res = await request
      .post("/auth")
      .send({ email: "unregistered@email.com", password: "456123" });
    expect(res.statusCode).toEqual(403);
    expect(res.body.errors.email).toEqual("Unregistered user.");
  });

  test("Should prevent an user from logging in with wrong password", async () => {
    const res = await request
      .post("/auth")
      .send({ email: mainUser.email, password: "wrongPassword" });
    expect(res.statusCode).toEqual(403);
    expect(res.body.errors.password).toEqual("Incorrect password.");
  });
});
