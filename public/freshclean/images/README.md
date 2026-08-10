# Photo Specifications for FreshClean Landing Page

All photos should be **bright, warm-toned, and professional**.
Style: clean Scandinavian aesthetic — lots of natural light, minimal clutter, modern interiors.

## Required Images

### 1. hero-image.jpg
- **Size:** 1280 x 800 px (16:10)
- **Content:** Bright, clean apartment with panoramic windows. Sunlight flooding in. Spotless surfaces, modern furniture, feeling of freshness and order.
- **Mood:** Aspirational — "this is how your home could look"
- **Notes:** No people necessary. Focus on the clean space.

### 2. service-regular.jpg
- **Size:** 640 x 400 px (16:10)
- **Content:** Kitchen being cleaned — wiping a countertop or polishing a surface. Soft, warm lighting. Real-looking (not overly staged).
- **Mood:** Everyday care, comfort
- **Notes:** Can include hands/person partially visible.

### 3. service-deep.jpg
- **Size:** 640 x 400 px (16:10)
- **Content:** Close-up of detailed cleaning — bookshelf, furniture, hard-to-reach areas. Micro-fiber cloth, attention to detail.
- **Mood:** Thoroughness, precision
- **Notes:** Close-up shot preferred.

### 4. service-renovation.jpg
- **Size:** 640 x 400 px (16:10)
- **Content:** Before/after concept — half of the frame shows construction dust/mess, the other half shows a perfectly clean room.
- **Mood:** Dramatic transformation
- **Notes:** Clear visual contrast between dirty and clean halves.

### 5. service-office.jpg
- **Size:** 640 x 400 px (16:10)
- **Content:** Clean modern office space — open-plan desks, clean glass, organized workspace. Natural light.
- **Mood:** Professional, productive
- **Notes:** No people. Focus on the clean environment.

### 6. map-placeholder.jpg (optional)
- **Size:** 640 x 400 px (16:10)
- **Content:** Stylized map of Warsaw or alternatively: replace this with a Google Maps iframe in the HTML.
- **Notes:** This can also be skipped if you prefer a Google Maps embed.

## Image Replacement Instructions

1. Place all images in this `images/` folder
2. In `index.html`, replace placeholder `<div>` blocks with `<img>` tags:

```html
<!-- Replace this: -->
<div class="hero-image-placeholder">
  <span>hero-image.jpg...</span>
</div>

<!-- With this: -->
<img src="images/hero-image.jpg" alt="Czyste, jasne mieszkanie w Warszawie" class="hero-image" loading="lazy">
```

3. Add this CSS for the actual images:

```css
.hero-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.service-card img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  object-fit: cover;
  margin-bottom: var(--space-lg);
}
```
