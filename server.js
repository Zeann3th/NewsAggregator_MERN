import express from "express"
import { articlesRoutes } from "./routes/articlesRoutes.js"
import { usersRoutes } from "./routes/usersRoutes.js"
import { categoriesRoutes } from "./routes/categoriesRoutes.js"
import { postsRoutes } from "./routes/postsRoutes.js"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import mongoose from "mongoose"
import cors from "cors";
import dotenv from "dotenv";

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
dotenv.config()

// Configs
const port = process.env.PORT || 4000;
const connectionSTring = process.env.CONNECTION_STRING;
const swaggerSpec = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "News Aggregator APIs",
            version: "1.0.0",
        },
        servers: [{
            url: `https://newsaggregator-mern.onrender.com`
        }]
    },
    apis: ["./docs/swagger-docs.yaml"]
}


// Routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerSpec)))
app.use("/v1/articles", articlesRoutes)
app.use("/v1/categories", categoriesRoutes)
app.use("/v1/posts", postsRoutes)
app.use("/v1/users", usersRoutes)

mongoose.connect(connectionSTring, { dbName: process.env.MONGODB_DATABASE_NAME })
    .then(() => {
        console.log("Connected successfully to MongoDB");
        app.listen(port, () => {console.log(`Listening on port ${port}`)});
    })
    .catch(err => console.log(err));

