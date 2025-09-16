# Use full Go base image (Debian-based, includes everything)
FROM golang:1.24.4

# Set working directory
WORKDIR /app

# Copy Go modules first for caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build your worker (worker.go is entrypoint)
RUN go build -o worker-bin ./worker/worker.go

# Run worker
CMD ["./worker-bin"]
