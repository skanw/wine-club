#!/bin/bash

# ============================================
# VinClub Development Environment Setup Script
# ============================================
# This script sets up the development environment on a new machine

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
check_node_version() {
    print_header "Checking Node.js Installation"
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        print_info "Please install Node.js v20 LTS or higher from https://nodejs.org/"
        print_info "Or use nvm: nvm install 20 && nvm use 20"
        return 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_warning "Node.js version is less than v20. Recommended: v20 LTS"
        print_info "Current version: $(node -v)"
        print_info "Consider upgrading: nvm install 20 && nvm use 20"
    else
        print_success "Node.js $(node -v) is installed"
    fi
}

# Check npm
check_npm() {
    if ! command_exists npm; then
        print_error "npm is not installed"
        return 1
    fi
    print_success "npm $(npm -v) is installed"
}

# Check Docker
check_docker() {
    print_header "Checking Docker Installation"
    
    if ! command_exists docker; then
        print_error "Docker is not installed"
        print_info "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
        print_info "Make sure Docker Desktop is running before proceeding"
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_warning "Docker is installed but not running"
        print_info "Please start Docker Desktop and run this script again"
        return 1
    fi
    
    print_success "Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) is installed and running"
}

# Check Wasp CLI
check_wasp() {
    print_header "Checking Wasp CLI Installation"
    
    if ! command_exists wasp; then
        print_error "Wasp CLI is not installed"
        print_info "Installing Wasp CLI..."
        
        # Install Wasp CLI
        curl -sSL https://get.wasp-lang.dev/installer.sh | sh
        
        # Source wasp in current shell
        if [ -f ~/.wasp/bin/wasp ]; then
            export PATH="$HOME/.wasp/bin:$PATH"
            print_success "Wasp CLI installed successfully"
        else
            print_error "Failed to install Wasp CLI"
            print_info "Please install manually: curl -sSL https://get.wasp-lang.dev/installer.sh | sh"
            print_info "Then add to your PATH: export PATH=\"\$HOME/.wasp/bin:\$PATH\""
            return 1
        fi
    else
        WASP_VERSION=$(wasp version 2>/dev/null | head -n1 || echo "unknown")
        print_success "Wasp CLI is installed: $WASP_VERSION"
    fi
    
    # Verify Wasp version
    WASP_VER=$(wasp version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1 || echo "")
    if [ -n "$WASP_VER" ]; then
        MAJOR=$(echo "$WASP_VER" | cut -d'.' -f1)
        MINOR=$(echo "$WASP_VER" | cut -d'.' -f2)
        if [ "$MAJOR" -eq 0 ] && [ "$MINOR" -lt 18 ]; then
            print_warning "Wasp version $WASP_VER is less than 0.18.0"
            print_info "Consider upgrading: wasp upgrade"
        fi
    fi
}

# Setup environment variables
setup_env_file() {
    print_header "Setting Up Environment Variables"
    
    APP_DIR="vinclub/app"
    ENV_EXAMPLE="$APP_DIR/.env.example"
    ENV_FILE="$APP_DIR/.env.server"
    
    if [ ! -f "$ENV_EXAMPLE" ]; then
        print_error ".env.example file not found at $ENV_EXAMPLE"
        return 1
    fi
    
    if [ -f "$ENV_FILE" ]; then
        print_warning ".env.server already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Skipping environment file setup"
            return 0
        fi
    fi
    
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    print_success "Created .env.server from .env.example"
    
    # Generate JWT_SECRET if not set
    if grep -q "JWT_SECRET=your-secret-key-here" "$ENV_FILE"; then
        print_info "Generating JWT_SECRET..."
        JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
        
        # Update JWT_SECRET in .env.server (works on both macOS and Linux)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|JWT_SECRET=your-secret-key-here-minimum-32-characters-long|JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|JWT_SECRET=your-secret-key-here-minimum-32-characters-long|JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
        fi
        print_success "Generated and set JWT_SECRET"
    fi
    
    print_warning "Please review and update .env.server with your configuration"
    print_info "Location: $ENV_FILE"
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    APP_DIR="vinclub/app"
    
    if [ ! -f "$APP_DIR/package.json" ]; then
        print_error "package.json not found at $APP_DIR/package.json"
        return 1
    fi
    
    print_info "Installing npm dependencies for main app..."
    cd "$APP_DIR"
    npm install
    cd - > /dev/null
    print_success "Main app dependencies installed"
    
    # Install blog dependencies if it exists
    if [ -f "vinclub/blog/package.json" ]; then
        print_info "Installing npm dependencies for blog..."
        cd vinclub/blog
        npm install
        cd - > /dev/null
        print_success "Blog dependencies installed"
    fi
    
    # Install e2e test dependencies if it exists
    if [ -f "vinclub/e2e-tests/package.json" ]; then
        print_info "Installing npm dependencies for e2e tests..."
        cd vinclub/e2e-tests
        npm install
        cd - > /dev/null
        print_success "E2E test dependencies installed"
    fi
}

# Main setup function
main() {
    print_header "VinClub Development Environment Setup"
    
    print_info "This script will set up your development environment"
    print_info "Make sure you're in the project root directory"
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "vinclub/app/main.wasp" ]; then
        print_error "main.wasp not found. Are you in the project root?"
        print_info "Please cd to the project root and run this script again"
        exit 1
    fi
    
    # Run checks
    check_node_version || exit 1
    check_npm || exit 1
    check_docker || exit 1
    check_wasp || exit 1
    
    # Setup environment
    setup_env_file
    
    # Install dependencies
    install_dependencies
    
    print_header "Setup Complete! 🎉"
    
    echo ""
    print_success "All prerequisites are installed and configured"
    echo ""
    print_info "Next steps:"
    echo "  1. Review and update vinclub/app/.env.server with your configuration"
    echo "  2. Start the database: cd vinclub/app && wasp start db"
    echo "  3. Run migrations: wasp db migrate-dev"
    echo "  4. (Optional) Seed database: wasp db seed"
    echo "  5. Start the app: wasp start"
    echo ""
    print_info "For more details, see: vinclub/app/README.md"
    echo ""
}

# Run main function
main

