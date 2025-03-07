class ApiResponse {
    constructor(status, message, data, error) {
        this.success = status >= 200 && status < 300;
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }
    static success(data, message = "Operation successful") {
        return new ApiResponse(200, message, data);
    }
    static error(message = "An error occurred", status = 500, error) {
        return new ApiResponse(status, message, null, error);
    }
    static notFound(message = "Resource not found") {
        return new ApiResponse(404, message);
    }
    static unauthorized(message = "Unauthorized access") {
        return new ApiResponse(401, message);
    }
    static badRequest(message = "Bad request", error) {
        return new ApiResponse(400, message, null, error);
    }
}
export { ApiResponse };
