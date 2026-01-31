
# Fix Plan: Preview Panel Not Displaying Generated Code

## Problem Analysis

Based on my investigation, I found several issues preventing the preview from working:

### Issue 1: Code Block Extraction Regex Mismatch
The current regex `/```(jsx?|tsx?|html|css)\n([\s\S]*?)```/g` requires a specific newline character (`\n`) after the language identifier. If the markdown has Windows-style line endings (`\r\n`) or other variations, extraction fails.

### Issue 2: Transform Function Export Handling
When transforming code like `export default Portfolio;`, the regex `export\s+default\s+` only removes `export default ` but leaves `Portfolio;`. While this is valid JavaScript, the subsequent code flow might be affected.

### Issue 3: Preview Template Render Logic Conflict
The `previewTemplate.ts` has TWO render mechanisms:
1. User's transformed code includes `root.render(<ComponentName />);`
2. Template also has `if (typeof App !== 'undefined')` check and render

When the component is named something other than `App` (like `Portfolio`), the template's fallback doesn't trigger, which is correct - but there may be edge cases where neither renders.

### Issue 4: Tooltip Ref Warnings (Minor)
Console shows warnings about function components receiving refs in `PreviewPanel.tsx`. While these don't break functionality, they indicate improper Tooltip usage patterns.

---

## Implementation Plan

### Step 1: Fix Code Block Extraction Regex
**File:** `src/utils/codeExtractor.ts`

Make the regex more flexible to handle different line ending formats:

```text
Changes:
- Update regex to handle \r\n, \n, or just whitespace after language identifier
- From: /```(jsx?|tsx?|html|css)\n([\s\S]*?)```/g
- To: /```(jsx?|tsx?|html|css)[\r\n]+([\s\S]*?)```/g
```

### Step 2: Improve Export Default Handling
**File:** `src/utils/codeExtractor.ts`

Fix the transformation to properly handle `export default ComponentName;` pattern:

```text
Changes:
- Update regex to remove entire export default statement including the component name
- From: /export\s+default\s+/
- To: /export\s+default\s+\w+;?\s*/g (remove the entire line)
```

### Step 3: Improve Component Detection
**File:** `src/utils/codeExtractor.ts`

Make the component detection more robust to handle arrow function syntax variations:

```text
Changes:
- Update hasFunctionComponent regex to also match arrow functions with parentheses
- Add pattern: /const\s+[A-Z][a-zA-Z0-9]*\s*=\s*\(\s*\)\s*=>/
```

### Step 4: Wrap Tooltip Components Properly
**File:** `src/components/preview/PreviewPanel.tsx`

Use a single TooltipProvider at the top level instead of wrapping each tooltip individually:

```text
Changes:
- Move TooltipProvider to wrap the entire toolbar
- Remove individual TooltipProvider wrappers around each Tooltip
- This eliminates the ref forwarding warnings
```

### Step 5: Add Error Boundary for Preview Rendering
**File:** `src/components/preview/LivePreview.tsx`

Add better error handling to catch and display render errors:

```text
Changes:
- Add try-catch around HTML generation
- Log errors to console for debugging
- Show user-friendly error message if preview fails
```

---

## Technical Details

### Regex Changes Explained

**Original code block regex:**
```javascript
/```(jsx?|tsx?|html|css)\n([\s\S]*?)```/g
```

**Fixed regex:**
```javascript
/```(jsx?|tsx?|html|css)\s*[\r\n]+([\s\S]*?)```/g
```

The change:
- `\n` becomes `\s*[\r\n]+` to handle optional whitespace and both Unix/Windows line endings

**Original export removal:**
```javascript
transformed.replace(/export\s+default\s+/, '')
```

**Fixed export removal:**
```javascript
transformed.replace(/export\s+default\s+\w+;?\s*\n?/g, '')
```

The change:
- Matches the entire export statement including the identifier and optional semicolon/newline
- Uses global flag to catch multiple exports if present

### Files to Modify

| File | Changes |
|------|---------|
| `src/utils/codeExtractor.ts` | Fix regex patterns for extraction and transformation |
| `src/components/preview/PreviewPanel.tsx` | Consolidate TooltipProvider usage |
| `src/components/preview/LivePreview.tsx` | Add error logging for debugging |

---

## Expected Outcome

After implementing these fixes:
1. Code blocks will be correctly extracted regardless of line ending format
2. Export statements will be fully removed without leaving orphan expressions
3. Component names will be correctly detected for all function syntax variations
4. Preview panel will display the generated component instead of the placeholder
5. Console warnings about refs will be eliminated
