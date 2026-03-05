package user

import (
	"codeforge/website-prospecting-api/internal/db"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Create(createUserDto CreateUserDto) (*User, error)
	FindByLogin(login string) (*User, error)
	FindById(id string) (*User, error)
	GetCount() int64
}

type userService struct{}

func NewUserService() UserService {
	return &userService{}
}

func (s *userService) Create(createUserDto CreateUserDto) (*User, error) {
	passwordConfirmationOk := createUserDto.Password == createUserDto.ConfirmPassword

	if !passwordConfirmationOk {
		return nil, errors.New("password and confirmation password do not match")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(createUserDto.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error during password hashing: %w", err)
	}

	user := User{
		Name:         createUserDto.Name,
		Login:        createUserDto.Login,
		PasswordHash: string(passwordHash[:]),
	}

	result := db.DB.Create(&user)

	if result.Error != nil {
		return nil, fmt.Errorf("error during creation of user record: %w", result.Error)
	}

	return &user, nil
}

func (s *userService) FindByLogin(login string) (*User, error) {
	user := User{}
	result := db.DB.Where("login = ?", login).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (s *userService) FindById(id string) (*User, error) {
	user := User{}
	result := db.DB.Where("id = ?", uuid.MustParse(id)).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (s *userService) GetCount() int64 {
	var count int64
	db.DB.Model(&User{}).Count(&count)
	return count
}
