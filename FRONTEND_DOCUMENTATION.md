# Frontend UI/UX Documentation
## Intelligent Multilingual Translator

This document provides a complete specification of the UI, design system, components, and functionality for recreating this application in any tech stack.

---

## Table of Contents
1. [Design System](#design-system)
2. [Application Structure](#application-structure)
3. [Pages & Routing](#pages--routing)
4. [Components](#components)
5. [Features & Functionality](#features--functionality)
6. [Backend Integration](#backend-integration)
7. [Assets](#assets)

---

## Design System

### Color Palette (HSL Values)

**Light Mode:**
```css
--background: 0 0% 100%;
--foreground: 142 71% 15%;
--card: 0 0% 100%;
--card-foreground: 142 71% 15%;
--popover: 0 0% 100%;
--popover-foreground: 142 71% 15%;
--primary: 142 71% 45%;
--primary-foreground: 0 0% 100%;
--primary-glow: 142 71% 65%;
--secondary: 142 30% 95%;
--secondary-foreground: 142 71% 20%;
--muted: 142 30% 96%;
--muted-foreground: 142 20% 45%;
--accent: 142 50% 50%;
--accent-foreground: 0 0% 100%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 100%;
--border: 142 30% 85%;
--input: 142 30% 85%;
--ring: 142 71% 45%;
```

**Dark Mode:**
```css
--background: 142 50% 8%;
--foreground: 142 30% 95%;
--card: 142 45% 10%;
--card-foreground: 142 30% 95%;
--popover: 142 45% 10%;
--popover-foreground: 142 30% 95%;
--primary: 142 71% 55%;
--primary-foreground: 142 71% 10%;
--secondary: 142 30% 15%;
--secondary-foreground: 142 30% 95%;
--muted: 142 30% 15%;
--muted-foreground: 142 20% 65%;
--accent: 142 50% 55%;
--accent-foreground: 0 0% 100%;
--destructive: 0 62.8% 50%;
--destructive-foreground: 0 0% 100%;
--border: 142 30% 18%;
--input: 142 30% 18%;
--ring: 142 71% 55%;
```

### Gradients
```css
/* Light Mode */
--gradient-primary: linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 55%));
--gradient-secondary: linear-gradient(180deg, hsl(142 30% 98%), hsl(142 30% 95%));
--gradient-hero: linear-gradient(135deg, hsl(142 71% 45%) 0%, hsl(142 71% 55%) 50%, hsl(142 71% 65%) 100%);

/* Dark Mode */
--gradient-primary: linear-gradient(135deg, hsl(142 71% 55%), hsl(142 71% 65%));
--gradient-secondary: linear-gradient(180deg, hsl(142 45% 12%), hsl(142 40% 8%));
```

### Shadows
```css
--shadow-primary: 0 10px 40px -10px hsl(142 71% 45% / 0.3);
--shadow-card: 0 4px 20px hsl(142 20% 50% / 0.1);
--shadow-glow: 0 0 40px hsl(142 71% 65% / 0.4);
```

### Border Radius
```css
--radius: 0.75rem; /* 12px */
```

### Typography
- **Font Family**: System font stack (default)
- **Heading Sizes**: 
  - H1: `text-2xl` (1.5rem/24px) or larger depending on context
  - Page titles: `text-3xl font-bold` (1.875rem/30px)
- **Body**: `text-base` (1rem/16px) or `text-lg` (1.125rem/18px) for textareas

### Animations

**Keyframes:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Utility Classes:**
- `.animate-fade-in` - 0.5s ease-in-out fade in
- `.animate-slide-up` - 0.4s ease-out slide up from bottom
- `.animate-scale-in` - 0.3s ease-out scale in
- `.hover-lift` - On hover: `translateY(-4px)` + shadow

**Transitions:**
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Application Structure

### Layout Pattern
All pages (except Auth and NotFound) use a consistent layout:

```
┌─────────────────────────────────────┐
│  Sidebar (collapsible)              │
│  - Logo/App name                    │
│  - Navigation menu                  │
│  - User profile (bottom)            │
├─────────────────────────────────────┤
│  Header (sticky)                    │
│  - Sidebar trigger                  │
│  - Back button (← arrow icon)       │
│  - Page title                       │
├─────────────────────────────────────┤
│  Main Content Area                  │
│  - Container: max-w-6xl mx-auto     │
│  - Padding: px-4 py-12              │
│  - Cards with content               │
└─────────────────────────────────────┘
```

### Sidebar Specifications
- **Width**: 
  - Collapsed: `w-14` (56px)
  - Expanded: `w-60` (240px)
- **Position**: Fixed left
- **Navigation Items**:
  1. Home (/) - Home icon
  2. Text Translation (/translate) - Languages icon
  3. Image Translation (/image-translate) - ImageIcon icon
  4. Video Translation (/video-translate) - Video icon
  5. History (/history) - History icon

- **Active State**: `bg-muted text-primary font-medium`
- **Hover State**: `hover:bg-muted/50`
- **User Profile**: Bottom section with avatar, name, and Sign Out button

### Header Specifications
- **Height**: `h-16` (64px)
- **Styling**: 
  - Border bottom: `border-b border-border`
  - Background: `bg-background/80 backdrop-blur-lg`
  - Position: `sticky top-0 z-50`
- **Contents**:
  - Sidebar trigger button (left, ml-4)
  - Back button (ArrowLeft icon, ghost variant, navigates to "/")
  - Page title (text-2xl font-bold)

---

## Pages & Routing

### 1. Home Page (`/`)
**File**: `src/pages/Index.tsx`

**Layout**:
- Full-screen hero section with background image (`hero-bg.jpg`)
- Semi-transparent overlay: `bg-background/90 backdrop-blur-sm`
- Centered content card with app logo and title
- Feature cards grid (3 columns on desktop, 1 on mobile)

**Features Cards**:
1. **Text Translation**
   - Icon: Languages (green)
   - Title: "Text Translation"
   - Description: "Translate text between 100+ languages..."
   - Button: "Start Translating" → `/translate`

2. **Image Translation**
   - Icon: ImageIcon (green)
   - Title: "Image Translation"
   - Description: "Extract and translate text from images..."
   - Button: "Translate Image" → `/image-translate`

3. **Video Translation**
   - Icon: Video (green)
   - Title: "Video Translation"
   - Description: "Extract and translate audio from videos..."
   - Button: "Translate Video" → `/video-translate`

**Styling**:
- Cards: `rounded-2xl shadow-lg hover-lift`
- Background: hero image with overlay
- Animations: `animate-fade-in`, `animate-slide-up`

---

### 2. Text Translation Page (`/translate`)
**File**: `src/pages/Translate.tsx`

**Layout**: Two-column grid (responsive)

**Left Column (Source)**:
- Language selector dropdown (source language)
- Swap languages button (ArrowRightLeft icon)
- Voice input button (Mic icon, red pulse when listening)
- Large textarea (`min-h-[250px]`, `rounded-xl shadow-inner`)
- Word counter below textarea: "Words: {count}"
- Grammar error display (if any):
  - Red-tinted boxes with error messages
  - Clickable replacement suggestions
- Action buttons row:
  - **Translate** button (primary, with ArrowLeftRight icon)
  - **Grammar Check** button (outline, CheckCircle2 icon)
  - **Clear All** button (outline, Trash2 icon)
- Copy and Speak buttons (smaller, below)

**Right Column (Translation)**:
- Language selector dropdown (target language)
- Large textarea (`min-h-[300px]`, read-only, `bg-secondary/50`)
- Action buttons (when translation exists):
  - **Copy** (outline)
  - **Speak** (outline, toggles to "Stop")
  - **Share** (outline, Share2 icon)
  - **Download** (outline, Download icon)

**Tooltips**: All buttons have hover tooltips explaining their function

**Interactions**:
- Real-time word counting
- Voice input toggles listening state
- Swap languages exchanges source/target + texts
- Clear all resets everything
- Share uses native share API (fallback to clipboard)
- Download creates .txt file with both original and translation

---

### 3. Image Translation Page (`/image-translate`)
**File**: `src/pages/ImageTranslate.tsx`

**Layout**: Two-column grid

**Left Column**:
- Dropzone for image upload:
  - Dashed border: `border-2 border-dashed rounded-lg`
  - Active state: `border-primary bg-primary/10`
  - Accepted formats: images, PDF, DOCX
  - Preview: Shows uploaded image with delete button overlay
  - Empty state: ImageIcon + text prompts
- Progress bar (shows during text extraction)
- Target language selector
- **Extract & Translate** button (primary, Upload icon)

**Right Column**:
- **Extracted Text** section:
  - Label: "Extracted Text"
  - Read-only textarea (`bg-secondary/50`)
  - Copy and Speak buttons (if text exists)
- **Translation** section:
  - Label: "Translation"
  - Read-only textarea
  - Copy and Speak buttons (if translation exists)

**Alert**: Shows error when no text detected (red alert, can remove file)

**Background**: Solid background (no image)

---

### 4. Video Translation Page (`/video-translate`)
**File**: `src/pages/VideoTranslate.tsx`

**Layout**: Similar to Image Translation

**Left Column**:
- Video dropzone:
  - Accepted formats: `.mp4, .mov, .avi, .mkv, .webm, .flv, .wmv, .mpeg`
  - Preview: Video player with controls
  - Delete button overlay
- Processing indicators:
  - Spinner with stage text (e.g., "Extracting audio...")
  - Progress bar showing percentage
- Extracted text textarea (editable)
- Character count display
- Target language selector
- Re-translate button (if text exists)
- Copy and Speak buttons

**Right Column**:
- Translated subtitles textarea (read-only)
- Action buttons (when available):
  - Copy
  - Speak/Stop
  - Download (creates .srt file)

**Automatic Process**:
1. Upload video → auto-extract audio
2. Transcribe audio → show in left textarea
3. Auto-translate → show in right textarea
4. Save to history

**Background**: Solid background

---

### 5. History Page (`/history`)
**File**: `src/pages/History.tsx`

**Layout**: Single column with cards

**Header**:
- Title: "Translation History"
- Clear History button (destructive, right-aligned, Trash2 icon)

**Content**:
- Loading state: Centered spinner
- Empty state: "No translation history yet"
- History cards (most recent first):
  - Date/time in top-left
  - Translation type badge (top-right): "text", "image", or "video"
  - Two-column layout:
    - Left: Source language + source text
    - Right: Target language + translated text
  - Styling: `hover-lift animate-slide-up`

**Functionality**:
- Loads last 50 translations
- Clear history deletes all user's history

---

### 6. Authentication Page (`/auth`)
**File**: `src/pages/Auth.tsx`

**Layout**: Centered card on full-screen background

**Background**: `auth-bg.jpg` with overlay (`bg-background/90 backdrop-blur-sm`)

**Card Content**:
- Logo: Green gradient circle with Languages icon
- Title: "Welcome to LinguaConnect" (gradient text)
- Description: "Break language barriers with AI-powered translation"
- Tabs: Login / Register

**Login Tab**:
- Email input
- Password input
- Sign In button

**Register Tab**:
- Full Name input
- Email input
- Password input (min 6 chars)
- Create Account button

**Styling**: Card has shadow-2xl, border-2

---

### 7. 404 Page (`/404` or unmatched routes)
**File**: `src/pages/NotFound.tsx`

**Layout**: Centered content

**Content**:
- Large "404" text (text-6xl font-bold)
- Message: "Oops! Page not found"
- Back button with ArrowLeft icon → navigates to "/"

**Background**: Solid background color

---

## Components

### UI Components (shadcn-based)

All components use semantic color tokens from the design system.

**Key Components Used**:

1. **Button** (`button.tsx`)
   - Variants: default, destructive, outline, ghost, secondary
   - Sizes: default, sm, lg, icon
   - Rounded corners: `rounded-xl` or `rounded-2xl`
   - Shadow: `shadow-md` on primary variant

2. **Card** (`card.tsx`)
   - Base: `rounded-2xl shadow-lg`
   - Hover effect: `hover-lift`
   - Padding: `p-6`

3. **Textarea** (`textarea.tsx`)
   - Source inputs: `rounded-xl shadow-inner`
   - Output/readonly: `bg-secondary/50 rounded-xl`

4. **Select** (`select.tsx`)
   - Dropdown for language selection
   - Shows flag emoji + language name

5. **Tooltip** (`tooltip.tsx`)
   - All action buttons have tooltips
   - Appears on hover and focus

6. **Alert** (`alert.tsx`)
   - Destructive variant for errors
   - Includes AlertCircle icon
   - Action buttons embedded

7. **Progress** (`progress.tsx`)
   - Used for extraction/processing progress

8. **Badge** (`badge.tsx`)
   - Grammar suggestions (clickable)
   - Translation type labels

9. **Sidebar** (`sidebar.tsx`)
   - Collapsible navigation
   - SidebarProvider, SidebarTrigger, SidebarContent, SidebarGroup, etc.

---

## Features & Functionality

### Language Selection
**Available Languages** (from `src/utils/languages.ts`):
- English (🇬🇧), Spanish (🇪🇸), French (🇫🇷), German (🇩🇪), Italian (🇮🇹)
- Portuguese (🇵🇹), Russian (🇷🇺), Japanese (🇯🇵), Korean (🇰🇷), Chinese Simplified (🇨🇳)
- Arabic (🇸🇦), Hindi (🇮🇳), Turkish (🇹🇷), Dutch (🇳🇱), Swedish (🇸🇪)
- Polish (🇵🇱), Vietnamese (🇻🇳), Thai (🇹🇭), Hebrew (🇮🇱), Greek (🇬🇷)

Format: `{ code: 'en', name: 'English', flag: '🇬🇧' }`

### Text Translation Features

1. **Real-time Word Counter**
   - Counts words on every keystroke
   - Formula: `sourceText.trim().split(/\s+/).length`
   - Shows "Words: {count}"

2. **Voice Input**
   - Uses Web Speech API
   - Button shows red pulse when listening
   - Stops on speech detected or manual stop

3. **Text-to-Speech**
   - Uses SpeechSynthesis API
   - Button toggles between "Speak" and "Stop"
   - Speaks in selected language

4. **Grammar Check**
   - Checks source text for errors
   - Displays errors in red boxes
   - Shows clickable replacement suggestions
   - Applying suggestion updates source text

5. **Swap Languages**
   - Exchanges source ↔ target languages
   - Exchanges source text ↔ translated text

6. **Clear All**
   - Resets all text fields
   - Clears grammar errors
   - Shows success toast

7. **Share Translation**
   - Uses Web Share API if available
   - Fallback: Copy to clipboard
   - Format: `{sourceText}\n\n→ {translatedText}`

8. **Download Translation**
   - Creates .txt file
   - Format:
     ```
     Original (en):
     {sourceText}
     
     Translation (es):
     {translatedText}
     ```
   - Filename: `translation-{timestamp}.txt`

### Image Translation Features

1. **Drag & Drop Upload**
   - Accepts: images, PDF, DOCX
   - Single file only
   - Shows preview with delete button

2. **OCR Text Extraction**
   - Uses Tesseract.js
   - Shows progress bar
   - Extracts text from uploaded file

3. **Auto-translation**
   - After extraction, auto-translates to target language
   - Saves to history

4. **Error Handling**
   - Shows alert if no text detected
   - Allows file removal

### Video Translation Features

1. **Video Upload**
   - Drag & drop or click
   - Shows video preview with controls
   - Delete button overlay

2. **Audio Extraction & Transcription**
   - Uses Hugging Face Transformers (@huggingface/transformers)
   - Whisper model for speech-to-text
   - Shows multi-stage progress:
     - "Loading model..."
     - "Extracting audio..."
     - "Transcribing..."
   - Progress bar with percentage

3. **Automatic Flow**
   - Upload → Extract → Transcribe → Translate → Save
   - All automatic on file drop
   - User can edit extracted text and re-translate

4. **Subtitle Download**
   - Downloads as .srt file
   - Filename: `subtitles_{targetLang}.srt`

### History Features

1. **Load History**
   - Fetches last 50 translations
   - Sorts by most recent first
   - Shows all translation types

2. **Clear History**
   - Deletes all user's translations
   - Confirmation via button click

---

## Backend Integration

### Supabase Configuration
- **Authentication**: Email/password
- **Database Table**: `translation_history`
  - Fields: id, user_id, source_text, translated_text, source_language, target_language, translation_type, created_at

### Translation Service (`src/utils/translationService.ts`)
- Uses MyMemory API: `https://api.mymemory.translated.net/get`
- Handles text translation
- Manages speech synthesis and recognition

### Grammar Service (`src/utils/grammarService.ts`)
- Checks grammar using LanguageTool API
- Returns errors with replacements

### OCR Service (`src/utils/ocrService.ts`)
- Uses Tesseract.js for image text extraction
- Reports progress via callback

### Audio Transcription Service (`src/utils/audioTranscriptionService.ts`)
- Uses @huggingface/transformers
- Whisper tiny model
- Extracts audio from video → transcribes → returns text

---

## Assets

### Images
1. **hero-bg.jpg** - Homepage hero background
2. **auth-bg.jpg** - Authentication page background
3. **text-bg.jpg** - Used on some translation pages (now removed on Video page)

### Icons (lucide-react)
All icons are from `lucide-react` package:
- ArrowLeft, ArrowLeftRight, ArrowRightLeft
- Copy, Download, Share2, Trash2, Upload
- Languages, ImageIcon, Video, Mic, Volume2
- Loader2 (spinner), CheckCircle2, AlertCircle
- Home, History, User

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: ≥ 1024px

### Responsive Patterns

**Grid Layouts**:
- Cards: `grid md:grid-cols-2 gap-6` (2 columns on desktop, 1 on mobile)
- Feature cards: `grid md:grid-cols-3 gap-6` (3 columns on desktop)

**Sidebar**:
- Always visible on desktop
- Collapsible/overlay on mobile (via trigger button)

**Buttons**:
- Full width on mobile: `w-full md:w-auto`
- Flex wrap for button groups: `flex gap-2 flex-wrap`

**Container**:
- Max width: `max-w-6xl mx-auto`
- Padding: `px-4 py-12`

---

## State Management Patterns

### Component State (React hooks equivalents)

**Text Translation**:
- sourceText, translatedText
- sourceLang, targetLang (default: 'en', 'es')
- loading, listening
- grammarErrors (array)

**Image Translation**:
- imageFile, imagePreview
- extractedText, translatedText
- targetLang
- loading, progress
- showInvalidError
- isSpeakingExtracted, isSpeakingTranslated

**Video Translation**:
- videoFile, videoUrl
- subtitles, translatedSubtitles
- targetLang
- loading, extracting
- extractProgress, extractStage
- showInvalidError
- isSpeakingSubtitles, isSpeakingTranslated

**History**:
- history (array)
- loading

**Auth**:
- loginEmail, loginPassword
- registerEmail, registerPassword, registerFullName
- loading

### Side Effects

**On mount**:
- History page: Load translation history
- Auth page: Redirect if already logged in

**On file upload**:
- Image: Auto-extract and translate
- Video: Auto-extract, transcribe, and translate

**On translation**:
- Save to database (if user logged in)
- Show success toast

---

## Accessibility

### Keyboard Navigation
- All buttons are keyboard accessible
- Tooltips appear on focus
- Forms have proper label associations

### ARIA Labels
- Icon-only buttons have aria-label or tooltip
- Loading states announced
- Error messages associated with inputs

### Color Contrast
- Primary green on white: sufficient contrast
- Text on backgrounds: proper contrast ratios
- Error messages: high contrast

---

## Performance Considerations

### Code Splitting
- Pages are lazy-loaded via routing
- Heavy libraries (Tesseract, Transformers) loaded on-demand

### Image Optimization
- Background images should be optimized
- Use appropriate formats (WebP where supported)

### Loading States
- All async operations show loading indicators
- Skeleton screens or spinners for data fetching

---

## Browser Compatibility

### Required APIs
- **Web Speech API**: For voice input (Chrome, Edge, Safari)
- **Speech Synthesis API**: For text-to-speech (all modern browsers)
- **Web Share API**: Progressive enhancement (fallback to clipboard)
- **File API**: For file uploads (all modern browsers)

### Fallbacks
- Share API → clipboard copy
- Speech APIs → graceful degradation with error toast

---

## Development Notes

### Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Key Dependencies
- React 18.3.1
- React Router DOM 6.30.1
- Supabase JS 2.75.0
- Tesseract.js 6.0.1
- @huggingface/transformers 3.7.5
- lucide-react 0.462.0
- Tailwind CSS
- shadcn/ui components

---

## Testing Checklist

When recreating this UI, verify:

- [ ] All 7 pages render correctly
- [ ] Sidebar navigation works
- [ ] Back buttons navigate to home
- [ ] Theme toggle works (light/dark)
- [ ] Text translation with all features
- [ ] Image upload and OCR extraction
- [ ] Video upload and transcription
- [ ] History loads and clears
- [ ] Authentication flow
- [ ] All tooltips appear
- [ ] Responsive on mobile/tablet/desktop
- [ ] All animations smooth
- [ ] Error states display correctly
- [ ] Success toasts appear
- [ ] File downloads work
- [ ] Share functionality works
- [ ] Voice input/output works
- [ ] Grammar check works

---

## Design Philosophy

**Green & White Theme**: Clean, fresh, and professional. Green represents growth, harmony, and global connection.

**Minimalism**: Simple, uncluttered interfaces focusing on core functionality.

**Consistency**: Same layout pattern, button styles, and interactions across all pages.

**Accessibility**: Tooltips, keyboard support, high contrast, clear labels.

**Progressive Enhancement**: Core features work everywhere, advanced features (voice, share) enhance experience when available.

---

This documentation provides everything needed to recreate the exact UI/UX in any tech stack. Good luck with your conversion!
