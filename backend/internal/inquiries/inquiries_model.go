package inquiries

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type State int16
type Event int16

const (
	EventStartContact Event = iota
	EventContacted
	EventContactFailed
	EventRetryContact
	EventScheduleMeeting
	EventStartDiscovery
	EventStartImplementation
	EventCancelInquiry
	EventFinishInquiry
)

const (
	StateOpen State = iota
	StateAttemptingContact
	StateContactEstablished
	StateContactFailed
	StateScheduledMeeting
	StateDiscovery
	StateInProgress
	StateCancelled
	StateResolved
)

// ToString returns the persisted form of the state (lowercase snake_case).
func (s State) ToString() string {
	switch s {
	case StateOpen:
		return "open"
	case StateAttemptingContact:
		return "attempting_contact"
	case StateContactEstablished:
		return "contact_established"
	case StateContactFailed:
		return "contact_failed"
	case StateScheduledMeeting:
		return "scheduled_meeting"
	case StateDiscovery:
		return "discovery"
	case StateInProgress:
		return "in_progress"
	case StateResolved:
		return "resolved"
	case StateCancelled:
		return "cancelled"
	default:
		return "open"
	}
}

func parseStateString(v string) (State, error) {
	switch v {
	case "open":
		return StateOpen, nil
	case "attempting_contact":
		return StateAttemptingContact, nil
	case "contact_established":
		return StateContactEstablished, nil
	case "contact_failed":
		return StateContactFailed, nil
	case "scheduled_meeting":
		return StateScheduledMeeting, nil
	case "discovery":
		return StateDiscovery, nil
	case "in_progress":
		return StateInProgress, nil
	case "resolved":
		return StateResolved, nil
	case "cancelled":
		return StateCancelled, nil
	default:
		return StateOpen, fmt.Errorf("unknown inquiry state: %q", v)
	}
}

func (s State) Value() (driver.Value, error) {
	return s.ToString(), nil
}

func (s *State) Scan(value interface{}) error {
	if value == nil {
		*s = StateOpen
		return nil
	}
	var str string
	switch v := value.(type) {
	case string:
		str = v
	case []byte:
		str = string(v)
	default:
		return fmt.Errorf("cannot scan %T into State", value)
	}
	parsed, err := parseStateString(str)
	if err != nil {
		return err
	}
	*s = parsed
	return nil
}

var Transitions = map[State]map[Event]State{
	StateOpen: {
		EventStartContact: StateAttemptingContact,
	},
	StateAttemptingContact: {
		EventContactEstablished: StateContactEstablished,
		EventContactFailed: StateContactFailed,
	},
	StateContactEstablished: {
		EventScheduleMeeting: StateScheduledMeeting,
		EventCancelInquiry: StateCancelled,
	},
	StateScheduledMeeting: {
		EventStartDiscovery: StateDiscovery,
		EventCancelInquiry: StateCancelled,
	},
	StateContactFailed: {
		EventRetryContact: StateAttemptingContact,
		EventCancelInquiry: StateCancelled,
	},
	StateDiscovery: {
		EventStartImplementation: StateInProgress,
		EventCancelInquiry: StateCancelled,
	},
	StateInProgress: {
		EventCancelInquiry: StateCancelled,
		EventFinishInquiry: StateResolved,
	},
}

type Inquiries struct {
	ID                 uuid.UUID `json:"id" gorm:"type:uuid;primaryKey;"`
	CustomerName       string    `json:"customer_name" gorm:"size:255;not null;"`
	CustomerEmail      string    `json:"customer_email" gorm:"size:255;not null;"`
	CustomerPhone      string    `json:"customer_phone" gorm:"size:18;not null;"`
	ServiceKey         string    `json:"service_key" gorm:"size:50;not null;"`
	ProjectDescription string    `json:"project_description" gorm:"type:text"`
	State              State     `json:"state" gorm:"type:varchar(50);not null;default:'open'"`
	Searchable         string    `json:"" gorm:"type:text;->"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

func (i *Inquiries) BeforeCreate(tx *gorm.DB) error {
	if i.ID == uuid.Nil {
		newIdV7, _ := uuid.NewV7()
		i.ID = newIdV7
	}
	return nil
}

func (i *Inquiries) CanTransition(event Event) bool {
	currentState := i.State
	nextState, ok := Transitions[currentState][event]
	return ok && nextState != currentState
}
