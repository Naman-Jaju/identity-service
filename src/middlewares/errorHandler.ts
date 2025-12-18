import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Global error handler middleware
 * Must be placed LAST in middleware chain
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any = undefined;

  // Handle operational errors (errors we threw)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle Mongoose validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = handleMongooseValidationError(err);
  }
  // Handle Mongoose duplicate key errors
  else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
    errors = handleMongoDuplicateKeyError(err);
  }
  // Handle Mongoose cast errors (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  // Handle JWT expiration
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Handle Zod validation errors
  else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation error';
    errors = handleZodError(err);
  }
  // Unexpected errors (programming errors, bugs)
  else {
    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production') {
      message = 'Something went wrong';
    } else {
      message = err.message;
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(errors && { errors }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        name: err.name,
      }),
    },
  });
};

/**
 * Handle Mongoose validation errors
 */
const handleMongooseValidationError = (err: any) => {
  const errors: Record<string, string> = {};
  
  Object.keys(err.errors).forEach((key) => {
    errors[key] = err.errors[key].message;
  });
  
  return errors;
};

/**
 * Handle MongoDB duplicate key errors
 */
const handleMongoDuplicateKeyError = (err: any) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  
  return {
    [field]: `${field} '${value}' already exists`,
  };
};

/**
 * Handle Zod validation errors
 */
const handleZodError = (err: any) => {
  const errors: Record<string, string> = {};
  
  err.errors?.forEach((error: any) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });
  
  return errors;
};

/**
 * Async handler wrapper
 * Catches errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 * Place before error handler but after all routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};