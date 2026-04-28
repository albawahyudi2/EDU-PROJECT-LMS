# 📋 MANUAL ACCESSIBILITY TESTING GUIDE - DAY 11-12
**Application**: LMS ABK (Learning Management System)  
**Date**: March 12, 2026  
**Purpose**: Step-by-step guide for manual accessibility testing

---

## 🎯 Overview

This guide provides detailed instructions for manually testing the accessibility of the LMS ABK application. Each test includes:
- **What to test**
- **How to test**
- **Expected behavior**
- **How to record results**

**Estimated Time**: 3-4 hours for complete testing

---

## ⌨️ SECTION 1: Keyboard Navigation Testing (45 minutes)

### Test 1.1: Basic Tab Navigation
**Objective**: Verify all interactive elements can be reached using Tab key

**Steps**:
1. Open the application in a browser
2. Press Tab repeatedly
3. Note which elements receive focus

**Expected Behavior**:
- [ ] All buttons, links, and form fields receive focus
- [ ] Focus indicator (blue ring) is clearly visible
- [ ] Tab order follows logical reading order (top-to-bottom, left-to-right)
- [ ] No elements are skipped
- [ ] Hidden elements (like mobile menu when closed) are not in tab order

**Test on Pages**:
- [ ] Login page
- [ ] Dashboard (teacher view)
- [ ] Dashboard (student view)
- [ ] Dashboard (parent view)
- [ ] Assignments list
- [ ] Assignment detail
- [ ] Student detail page
- [ ] Classroom detail page

---

### Test 1.2: Reverse Tab Navigation
**Objective**: Verify Shift+Tab works correctly

**Steps**:
1. Navigate to end of page using Tab
2. Press Shift+Tab repeatedly
3. Verify focus moves backward through elements

**Expected Behavior**:
- [ ] Focus moves in reverse order
- [ ] All elements are reachable in reverse
- [ ] Focus indicator remains visible

---

### Test 1.3: Enter/Space Key Activation
**Objective**: Verify buttons and links can be activated with keyboard

**Steps**:
1. Tab to a button
2. Press Enter or Space key
3. Verify action occurs

**Expected Behavior**:
- [ ] Links activate with Enter key
- [ ] Buttons activate with Enter or Space key
- [ ] Form submission works with Enter key
- [ ] No page reload unless expected

**Test on**:
- [ ] Login button
- [ ] Navigation menu items
- [ ] Submit assignment button
- [ ] Delete/Edit buttons
- [ ] Modal open/close buttons

---

### Test 1.4: Escape Key
**Objective**: Verify modals and dropdowns close with Escape

**Steps**:
1. Open a modal dialog
2. Press Escape key
3. Verify modal closes

**Expected Behavior**:
- [ ] Modal dialogs close with Escape
- [ ] Dropdown menus close with Escape
- [ ] Focus returns to trigger element
- [ ] No keyboard traps

**Test on**:
- [ ] Confirm delete dialog
- [ ] Assignment submission modal
- [ ] User menu dropdown

---

### Test 1.5: Skip Navigation Link
**Objective**: Verify "Skip to main content" link works

**Steps**:
1. Load dashboard page
2. Press Tab once (focus should go to skip link)
3. Press Enter to activate
4. Verify focus moves to main content

**Expected Behavior**:
- [ ] Skip link appears on first Tab press
- [ ] Skip link is visually visible when focused
- [ ] Activating skip link moves focus to main content
- [ ] Main content area receives focus indicator

---

### Test 1.6: No Keyboard Traps
**Objective**: Ensure users can always navigate away from elements

**Steps**:
1. Navigate through entire application with keyboard only
2. Try to escape from each interactive component

**Expected Behavior**:
- [ ] Can always Tab away from any element
- [ ] Custom components don't trap focus
- [ ] File upload component is keyboard accessible
- [ ] Rich text editor (if any) is keyboard accessible

---

## 📱 SECTION 2: Responsive & Touch Testing (30 minutes)

