export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean

    constructor(message: string, statusCode: number, isOperational = true){
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational

         // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);
    
        // Set the prototype explicitly for instanceof checks to work
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * 400 Bad Request
 */

export class BadRequestError extends AppError {
    constructor(message = "Bad Request"){
        super(message, 400)
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * 401 Unauthorized
 */

export class UnauthorizedError extends AppError{
    constructor(message = "Unauthorized-Invalid credentials"){
        super(message, 401);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * 404 Not-Found
 */

export class NotFoundError extends AppError{
    constructor(message = "Not Found"){
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}


/**
 * 429 Too many request
 */

export class TooManyRequestError extends AppError {
    constructor(message = "Too many reqeusts"){
        super(message, 429);
        Object.setPrototypeOf(this, TooManyRequestError.prototype);
    }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, false); 
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}


/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}