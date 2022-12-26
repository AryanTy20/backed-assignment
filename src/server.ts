import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookie from "cookie-parser";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookie());

// * custom imports *//
import { ExtendedError, DbConnect } from "./utils";
import UserRoutes from "./routes";

// * Database connect *//
DbConnect();

// * route to show api running *//
app.get("/", (req: Request, res: Response, next: NextFunction) =>
  res.json("api running 🚀")
);

// * Admin routes * //
app.use("/api", UserRoutes);

// * Route for Error Handling *//
app.use(
  (err: ExtendedError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    return res.status(status).json(message);
  }
);

app.listen(5000, () => console.log("server running on port 5000"));
