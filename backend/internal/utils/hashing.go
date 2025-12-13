package utils

import (
	"codeforge/website-prospecting-api/internal/config"
	"crypto/sha256"
	"encoding/hex"
)

func HashIpUnrecoverable(input string) string {
	cfg, _ := config.Load()

	salt := cfg.IpHashSalt

	firstHash := sha256.Sum256([]byte(salt + input))

	secondHash := sha256.Sum256([]byte(salt + hex.EncodeToString(firstHash[:])))

	return hex.EncodeToString(secondHash[:])
}
