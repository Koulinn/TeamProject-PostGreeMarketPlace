export const notFoundErrorHandler = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({
            success: false,
            msg: err.message
        })
    } else {
        next(err)
    }
}

export const badRequestErrorHandler = (err, req, res, next) => {
    // console.log(' bad 400', err)
    if (err.status === 400) {
        res.status(400).send({
            success: false,
            msg: err, //errorList should be passed from the route
            // msge: "40000000" adding extra stuff to the handlers
        })
    } else {
        next(err)
    }
   
}

export const serverErrorHandler = (err, req, res, next) => {
    res.status(500).send("Oh crap! It's not you, it's me the server I'm having some issues atm")
}