### Test 2.1: Small Mobile (320px - iPhone SE)
**Objective**: Test at minimum mobile width

**Steps**:
1. Open DevTools (F12)
2. Set viewport to 320px width
3. Navigate through application

**Expected Behavior**:
- [ ] No horizontal scrolling
- [ ] All content visible
- [ ] Buttons are tappable (not overlapping)
- [ ] Text is readable without zooming
- [ ] Forms are usable
- [ ] Navigation menu works

**Screenshot locations**: Take screenshots of any issues

---

### Test 2.2: Standard Mobile (375px - iPhone)
**Steps**: Same as Test 2.1, but at 375px width

**Expected Behavior**: Same as Test 2.1

---

### Test 2.3: Tablet (768px - iPad)
**Steps**: Same as Test 2.1, but at 768px width

**Expected Behavior**:
- [ ] Layout adjusts appropriately
- [ ] Two-column layouts work if implemented
- [ ] Touch targets remain adequate
- [ ] Navigation switches to desktop mode if designed

---

### Test 2.4: Desktop (1024px & 1920px)
**Steps**: Test at both desktop widths

**Expected Behavior**:
- [ ] Sidebar remains visible
- [ ] Content is well-spaced
- [ ] No excessive whitespace
- [ ] Multi-column layouts display correctly

---

### Test 2.5: Touch Target Size
**Objective**: Verify all interactive elements meet minimum 44x44px size

**Steps**:
1. Use browser DevTools to inspect button sizes
2. Measure width and height
3. Test on actual touch device if available

**Expected Behavior**:
- [ ] All buttons are at least 44px tall
- [ ] Icon buttons are at least 44x44px
- [ ] Touch targets have adequate spacing (8px minimum)
- [ ] No overlapping touch targets

**Elements to check**:
- [ ] Login button: Should be 44px height ✅
- [ ] Navigation menu items
- [ ] Assignment list items
- [ ] Icon-only buttons (delete, edit, etc.)
- [ ] Close buttons on modals

---

### Test 2.6: Pinch to Zoom
**Objective**: Verify pinch-to-zoom is not disabled

**Steps**:
1. Open on mobile device or simulate in DevTools
2. Try pinch-to-zoom gesture
3. Verify content zooms

**Expected Behavior**:
- [ ] Pinch-to-zoom works
- [ ] Content reflows when zoomed
- [ ] No `user-scalable=no` in viewport meta tag

---

## 🖼️ SECTION 3: Visual & Color Testing (30 minutes)

### Test 3.1: Color Contrast Testing
**Objective**: Verify text meets WCAG AA contrast requirements (4.5:1)

**Tools Needed**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Color Picker

**Steps**:
1. Inspect text elements
2. Copy foreground and background colors
3. Test in WebAIM Contrast Checker
4. Record contrast ratio

**Elements to test**:
- [ ] Body text on white background
- [ ] Primary button text on blue background
- [ ] Muted text on white background
- [ ] Error text on white background
- [ ] Link text on white background
- [ ] Navigation text
- [ ] Placeholder text

**Expected Ratios**:
- Normal text (< 18pt): ≥ 4.5:1
- Large text (≥ 18pt or 14pt bold): ≥ 3:1
- UI components: ≥ 3:1

---

### Test 3.2: Color Blindness Simulation
**Objective**: Ensure information isn't conveyed by color alone

