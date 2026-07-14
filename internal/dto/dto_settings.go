package dto

type SmtpSettingsRequest struct {
	FromEmail string `json:"from_email" binding:"required,email"`
	Password  string `json:"password"`
	Host      string `json:"host" binding:"required"`
	Port      int    `json:"port" binding:"required"`
}

type SmtpSettingsResponse struct {
	Configured bool   `json:"configured"`
	FromEmail  string `json:"from_email"`
	Host       string `json:"host"`
	Port       int    `json:"port"`
}
