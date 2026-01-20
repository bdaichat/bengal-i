/**
 * Generate HTML template for live preview iframe
 */
export function generatePreviewHTML(code: string, darkMode: boolean = false): string {
  return `<!DOCTYPE html>
<html lang="en" class="${darkMode ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  
  <!-- React -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Lucide React Icons -->
  <script src="https://unpkg.com/lucide-react@0.462.0/dist/umd/lucide-react.min.js"></script>
  
  <!-- Framer Motion -->
  <script src="https://unpkg.com/framer-motion@11/dist/framer-motion.umd.min.js"></script>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${darkMode ? '#0a0a0a' : 'white'};
      color: ${darkMode ? '#fafafa' : '#0a0a0a'};
      min-height: 100vh;
      transition: background-color 0.2s, color 0.2s;
    }
    #root {
      min-height: 100vh;
    }
    .preview-error {
      padding: 20px;
      background: ${darkMode ? '#450a0a' : '#fef2f2'};
      border: 1px solid ${darkMode ? '#7f1d1d' : '#fecaca'};
      border-radius: 8px;
      color: ${darkMode ? '#fca5a5' : '#dc2626'};
      margin: 20px;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .preview-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: ${darkMode ? '#a1a1aa' : '#6b7280'};
    }
  </style>
  
  <script>
    // Configure Tailwind with dark mode support
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            background: ${darkMode ? "'#0a0a0a'" : "'#ffffff'"},
            foreground: ${darkMode ? "'#fafafa'" : "'#0a0a0a'"},
            card: ${darkMode ? "'#0a0a0a'" : "'#ffffff'"},
            'card-foreground': ${darkMode ? "'#fafafa'" : "'#0a0a0a'"},
            muted: ${darkMode ? "'#27272a'" : "'#f4f4f5'"},
            'muted-foreground': ${darkMode ? "'#a1a1aa'" : "'#71717a'"},
            border: ${darkMode ? "'#27272a'" : "'#e4e4e7'"},
            primary: {
              DEFAULT: '#2563eb',
              foreground: '#ffffff'
            },
            secondary: {
              DEFAULT: ${darkMode ? "'#27272a'" : "'#f4f4f5'"},
              foreground: ${darkMode ? "'#fafafa'" : "'#18181b'"}
            }
          }
        }
      }
    };
    
    // Enhanced error handling with component detection and code snippets
    window.__missingComponents = [];
    window.__userCode = '';
    window.__codeLineOffset = 0;
    
    window.__formatStack = function(stack) {
      if (!stack) return '';
      return stack
        .split('\\n')
        .filter(line => !line.includes('node_modules') && !line.includes('unpkg.com'))
        .slice(0, 10)
        .join('\\n');
    };
    
    window.__extractLineNumber = function(stack) {
      if (!stack) return null;
      // Match patterns like "at eval:123:45" or "<anonymous>:123:45" or "Babel:123:45"
      const patterns = [
        /at\\s+.*?:?(\\d+):(\\d+)/,
        /<anonymous>:(\\d+):(\\d+)/,
        /eval.*?:(\\d+):(\\d+)/,
        /Babel.*?:(\\d+):(\\d+)/,
        /:?(\\d+):(\\d+)\\)?$/m
      ];
      for (const pattern of patterns) {
        const match = stack.match(pattern);
        if (match && parseInt(match[1]) > 0) {
          return { line: parseInt(match[1]), column: parseInt(match[2]) };
        }
      }
      return null;
    };
    
    window.__getCodeSnippet = function(lineNum, contextLines = 3) {
      if (!window.__userCode || !lineNum) return null;
      const lines = window.__userCode.split('\\n');
      const adjustedLine = lineNum - window.__codeLineOffset;
      
      if (adjustedLine < 1 || adjustedLine > lines.length) return null;
      
      const start = Math.max(0, adjustedLine - contextLines - 1);
      const end = Math.min(lines.length, adjustedLine + contextLines);
      
      const snippetLines = [];
      for (let i = start; i < end; i++) {
        const lineNumber = i + 1;
        const isErrorLine = lineNumber === adjustedLine;
        snippetLines.push({
          num: lineNumber,
          code: lines[i],
          isError: isErrorLine
        });
      }
      return { lines: snippetLines, errorLine: adjustedLine };
    };
    
    window.__detectMissingComponent = function(message) {
      const patterns = [
        /Element type is invalid.*?Check the render method of \`?([A-Z][a-zA-Z0-9]*)\`?/,
        /([A-Z][a-zA-Z0-9]*) is not defined/,
        /Cannot read properties of undefined.*?reading '([a-zA-Z]+)'/,
        /Component is not a function/,
        /'([A-Z][a-zA-Z0-9]*)' is not a function/
      ];
      for (const p of patterns) {
        const m = message.match(p);
        if (m) return m[1] || 'Unknown';
      }
      return null;
    };
    
    window.__renderError = function(title, message, stack, hint, lineInfo) {
      const root = document.getElementById('root');
      const darkMode = document.documentElement.classList.contains('dark');
      const bg = darkMode ? '#1c1917' : '#fef2f2';
      const border = darkMode ? '#7f1d1d' : '#fecaca';
      const text = darkMode ? '#fca5a5' : '#dc2626';
      const muted = darkMode ? '#a8a29e' : '#78716c';
      const btnBg = darkMode ? '#292524' : '#fef2f2';
      const btnBorder = darkMode ? '#44403c' : '#fecaca';
      const codeBg = darkMode ? '#0c0a09' : '#fff';
      const errorLineBg = darkMode ? '#7f1d1d' : '#fee2e2';
      const lineNumColor = darkMode ? '#57534e' : '#a8a29e';
      
      // Try to get code snippet
      const extractedLine = lineInfo || window.__extractLineNumber(stack);
      const snippet = extractedLine ? window.__getCodeSnippet(extractedLine.line) : null;
      
      // Store error for copy function
      window.__lastError = { title, message, stack, hint: hint?.replace(/<[^>]*>/g, ''), snippet };
      
      let snippetHtml = '';
      if (snippet && snippet.lines.length > 0) {
        const snippetLines = snippet.lines.map(l => {
          const lineStyle = l.isError 
            ? \`background: \${errorLineBg}; border-left: 3px solid \${text}; margin-left: -3px; padding-left: 3px;\`
            : '';
          const indicator = l.isError ? ' → ' : '   ';
          return \`<div style="\${lineStyle}"><span style="color: \${lineNumColor}; user-select: none; display: inline-block; width: 35px; text-align: right; margin-right: 8px;">\${l.num}</span><span style="color: \${l.isError ? text : muted};">\${indicator}</span>\${escapeHtml(l.code)}</div>\`;
        }).join('');
        snippetHtml = \`
          <div style="margin: 12px 0;">
            <div style="font-size: 11px; color: \${muted}; margin-bottom: 6px;">Error at line \${snippet.errorLine}:</div>
            <pre style="margin: 0; padding: 10px; background: \${codeBg}; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5;">\${snippetLines}</pre>
          </div>\`;
      }
      
      function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      
      root.innerHTML = \`
        <div style="padding: 20px; background: \${bg}; border: 1px solid \${border}; border-radius: 8px; color: \${text}; margin: 20px; font-family: system-ui, monospace;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <strong style="font-size: 14px;">\${title}</strong>
              \${extractedLine ? \`<span style="font-size: 11px; background: \${btnBg}; border: 1px solid \${btnBorder}; padding: 2px 6px; border-radius: 3px;">Line \${extractedLine.line}\${extractedLine.column ? ':' + extractedLine.column : ''}</span>\` : ''}
            </div>
            <button id="__copyErrorBtn" style="display: flex; align-items: center; gap: 4px; padding: 6px 10px; font-size: 11px; background: \${btnBg}; border: 1px solid \${btnBorder}; border-radius: 4px; color: \${text}; cursor: pointer; transition: opacity 0.2s;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>Copy Error</span>
            </button>
          </div>
          <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5;">\${message}</p>
          \${snippetHtml}
          \${hint ? \`<div style="background: \${darkMode ? '#292524' : '#fef9c3'}; color: \${darkMode ? '#fde68a' : '#854d0e'}; padding: 10px; border-radius: 6px; margin-bottom: 12px; font-size: 12px;"><strong>💡 Hint:</strong> \${hint}</div>\` : ''}
          \${stack ? \`<details style="margin-top: 8px;"><summary style="cursor: pointer; color: \${muted}; font-size: 12px;">Full stack trace</summary><pre style="margin-top: 8px; padding: 10px; background: \${codeBg}; border-radius: 4px; font-size: 11px; overflow-x: auto; white-space: pre-wrap; color: \${muted};">\${stack}</pre></details>\` : ''}
        </div>\`;
      
      // Attach copy handler
      document.getElementById('__copyErrorBtn')?.addEventListener('click', function() {
        const e = window.__lastError;
        let snippetText = '';
        if (e.snippet && e.snippet.lines) {
          snippetText = 'Code (line ' + e.snippet.errorLine + '):\\n' + e.snippet.lines.map(l => (l.isError ? '→ ' : '  ') + l.num + ': ' + l.code).join('\\n');
        }
        const text = [e.title, e.message, snippetText, e.hint ? 'Hint: ' + e.hint : '', e.stack ? 'Stack:\\n' + e.stack : ''].filter(Boolean).join('\\n\\n');
        navigator.clipboard.writeText(text).then(() => {
          this.querySelector('span').textContent = 'Copied!';
          setTimeout(() => { this.querySelector('span').textContent = 'Copy Error'; }, 2000);
        });
      });
    };
    
    window.onerror = function(message, source, lineno, colno, error) {
      // Handle generic "Script error" from cross-origin issues
      let displayMessage = String(message);
      let hint = null;
      
      if (displayMessage === 'Script error.' || displayMessage === 'Script error') {
        displayMessage = 'An error occurred in the preview code. This may be due to a syntax error, undefined variable, or component issue.';
        hint = 'Check your code for: <strong>1)</strong> Undefined variables or components <strong>2)</strong> Syntax errors <strong>3)</strong> Missing imports. The preview runs in a sandboxed environment with limited error details.';
      } else {
        const comp = window.__detectMissingComponent(displayMessage);
        if (comp) {
          hint = \`The component <strong>\${comp}</strong> may not be defined or exported. Check imports and ensure it's a valid React component.\`;
        } else if (displayMessage.includes('not a function')) {
          hint = 'A component was imported but is not a valid function. Check default/named exports.';
        } else if (displayMessage.includes('is not defined')) {
          hint = 'A variable or component is used before being defined. Check spelling and imports.';
        }
      }
      
      const lineInfo = lineno > 0 ? { line: lineno, column: colno } : null;
      window.__renderError(
        'Runtime Error',
        displayMessage,
        error ? window.__formatStack(error.stack) : (lineno ? \`at line \${lineno}, column \${colno}\` : null),
        hint,
        lineInfo
      );
      return true;
    };
    
    window.onunhandledrejection = function(event) {
      const msg = event.reason?.message || String(event.reason);
      const comp = window.__detectMissingComponent(msg);
      let hint = comp ? \`Check if <strong>\${comp}</strong> is properly defined and exported.\` : null;
      window.__renderError(
        'Unhandled Promise Rejection',
        msg,
        event.reason?.stack ? window.__formatStack(event.reason.stack) : null,
        hint
      );
    };
    
    // Make common libraries available globally
    window.lucide = window.lucideReact || {};
  </script>
</head>
<body>
  <div id="root">
    <div class="preview-loading">Loading preview...</div>
  </div>
  
  <script type="text/babel" data-presets="react">
    try {
      // Destructure React hooks and utilities for convenience
      const {
        useState, useEffect, useCallback, useMemo, useRef,
        useContext, useReducer, useLayoutEffect, useImperativeHandle,
        useDebugValue, useDeferredValue, useId, useInsertionEffect,
        useSyncExternalStore, useTransition,
        createContext, forwardRef, memo, lazy, Suspense,
        Fragment, Children, cloneElement, createElement, isValidElement
      } = React;
      
      // Mock router hooks (commonly used in generated code)
      const useNavigate = () => (path) => console.log('Navigate to:', path);
      const useLocation = () => ({ pathname: '/', search: '', hash: '' });
      const useParams = () => ({});
      
      // Common utility function stubs
      const cn = (...classes) => classes.filter(Boolean).join(' ');
      
      // Framer Motion stubs - use real library if available, otherwise fallback to HTML elements
      const FramerMotion = window.FramerMotion || {};
      const motion = FramerMotion.motion || {
        div: 'div', span: 'span', p: 'p', 
        h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
        section: 'section', article: 'article', aside: 'aside', nav: 'nav',
        header: 'header', footer: 'footer', main: 'main',
        button: 'button', a: 'a', img: 'img', 
        ul: 'ul', ol: 'ol', li: 'li',
        form: 'form', input: 'input', textarea: 'textarea', label: 'label',
        table: 'table', tr: 'tr', td: 'td', th: 'th'
      };
      const AnimatePresence = ({ children }) => children;
      const useAnimation = () => ({});
      const useInView = () => [null, true];
      const useScroll = () => ({ scrollY: { get: () => 0 } });
      const useTransform = () => 0;
      const useSpring = () => 0;
      
      // Destructure common icons for convenience - expanded list
      const { 
        // Navigation
        Menu, X, ChevronRight, ChevronDown, ChevronLeft, ChevronUp,
        ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
        // Actions
        Check, Plus, Minus, Search, Settings, Filter,
        Download, Upload, Edit, Trash2, Copy, Save, Send,
        MoreHorizontal, MoreVertical, Grip, GripVertical,
        // User & Social
        User, Users, Github, Linkedin, Twitter, Facebook, Instagram, Youtube,
        // Communication
        Mail, Phone, MessageCircle, MessageSquare, AtSign,
        // Location & Time
        MapPin, Calendar, Clock, Globe,
        // Media
        Image, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
        // Status
        AlertCircle, AlertTriangle, Info, HelpCircle, CheckCircle, XCircle,
        Star, Heart, Share2,
        // Files
        File, FileText, Folder, FolderOpen, Archive,
        // Links
        ExternalLink, Link,
        // Home & Navigation
        Home, Briefcase, BookOpen, Award,
        // Theme & Code
        Sun, Moon, Code, Code2, Terminal, Zap, Eye, EyeOff, Sparkles,
        // Shopping & Commerce
        ShoppingCart, CreditCard, Package, Truck,
        // Misc
        Bell, Lock, Unlock, Key, Shield, Loader2, RefreshCw, RotateCcw
      } = window.lucide || {};
      
      // Enhanced Error Boundary Component with full stack + hints
      class ErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, error: null, errorInfo: null };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        componentDidCatch(error, errorInfo) {
          this.setState({ errorInfo });
          console.error('Preview Error:', error, errorInfo);
        }
        render() {
          if (this.state.hasError) {
            const msg = this.state.error?.message || 'Unknown error';
            const comp = window.__detectMissingComponent?.(msg);
            const stack = window.__formatStack?.(this.state.error?.stack) || '';
            const componentStack = this.state.errorInfo?.componentStack || '';
            
            let hint = null;
            if (comp) {
              hint = \`The component <\${comp}> may not be defined. Ensure it is imported or declared.\`;
            } else if (msg.includes('not a function')) {
              hint = 'A component reference is invalid. Check that all imports use correct named/default exports.';
            } else if (msg.includes('Cannot read properties')) {
              hint = 'An object is undefined when accessed. Check initial state and conditional rendering.';
            }
            
            const darkMode = document.documentElement.classList.contains('dark');
            const bg = darkMode ? '#1c1917' : '#fef2f2';
            const border = darkMode ? '#7f1d1d' : '#fecaca';
            const text = darkMode ? '#fca5a5' : '#dc2626';
            const muted = darkMode ? '#a8a29e' : '#78716c';
            const hintBg = darkMode ? '#292524' : '#fef9c3';
            const hintText = darkMode ? '#fde68a' : '#854d0e';
            const btnBg = darkMode ? '#292524' : '#fef2f2';
            const btnBorder = darkMode ? '#44403c' : '#fecaca';
            
            const fullStack = stack + (componentStack ? '\\n\\nComponent Stack:' + componentStack : '');
            
            const handleCopy = () => {
              const errorText = ['Component Error', msg, hint ? 'Hint: ' + hint : '', fullStack ? 'Stack:\\n' + fullStack : ''].filter(Boolean).join('\\n\\n');
              navigator.clipboard.writeText(errorText).then(() => {
                this.setState({ copied: true });
                setTimeout(() => this.setState({ copied: false }), 2000);
              });
            };
            
            return React.createElement('div', {
              style: { padding: 20, background: bg, border: \`1px solid \${border}\`, borderRadius: 8, color: text, margin: 20, fontFamily: 'system-ui, monospace' }
            },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                  React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                    React.createElement('circle', { cx: 12, cy: 12, r: 10 }),
                    React.createElement('line', { x1: 12, y1: 8, x2: 12, y2: 12 }),
                    React.createElement('line', { x1: 12, y1: 16, x2: 12.01, y2: 16 })
                  ),
                  React.createElement('strong', { style: { fontSize: 14 } }, 'Component Error')
                ),
                React.createElement('button', {
                  onClick: handleCopy,
                  style: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', fontSize: 11, background: btnBg, border: \`1px solid \${btnBorder}\`, borderRadius: 4, color: text, cursor: 'pointer' }
                },
                  React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                    React.createElement('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 }),
                    React.createElement('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
                  ),
                  this.state.copied ? 'Copied!' : 'Copy Error'
                )
              ),
              React.createElement('p', { style: { margin: '0 0 12px', fontSize: 13, lineHeight: 1.5 } }, msg),
              hint && React.createElement('div', { 
                style: { background: hintBg, color: hintText, padding: 10, borderRadius: 6, marginBottom: 12, fontSize: 12 }
              }, '💡 Hint: ', hint),
              fullStack && React.createElement('details', { style: { marginTop: 8 } },
                React.createElement('summary', { style: { cursor: 'pointer', color: muted, fontSize: 12 } }, 'Stack trace'),
                React.createElement('pre', { 
                  style: { marginTop: 8, padding: 10, background: darkMode ? '#0c0a09' : '#fff', borderRadius: 4, fontSize: 11, overflowX: 'auto', whiteSpace: 'pre-wrap', color: muted }
                }, fullStack)
              )
            );
          }
          return this.props.children;
        }
      }
      
      // Common UI component stubs
      const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2';
        const variants = {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          outline: 'border border-input bg-background hover:bg-accent',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'text-primary underline-offset-4 hover:underline',
          secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          destructive: 'bg-red-500 text-white hover:bg-red-600',
        };
        const sizes = {
          default: 'h-10 px-4 py-2',
          sm: 'h-9 px-3',
          lg: 'h-11 px-8',
          icon: 'h-10 w-10',
        };
        return (
          <button 
            className={\`\${baseStyles} \${variants[variant] || variants.default} \${sizes[size] || sizes.default} \${className}\`}
            {...props}
          >
            {children}
          </button>
        );
      };
      
      const Card = ({ children, className = '', ...props }) => (
        <div className={\`rounded-lg border bg-white shadow-sm \${className}\`} {...props}>
          {children}
        </div>
      );
      
      const CardHeader = ({ children, className = '', ...props }) => (
        <div className={\`flex flex-col space-y-1.5 p-6 \${className}\`} {...props}>{children}</div>
      );
      
      const CardTitle = ({ children, className = '', ...props }) => (
        <h3 className={\`text-2xl font-semibold leading-none tracking-tight \${className}\`} {...props}>{children}</h3>
      );
      
      const CardDescription = ({ children, className = '', ...props }) => (
        <p className={\`text-sm text-muted-foreground \${className}\`} {...props}>{children}</p>
      );
      
      const CardContent = ({ children, className = '', ...props }) => (
        <div className={\`p-6 pt-0 \${className}\`} {...props}>{children}</div>
      );
      
      const CardFooter = ({ children, className = '', ...props }) => (
        <div className={\`flex items-center p-6 pt-0 \${className}\`} {...props}>{children}</div>
      );
      
      const Input = ({ className = '', ...props }) => (
        <input 
          className={\`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary \${className}\`}
          {...props}
        />
      );
      
      const Textarea = ({ className = '', ...props }) => (
        <textarea 
          className={\`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary \${className}\`}
          {...props}
        />
      );
      
      const Label = ({ children, className = '', ...props }) => (
        <label className={\`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 \${className}\`} {...props}>
          {children}
        </label>
      );
      
      const Badge = ({ children, className = '', variant = 'default', ...props }) => {
        const variants = {
          default: 'bg-primary text-primary-foreground',
          secondary: 'bg-secondary text-secondary-foreground',
          outline: 'border border-input bg-background',
          destructive: 'bg-red-500 text-white',
        };
        return (
          <span className={\`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors \${variants[variant] || variants.default} \${className}\`} {...props}>
            {children}
          </span>
        );
      };
      
      const Avatar = ({ children, className = '', ...props }) => (
        <span className={\`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full \${className}\`} {...props}>
          {children}
        </span>
      );
      
      const AvatarImage = ({ src, alt = '', className = '', ...props }) => (
        <img src={src} alt={alt} className={\`aspect-square h-full w-full \${className}\`} {...props} />
      );
      
      const AvatarFallback = ({ children, className = '', ...props }) => (
        <span className={\`flex h-full w-full items-center justify-center rounded-full bg-muted \${className}\`} {...props}>
          {children}
        </span>
      );
      
      const Separator = ({ className = '', orientation = 'horizontal', ...props }) => (
        <div 
          className={\`shrink-0 bg-border \${orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'} \${className}\`}
          {...props}
        />
      );
      
      const Tabs = ({ children, defaultValue, className = '', ...props }) => {
        const [value, setValue] = useState(defaultValue);
        return (
          <div className={className} data-value={value} {...props}>
            {React.Children.map(children, child => 
              React.isValidElement(child) ? React.cloneElement(child, { value, onValueChange: setValue }) : child
            )}
          </div>
        );
      };
      
      const TabsList = ({ children, className = '', ...props }) => (
        <div className={\`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground \${className}\`} {...props}>
          {children}
        </div>
      );
      
      const TabsTrigger = ({ children, value: triggerValue, className = '', value: currentValue, onValueChange, ...props }) => (
        <button 
          className={\`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 \${className}\`}
          onClick={() => onValueChange?.(triggerValue)}
          {...props}
        >
          {children}
        </button>
      );
      
      const TabsContent = ({ children, value: contentValue, value: currentValue, className = '', ...props }) => (
        <div className={\`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 \${className}\`} {...props}>
          {children}
        </div>
      );
      
      const ScrollArea = ({ children, className = '', ...props }) => (
        <div className={\`relative overflow-auto \${className}\`} {...props}>
          {children}
        </div>
      );
      
      const Select = ({ children, ...props }) => children;
      const SelectTrigger = ({ children, className = '', ...props }) => (
        <button className={\`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm \${className}\`} {...props}>
          {children}
        </button>
      );
      const SelectValue = ({ placeholder, ...props }) => <span {...props}>{placeholder}</span>;
      const SelectContent = ({ children, ...props }) => <div {...props}>{children}</div>;
      const SelectItem = ({ children, ...props }) => <div {...props}>{children}</div>;
      
      const Switch = ({ checked, onCheckedChange, className = '', ...props }) => (
        <button
          role="switch"
          aria-checked={checked}
          onClick={() => onCheckedChange?.(!checked)}
          className={\`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors \${checked ? 'bg-primary' : 'bg-input'} \${className}\`}
          {...props}
        >
          <span className={\`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform \${checked ? 'translate-x-5' : 'translate-x-0'}\`} />
        </button>
      );
      
      const Checkbox = ({ checked, onCheckedChange, className = '', ...props }) => (
        <button
          role="checkbox"
          aria-checked={checked}
          onClick={() => onCheckedChange?.(!checked)}
          className={\`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 \${checked ? 'bg-primary text-primary-foreground' : ''} \${className}\`}
          {...props}
        >
          {checked && <Check className="h-4 w-4" />}
        </button>
      );
      
      const Progress = ({ value = 0, className = '', ...props }) => (
        <div className={\`relative h-4 w-full overflow-hidden rounded-full bg-secondary \${className}\`} {...props}>
          <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }} />
        </div>
      );
      
      const Skeleton = ({ className = '', ...props }) => (
        <div className={\`animate-pulse rounded-md bg-muted \${className}\`} {...props} />
      );
      
      const Alert = ({ children, className = '', variant = 'default', ...props }) => (
        <div className={\`relative w-full rounded-lg border p-4 \${variant === 'destructive' ? 'border-red-500 text-red-500' : ''} \${className}\`} {...props}>
          {children}
        </div>
      );
      
      const AlertTitle = ({ children, className = '', ...props }) => (
        <h5 className={\`mb-1 font-medium leading-none tracking-tight \${className}\`} {...props}>{children}</h5>
      );
      
      const AlertDescription = ({ children, className = '', ...props }) => (
        <div className={\`text-sm [&_p]:leading-relaxed \${className}\`} {...props}>{children}</div>
      );
      
      // Container/Layout helpers
      const Container = ({ children, className = '', ...props }) => (
        <div className={\`container mx-auto px-4 \${className}\`} {...props}>{children}</div>
      );
      
      const Section = ({ children, className = '', ...props }) => (
        <section className={\`py-12 md:py-24 \${className}\`} {...props}>{children}</section>
      );

      // Store user's code for error display (line offset accounts for all code above this point)
      window.__userCode = ${JSON.stringify(code)};
      window.__codeLineOffset = 0; // User code starts at line 1 in stored code
      
      // User's code wrapped in ErrorBoundary
      ${code}
      
      // Wrap the rendered component in ErrorBoundary if App exists
      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
          React.createElement(ErrorBoundary, null,
            React.createElement(App)
          )
        );
      }
      
    } catch (error) {
      const comp = window.__detectMissingComponent?.(error.message);
      let hint = null;
      if (comp) {
        hint = \`<strong>\${comp}</strong> is not defined. Add it to the code or check the import.\`;
      } else if (error.message.includes('Unexpected token')) {
        const match = error.message.match(/(\\d+):(\\d+)/);
        hint = 'Syntax error in the code. Check for missing brackets, quotes, or semicolons.';
      } else if (error.message.includes('is not defined')) {
        hint = 'A variable or component is referenced but not defined. Check spelling and ensure it exists.';
      }
      
      // Extract line info from compilation errors
      const lineMatch = error.stack?.match(/(\\d+):(\\d+)/);
      const lineInfo = lineMatch ? { line: parseInt(lineMatch[1]), column: parseInt(lineMatch[2]) } : null;
      
      window.__renderError?.('Compilation Error', error.message, window.__formatStack?.(error.stack), hint, lineInfo) 
        || (document.getElementById('root').innerHTML = '<div class="preview-error">Error: ' + error.message + '</div>');
    }
  </script>
</body>
</html>`;
}

/**
 * Generate a placeholder preview when no code is available
 */
export function generatePlaceholderHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
  <div class="text-center p-8">
    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    </div>
    <h2 class="text-lg font-semibold text-gray-700 mb-2">Live Preview</h2>
    <p class="text-gray-500 text-sm max-w-xs">
      Ask the AI to build something and watch it appear here in real-time!
    </p>
  </div>
</body>
</html>`;
}
