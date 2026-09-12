import { Router, type IRouter } from "express";
import healthRouter from "./health";
import candidatesRouter from "./candidates";
import studentsRouter from "./students";
import votesRouter from "./votes";
import resultsRouter from "./results";
import electionRouter from "./election";
import authRouter from "./auth";

const router: IRouter = Router();

router.use("/auth", authRouter);
router.use(healthRouter);
router.use("/candidates", candidatesRouter);
router.use("/students", studentsRouter);
router.use("/votes", votesRouter);
router.use("/results", resultsRouter);
router.use("/election", electionRouter);

export default router;
