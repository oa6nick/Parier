#!/bin/bash

# Generate Swagger Documentation Script
# This script regenerates Swagger docs after API changes

set -e

echo "🔄 Generating updated Swagger documentation..."

# Check if swag is installed
if ! command -v swag &> /dev/null; then
    echo "📦 Installing swag..."
    go install github.com/swaggo/swag/cmd/swag@latest
fi

# Navigate to server directory
cd "$(dirname "$0")/.."

# Clean old documentation
echo "🧹 Cleaning old documentation..."
rm -rf docs/

# Generate new documentation
echo "📚 Generating Swagger documentation..."
swag init -g cmd/main.go -o docs --parseDependency --parseInternal

# Check if generation was successful
if [ -d "docs" ] && [ -f "docs/swagger.json" ]; then
    echo "✅ Swagger documentation generated successfully!"
    echo "📂 Documentation files:"
    ls -la docs/
    
    echo ""
    echo "🌐 Access documentation at:"
    echo "   - Swagger UI: http://localhost:8080/swagger/index.html"
    echo "   - JSON: http://localhost:8080/swagger/doc.json"
    echo ""
    
    # Show some stats
    echo "📊 Documentation stats:"
    echo "   - Endpoints: $(jq '.paths | length' docs/swagger.json)"
    echo "   - Schemas: $(jq '.components.schemas | length' docs/swagger.json)"
    echo ""
    
    echo "🔧 Next steps:"
    echo "   1. Start the server: go run cmd/main.go"
    echo "   2. Open Swagger UI in browser"
    echo "   3. Test the new JSON body endpoints"
    echo ""
    
else
    echo "❌ Failed to generate Swagger documentation!"
    echo "🔍 Check for syntax errors in handlers and models"
    exit 1
fi

echo "✨ Documentation generation complete!" 