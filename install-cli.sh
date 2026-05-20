#!/bin/bash
# Zio-Booster CLI Installation Script (Linux/macOS)
# This script installs the Zio-Booster CLI tool for terminal usage without Git

echo "============================================================"
echo "  Zio-Booster CLI Installer"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not found in PATH."
    echo "Please install Python 3.7 or higher."
    exit 1
fi

echo "✓ Python detected"
python3 --version
echo ""

# Determine installation directory
if [ "$(uname)" == "Darwin" ]; then
    INSTALL_DIR="$HOME/Library/Zio-Booster"
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    INSTALL_DIR="$HOME/.local/share/zio-booster"
else
    echo "Unsupported operating system"
    exit 1
fi

# Create installation directory
if [ ! -d "$INSTALL_DIR" ]; then
    echo "Creating installation directory..."
    mkdir -p "$INSTALL_DIR"
fi

echo "Installing to: $INSTALL_DIR"
echo ""

# Install required packages
echo "Installing required packages..."
pip3 install psutil
echo ""

# Copy CLI script to installation directory
echo "Copying CLI files..."
cp -f zio-booster-cli.py "$INSTALL_DIR/zio-booster-cli.py"
cp -f requirements.txt "$INSTALL_DIR/requirements.txt"
echo ""

# Create wrapper script
echo "Creating command wrapper..."
cat > "$INSTALL_DIR/zio-booster" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$SCRIPT_DIR/zio-booster-cli.py" "$@"
EOF

chmod +x "$INSTALL_DIR/zio-booster"

# Add to PATH
echo ""
echo "Adding Zio-Booster to PATH..."

# Detect shell
if [ -n "$BASH_VERSION" ]; then
    PROFILE="$HOME/.bashrc"
elif [ -n "$ZSH_VERSION" ]; then
    PROFILE="$HOME/.zshrc"
else
    PROFILE="$HOME/.profile"
fi

# Add to PATH if not already present
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    echo "" >> "$PROFILE"
    echo "# Zio-Booster CLI" >> "$PROFILE"
    echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$PROFILE"
    echo "Added PATH export to $PROFILE"
    echo ""
    echo "NOTE: Please restart your terminal or run: source $PROFILE"
fi

echo ""
echo "============================================================"
echo "  Installation Complete!"
echo "============================================================"
echo ""
echo "You can now use Zio-Booster CLI from any terminal:"
echo "  zio-booster boost      - Start optimization"
echo "  zio-booster status     - Check system status"
echo "  zio-booster monitor    - Real-time monitoring"
echo "  zio-booster optimize   - Manual optimization"
echo "  zio-booster --help     - Show all commands"
echo ""
