package auth

import (
	"errors"
	"testing"
	"time"

	"codeforge/website-prospecting-api/internal/user"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type fakeUserService struct {
	createdUser  *user.User
	findUser     *user.User
	findByIdUser *user.User
	createErr    error
	findErr      error
	count        int64
}

func (f *fakeUserService) Create(dto user.CreateUserDto) (*user.User, error) {
	if f.createErr != nil {
		return nil, f.createErr
	}
	return f.createdUser, nil
}

func (f *fakeUserService) FindByLogin(login string) (*user.User, error) {
	if f.findErr != nil {
		return nil, f.findErr
	}
	return f.findUser, nil
}

func (f *fakeUserService) FindById(id string) (*user.User, error) {
	if f.findErr != nil {
		return nil, f.findErr
	}
	return f.findByIdUser, nil
}

func (f *fakeUserService) GetCount() int64 {
	return f.count
}

func newTestAuthService(us user.UserService, secret []byte) AuthService {
	return &authService{
		userService: us,
		secret:      secret,
		tokenTTL:    time.Hour,
	}
}

func TestAuthService_Register_Success(t *testing.T) {
	u := &user.User{
		ID:    uuid.New(),
		Name:  "John Doe",
		Login: "john",
	}

	us := &fakeUserService{
		createdUser: u,
	}

	svc := newTestAuthService(us, []byte("test-secret"))

	input := user.CreateUserDto{
		Name:            "John Doe",
		Login:           "john",
		Password:        "secret",
		ConfirmPassword: "secret",
	}

	result, err := svc.Register(input)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result.ID != u.ID {
		t.Fatalf("expected user ID %q, got %q", u.ID, result.ID)
	}

	if result.Name != u.Name {
		t.Fatalf("expected user name %q, got %q", u.Name, result.Name)
	}

	if result.Login != u.Login {
		t.Fatalf("expected user login %q, got %q", u.Login, result.Login)
	}
}

func TestAuthService_Login_Success(t *testing.T) {
	password := "secret"
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("failed to generate password hash: %v", err)
	}

	u := &user.User{
		ID:           uuid.New(),
		Name:         "Jane Doe",
		Login:        "jane",
		PasswordHash: string(hash),
	}

	us := &fakeUserService{
		findUser: u,
	}

	svc := newTestAuthService(us, []byte("test-secret"))

	result, err := svc.Login(LoginDto{
		Login:    "jane",
		Password: password,
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if result.Token == "" {
		t.Fatalf("expected token to be generated")
	}

	if result.User.Login != u.Login {
		t.Fatalf("expected login %q, got %q", u.Login, result.User.Login)
	}
}

func TestAuthService_Login_InvalidPassword(t *testing.T) {
	password := "secret"
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("failed to generate password hash: %v", err)
	}

	u := &user.User{
		ID:           uuid.New(),
		Name:         "Jane Doe",
		Login:        "jane",
		PasswordHash: string(hash),
	}

	us := &fakeUserService{
		findUser: u,
	}

	svc := newTestAuthService(us, []byte("test-secret"))

	_, err = svc.Login(LoginDto{
		Login:    "jane",
		Password: "wrong",
	})
	if !errors.Is(err, ErrInvalidCredentials) {
		t.Fatalf("expected ErrInvalidCredentials, got %v", err)
	}
}

func TestAuthService_Login_UserNotFound(t *testing.T) {
	us := &fakeUserService{
		findErr: errors.New("not found"),
	}

	svc := newTestAuthService(us, []byte("test-secret"))

	_, err := svc.Login(LoginDto{
		Login:    "missing",
		Password: "any",
	})
	if !errors.Is(err, ErrInvalidCredentials) {
		t.Fatalf("expected ErrInvalidCredentials when user is not found, got %v", err)
	}
}

func TestAuthService_Login_TokenGenerationError(t *testing.T) {
	us := &fakeUserService{
		findUser: &user.User{
			ID: uuid.New(),
		},
	}

	svc := newTestAuthService(us, []byte(""))

	_, err := svc.Login(LoginDto{
		Login:    "any",
		Password: "any",
	})
	if err == nil {
		t.Fatalf("expected an error, got nil")
	}
}
func TestAuthService_CheckInitialSetup_True(t *testing.T) {
	us := &fakeUserService{
		count: 10,
	}

	svc := newTestAuthService(us, []byte("test-secret"))

	result := svc.CheckInitialSetup()
	if !result {
		t.Fatalf("expected true, got false")
	}
}

func TestAuthService_CheckInitialSetup_False(t *testing.T) {
	us := &fakeUserService{
		count: 0,
	}

	svc := newTestAuthService(us, []byte("test-secret"))

	result := svc.CheckInitialSetup()
	if result {
		t.Fatalf("expected false, got true")
	}
}
