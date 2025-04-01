package database

// Modify all this
func EmailExists(email string) bool {
	return email == ""
}

func UserExists(username string) bool {
	return username == ""
}

func Register(username, password, email string) bool {
	return username != "" && password != "" && email != ""
}
