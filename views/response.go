package views

type APIError struct {
	Message string `json:"message"`
}

type APISuccess struct {
	Message string `json:"message"`
}
