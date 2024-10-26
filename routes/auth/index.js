import express from "express"
import { authenticateToken, authorizeRole } from "../../middleware/auth-middleware.js";
import AuthController from "../../controller/AuthController.js";


const authRoute = express();


authRoute.post('/register', AuthController.register);
authRoute.post('/login', AuthController.Login);



export default authRoute