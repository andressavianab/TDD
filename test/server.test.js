let app = require("../src/app.js");
let supertest = require("supertest");
let request = supertest(app); //request object

test("must run on port 3000", () => {
  return request
    .get("/")
    .then((res) => {
      let status = res.statusCode;
      expect(status).toEqual(200);
    })
    .catch((err) => {
      fail(err);
    });
});