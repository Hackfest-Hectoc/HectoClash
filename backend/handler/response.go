package handler

type Response struct {
	Status string `json:"status"`
	Message string `json:"message"`
}

var (
	ErrBadFormData = Response{"failure", "Bad Form Data."}
	ErrUserExists  = Response{"failure", "User already exists."}
	ErrEmailExists = Response{"failure", "Email already exists."}
	ErrEmptyFields = Response{"failure", "All fields are required."}
	ErrRegFailure  = Response{"failure", "Failed to register. Please contact admin."}
	ErrInvalidUsername = Response{"failure", "Username length must be between 4 and 20 characters."}
	ErrInvalidPassword = Response{"failure", "Password length must be between 8 and 72 characters."}
	ErrInvalidEmail = Response{"failure", "Invalid email address."}
	ErrInvalidCreds = Response{"failure", "Invalid credentials."}
	RegSuccess = Response{"success", "Registered Successfully."}
	LoggedIn = Response{"success", "LoggedIn."}
)
