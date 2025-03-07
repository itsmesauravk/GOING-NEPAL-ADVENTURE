const healthCheck = (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Service is running smoothly",
        timestamp: new Date().toISOString(),
    });
};
export default healthCheck;