**Tools Needed**:
- Chrome extension: [Colorblindly](https://chrome.google.com/webstore/detail/colorblindly)

**Steps**:
1. Install Colorblindly extension
2. Test with different color blindness types:
   - Protanopia (red-blind)
   - Deuteranopia (green-blind)
   - Tritanopia (blue-blind)
   - Achromatopsia (complete color blindness)
3. Verify information is still understandable

**Expected Behavior**:
- [ ] Errors have icons in addition to red color
- [ ] Success messages have icons in addition to green color
- [ ] Form validation doesn't rely only on color
- [ ] Charts/graphs have patterns or labels
- [ ] Status indicators have text or icons

---

### Test 3.3: Focus Indicators
**Objective**: Verify focus indicators are clearly visible

**Steps**:
1. Tab through application
2. Observe focus indicator on each element
3. Test on different backgrounds

**Expected Behavior**:
- [ ] Focus indicator is visible on all interactive elements
- [ ] Focus indicator has sufficient contrast (3:1 minimum)
- [ ] Focus indicator is not hidden by other elements
- [ ] Custom components have focus indicators

---

### Test 3.4: Reduced Motion
**Objective**: Verify animations respect prefers-reduced-motion

**Steps**:
1. Open DevTools
2. Open Command Palette (Ctrl+Shift+P)
3. Type "Emulate CSS prefers-reduced-motion: reduce"
4. Enable reduced motion
5. Navigate through application

**Expected Behavior**:
- [ ] Animations are minimal or disabled
- [ ] Page transitions work without motion
- [ ] Loading spinners still function (simple rotation OK)
- [ ] No auto-playing videos or GIFs

---

## 🔊 SECTION 4: Screen Reader Testing (60 minutes)

### Prerequisites
**Windows Users**: Download [NVDA](https://www.nvaccess.org/download/) (free)  
**Mac Users**: Use built-in VoiceOver (Cmd+F5)  
**Linux Users**: Use Orca

---

### Test 4.1: Page Titles and Headings
**Objective**: Verify logical document structure

**Steps**:
1. Activate screen reader
2. Navigate page using heading shortcuts (H key in NVDA)
3. Listen to page title and all headings

**Expected Behavior**:
- [ ] Each page has unique, descriptive title
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skips)
- [ ] Only one h1 per page
- [ ] Headings accurately describe content

**Test on**:
- [ ] Login page
- [ ] Dashboard pages
- [ ] Assignment pages
- [ ] Student detail pages

---

### Test 4.2: Form Labels and Instructions
**Objective**: Verify all form fields are properly labeled

**Steps**:
1. Navigate to login page
2. Tab to email field
3. Listen to what screen reader announces
4. Repeat for all form fields

**Expected Behavior**:
- [ ] Field label is announced before input type
- [ ] Required fields are indicated
- [ ] Placeholder text is not used as sole label
- [ ] Instructions are announced
- [ ] Error messages are announced when validation fails

**Test Forms**:
- [ ] Login form
- [ ] Assignment submission form
- [ ] Grade entry form
- [ ] Note creation form

---

### Test 4.3: Error Messages
**Objective**: Verify errors are announced to screen readers

**Steps**:
1. Submit login form with invalid data
2. Listen for error announcement
3. Tab to field with error
4. Verify error is read

**Expected Behavior**:
- [ ] General error messages are announced immediately
- [ ] Field-specific errors are associated with fields
- [ ] Errors have role="alert" or aria-live="polite"
- [ ] Error text is clear and helpful

---

### Test 4.4: Buttons and Links
**Objective**: Verify all buttons/links have descriptive text

**Steps**:
1. Navigate through page using Tab
2. Listen to each button/link announcement
3. Verify purpose is clear

**Expected Behavior**:
- [ ] Button purpose is clear from label
- [ ] Links describe destination (not "click here")
- [ ] Icon-only buttons have aria-label
- [ ] Delete buttons indicate what will be deleted

**Examples of good labels**:
- ✅ "Delete assignment: Math Quiz"
- ✅ "Edit student: Budi Santoso"
- ❌ "Delete" (too vague)
- ❌ "Click here"

---

### Test 4.5: Dynamic Content
**Objective**: Verify dynamic content changes are announced

**Steps**:
1. Trigger loading state
2. Listen for announcement
3. Wait for content to load
4. Verify completion is announced

**Expected Behavior**:
- [ ] Loading states are announced
- [ ] Success messages are announced
- [ ] New content is announced (aria-live regions)
- [ ] Page updates don't disrupt reading

**Test scenarios**:
- [ ] Form submission
- [ ] Assignment grading
- [ ] Content filtering/sorting
- [ ] Pagination

---

### Test 4.6: Images
**Objective**: Verify images have appropriate alt text

**Steps**:
1. Navigate to pages with images
2. Listen to alt text announcements
3. Verify alt text is descriptive

**Expected Behavior**:
- [ ] Informative images have descriptive alt text
- [ ] Decorative images have empty alt="" or aria-hidden="true"
- [ ] Complex images have detailed descriptions
- [ ] Icons used alone have text alternatives

---

### Test 4.7: Landmark Regions
**Objective**: Verify page landmarks are properly defined

**Steps**:
1. Activate screen reader landmark navigation (D key in NVDA)
2. Navigate through landmarks
3. Verify all major regions are identified

**Expected Behavior**:
- [ ] Main content has `<main>` landmark
- [ ] Navigation has `<nav>` landmark
- [ ] Header has `<header>` landmark
- [ ] Footer has `<footer>` (if present)
- [ ] Search has `role="search"` (if present)

---

## 📝 SECTION 5: Content & Readability (30 minutes)

### Test 5.1: Text Readability
**Objective**: Verify text is appropriate for target audience

**Steps**:
1. Read all instructional text
2. Evaluate language complexity
3. Check for jargon

**Expected Behavior**:
- [ ] Language is simple and clear
- [ ] Sentences are short (< 20 words ideal)
- [ ] Active voice is used
- [ ] Technical terms are explained
- [ ] Age-appropriate for special needs children

**Check on**:
- [ ] Assignment instructions
- [ ] Error messages
- [ ] Help text
- [ ] Button labels

---

### Test 5.2: Consistent Terminology
**Objective**: Verify consistent language throughout app

**Steps**:
1. Note key terms used in different places
2. Check for inconsistencies

**Expected Behavior**:
- [ ] Same feature uses same term everywhere
- [ ] Icons have consistent meanings
- [ ] Actions use consistent verbs

---

### Test 5.3: Visual Hierarchy
**Objective**: Verify content has clear visual structure

**Steps**:
1. Scan pages with eyes partly closed
2. Identify what stands out
3. Verify importance matches hierarchy

**Expected Behavior**:
- [ ] Important content is visually prominent
- [ ] Related content is grouped together
- [ ] Adequate whitespace between sections
- [ ] Clear visual distinction between sections

---

## 🎯 SECTION 6: Special Needs Considerations (30 minutes)

### Test 6.1: Cognitive Load
**Objective**: Verify interface is not overwhelming

**Steps**:
1. Evaluate each page for complexity
2. Count number of choices presented at once

**Expected Behavior**:
- [ ] No more than 7±2 items per list/menu
- [ ] Complex tasks broken into steps
- [ ] Clear next action indicated
- [ ] Progress indicators for multi-step processes

---

### Test 6.2: Error Prevention & Recovery
**Objective**: Verify errors are prevented or easily corrected

**Steps**:
1. Try to perform destructive actions
2. Check for confirmations
3. Test undo functionality

**Expected Behavior**:
- [ ] Confirmation required for delete actions
- [ ] Form data is preserved on error
- [ ] Clear "Cancel" option always available
- [ ] Undo available where appropriate

---

### Test 6.3: Consistency & Predictability
**Objective**: Verify UI behaves predictably

**Steps**:
1. Perform same action in different places
2. Verify similar behavior
3. Check navigation consistency

**Expected Behavior**:
- [ ] Similar actions look and behave similarly
- [ ] Navigation is consistent across pages
- [ ] Icons mean the same thing everywhere
- [ ] Unexpected behavior doesn't occur

---

## 📊 RESULTS RECORDING TEMPLATE

### Create a spreadsheet with these columns:

| Test ID | Test Name | Page/Component | Pass/Fail | Severity | Notes | Screenshot |
|---------|-----------|----------------|-----------|----------|-------|------------|
| 1.1 | Tab Navigation | Login | Pass | - | All elements focusable | - |
| 1.2 | Reverse Tab | Login | Pass | - | Works correctly | - |
| 3.1 | Color Contrast | Button | Fail | Medium | Contrast only 4.2:1 | button.png |

### Severity Levels:
- **Critical**: Blocks core functionality for users with disabilities
- **High**: Significant barrier to accessibility
- **Medium**: Accessibility issue but workaround exists
- **Low**: Minor issue or convenience enhancement

---

## ✅ COMPLETION CHECKLIST

### Keyboard Testing
- [ ] Test 1.1: Basic Tab Navigation (8 pages)
- [ ] Test 1.2: Reverse Tab Navigation
- [ ] Test 1.3: Enter/Space Activation (5 components)
- [ ] Test 1.4: Escape Key (3 components)
- [ ] Test 1.5: Skip Navigation Link
- [ ] Test 1.6: No Keyboard Traps

### Responsive Testing
- [ ] Test 2.1: Small Mobile (320px)
- [ ] Test 2.2: Standard Mobile (375px)
- [ ] Test 2.3: Tablet (768px)
- [ ] Test 2.4: Desktop (1024px & 1920px)
- [ ] Test 2.5: Touch Target Size (5+ elements)
- [ ] Test 2.6: Pinch to Zoom

### Visual Testing
- [ ] Test 3.1: Color Contrast (7+ elements)
- [ ] Test 3.2: Color Blindness (4 types)
- [ ] Test 3.3: Focus Indicators
- [ ] Test 3.4: Reduced Motion

### Screen Reader Testing
- [ ] Test 4.1: Page Titles and Headings (4 pages)
- [ ] Test 4.2: Form Labels (4 forms)
- [ ] Test 4.3: Error Messages
- [ ] Test 4.4: Buttons and Links
- [ ] Test 4.5: Dynamic Content (4 scenarios)
- [ ] Test 4.6: Images
- [ ] Test 4.7: Landmark Regions

### Content Testing
- [ ] Test 5.1: Text Readability (4 areas)
- [ ] Test 5.2: Consistent Terminology
- [ ] Test 5.3: Visual Hierarchy

### Special Needs Testing
- [ ] Test 6.1: Cognitive Load
- [ ] Test 6.2: Error Prevention & Recovery
- [ ] Test 6.3: Consistency & Predictability

---

## 📈 FINAL REPORT TEMPLATE

```markdown
# Manual Accessibility Testing Results

**Date**: [Date]
**Tester**: [Name]
**Duration**: [Hours]

## Summary
- Total Tests: [Number]
- Passed: [Number] ([Percentage]%)
- Failed: [Number] ([Percentage]%)

## Critical Issues
1. [Issue description]
2. [Issue description]

## High Priority Issues
1. [Issue description]
2. [Issue description]

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Overall Assessment
[Your assessment of accessibility readiness]
```

---

## 🎓 Testing Tips

1. **Take Your Time**: Accessibility testing requires patience and attention to detail

2. **Use Real Devices**: When possible, test on actual mobile devices and tablets

3. **Get User Feedback**: If possible, have actual users with disabilities test

4. **Document Everything**: Screenshots and detailed notes help developers fix issues

5. **Test in Stages**: Don't try to do everything at once. Break testing into sessions

6. **Learn as You Go**: Familiarize yourself with screen readers through practice

7. **Test with Content**: Use real data, not just "Lorem ipsum"

8. **Think Like Users**: Consider how each user role would navigate the app

---

**Next Steps After Testing**:
1. Compile results spreadsheet
2. Prioritize issues by severity
3. Create bug tickets for failures
4. Retest after fixes
5. Document any accessibility features for users

---

*Manual testing guide created for WEEK 3 DAY 11-12: Accessibility Features*
*Part of comprehensive accessibility improvement initiative*
