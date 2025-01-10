const errorHandler = (err, req, res, next) => {
    console.error('Error capturado:', err);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ocurrió un error inesperado.';
  
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Incluye el stack solo en modo desarrollo
    });
  };
  
  module.exports = errorHandler;
  