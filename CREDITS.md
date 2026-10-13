# CREDITS

## Original reference — SkillsGlobe

- Source: `src/components/rpg/tech-sphere/original/SkillsGlobe.jsx`
- Origin: professor-provided reference component for a 3D tech globe using three.js / @react-three/fiber.
- Author/credit: the original file does not declare a named author or explicit license. The professor's name is therefore not confirmed in the current source copy.

## Local adaptation — SkillsGlobeAdapter

- File: `src/components/rpg/tech-sphere/SkillsGlobeAdapter.tsx`
- This file is a TypeScript port of the original `SkillsGlobe.jsx`.
- Changes from the original (minimal, for compilation only):
  1. `import { useTranslation } from 'react-i18next'` → inline shim (same API, Portuguese strings).
  2. `import { useTheme } from '../theme/themeContext'` → `@/hooks/use-theme` (project's own hook).
  3. `import './SkillsGlobe.css'` → `./original/SkillsGlobe.css` (path adjusted).
  4. TypeScript type annotations added throughout.
  5. `icon` prop accepts `string` (single letter) in addition to a React component.
- All logic, constants, and JSX are otherwise identical to the original.

## Legal note

No explicit license was found in the original reference files. Public publication or redistribution of the adapted code should wait for the professor's written confirmation before release.
