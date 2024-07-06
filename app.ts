import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userInfoRouter from './app/userOperations/userOperationRouter'
import contenGenerateRouter from  './app/ContentGenerate/contentGenerateRouter'
import courseOutlineRouter from './app/CourseOutline/courseOutlineRouter'
import conversationRouter from './app/Conversation/conversationRouter'
import mongoose from "mongoose"

export default class Startup {
    app: any
    wb3StorageClient: any ;
    
    constructor(){
        this.app = express();
    }

    // Registers all middleware
    public async setup(){
        require('dotenv').config()

        const {SERVER_MONGODB_URL} = process.env
        this.app.use(cors());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ limit: '10mb',  extended: false }));
        this.app.use(cookieParser());

        // register controller routes
        this.app.use('/userInfo', userInfoRouter);
        this.app.use('/courseOutline', courseOutlineRouter);
        this.app.use('/aiGen', contenGenerateRouter);
        this.app.use("/conversation", conversationRouter)

        this.app.use(function(req, res, next) {
            next(createError(404));
        });

        // error handler
        this.app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

        mongoose.connect( SERVER_MONGODB_URL )
    }

    //run the app on port
    public run(port: Number){
        //starting app on server
        this.app.listen(port, ()=>{
        console.log('Server Started...')
        })
    }

    public getWb3StorageClient(){
        return this.wb3StorageClient;
    }
}
  