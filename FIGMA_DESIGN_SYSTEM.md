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

The real values come from Figma. `figma.showUI(__html__, { themeColors: true })` injects Figma's own `--figma-color-*` variables for the user's current light or dark theme, so the UI always matches Figma.

#### Fallback Values

`src/ui.css` defines light fallbacks inside `:where(:root)`. `:where()` has zero specificity, so Figma's injected values always win. The fallbacks only apply outside Figma (e.g. opening `ui.html` in a browser).

```css
:where(:root) {
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

#### Dark Theme

No dark values are hard-coded. In dark mode Figma injects dark values for the same variables (and adds a `figma-dark` class to `<html>`), so every component that uses the variables switches automatically.

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

### 1. Input Components

**File**: `src/components/Inputs.tsx`

Controlled count + unit inputs. State lives in `App` (`src/ui.tsx`).

**Styling Classes**:

- `.input-number` - Number input fields
- `select` - Dropdown menus
- `.input-group-div` - Input container

### 2. Button Components

**Files**: `src/components/Buttons.tsx`, `src/components/LangButton.tsx`

Language buttons are generated from `LANGUAGES` in `src/data/languages.ts`, in two groups: Indian languages (`group: "desi"`) and the classic Lorem ipsum (`group: "classic"`). To add a language, add a config entry there and a word array in `src/data/wordSpace.ts`.

**Styling Classes**:

- `.button-pri` - Language buttons
- `.button-wide` - Wider variant for long labels (e.g. "Lorem ipsum")
- `.buttons-div` - Button container
- `.buttons-grid` - Three-column variant for the Indian language buttons (flex, so an incomplete last row stays centred). The plugin is 272px wide so the longest label ("Malayalam") fits in Inter with some slack. Recheck this if a longer language name is added

### 3. Layout Components

**File**: `src/components/BottomSection.tsx`

**Styling Classes**:

- `.content-div` - Content containers
- `.bottom-wrapper` - Footer container
- `.icon-button` - Small square icon button (disclaimer, theme toggle)

## Theme System

By default the plugin follows Figma's theme. A footer button lets users override it.

**Plugin Code** (`src/code.ts`):

```typescript
figma.showUI(__html__, { width: 272, height: 410, themeColors: true });
```

When the user switches Figma between light and dark, Figma updates the injected variables live, with no plugin code involved. If a style ever needs to differ beyond colour, target `html.figma-dark` in CSS.

### Manual Override (Auto → Light → Dark)

**Files**: `src/components/ThemeToggle.tsx`, `src/hooks/useThemePreference.ts`

- The footer button cycles 🌗 Auto (follows Figma) → ☀️ Light → 🌙 Dark.
- Light/Dark set `data-theme` on `<html>`. `html[data-theme="light"|"dark"]` in `ui.css` defines a full palette and is more specific than Figma's injected `:root` values, so it wins. Auto removes the attribute.
- The choice is saved per user with `figma.clientStorage` (key `themePreference`), because the UI iframe can't rely on `localStorage` inside Figma:
  - UI → plugin `get-theme-pref` on load; plugin → UI `{ type: "theme-pref", value }`
  - UI → plugin `set-theme-pref` with the new value on each click

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
│   ├── Inputs.tsx          # Count + unit inputs
│   ├── Buttons.tsx         # Language button groups
│   ├── LangButton.tsx      # Single language button
│   ├── ThemeToggle.tsx     # Auto / Light / Dark override button
│   └── BottomSection.tsx   # Footer component
├── hooks/
│   └── useThemePreference.ts # Theme override state, saved via clientStorage
├── data/
│   ├── languages.ts        # Language config (fonts, punctuation, groups), shared by UI + plugin
│   └── wordSpace.ts        # Word bank per language (plugin side only)
├── generator.ts            # Pure text generator (no Figma API)
├── fill.ts                 # Pure fill-to-fit search (caller measures the layer)
├── amount.ts               # Pure amount parsing/validation + quick-action suggestions
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
