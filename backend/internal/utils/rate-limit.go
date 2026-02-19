package utils

import (
	"sync"
	"time"
)

const (
	BaseDelay              = 1 * time.Second
	MaxConsecutiveRequests = 20
	MaxDelay               = 5 * time.Minute
)

type PerIpState struct {
	ConsecutiveCount int
	LastRequestAt    time.Time
}

type RateLimiter struct {
	mu     sync.Mutex
	states map[string]PerIpState
}

func NewRateLimiter() *RateLimiter {
	return &RateLimiter{
		states: make(map[string]PerIpState),
	}
}

func (r *RateLimiter) DelayAccordinglyToIp(ip string) {
	r.mu.Lock()

	state, exists := r.states[ip]
	if !exists {
		state = PerIpState{ConsecutiveCount: 1, LastRequestAt: time.Now()}
		r.states[ip] = state
	}

	now := time.Now()
	timeSinceLastRequest := now.Sub(state.LastRequestAt)

	const resetThreshold = 10 * time.Minute // Reset the counter after 10 minutes, to avoid DOS attacks

	if timeSinceLastRequest < resetThreshold {
		state.ConsecutiveCount++
	} else {
		state.ConsecutiveCount = 1
	}

	state.LastRequestAt = now
	delay := BaseDelay * (1 << (state.ConsecutiveCount - 1)) // Exponential backoff strategy for consecutive requests

	if delay > MaxDelay {
		delay = MaxDelay
	}

	r.states[ip] = state

	r.mu.Unlock()

	time.Sleep(delay)
}

func (r *RateLimiter) TooManyRequests(ip string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	state, exists := r.states[ip]
	if !exists {
		return false
	}

	return state.ConsecutiveCount > MaxConsecutiveRequests-1 // -1 because it is before the counter is incremented
}
