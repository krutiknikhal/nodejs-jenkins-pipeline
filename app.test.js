const request = require("supertest");
const app = require("./app");

describe("Node.js Jenkins Demo App", () => {

    test("GET / should return the application message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Hello from Jenkins Automated CI/CD Pipeline!");
    });

    test("GET /health should return application health", async () => {
        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "OK"
        });
    });

});