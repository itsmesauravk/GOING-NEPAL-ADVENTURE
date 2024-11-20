import express from "express"
import dotenv from "dotenv"
import cors from "cors"

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dotenv.config()
app.use(cors())

//routers
import Health from "./routes/health/healthcheck.router.js"
//trekking
import trekkingRouter from "./routes/trekking.routes.js"
//tour
import tourRouter from "./routes/tour.routes.js"
//wellness
import wellnessRouter from "./routes/wellness.routes.js"

//health
app.use("/", Health)
//trekking
app.use("/api/v1/trekking", trekkingRouter)
//tour
app.use("/api/v1/tour", tourRouter)
//wellness
app.use("/api/v1/wellness", wellnessRouter)

// default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GOING NEAPL ADVENTURE",
  })
})

export default app
