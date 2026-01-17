/**
 * Generate HTML template for live preview iframe
 */
export function generatePreviewHTML(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
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
  
  <!-- Lucide React Icons (common in generated code) -->
  <script src="https://unpkg.com/lucide-react@0.462.0/dist/umd/lucide-react.min.js"></script>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      min-height: 100vh;
    }
    #root {
      min-height: 100vh;
    }
    .preview-error {
      padding: 20px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      margin: 20px;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .preview-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #6b7280;
    }
  </style>
  
  <script>
    // Configure Tailwind
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: '#2563eb',
              foreground: '#ffffff'
            },
            secondary: {
              DEFAULT: '#f3f4f6',
              foreground: '#1f2937'
            }
          }
        }
      }
    };
    
    // Error handling
    window.onerror = function(message, source, lineno, colno, error) {
      const root = document.getElementById('root');
      root.innerHTML = '<div class="preview-error">Error: ' + message + '</div>';
      return true;
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
      
      // Destructure common icons for convenience
      const { 
        Menu, X, ChevronRight, ChevronDown, ChevronLeft, ChevronUp,
        Check, Plus, Minus, Search, Settings, User, Home, Mail,
        Phone, MapPin, Calendar, Clock, Star, Heart, Share2,
        Download, Upload, Edit, Trash2, Copy, Save, Send,
        ArrowRight, ArrowLeft, ExternalLink, Link, Image,
        Play, Pause, Volume2, VolumeX, Maximize, Minimize
      } = window.lucide || {};
      
      // Common UI component stubs
      const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2';
        const variants = {
          default: 'bg-primary text-primary-foreground hover:bg-primary/90',
          outline: 'border border-input bg-background hover:bg-accent',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'text-primary underline-offset-4 hover:underline',
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
      
      const Input = ({ className = '', ...props }) => (
        <input 
          className={\`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary \${className}\`}
          {...props}
        />
      );

      // User's code
      ${code}
      
    } catch (error) {
      document.getElementById('root').innerHTML = '<div class="preview-error">Error: ' + error.message + '</div>';
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
