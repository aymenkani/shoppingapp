import * as dotenv from 'dotenv';
dotenv.config()

import { Application } from 'express'
import cors from 'cors';
import { json ,urlencoded } from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose'
import { errorHandler } from '@shoppingapp/common';
import { authRouters } from './auth/auth.routers';

export class AppModule {
    constructor(public app: Application) {
        app.set('trust-proxy', true)

        app.use(cors({
            origin: "*",
            credentials: true,
            optionsSuccessStatus: 200
        }))

        app.use(urlencoded({ extended: true }))
        app.use(json())
        app.use(cookieSession({
            signed: false,
            secure: false
        }))

        app.use(authRouters)
        app.use(errorHandler)

        Object.setPrototypeOf(this, AppModule.prototype)
    }

    async start() {
        if(!process.env.MONGO_URI) {
            throw new Error('mongo_uri must be defined')
        }
    
        if(!process.env.JWT_KEY) {
            throw new Error('mongo_uri must be defined')
        }

        try {
            await mongoose.connect(process.env.MONGO_URI)
        } catch(err) {
            throw new Error('database connection error')
        }

        this.app.listen(8080, () => console.log('OK! port: 8080'))
    }
}