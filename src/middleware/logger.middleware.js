function logger(req, res, next) {
    const start = Date.now();
    console.log(`[START] ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[END] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${duration}ms`);
    });

    next();
}

export default logger;