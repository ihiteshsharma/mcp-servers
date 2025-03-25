#!/bin/bash
# Script to run tests with coverage reporting

# Set terminal colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Figma MCP Server Test Runner ===${NC}"
echo -e "${YELLOW}Running tests with coverage...${NC}"

# Create directories if they don't exist
mkdir -p ./coverage

# Run the tests with coverage
NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

# Check if tests passed
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  
  # Display coverage report summary
  echo -e "${BLUE}=== Coverage Report ===${NC}"
  
  # Extract coverage summary from coverage/coverage-summary.json if it exists
  if [ -f ./coverage/coverage-summary.json ]; then
    TOTAL_LINES=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*' ./coverage/coverage-summary.json | grep -o 'total":[0-9]*' | cut -d':' -f2)
    COVERED_LINES=$(grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*' ./coverage/coverage-summary.json | grep -o 'covered":[0-9]*' | cut -d':' -f2)
    
    if [ -n "$TOTAL_LINES" ] && [ -n "$COVERED_LINES" ] && [ "$TOTAL_LINES" -gt 0 ]; then
      COVERAGE=$((COVERED_LINES * 100 / TOTAL_LINES))
      echo -e "Line coverage: ${YELLOW}${COVERAGE}%${NC} (${COVERED_LINES}/${TOTAL_LINES})"
    else
      echo -e "${RED}Could not calculate coverage percentage.${NC}"
    fi
  else
    echo -e "${RED}Coverage report not found.${NC}"
  fi
  
  echo -e "${GREEN}✓ Test run completed successfully!${NC}"
  echo -e "${YELLOW}See ./coverage/lcov-report/index.html for detailed report${NC}"
else
  echo -e "${RED}✗ Tests failed!${NC}"
  exit 1
fi 