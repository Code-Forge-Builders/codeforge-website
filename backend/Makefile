GOCMD := go
AIRCMD := air
BINARY_NAME := cfapi
BIN_FOLDER := ./bin
COVERAGE_OUTPUT := coverage.out
COVERAGE_MINIMUM_THRESHOLD := 50

.PHONY: all
all: test build

.PHONY: dev
dev:
	$(AIRCMD) main.go || $(GOCMD) run main.go

.PHONY: build
build:
	$(GOCMD) build -o $(BIN_FOLDER)/$(BINARY_NAME) main.go

test:
	$(GOCMD) test ./...

test-cov:
	$(GOCMD) test -cover ./... -coverprofile=$(COVERAGE_OUTPUT) && ./coverage-check.sh $(COVERAGE_OUTPUT) $(COVERAGE_MINIMUM_THRESHOLD)
