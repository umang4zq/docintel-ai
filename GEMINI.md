# Wirekit Project Guidelines

## Animation Standards

To ensure performance and maintainability, animations are split between Framer Motion and GSAP based on complexity.

### Framer Motion
Use Framer Motion for declarative, component-level animations:
- Page transitions
- Card / section scroll reveals
- Stagger list animations
- Hero text entrance
- Modal open/close

### GSAP
Use GSAP for imperative, complex, or timeline-based animations:
- Complex timelines (landing page sequences)
- Scroll-triggered text (using `ScrollTrigger` plugin)
- Character-by-character text reveals
- Pinned scroll sections
- Anything needing precise timing control

### Critical Rule
**Never mix both Framer Motion and GSAP on the same element.** Pick one library per component to avoid conflicts and performance degradation.
