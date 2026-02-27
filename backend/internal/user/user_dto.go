package user

type CreateUserDto struct {
	Name            string `json:"name" binding:"required"`
	Login           string `json:"login" binding:"required"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}
