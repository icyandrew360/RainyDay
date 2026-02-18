#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/RainyApp"

log() {
  printf '[setup] %s\n' "$1"
}

fail() {
  printf '[setup] ERROR: %s\n' "$1" >&2
  exit 1
}

ensure_apt_available() {
  if ! command -v apt-get >/dev/null 2>&1; then
    fail "This script currently supports Debian/Ubuntu-style systems with apt-get."
  fi
}

install_base_packages() {
  log "Installing base system packages..."
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg build-essential git
}

install_or_update_node() {
  local need_node_install=true

  if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    local node_major
    node_major="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
    if [[ "$node_major" -ge 20 ]]; then
      need_node_install=false
      log "Detected Node.js $(node -v) and npm $(npm -v)."
    fi
  fi

  if [[ "$need_node_install" == true ]]; then
    log "Installing Node.js 22.x from NodeSource..."
    sudo install -d -m 0755 /etc/apt/keyrings
    if [[ ! -f /etc/apt/keyrings/nodesource.gpg ]]; then
      curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    fi

    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
      | sudo tee /etc/apt/sources.list.d/nodesource.list >/dev/null

    sudo apt-get update
    sudo apt-get install -y nodejs
    log "Installed Node.js $(node -v) and npm $(npm -v)."
  fi
}

install_project_dependencies() {
  if [[ -f "$ROOT_DIR/package-lock.json" ]]; then
    log "Installing root-level dependencies..."
    (cd "$ROOT_DIR" && npm ci)
  fi

  if [[ ! -f "$APP_DIR/package-lock.json" ]]; then
    fail "Missing $APP_DIR/package-lock.json"
  fi

  log "Installing RainyApp dependencies..."
  (cd "$APP_DIR" && npm ci)
}

verify_build() {
  log "Running production build to verify setup..."
  (cd "$APP_DIR" && npm run build)
}

main() {
  ensure_apt_available
  install_base_packages
  install_or_update_node
  install_project_dependencies
  verify_build
  log "Setup complete. Start dev server with: cd RainyApp && npm run dev -- --host"
}

main "$@"
