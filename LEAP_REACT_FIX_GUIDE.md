
# Leap.new React Frontend - Fix Guide

## Problem Summary

The Soul Synaptica React frontend is experiencing **50+ TypeScript compilation errors** due to corrupted/outdated React type definitions in the Leap.new environment.

**Root Cause:** Bun package manager is installing `@types/react@0.14.57` instead of `@types/react@18.x`, causing all React hooks and types to be unavailable.

---

## Quick Fix Steps

### Step 1: Check Current Package Versions

In your Leap.new project, check what's currently installed:

```bash
# In the Leap.new terminal/console
bun list | grep react
# OR
cat package.json | grep react
```

**Expected output should show:**
```json
"react": "^18.3.1",
"react-dom": "^18.3.1",
"@types/react": "^18.3.12",
"@types/react-dom": "^18.3.1"
```

**If you see version 0.14.x or similar, that's the problem!**

---

### Step 2: Create/Update package.json

If `package.json` doesn't exist or has wrong versions, create/update it:

```json
{
  "name": "soul-synaptica-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "lucide-react": "^0.344.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

---

### Step 3: Force Clean Install

```bash
# Remove existing node_modules and lock files
rm -rf node_modules
rm -f bun.lockb
rm -f package-lock.json
rm -f yarn.lock

# Clear Bun cache
bun pm cache rm

# Fresh install with Bun
bun install --force

# Verify React types are correct
ls -la node_modules/@types/react/
# Should show files dated 2024, not 2015
```

---

### Step 4: Update tsconfig.json

Ensure your `tsconfig.json` has proper configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Type checking */
    "types": ["react", "react-dom"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./frontend/*"]
    }
  },
  "include": ["frontend"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### Step 5: Fix Import Statements

Update all your React component files to use consistent import patterns:

#### ❌ AVOID (if types are broken):
```typescript
import * as React from 'react'
```

#### ✅ USE THIS PATTERN:
```typescript
import React, { useState, useEffect } from 'react'
```

#### Examples:

**Navbar.tsx:**
```typescript
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  // ... rest of component
}
```

**ContactForm.tsx:**
```typescript
import React, { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  // ... rest of component
}
```

---

### Step 6: Handle Auto-Generated shadcn/ui Components

The shadcn/ui components are **readonly** and auto-regenerated. If they're causing errors:

#### Option A: Override with Local Versions

Create your own versions in a different location:

```bash
# Create custom UI components folder
mkdir -p frontend/components/custom-ui
```

Then copy and modify the shadcn components to use correct imports:

**frontend/components/custom-ui/button.tsx:**
```typescript
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

Then update imports in your components:
```typescript
// Change from:
import { Button } from '@/components/ui/button'
// To:
import { Button } from '@/components/custom-ui/button'
```

#### Option B: Request Leap.new to Regenerate

If shadcn/ui files are truly readonly, ask Leap.new support to:
1. Delete all files in `frontend/components/ui/`
2. Regenerate them with correct React 18 types

---

### Step 7: Verify Build

After fixing dependencies and imports:

```bash
# Try building
bun run build

# If successful, you should see:
# ✓ built in XXXms
# No TypeScript errors

# Start dev server
bun run dev
```

---

## Alternative Solution: Downgrade to Compatible Versions

If updating doesn't work, try matching what Leap.new expects:

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/react": "18.2.66",
    "@types/react-dom": "18.2.22"
  }
}
```

Then reinstall:
```bash
rm -rf node_modules bun.lockb
bun install
```

---

## Debugging Commands

### Check React Type Resolution
```bash
# See where @types/react is being loaded from
bun pm ls @types/react

# Check the actual type definitions file
cat node_modules/@types/react/index.d.ts | head -20

# Should show React 18 exports like:
# export function useState<S>(...): ...
# export function useEffect(...): ...
```

### Check for Conflicting Packages
```bash
# Find all React-related packages
find node_modules -name "*react*" -type d

# Should NOT see:
# node_modules/.bun/@types+react@0.14.57/
```

### Verify TypeScript Can Find Types
```bash
# Run TypeScript compiler check
tsc --noEmit

# Should show specific errors, not "module not found"
```

---

## Component-Specific Fixes

### Layout.tsx - "children is missing" Error

**Error:**
```
App.tsx(13,8): error TS2741: Property 'children' is missing in type '{}' but required in type 'LayoutProps'
```

**Fix:**

Ensure Layout component properly types children:

```typescript
import React, { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

And in App.tsx:
```typescript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
// ... other imports

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
```

---

## If Nothing Works: Nuclear Option

If all else fails, recreate the project:

### 1. Export Your Components
```bash
# Copy all your custom components
cp -r frontend/components /tmp/components-backup
cp -r frontend/pages /tmp/pages-backup
```

### 2. Create Fresh Vite + React Project Locally
```bash
# On your local machine (not in Leap.new)
npm create vite@latest soul-synaptica-frontend -- --template react-ts
cd soul-synaptica-frontend
npm install
```

### 3. Copy Components Back
```bash
# Copy your components to the new project
cp -r /tmp/components-backup/* src/components/
cp -r /tmp/pages-backup/* src/pages/
```

### 4. Install Dependencies
```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react class-variance-authority clsx tailwind-merge
npx tailwindcss init -p
```

### 5. Test Locally
```bash
npm run dev
# Verify everything works
```

### 6. Push to New Leap.new Project
- Create new Leap.new project
- Upload the working code
- Should build successfully

---

## Prevention for Future

### Add to package.json (resolutions)
```json
{
  "resolutions": {
    "@types/react": "^18.3.12"
  }
}
```

### Lock File Commitment
```bash
# Commit bun.lockb to prevent version drift
git add bun.lockb
git commit -m "Lock React 18 types"
```

---

## Contact Leap.new Support

If the issue persists, contact Leap.new with:

**Subject:** "React type definitions resolving to 0.14.57 instead of 18.x"

**Message:**
```
My project is experiencing TypeScript compilation errors because
@types/react is resolving to version 0.14.57 instead of 18.x.

Project URL: https://proj-d3u940482vjkdgi8srmg.lp.dev
Error path: /workspace/node_modules/.bun/@types+react@0.14.57/

Despite having:
- "react": "^18.3.1" in dependencies
- "@types/react": "^18.3.12" in devDependencies

Bun is installing the wrong version. Can you help resolve this?

Errors include:
- TS2305: Module 'react' has no exported member 'useState'
- TS2694: Namespace 'React' has no exported member 'ComponentProps'
```

---

## Success Checklist

Once fixed, verify:

- [ ] `bun list | grep @types/react` shows version 18.x
- [ ] `tsc --noEmit` runs without errors
- [ ] `bun run build` completes successfully
- [ ] All 5 pages render (Home, About, Services, Team, Contact)
- [ ] Mobile menu works
- [ ] Contact form submits
- [ ] Toast notifications appear
- [ ] Navigation between pages works

---

## Additional Resources

- **React 18 Types Docs:** https://react-typescript-cheatsheet.netlify.app/
- **Bun Package Manager:** https://bun.sh/docs/cli/install
- **Vite + React:** https://vitejs.dev/guide/
- **shadcn/ui Docs:** https://ui.shadcn.com/

---

**Status After Fix:** Should go from 🔴 **Blocked** → 🟢 **Deployed**

**Last Updated:** 2025-10-25
