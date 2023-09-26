import { ErrorRequestHandler     } from "express";

import { IS_DEV } from "./constants";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next)=> {
    console.log(err);
    res.send({
        error: IS_DEV? err: null,
        message: "There was some internal server error"
    })
}

export default errorHandler;  
