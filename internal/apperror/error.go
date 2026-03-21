package apperror

type AppError struct {
	Message    string
	Code       string
	HTTPStatus int
}

// Define all app errors here
var ErrUnauthorized = AppError{
	Code:       "UNAUTHORIZED",
	Message:    "Unauthorized access",
	HTTPStatus: 401,
}
