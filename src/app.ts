import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dotenv.config()
app.use(
  cors({
    origin: [
      "https://gna-admin-panel.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://www.goingnepaladventure.com",
    ],
    credentials: true,
  })
)
app.use(cookieParser())

//routers
import Health from "./routes/health/healthcheck.router.js"
//trekking
import trekkingRouter from "./routes/trekking.routes.js"
//tour
import tourRouter from "./routes/tour.routes.js"
//wellness
import wellnessRouter from "./routes/wellness.routes.js"
//blogs
import blogRouter from "./routes/blog.routes.js"
//plan trip
import planTripRouter from "./routes/planTrip.routes.js"
//home
import homeRouter from "./routes/home.routes.js"
//trips and tours
import tripsAndToursRouter from "./routes/tripsAndTours.routes.js"
//acitivities
import activitiesRouter from "./routes/activities.routes.js"
//user details
import useDetailsRoutes from "./routes/userDetails.routes.js"
//quoteAndCustomize
import quoteAndCustomize from "./routes/quoteAndCustomize.js"
//admin
import adminRouter from "./routes/admin.routes.js"

//health
app.use("/", Health)
//trekking
app.use("/api/v1/trekking", trekkingRouter)
//tour
app.use("/api/v1/tour", tourRouter)
//wellness
app.use("/api/v1/wellness", wellnessRouter)
//blogs
app.use("/api/v1/blogs", blogRouter)
//plan trip
app.use("/api/v1/plan-trip", planTripRouter)
//home
app.use("/api/v1/home", homeRouter)
//trips and tours
app.use("/api/v1/trips-and-tours", tripsAndToursRouter)
//activities
app.use("/api/v1/activities", activitiesRouter)
//user details
app.use("/api/v1/users", useDetailsRoutes)
//quoteAndCustomize
app.use("/api/v1/quote-and-customize", quoteAndCustomize)
//admin
app.use("/api/v1/admin", adminRouter)

// default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GOING NEAPL ADVENTURE",
  })
})

export default app
