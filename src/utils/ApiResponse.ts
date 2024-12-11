interface ApiResponseTypes<T = any> {
  success: boolean
  status: number
  message: string
  data?: T
  error?: any
}

class ApiResponse<T = any> {
  success: boolean
  status: number
  message: string
  data?: T
  error?: any

  constructor(status: number, message: string, data?: T, error?: any) {
    this.success = status >= 200 && status < 300
    this.status = status
    this.message = message
    this.data = data
    this.error = error
  }

  static success<T>(data: T, message = "Operation successful"): ApiResponse<T> {
    return new ApiResponse<T>(200, message, data)
  }

  static error(
    message = "An error occurred",
    status = 500,
    error?: any
  ): ApiResponse<null> {
    return new ApiResponse<null>(status, message, null, error)
  }

  static notFound(message = "Resource not found"): ApiResponse<null> {
    return new ApiResponse<null>(404, message)
  }

  static unauthorized(message = "Unauthorized access"): ApiResponse<null> {
    return new ApiResponse<null>(401, message)
  }

  static badRequest(message = "Bad request", error?: any): ApiResponse<null> {
    return new ApiResponse<null>(400, message, null, error)
  }
}

export { ApiResponse }
