GOCMD := go
AIRCMD := air
BINARY_NAME := cfapi
BIN_FOLDER := ./bin

.PHONY: all
all: test build

.PHONY: dev
dev:
	$(AIRCMD) main.go || $(GOCMD) run main.go

.PHONY: build
build:
	$(GOCMD) build -o $(BIN_FOLDER)/$(BINARY_NAME) main.go

test:
	$(GOCMD) test -cover -v ./...