// asyncHandler is higher order function 
// wrapper function

const asyncHandler = (requestHandler) => {
  (req,res, next) => {
    Promise.resolve(requestHandler(req, res, next)).
    catch((err) => next(err))
  }
}

export {asyncHandler}

