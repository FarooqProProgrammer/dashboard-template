import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { generateToken } from "../lib/function.js"

dotenv.config()

const prisma = new PrismaClient();


class AuthController {

    // Register Controller
    static register = async (req, res) => {
        const { email, password, name, role } = req.body;
        try {

            console.log(req.body)
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role || 'USER', 
                },
            });

            res.status(201).json({ message: `User ${user.email} created with role ${user.role}` });
        } catch (error) {
            res.status(500).json({ error: 'Error registering user' });
        }
    }

    static Login = async (req, res) => {
        const { email, password } = req.body;

        try {
            // Check if email is provided
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            // Find the user by email
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return res.status(400).json({ message: 'User not found' });

            // Compare the provided password with the hashed password in the database
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

            // Generate token (make sure generateToken is defined correctly)
            const token = generateToken(user);

            // Return user data without password
            const { password: _, ...userWithoutPassword } = user; // Using destructuring to omit the password field

            // Or if you prefer lodash:
            // const userWithoutPassword = _.omit(user, 'password');

            res.json({ token, user: userWithoutPassword });
        } catch (error) {
            console.error('Login error:', error); // Log the error for debugging
            res.status(500).json({ error: 'Error logging in user' });
        }
    }


}

export default AuthController