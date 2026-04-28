/**
 * ACCESSIBILITY AUDIT SCRIPT
 * 
 * This script checks for common accessibility issues in the codebase
 * Run: node accessibility-audit.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const issues = {
  critical: [],
  warning: [],
  good: [],
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, content) {
  const fileName = path.basename(filePath);
  
  // Check for images without alt text
  const imgWithoutAlt = content.match(/<img(?![^>]*alt=)/g);
  if (imgWithoutAlt) {
    issues.critical.push({
      file: filePath,
      issue: `${imgWithoutAlt.length} image(s) without alt text`,
      line: 'Multiple',
    });
  }

  // Check for buttons without aria-label (for icon-only buttons)
  const iconButtonPattern = /<button[^>]*>[\s\n]*<[^>]+(Icon|svg)[^>]*>[\s\n]*<\/button>/gi;
  const iconButtons = content.match(iconButtonPattern);
  if (iconButtons) {
    iconButtons.forEach((btn) => {
      if (!btn.includes('aria-label') && !btn.includes('title')) {
        issues.warning.push({
          file: filePath,
          issue: 'Icon-only button without aria-label',
          snippet: btn.substring(0, 60) + '...',
        });
      }
    });
  }

  // Check for inputs without labels
  const inputWithoutLabel = content.match(/<input(?![^>]*id=)/g);
  if (inputWithoutLabel) {
    issues.warning.push({
      file: filePath,
      issue: `${inputWithoutLabel.length} input(s) without id (cannot be labeled)`,
      line: 'Multiple',
    });
  }

  // Check for good practices
  if (content.includes('aria-label')) {
    issues.good.push({
      file: filePath,
      practice: 'Uses aria-label for accessibility',
    });
  }

  if (content.includes('htmlFor') || content.includes('for=')) {
    issues.good.push({
      file: filePath,
      practice: 'Uses proper label associations',
    });
  }

  if (content.includes('role=')) {
    issues.good.push({
      file: filePath,
      practice: 'Uses ARIA roles',
    });
  }

  // Check for focus management
  if (content.includes('autoFocus')) {
    issues.good.push({
      file: filePath,
      practice: 'Manages focus on page load',
    });
  }

  // Check for semantic HTML
  const semanticTags = ['<nav', '<main', '<header', '<footer', '<article', '<section'];
  semanticTags.forEach((tag) => {
    if (content.includes(tag)) {
      issues.good.push({
        file: filePath,
        practice: `Uses semantic HTML: ${tag}>`,
      });
    }
  });
}

function scanDirectory(dir, extensions = ['.tsx', '.jsx', '.ts', '.js']) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        scanDirectory(filePath, extensions);
      }
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      const content = fs.readFileSync(filePath, 'utf-8');
      checkFile(filePath, content);
    }
  });
}

// Color Contrast Checker
function checkColorContrast() {
  log('\n📊 COLOR CONTRAST ANALYSIS', 'cyan');
  log('=' .repeat(70), 'cyan');

  const globalsCssPath = path.join(__dirname, 'apps', 'frontend', 'src', 'app', 'globals.css');
  
  if (fs.existsSync(globalsCssPath)) {
    const content = fs.readFileSync(globalsCssPath, 'utf-8');
    
    // Extract color values
    const colors = {
      primary: content.match(/--primary: ([\d.]+) ([\d.]+%) ([\d.]+%)/)?.[0],
      foreground: content.match(/--foreground: ([\d.]+) ([\d.]+%) ([\d.]+%)/)?.[0],
      background: content.match(/--background: ([\d.]+) ([\d.]+%) ([\d.]+%)/)?.[0],
      muted: content.match(/--muted-foreground: ([\d.]+) ([\d.]+%) ([\d.]+%)/)?.[0],
    };

    log('\n  Current Color Scheme:', 'white');
    log(`    ${colors.primary || 'primary not found'}`, 'blue');
    log(`    ${colors.foreground || 'foreground not found'}`, 'white');
    log(`    ${colors.background || 'background not found'}`, 'white');
    log(`    ${colors.muted || 'muted not found'}`, 'yellow');

    log('\n  ✅ WCAG AA Standard: Contrast ratio 4.5:1 for normal text', 'green');
    log('  ✅ WCAG AAA Standard: Contrast ratio 7:1 for normal text', 'green');
    log('\n  ⚠️  Manual testing recommended with tools like:', 'yellow');
    log('     - WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)', 'white');
    log('     - Chrome DevTools Lighthouse', 'white');
  }
}

// Keyboard Navigation Checklist
function printKeyboardChecklist() {
  log('\n⌨️  KEYBOARD NAVIGATION CHECKLIST', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const checklist = [
    'Can navigate entire application using Tab key',
    'Can activate buttons/links using Enter or Space',
    'Can close dialogs using Escape key',
    'Focus indicators are visible and clear',
    'Tab order follows logical reading order',
    'No keyboard traps (can always move focus away)',
    'Skip to main content link available',
    'Custom components handle keyboard events',
  ];

  checklist.forEach((item, index) => {
    log(`  [ ] ${index + 1}. ${item}`, 'yellow');
  });
}

// Screen Reader Checklist
function printScreenReaderChecklist() {
  log('\n🔊 SCREEN READER CHECKLIST', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const checklist = [
    'All images have descriptive alt text',
    'Form inputs have associated labels',
    'Error messages are announced',
    'Loading states are announced',
    'Dynamic content changes are announced (aria-live)',
    'Landmark regions are properly defined',
    'Heading hierarchy is logical (h1 → h2 → h3)',
    'Links have descriptive text (not just "click here")',
    'Icon-only buttons have aria-label',
    'Complex widgets use appropriate ARIA roles',
  ];

  checklist.forEach((item, index) => {
    log(`  [ ] ${index + 1}. ${item}`, 'yellow');
  });
}

// Responsive Design Checklist
function printResponsiveChecklist() {
  log('\n📱 RESPONSIVE DESIGN CHECKLIST', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  const checklist = [
    'Test at 320px width (small mobile)',
    'Test at 768px width (tablet)',
    'Test at 1024px width (desktop)',
    'Test at 1920px width (large desktop)',
    'Touch targets are at least 44x44px',
    'Text is readable without zooming',
    'Horizontal scrolling not required',
    'Content reflows properly',
    'No content is cut off or hidden',
    'Forms are usable on mobile',
  ];

  checklist.forEach((item, index) => {
    log(`  [ ] ${index + 1}. ${item}`, 'yellow');
  });
}

// Main execution
async function runAudit() {
  log('\n' + '='.repeat(70), 'cyan');
  log('  🎯 ACCESSIBILITY AUDIT REPORT', 'cyan');
  log('  Date: ' + new Date().toLocaleDateString(), 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  // Scan frontend directory
  const frontendDir = path.join(__dirname, 'apps', 'frontend', 'src');
  
  if (fs.existsSync(frontendDir)) {
    log('🔍 Scanning frontend directory...', 'blue');
    scanDirectory(frontendDir);
  }

  // Print results
  log('\n🚨 CRITICAL ISSUES', 'red');
  log('=' .repeat(70), 'red');
  if (issues.critical.length === 0) {
    log('  ✅ No critical issues found!', 'green');
  } else {
    issues.critical.forEach((issue, index) => {
      log(`\n  ${index + 1}. ${issue.file}`, 'white');
      log(`     Issue: ${issue.issue}`, 'red');
      if (issue.snippet) log(`     Snippet: ${issue.snippet}`, 'white');
    });
  }

  log('\n⚠️  WARNINGS', 'yellow');
  log('=' .repeat(70), 'yellow');
  if (issues.warning.length === 0) {
    log('  ✅ No warnings found!', 'green');
  } else {
    // Show only first 10 warnings to avoid clutter
    const warningsToShow = issues.warning.slice(0, 10);
    warningsToShow.forEach((issue, index) => {
      log(`\n  ${index + 1}. ${path.basename(issue.file)}`, 'white');
      log(`     Issue: ${issue.issue}`, 'yellow');
      if (issue.snippet) log(`     Snippet: ${issue.snippet}`, 'white');
    });
    
    if (issues.warning.length > 10) {
      log(`\n  ... and ${issues.warning.length - 10} more warnings`, 'yellow');
    }
  }

  log('\n✅ GOOD PRACTICES FOUND', 'green');
  log('=' .repeat(70), 'green');
  
  // Count unique good practices
  const practiceCount = {};
  issues.good.forEach((item) => {
    practiceCount[item.practice] = (practiceCount[item.practice] || 0) + 1;
  });

  Object.entries(practiceCount).forEach(([practice, count]) => {
    log(`  ✓ ${practice} (${count} files)`, 'green');
  });

  // Additional checks
  checkColorContrast();
  printKeyboardChecklist();
  printScreenReaderChecklist();
  printResponsiveChecklist();

  // Summary
  log('\n' + '='.repeat(70), 'cyan');
  log('  📊 AUDIT SUMMARY', 'cyan');
  log('=' .repeat(70), 'cyan');
  log(`  Critical Issues: ${issues.critical.length}`, issues.critical.length > 0 ? 'red' : 'green');
  log(`  Warnings: ${issues.warning.length}`, issues.warning.length > 0 ? 'yellow' : 'green');
  log(`  Good Practices: ${Object.keys(practiceCount).length} types found`, 'green');
  
  log('\n  🎯 NEXT STEPS:', 'cyan');
  log('  1. Fix all critical issues', 'white');
  log('  2. Review and fix warnings', 'white');
  log('  3. Complete manual checklists', 'white');
  log('  4. Test with real assistive technologies', 'white');
  log('  5. Run Lighthouse audit in Chrome DevTools', 'white');
  
  log('\n  📚 Resources:', 'cyan');
  log('  - WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/', 'white');
  log('  - WebAIM: https://webaim.org/', 'white');
  log('  - a11y Project: https://www.a11yproject.com/', 'white');
  
  log('\n' + '='.repeat(70) + '\n', 'cyan');
}

// Run the audit
runAudit().catch((error) => {
  console.error('Error running audit:', error);
  process.exit(1);
});
