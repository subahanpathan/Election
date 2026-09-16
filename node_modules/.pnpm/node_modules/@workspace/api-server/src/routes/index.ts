import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import candidatesRouter from "./candidates";
import studentsRouter from "./students";
import votesRouter from "./votes";
import resultsRouter from "./results";
import electionRouter from "./election";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/candidates", candidatesRouter);
router.use("/students", studentsRouter);
router.use("/votes", votesRouter);
router.use("/results", resultsRouter);
router.use("/election", electionRouter);

export default router;
