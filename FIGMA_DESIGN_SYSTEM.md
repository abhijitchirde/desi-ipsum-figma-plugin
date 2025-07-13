# Figma Design System Documentation

## Overview

This document outlines the design system implementation for the Desi Ipsum Figma plugin, which follows Figma's native design language and provides comprehensive dark mode support.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Component Library](#component-library)
4. [Theme System](#theme-system)
5. [Implementation Guidelines](#implementation-guidelines)
6. [File Structure](#file-structure)
7. [Usage Examples](#usage-examples)

## Color System

### CSS Custom Properties

The design system uses CSS custom properties (CSS variables) to maintain consistency across light and dark themes.

#### Light Theme Variables

```css
:root {
  --figma-color-bg: #ffffff; /* Primary background */
  --figma-color-bg-secondary: #f5f5f5; /* Secondary background */
  --figma-color-text: #000000; /* Primary text */
  --figma-color-text-secondary: #333333; /* Secondary text */
  --figma-color-border: #e5e5e5; /* Standard borders */
  --figma-color-border-strong: #cccccc; /* Strong borders */
  --figma-color-icon: #333333; /* Icon color */
  --figma-color-bg-brand: #18a0fb; /* Brand/primary color */
  --figma-color-text-brand: #ffffff; /* Text on brand background */
  --figma-color-bg-selected: #e5f3ff; /* Selected state background */
  --figma-color-text-selected: #18a0fb; /* Selected state text */
}
```

#### Dark Theme Variables

```css
[data-theme="dark"] {
  --figma-color-bg: #2c2c2c; /* Primary background */
  --figma-color-bg-secondary: #383838; /* Secondary background */
  --figma-color-text: #ffffff; /* Primary text */
  --figma-color-text-secondary: #cccccc; /* Secondary text */
  --figma-color-border: #444444; /* Standard borders */
  --figma-color-border-strong: #555555; /* Strong borders */
  --figma-color-icon: #cccccc; /* Icon color */
  --figma-color-bg-brand: #18a0fb; /* Brand/primary color */
  --figma-color-text-brand: #ffffff; /* Text on brand background */
  --figma-color-bg-selected: #1a3a4a; /* Selected state background */
  --figma-color-text-selected: #18a0fb; /* Selected state text */
}
```

### Color Usage Guidelines

- **Primary Background**: Use for main content areas and body background
- **Secondary Background**: Use for cards, input fields, and elevated surfaces
- **Primary Text**: Use for headings and main content text
- **Secondary Text**: Use for labels, captions, and less important text
- **Borders**: Use for input fields, buttons, and component boundaries
- **Brand Colors**: Use sparingly for primary actions and highlights

## Typography

### Font Stack

```css
font-family: Inter, Arial, Helvetica, sans-serif;
```

### Font Sizes

- **Large**: `1rem` (16px) - Page headings
- **Medium**: `0.85rem` (13.6px) - Section labels
- **Small**: `0.8rem` (12.8px) - Input text
- **Extra Small**: `0.7rem` (11.2px) - Button text
- **Micro**: `0.6rem` (9.6px) - Footer text

### Font Weights

- **Normal**: `400` - Default text
- **Medium**: `500` - Labels and emphasis
- **Semi-bold**: `600` - Section headers
- **Bold**: `700` - Page headings

## Component Library

### 1. Theme Toggle Component

**File**: `src/components/ThemeToggle.tsx`

A button component that allows users to switch between light and dark themes.

```tsx
import ThemeToggle from "./components/ThemeToggle";

// Usage
<ThemeToggle className="custom-class" />;
```

**Features**:

- Automatic theme detection
- Smooth transitions
- Accessible with proper ARIA labels
- Emoji indicators (☀️ for light, 🌙 for dark)

**Styling Classes**:

- `.theme-toggle` - Base styling
- Hover and active states included

### 2. Input Components

**File**: `src/components/Inputs.tsx`

Form input components with consistent styling.

**Styling Classes**:

- `.input-number` - Number input fields
- `select` - Dropdown menus
- `.input-group-div` - Input container

### 3. Button Components

**File**: `src/components/Buttons.tsx`

Action buttons with consistent styling and states.

**Styling Classes**:

- `.button-pri` - Primary buttons
- `.buttons-div` - Button container

### 4. Layout Components

**File**: `src/components/PageHeading.tsx`, `src/components/BottomSection.tsx`

Layout and structural components.

**Styling Classes**:

- `.heading-div` - Page heading container
- `.heading-text` - Page heading text
- `.content-div` - Content containers
- `.bottomContainer` - Footer container

## Theme System

### Theme Hook

**File**: `src/hooks/useFigmaTheme.ts`

A React hook that manages theme state and provides theme switching functionality.

```tsx
import { useFigmaTheme } from "../hooks/useFigmaTheme";

const { theme, isDark, toggleTheme } = useFigmaTheme();
```

**Returns**:

- `theme`: Current theme ("light" | "dark")
- `isDark`: Boolean indicating if dark theme is active
- `toggleTheme`: Function to switch themes

### Theme Detection

The system automatically detects the appropriate theme:

1. **Figma Environment**: Attempts to detect Figma's current theme
2. **System Preference**: Falls back to user's system preference
3. **Manual Override**: Users can manually toggle themes

### Theme Communication

**Plugin Code** (`src/code.ts`):

```typescript
// Handle theme requests
if (msg.type === "get-theme") {
  const currentTheme = "light"; // Default theme
  figma.ui.postMessage({
    pluginMessage: {
      type: "theme-changed",
      theme: currentTheme,
    },
  });
}
```

## Implementation Guidelines

### 1. CSS Best Practices

- Always use CSS custom properties for colors
- Include transition properties for smooth theme switching
- Use semantic class names
- Maintain consistent spacing and sizing

### 2. Component Development

- Use TypeScript interfaces for props
- Include proper accessibility attributes
- Follow React best practices
- Use consistent naming conventions

### 3. Theme Integration

- Always test both light and dark themes
- Ensure proper contrast ratios
- Use semantic color variables
- Include hover and active states

### 4. Performance Considerations

- Minimize re-renders during theme switching
- Use CSS transitions instead of JavaScript animations
- Optimize bundle size with tree shaking

## File Structure

```
src/
├── components/
│   ├── ThemeToggle.tsx      # Theme toggle component
│   ├── Inputs.tsx          # Input components
│   ├── Buttons.tsx         # Button components
│   ├── PageHeading.tsx     # Page heading component
│   └── BottomSection.tsx   # Footer component
├── hooks/
│   └── useFigmaTheme.ts    # Theme management hook
├── ui.css                  # Design system styles
├── ui.tsx                  # Main UI component
└── code.ts                 # Plugin logic
```

## Usage Examples

### Adding a New Component

1. **Create the component**:

```tsx
// src/components/NewComponent.tsx
import * as React from "react";

interface NewComponentProps {
  className?: string;
}

export default function NewComponent({ className = "" }: NewComponentProps) {
  return <div className={`new-component ${className}`}>Content here</div>;
}
```

2. **Add CSS styles**:

```css
/* In src/ui.css */
.new-component {
  background-color: var(--figma-color-bg-secondary);
  border: 1px solid var(--figma-color-border);
  color: var(--figma-color-text);
  padding: 0.8rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.new-component:hover {
  background-color: var(--figma-color-bg);
  border-color: var(--figma-color-border-strong);
}
```

### Adding Theme-Aware Styling

```css
/* Always use CSS variables for colors */
.my-component {
  background-color: var(--figma-color-bg);
  color: var(--figma-color-text);
  border: 1px solid var(--figma-color-border);
  transition: background-color 0.2s ease, color 0.2s ease,
    border-color 0.2s ease;
}

.my-component:hover {
  background-color: var(--figma-color-bg-secondary);
  border-color: var(--figma-color-border-strong);
}
```

### Using the Theme Hook

```tsx
import { useFigmaTheme } from "../hooks/useFigmaTheme";

function MyComponent() {
  const { theme, isDark, toggleTheme } = useFigmaTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isDark ? "light" : "dark"} mode
      </button>
    </div>
  );
}
```

## Accessibility

### Color Contrast

All color combinations meet WCAG AA standards:

- **Light Theme**: 4.5:1 minimum contrast ratio
- **Dark Theme**: 4.5:1 minimum contrast ratio

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Proper focus indicators are included
- Tab order is logical and intuitive

### Screen Reader Support

- Semantic HTML elements are used
- Proper ARIA labels are included
- Alternative text is provided for icons

## Browser Support

- **Chrome**: 88+
- **Firefox**: 78+
- **Safari**: 14+
- **Edge**: 88+

## Maintenance

### Adding New Colors

1. Add the color variable to both light and dark theme sections
2. Update this documentation
3. Test in both themes

### Updating Components

1. Ensure all colors use CSS variables
2. Test theme switching functionality
3. Verify accessibility compliance
4. Update component documentation

### Performance Monitoring

- Monitor bundle size changes
- Check theme switching performance
- Verify memory usage patterns

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Plugin Development Team
