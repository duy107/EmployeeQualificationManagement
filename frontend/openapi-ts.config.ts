import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    input: "http://localhost:5100/swagger/v1/swagger.json",
    output: "./src/api/rest",
    client: 'axios',
    schemas: false,
    useOptions: true,
    types: {
        dates: true,
        enums: 'javascript'
    },
    name: 'RestClient'
});