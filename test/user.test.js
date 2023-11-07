let app = require("../src/app.js");
let supertest = require("supertest");
let request = supertest(app); //request object

describe("User registration", () => {
  test("Should register an user successfully", async () => {
    //generate fake emails
    let time = Date.now();
    let email = `${time}@gmail.com`;

    let user = { name: "Andressa", email: email, password: "123" };

    const res = await request.post("/user").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(email);
  });

  test("Should prevent a user from submitting empty fields", async () => {
    let user = { name: "", email: "", password: "" };

    const res = await request.post("/user").send(user);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Please fill in all fields!")
  });

  test("Should prevent a repeated email from being registered", async () => {
    let time = Date.now();
    let email = `${time}@gmail.com`;

    let user = { name: "Andressa", email: email, password: "123" };

    const res = await request.post("/user").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual(email);

    const resError = await request.post("/user").send(user)
    expect(resError.statusCode).toEqual(400);
    expect(resError.body.error).toEqual("E-mail alredy registered.")

  });
});
