import express from "express"
import dotenv from "dotenv"

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dotenv.config()

//routers
import Health from "./routes/health/healthcheck.router.js"

//health
app.use("/", Health)

// default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GOING NEAPL ADVENTURE",
  })
})

export default app
