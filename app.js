import logger from './src/middleware/logger.middleware.js';

// ...existing code...

app.use(logger);

// Global error handling
process.on('unhandledRejection', (reason) => {
    console.error('[process] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('[process] Uncaught Exception:', err);
});

process.on('SIGINT', () => {
    console.log('\n[process] SIGINT received. Closing...');
    process.exit(0);
});