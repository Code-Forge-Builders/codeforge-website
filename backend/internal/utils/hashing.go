package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
)

type IPHasher interface {
	Hash(ip string) string
}

type ipHasher struct {
	salt []byte
}

func NewIPHasher(salt string) IPHasher {
	return &ipHasher{
		salt: []byte(salt),
	}
}

func (h *ipHasher) Hash(ip string) string {
	mac := hmac.New(sha256.New, h.salt)
	mac.Write([]byte(ip))
	return hex.EncodeToString(mac.Sum(nil))
}
