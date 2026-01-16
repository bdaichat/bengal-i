export interface ExtractedCode {
  id: string;
  language: string;
  code: string;
  isComponent: boolean;
  componentName?: string;
}

/**
 * Extract code blocks from markdown content
 */
export function extractCodeBlocks(markdown: string): ExtractedCode[] {
  const codeBlockRegex = /```(jsx?|tsx?|html|css)\n([\s\S]*?)```/g;
  const blocks: ExtractedCode[] = [];
  let match;
  let index = 0;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1];
    const code = match[2].trim();
    const isComponent = isReactComponent(code, language);
    const componentName = isComponent ? extractComponentName(code) : undefined;

    blocks.push({
      id: `block-${index++}`,
      language,
      code,
      isComponent,
      componentName,
    });
  }

  return blocks;
}

/**
 * Check if code is a React component
 */
function isReactComponent(code: string, language: string): boolean {
  if (!['jsx', 'tsx', 'js', 'ts'].includes(language)) return false;
  
  // Check for common React patterns
  const hasJSX = /<[A-Z][a-zA-Z]*|<[a-z]+[^>]*>/.test(code);
  const hasReactImport = /import.*from\s+['"]react['"]/.test(code);
  const hasFunctionComponent = /function\s+[A-Z][a-zA-Z]*\s*\(|const\s+[A-Z][a-zA-Z]*\s*=\s*\(/.test(code);
  const hasReturn = /return\s*\(?\s*</.test(code);
  
  return hasJSX && (hasReactImport || hasFunctionComponent || hasReturn);
}

/**
 * Extract component name from code
 */
function extractComponentName(code: string): string {
  // Try to find function component name
  const functionMatch = code.match(/function\s+([A-Z][a-zA-Z]*)\s*\(/);
  if (functionMatch) return functionMatch[1];

  // Try to find const component name
  const constMatch = code.match(/const\s+([A-Z][a-zA-Z]*)\s*=/);
  if (constMatch) return constMatch[1];

  // Try to find export default component name
  const exportMatch = code.match(/export\s+default\s+function\s+([A-Z][a-zA-Z]*)/);
  if (exportMatch) return exportMatch[1];

  return 'App';
}

/**
 * Get the best component to preview from extracted blocks
 */
export function getBestPreviewCode(blocks: ExtractedCode[]): ExtractedCode | null {
  // Prefer components, then any JSX/TSX code
  const components = blocks.filter(b => b.isComponent);
  if (components.length > 0) {
    return components[components.length - 1]; // Return the last component
  }

  const jsxBlocks = blocks.filter(b => ['jsx', 'tsx'].includes(b.language));
  if (jsxBlocks.length > 0) {
    return jsxBlocks[jsxBlocks.length - 1];
  }

  return null;
}

/**
 * Transform code for preview (remove imports, wrap in render call)
 */
export function transformForPreview(code: string, componentName: string = 'App'): string {
  // Remove import statements (we'll use CDN versions)
  let transformed = code
    .replace(/import\s+.*from\s+['"][^'"]+['"];?\n?/g, '')
    .replace(/import\s+['"][^'"]+['"];?\n?/g, '')
    .trim();

  // If code doesn't have a render call, add one
  if (!transformed.includes('ReactDOM.render') && !transformed.includes('createRoot')) {
    // Check if there's an export default
    if (transformed.includes('export default')) {
      transformed = transformed.replace(/export\s+default\s+/, '');
    }
    
    // Add render call
    transformed += `\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<${componentName} />);`;
  }

  return transformed;
}
