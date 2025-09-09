import express, { Request, Response, NextFunction } from "express";
import { multerInstance } from "@/server/utils/multer";
import cors from "cors";
import { Pool } from "pg";
import projectRoutes from "@/server/routes/projects.routes";
import { getTaskData } from "./controllers/task-data.controller";
import { errorHandler } from "@/server/error/errorHandler";
import {
    getArtists,
    createArtist,
} from "@/server/controllers/artists.controller";

import { checkServerConnection } from "@/server/controllers/check-server.controller";
import {
    updateTaskExecutor,
    updateTaskStatus,
    updateTaskPriority,
    deleteTask,
} from "./controllers/tasks.controller";

class Server {
    db: Pool;
    port: number;

    constructor(dbInstance: Pool, port = 3001) {
        this.db = dbInstance;
        this.port = port;
    }

    run() {
        const app = express();

        app.use(
            cors({
                origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
            }),
        );
        app.use(express.json());

        app.use("/projects", projectRoutes);
        app.use("/task-data", getTaskData);
        app.use("/check-server", checkServerConnection);
        app.get("/get-artist", getArtists);
        app.post("/create-artist", createArtist);
        app.delete("/delete-task", deleteTask);

        app.post(
            "/task-upload",
            multerInstance.single("data"),
            (err: unknown, req: Request, res: Response, next: NextFunction) => {
                if (err) next(err);
                res.send("Upload successfully");
            },
        );

        app.patch("/task-update-executor", updateTaskExecutor);
        app.patch("/task-update-status", updateTaskStatus);
        app.patch("/task-update-priority", updateTaskPriority);

        app.use(errorHandler);

        app.listen(this.port, () => {
            console.log(`Server started to listen on ${this.port} port`);
        });
    }
}

export default Server;
