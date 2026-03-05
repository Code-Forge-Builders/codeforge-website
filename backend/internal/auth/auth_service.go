package auth

import (
	"codeforge/website-prospecting-api/internal/config"
	"codeforge/website-prospecting-api/internal/user"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthUserDto struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Login string `json:"login"`
}

type AuthResult struct {
	Token     string      `json:"token"`
	ExpiresAt time.Time   `json:"expires_at"`
	User      AuthUserDto `json:"user"`
}

type TokenPayload struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
}

type AuthService interface {
	Register(dto user.CreateUserDto) (*user.User, error)
	Login(dto LoginDto) (*AuthResult, error)
	CheckInitialSetup() bool
	ValidateToken(token string) (*AuthUserDto, error)
}

type authService struct {
	userService user.UserService
	secret      []byte
	tokenTTL    time.Duration
}

var ErrInvalidCredentials = errors.New("invalid credentials")

func NewAuthService(userService user.UserService) AuthService {
	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Sprintf("failed to load configuration for auth service: %v", err))
	}

	if cfg.JWTSecret == "" {
		panic("JWT_SECRET must be configured")
	}

	expiryMinutes := cfg.JWTExpiryInMinutes
	if expiryMinutes <= 0 {
		expiryMinutes = 1440 // default to 24 hours
	}

	return &authService{
		userService: userService,
		secret:      []byte(cfg.JWTSecret),
		tokenTTL:    time.Duration(expiryMinutes) * time.Minute,
	}
}

func (s *authService) Register(dto user.CreateUserDto) (*user.User, error) {
	createdUser, err := s.userService.Create(dto)
	if err != nil {
		return nil, err
	}

	return createdUser, nil
}

func (s *authService) Login(dto LoginDto) (*AuthResult, error) {
	foundUser, err := s.userService.FindByLogin(dto.Login)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(foundUser.PasswordHash), []byte(dto.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	tokenPayload, err := s.generateToken(foundUser)
	if err != nil {
		return nil, err
	}

	return &AuthResult{
		Token:     tokenPayload.Token,
		ExpiresAt: tokenPayload.ExpiresAt,
		User:      mapUserToDto(foundUser),
	}, nil
}
func (s *authService) CheckInitialSetup() bool {
	count := s.userService.GetCount()

	if count <= 0 {
		return false
	}

	return true
}

func (s *authService) ValidateToken(token string) (*AuthUserDto, error) {
	tokenParsed, err := jwt.ParseWithClaims(token, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return s.secret, nil
	})

	if err != nil || !tokenParsed.Valid {
		return nil, errors.New("invalid token")
	}

	claims := tokenParsed.Claims.(*jwt.RegisteredClaims)

	user, err := s.userService.FindById(claims.Subject)

	if err != nil {
		return nil, err
	}

	return &AuthUserDto{
		ID:    user.ID.String(),
		Name:  user.Name,
		Login: user.Login,
	}, nil
}

func (s *authService) generateToken(u *user.User) (TokenPayload, error) {
	now := time.Now()

	claims := jwt.RegisteredClaims{
		Subject:   u.ID.String(),
		ExpiresAt: jwt.NewNumericDate(now.Add(s.tokenTTL)),
		IssuedAt:  jwt.NewNumericDate(now),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(s.secret)
	if err != nil {
		return TokenPayload{}, err
	}

	return TokenPayload{
		Token:     tokenString,
		ExpiresAt: claims.ExpiresAt.Time,
	}, nil
}

func mapUserToDto(u *user.User) AuthUserDto {
	return AuthUserDto{
		ID:    u.ID.String(),
		Name:  u.Name,
		Login: u.Login,
	}
}
