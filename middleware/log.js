import { PrismaClient } from "@prisma/client"
import chalk from "chalk";
const prisma = new PrismaClient();


export const logSuccess = async (req, res, next) => {

    const requestDetails = `${req.method} ${req.originalUrl} - ${new Date().toISOString()}`;
    console.log(chalk.yellow(`Incoming Request: ${requestDetails}`));



    res.on("finish", async () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const userId = req.session.userId || null; // Assume userId is saved in session
            const sessionId = req.sessionID; // Session ID from express-session
            const action = `${req.method} ${req.originalUrl}`;

            // Save log to database
            await prisma.log.create({
                data: {
                    userId: userId,
                    action: action,
                    sessionId: sessionId,
                },
            });
            console.log(chalk.blue(`Logged action: ${action} for user: ${userId || "Guest"}`));
        }
    });
    next();
};