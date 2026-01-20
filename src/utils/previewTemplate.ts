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
      
      // Error Boundary Component
      class ErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, error: null };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        componentDidCatch(error, errorInfo) {
          console.error('Preview Error:', error, errorInfo);
        }
        render() {
          if (this.state.hasError) {
            return React.createElement('div', { className: 'preview-error' },
              React.createElement('strong', null, 'Component Error: '),
              this.state.error?.message || 'Unknown error occurred'
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
