# React Frontend — Plataforma MAO
## End-User Pages Implementation Plan

> Public-facing frontend: Laravel 12 + Inertia.js + React 19 + TailwindCSS 4 + shadcn/ui
> Mobile-first (375px baseline). Navigation pattern: Hillsong/Elevation off-canvas.
> All images from `/storage/{path}` — local Laravel Storage, no CDN.

---

## TypeScript Types (`resources/js/types/index.ts`)

```ts
export type Status = 'active' | 'inactive'

export interface Province {
  id: number; name: string; slug: string; code: string
  hero_image: string | null; hero_video_url: string | null
  tagline: string | null; description: string | null; status: Status
}

export interface Region {
  id: number; province_id: number; name: string; slug: string
  cover_image: string | null; churches_count?: number
}

export interface Zone {
  id: number; region_id: number; name: string; slug: string
  churches_count?: number
}

export interface Church {
  id: number; name: string; slug: string
  type: 'church' | 'congregation'
  province: Pick<Province, 'name' | 'slug'>
  region: Pick<Region, 'name' | 'slug'> | null
  zone: Pick<Zone, 'name' | 'slug'> | null
  address: string | null; lat: number | null; lng: number | null
  pastor_name: string | null; phone: string | null; email: string | null
  service_times: { day: string; time: string; label: string }[] | null
  status: 'active' | 'inactive' | 'plant'
  programs?: ChurchProgram[]
}

export interface GroupType {
  id: number; name: string; slug: string; icon: string; order: number
}

export interface ChurchProgram {
  id: number; church_id: number; group_type: GroupType
  name: string | null; day_of_week: string | null
  start_time: string | null; end_time: string | null
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'occasional'
  location: string | null; description: string | null
  status: 'active' | 'inactive' | 'suspended'
}

export interface Event {
  id: number; title: string; slug: string; description: string | null
  type: string; starts_at: string; ends_at: string | null
  location: string | null; is_online: boolean; stream_url: string | null
  max_capacity: number | null; registration_required: boolean
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  scope_type: string; scope_id: number | null
}

export interface Sermon {
  id: number; title: string; series: string | null; description: string | null
  video_url: string | null; audio_url: string | null; pdf_url: string | null
  duration_minutes: number | null; preached_at: string; status: string
  speaker?: Pick<User, 'id' | 'name'>
}

export interface NewsItem {
  id: number; title: string; slug: string; excerpt: string | null
  cover_image: string | null; published_at: string; status: string
  body?: string
}

export interface Missionary {
  id: number; full_name: string; status: string; bio: string | null
  specialization: string | null; photo_url: string | null
  phone: string | null; email: string | null; needs: string | null
  province: Pick<Province, 'name' | 'slug'>
}

export interface SocialProject {
  id: number; name: string; category: string; description: string | null
  status: string; started_at: string | null
  province: Pick<Province, 'name' | 'slug'>
  impacts?: { metric_name: string; metric_value: number; recorded_at: string }[]
}

export interface User {
  id: number; name: string; email: string; role_label?: string
}

// Inertia shared props (from HandleInertiaRequests::share)
export interface SharedProps {
  auth: { user: User | null }
  provinces: Pick<Province, 'id' | 'name' | 'slug'>[]
  flash: { success: string | null; error: string | null }
}
```

---

## Component Tree

```
resources/js/
├── types/
│   └── index.ts                    ← all interfaces above
├── lib/
│   └── utils.ts                    ← cn(), formatDate(), storageUrl()
├── layouts/
│   ├── GlobalLayout.tsx            ← GlobalHeader + OffCanvas + GlobalFooter + WhatsApp
│   └── ProvinceLayout.tsx          ← ProvinceHeader + ProvinceOffCanvas + ProvinceFooter
├── components/
│   ├── navigation/
│   │   ├── GlobalHeader.tsx        ← logo · 3 links · search · menu button
│   │   ├── ProvinceHeader.tsx      ← province logo · eventos · missões · dar · menu
│   │   ├── OffCanvas.tsx           ← Framer Motion slide-from-right, dual mode (global/province)
│   │   └── MobileNav.tsx           ← province bottom tab bar (optional enhancement)
│   ├── home/
│   │   ├── HeroSection.tsx         ← headline + verse + 2 CTAs + 4 KPI counters
│   │   ├── SocialProjectsSection.tsx
│   │   ├── NationalEventsSection.tsx
│   │   ├── SermonSection.tsx       ← last sermon + resources grid
│   │   ├── ChurchMapSection.tsx    ← Leaflet (dynamic import)
│   │   └── SupportCTASection.tsx
│   ├── province/
│   │   ├── ProvinceHero.tsx        ← hero image/video + tagline + pastor + CTA
│   │   ├── LocationGrid.tsx        ← regions grid (Hillsong AU style)
│   │   ├── MinisteriosGrid.tsx     ← 5 fixed group type cards
│   │   └── ProvinceFooter.tsx
│   ├── church/
│   │   ├── ChurchHero.tsx
│   │   ├── ServiceTimesCard.tsx
│   │   └── ProgramsByType.tsx      ← programs grouped by HomogeneousGroupType
│   ├── cards/
│   │   ├── EventCard.tsx
│   │   ├── SermonCard.tsx
│   │   ├── ChurchCard.tsx
│   │   ├── NewsCard.tsx
│   │   ├── MissionaryCard.tsx
│   │   └── SocialProjectCard.tsx
│   ├── map/
│   │   └── ChurchMap.tsx           ← React Leaflet, dynamic import only
│   ├── forms/
│   │   ├── ContactForm.tsx         ← React Hook Form + Zod + router.post()
│   │   ├── EventRegistrationForm.tsx
│   │   ├── PartnershipForm.tsx
│   │   └── DonationForm.tsx
│   └── ui/                         ← shadcn/ui components (button, input, dialog…)
└── pages/
    ├── Home.tsx
    ├── QuemSomos.tsx
    ├── IntervencoSocial.tsx
    ├── Missoes.tsx
    ├── Media.tsx
    ├── SermonDetail.tsx
    ├── Agenda.tsx
    ├── EventDetail.tsx
    ├── Apoiar.tsx
    ├── Contacto.tsx
    ├── Province/
    │   ├── Index.tsx
    │   ├── Localizacoes.tsx
    │   ├── Events.tsx
    │   ├── News.tsx
    │   ├── NewsDetail.tsx
    │   ├── Missoes.tsx
    │   ├── Ministerios.tsx
    │   └── Dar.tsx
    ├── Region/
    │   └── Index.tsx
    ├── Zone/
    │   └── Index.tsx
    ├── Church/
    │   └── Show.tsx
    └── Auth/
        ├── Login.tsx
        └── Register.tsx
```

---

## Design System (`resources/css/globals.css` + `tailwind.config.ts`)

```css
/* Design tokens */
:root {
  --color-brand:      #7B3B2A;
  --color-brand-dark: #5C2B1C;
  --color-brand-light:#C4826A;
  --color-brand-pale: #F5EDE8;
  --color-cream:      #FAF7F2;
  --color-ink:        #1A1410;
  --color-ink-muted:  #5C5048;
  --font-display: 'Cormorant Garamond', serif;
  --font-body:    'DM Sans', sans-serif;
}
```

```ts
// tailwind.config.ts — extend with brand tokens
colors: {
  brand: { DEFAULT: '#7B3B2A', dark: '#5C2B1C', light: '#C4826A', pale: '#F5EDE8' },
  cream: '#FAF7F2',
  ink: { DEFAULT: '#1A1410', muted: '#5C5048' },
}
```

Google Fonts import (in `app.blade.php`):
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

Utility (`lib/utils.ts`):
```ts
export const storageUrl = (path: string) => `/storage/${path}`
export const formatDate = (iso: string, locale = 'pt-MZ') =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
```

---

## Navigation System

### `GlobalHeader.tsx`
```
[ AΩ Logo ]  [ Intervenção Social ]  [ Missões ]  [ Agenda ]  [ 🔍 ]  [ ≡ Menu ]
```
- Sticky, `bg-cream/95 backdrop-blur`
- Hamburger opens `<OffCanvas mode="global" />`

### `ProvinceHeader.tsx`
```
[ AΩ + Province Name ]  [ Eventos ]  [ Missões ]  [ Dar ]  [ ≡ Menu ]
```
- Sticky, province-specific branding accent
- Hamburger opens `<OffCanvas mode="province" province={province} />`

### `OffCanvas.tsx` (Framer Motion)
```tsx
// Dual mode — global and provincial
// Global sections:
//   Secção 1 "Explorar": Quem somos · Social · Missões · Média · Agenda
//   Secção 2 "Estrutura": Órgãos · Internacional · Documentos
//   CTA: Atendimento via WhatsApp
//
// Provincial sections:
//   Início · Localizações (sub-list of regions) · Eventos · Missões
//   Ministérios (Jovens · Mulheres · Homens · Crianças · Seniores)
//   Notícias · Dar
//   Footer: link → alfaomega.org (global)

<AnimatePresence>
  {isOpen && (
    <>
      <motion.div className="fixed inset-0 bg-black/55 z-40" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.nav className="fixed inset-y-0 right-0 w-96 max-w-[90vw] bg-stone-900 z-50 overflow-y-auto flex flex-col"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}>
        ...
      </motion.nav>
    </>
  )}
</AnimatePresence>
```

---

## Phase 1 — Foundation: Design System + Navigation
**Duration**: 1 week

- [ ] `resources/css/globals.css` — design tokens
- [ ] `tailwind.config.ts` — brand palette + font families
- [ ] `lib/utils.ts` — `cn()`, `storageUrl()`, `formatDate()`
- [ ] `types/index.ts` — all TypeScript interfaces
- [ ] `layouts/GlobalLayout.tsx` + `layouts/ProvinceLayout.tsx`
- [ ] `components/navigation/GlobalHeader.tsx`
- [ ] `components/navigation/ProvinceHeader.tsx`
- [ ] `components/navigation/OffCanvas.tsx` (Framer Motion, dual mode)
- [ ] `components/GlobalFooter.tsx` — 4 columns + social links
- [ ] `components/ProvinceFooter.tsx` — province links + global link
- [ ] WhatsApp float button (fixed bottom-right, links to wa.me)
- [ ] `app/Http/Middleware/HandleInertiaRequests.php` — share `provinces` + `auth.user` + `flash`
- [ ] shadcn/ui: install Button, Input, Select, Dialog, Tabs, Badge, Skeleton

**Verification**: `npm run dev` → navigate to `/` → GlobalHeader renders, OffCanvas opens and closes with animation at 375px.

---

## Phase 2 — Global Homepage
**Duration**: 1 week

**Controller** (`GlobalController@index`):
```php
return Inertia::render('Home', [
  'socialProjects' => SocialProjectResource::collection(
    SocialProject::active()->with('province')->limit(3)->get()
  ),
  'events' => EventResource::collection(
    Event::national()->upcoming()->published()->limit(3)->get()
  ),
  'sermon' => SermonResource::make(
    Sermon::national()->published()->latest('preached_at')->first()
  ),
  'stats' => [
    'churches'     => Church::active()->count(),
    'provinces'    => Province::active()->count(),
    'missionaries' => Missionary::active()->count(),
    'years'        => now()->year - 1995,
  ],
]);
```

**`pages/Home.tsx` sections:**

| # | Section | Component | Data |
|---|---------|-----------|------|
| 1 | Fixed header | `GlobalHeader` | `provinces` (shared) |
| 2 | Hero | `HeroSection` | `stats` (4 KPIs with count-up animation) |
| 3 | Intervenção Social | `SocialProjectsSection` | `socialProjects[3]` |
| 4 | Agenda Nacional | `NationalEventsSection` | `events[3]` |
| 5 | Última Pregação | `SermonSection` | `sermon` + static resource links |
| 6 | Mapa de Igrejas | `ChurchMapSection` | fetched client-side via TanStack Query after load |
| 7 | CTA Apoio | `SupportCTASection` | static: 3 CTA buttons |
| 8 | Footer | `GlobalFooter` | static |
| — | Float | WhatsApp button | static |

**`HeroSection.tsx`** — count-up animation on KPIs:
```tsx
// Use framer-motion useInView + useMotionValue + useTransform
// KPIs: X Igrejas · X Províncias · X Missionários · X Anos
```

**`ChurchMapSection.tsx`** — Leaflet loaded dynamically:
```tsx
const ChurchMap = dynamic(() => import('../components/map/ChurchMap'), { ssr: false })
// TanStack Query: useQuery({ queryKey: ['churches-map'], queryFn: () => fetch('/api/v1/churches?fields=lat,lng,name,slug').then(r => r.json()) })
// Leaflet markers clustered by province, click → church page
```

**Verification**: All 7 sections visible. KPI counters animate on scroll. Map loads after hero. WhatsApp button visible on mobile.

---

## Phase 3 — Global Static Pages
**Duration**: 1 week

### `pages/QuemSomos.tsx`
- Controller: `GlobalController@quemSomos` → `Inertia::render('QuemSomos', ['documents', 'leadership'])`
- Sections: Hero banner · História (timeline) · Liderança (cards) · Documentos (download list)

### `pages/IntervencoSocial.tsx`
- Controller: `GlobalController@social` → `['projects' => SocialProject with impacts]`
- Sections: Intro · Project cards with metrics (metric_value counters) · Map of provinces

### `pages/Missoes.tsx` (national)
- Controller: `GlobalController@missoes` → `['missionaries', 'churches_geojson']`
- Sections: Stats · National map (Leaflet) · Missionary cards grid · Join CTA

### `pages/Apoiar.tsx`
- Controller: `GlobalController@apoiar`
- Sections: 3-column CTA (Apoiar financeiramente · Propor parceria · Voluntariar)
- Each opens a modal: `DonationForm`, `PartnershipForm`, generic contact

### `pages/Contacto.tsx`
- Controller: `GlobalController@contacto`
- `ContactForm.tsx`: React Hook Form + Zod + `router.post('/contacto')`
- Fields: name, email (optional), phone, type (select), message
- Success: flash message via Inertia

**Verification**: All pages reachable via OffCanvas nav links. Contact form submits, flash success appears.

---

## Phase 4 — Media & Agenda
**Duration**: 1 week

### `pages/Media.tsx`
- Controller: `SermonController@index` → `['sermons' (paginated), 'series' (distinct list), 'preachers']`
- Filters (TanStack Query client-side refetch): série, pregador, data, província
- `SermonCard.tsx`: thumbnail (YouTube), title, series, preached_at, duration
- Pagination: Inertia `router.get()` preserving scroll

### `pages/SermonDetail.tsx`
- Controller: `SermonController@show` → `['sermon', 'related']`
- `ReactPlayer` (dynamic import): YouTube embed
- PDF download button (if `sermon.pdf_url`)
- Share buttons (WhatsApp, link copy)
- Related sermons (same series or preacher)

### `pages/Agenda.tsx`
- Controller: `EventController@index` → `['events' (national + all provinces), 'months']`
- View toggle: List view (default on mobile) / Calendar grid (desktop)
- Filters: type, province, month — via TanStack Query
- `EventCard.tsx`: date block + title + location + type badge + CTA

### `pages/EventDetail.tsx`
- Controller: `EventController@show` → `['event', 'isRegistered']`
- Sections: Hero (date/time/location) · Description · Registration CTA
- If `registration_required`: opens `EventRegistrationForm` modal
- Live stream: embed if `is_online && stream_url`

**Verification**: Sermon filters refetch without page reload. Event registration modal submits and shows confirmation.

---

## Phase 5 — Province Sub-sites
**Duration**: 2 weeks

All province pages use `ProvinceLayout` (province header + off-canvas + province footer).

### `pages/Province/Index.tsx`
- Controller: `ProvinceController@show`
```php
return Inertia::render('Province/Index', [
  'province'    => ProvinceResource::make($province->load('regions')),
  'events'      => EventResource::collection(Event::forProvince($province->id)->upcoming()->published()->limit(4)->get()),
  'news'        => NewsResource::collection(News::forProvince($province->id)->published()->limit(3)->get()),
  'missionaries'=> MissionaryResource::collection(Missionary::where('province_id',$province->id)->active()->limit(4)->get()),
]);
```
- Sections: `ProvinceHero` · `LocationGrid` (regions as cards) · Events (4) · News (3) · Missionaries · `Dar` CTA

### `pages/Province/Localizacoes.tsx`
- Controller → `['province', 'regions' with zones and church counts]`
- Grid of region cards; each expands to show zones
- "Ver igrejas" links to zone page

### `pages/Province/Events.tsx`
- Controller → `['province', 'events' paginated, 'types']`
- Same list/calendar toggle as global Agenda but scoped to province
- Registration modal inline

### `pages/Province/News.tsx` + `NewsDetail.tsx`
- Listing: `['province', 'news' paginated]` → NewsCard grid
- Detail: `['province', 'article', 'related']` → full body + cover + share

### `pages/Province/Missoes.tsx`
- Controller → `['province', 'missionaries', 'churches_in_province_geojson']`
- Leaflet map (dynamic import) scoped to province coords
- Missionary cards below map

### `pages/Province/Ministerios.tsx`
- Controller → `['province', 'groupTypes' (all 5), 'programsByType' (ChurchProgram grouped)]`
- 5 fixed group type cards (Jovens/Mulheres/Homens/Crianças/Seniores)
- Each card expands to list active programs across province churches
- `MinisteriosGrid.tsx`: icon + name + count of active programs

### `pages/Province/Dar.tsx`
- Controller → `['province']`
- Payment options: M-Pesa · Banco · Mpago
- Instructions per method (static content, province manager fills via CMS)
- `DonationForm.tsx`: amount, type (tithe/offering/mission/social), method, name, reference

**Verification**: Navigate `/{province}` → province hero loads with correct name/image. LocationGrid shows regions. Ministerios show 5 group types with programs.

---

## Phase 6 — Location & Church Pages
**Duration**: 1 week

### `pages/Region/Index.tsx`
- Controller: `RegionController@show` → `['province', 'region', 'zones' with church counts]`
- Breadcrumb: Ministry → Province → Region
- Zone cards grid with church count badges

### `pages/Zone/Index.tsx`
- Controller: `ZoneController@show` → `['province', 'region', 'zone', 'churches']`
- Church cards: name, type badge, pastor, service times summary
- Map with pin per church in zone (Leaflet, dynamic)

### `pages/Church/Show.tsx`
- Controller: `ChurchController@show`
```php
return Inertia::render('Church/Show', [
  'church'   => ChurchResource::make($church->load(['province','region','zone','programs.groupType'])),
  'province' => ProvinceResource::make($province),
]);
```
- Sections:
  - `ChurchHero`: name, type, address, pastor
  - `ServiceTimesCard`: formatted weekly schedule
  - `ProgramsByType`: programs grouped by HomogeneousGroupType
    - Jovens / Mulheres / Homens / Crianças / Seniores tabs
    - Each tab: program name, day, time, frequency, location
  - Contact: phone, email, WhatsApp link
  - Map: single pin (Leaflet, dynamic)
  - Family Groups accordion (if any)

**`ProgramsByType.tsx`**:
```tsx
// Programs come pre-grouped from API: { groupTypeId: ChurchProgram[] }
// Tabs: Jovens · Mulheres · Homens · Crianças · Seniores
// Only show tabs that have active programs
// Each program card: name, day_of_week, start_time–end_time, frequency badge, location
```

**Verification**: Navigate `/maputo/norte/zona-a/igreja-central` → church loads. Programs grouped by tabs. Service times displayed.

---

## Phase 7 — Auth Pages & Forms
**Duration**: 0.5 week

### `pages/Auth/Login.tsx`
- `router.post('/login', { email, password })`
- Inertia-managed redirect on success
- Link to Register

### `pages/Auth/Register.tsx`
- Basic: name, email, password, password_confirmation
- On success → redirect to dashboard or home

### Shared form pattern (all forms):
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'

// Errors from server:
const { errors } = usePage<{ errors: Record<string,string> }>().props
// Display under each field
```

**Verification**: Login with test credentials → redirects. Contact form submits → flash success.

---

## Phase 8 — SEO, Polish & Accessibility
**Duration**: 1 week

### SEO — Inertia `<Head>` per page:
```tsx
// pages/Province/Index.tsx
import { Head } from '@inertiajs/react'
<Head>
  <title>{province.name} — Ministério Alfa e Ômega</title>
  <meta name="description" content={province.tagline ?? ''} />
  <meta property="og:image" content={storageUrl(province.hero_image ?? '')} />
</Head>
```

### Loading states:
- `Skeleton` components (shadcn/ui) for cards during TanStack Query fetches
- Inertia progress bar (configured in `app.tsx` with brand color `#7B3B2A`)

### Error pages:
- `pages/Error/NotFound.tsx` (404) — link back to homepage
- `pages/Error/ServerError.tsx` (500) — contact info

### Accessibility checklist per page:
- All images have `alt` text
- Focus-visible styles on interactive elements
- Off-canvas: focus trap when open (`aria-modal`, keyboard close on Escape)
- Map: keyboard-accessible fallback list of churches
- Contrast: all text meets WCAG AA (4.5:1) against `#FAF7F2` background

### i18n (`i18next`):
- Namespace `common`: nav labels, button text, form labels
- Namespace `home`: section headings
- Language toggle: PT (default) / EN
- String files: `resources/js/locales/pt/common.json` + `en/common.json`

### Mobile testing checklist (375px):
- [ ] Off-canvas full-height, scrollable
- [ ] Province bottom nav visible and tappable (44px hit targets)
- [ ] Leaflet map usable (pinch-zoom)
- [ ] Forms: inputs not zoomed by iOS (font-size ≥ 16px)
- [ ] Event registration modal: full-screen on mobile

---

## Laravel Controllers Summary

| Controller | Method | Inertia page | Key data |
|-----------|--------|-------------|----------|
| `GlobalController` | `index` | `Home` | stats, socialProjects, events, sermon |
| `GlobalController` | `quemSomos` | `QuemSomos` | documents, leadership |
| `GlobalController` | `social` | `IntervencoSocial` | projects with impacts |
| `GlobalController` | `missoes` | `Missoes` | missionaries, churches |
| `GlobalController` | `apoiar` | `Apoiar` | static |
| `GlobalController` | `contacto` | `Contacto` | static |
| `SermonController` | `index` | `Media` | sermons paginated, series, preachers |
| `SermonController` | `show` | `SermonDetail` | sermon, related |
| `EventController` | `index` | `Agenda` | events paginated, types |
| `EventController` | `show` | `EventDetail` | event |
| `ProvinceController` | `show` | `Province/Index` | province, events, news, missionaries |
| `ProvinceController` | `localizacoes` | `Province/Localizacoes` | regions with zones |
| `ProvinceController` | `eventos` | `Province/Events` | province, events paginated |
| `ProvinceController` | `noticias` | `Province/News` | province, news paginated |
| `ProvinceController` | `ministerios` | `Province/Ministerios` | province, groupTypes, programsByType |
| `ProvinceController` | `dar` | `Province/Dar` | province |
| `NewsController` | `show` | `Province/NewsDetail` | province, article, related |
| `RegionController` | `show` | `Region/Index` | province, region, zones |
| `ZoneController` | `show` | `Zone/Index` | province, region, zone, churches |
| `ChurchController` | `show` | `Church/Show` | church (with programs), province |

---

## Laravel Routes (`routes/web.php`)

```php
// Global
Route::get('/', [GlobalController::class, 'index'])->name('home');
Route::get('/quem-somos', [GlobalController::class, 'quemSomos'])->name('about');
Route::get('/intervencao-social', [GlobalController::class, 'social'])->name('social');
Route::get('/missoes', [GlobalController::class, 'missoes'])->name('missions');
Route::get('/media', [SermonController::class, 'index'])->name('media');
Route::get('/media/{id}', [SermonController::class, 'show'])->name('sermon.show');
Route::get('/agenda', [EventController::class, 'index'])->name('agenda');
Route::get('/agenda/{slug}', [EventController::class, 'show'])->name('event.show');
Route::get('/apoiar', [GlobalController::class, 'apoiar'])->name('support');
Route::get('/contacto', [GlobalController::class, 'contacto'])->name('contact');
Route::post('/contacto', [ContactController::class, 'store'])->name('contact.store');

// Province sub-sites
Route::prefix('{province:slug}')->group(function () {
  Route::get('/', [ProvinceController::class, 'show'])->name('province.show');
  Route::get('/localizacoes', [ProvinceController::class, 'localizacoes'])->name('province.locations');
  Route::get('/eventos', [ProvinceController::class, 'eventos'])->name('province.events');
  Route::get('/eventos/{slug}', [EventController::class, 'show'])->name('province.event.show');
  Route::get('/noticias', [ProvinceController::class, 'noticias'])->name('province.news');
  Route::get('/noticias/{slug}', [NewsController::class, 'show'])->name('province.news.show');
  Route::get('/missoes', [ProvinceController::class, 'missoes'])->name('province.missions');
  Route::get('/ministerios', [ProvinceController::class, 'ministerios'])->name('province.ministries');
  Route::get('/dar', [ProvinceController::class, 'dar'])->name('province.give');

  // Location hierarchy
  Route::get('/{region:slug}', [RegionController::class, 'show'])->name('region.show');
  Route::get('/{region:slug}/{zone:slug}', [ZoneController::class, 'show'])->name('zone.show');
  Route::get('/{region:slug}/{zone:slug}/{church:slug}', [ChurchController::class, 'show'])->name('church.show');
});
```

---

## Implementation Timeline

| Phase | Pages / Work | Duration | Month |
|-------|-------------|----------|-------|
| 1 | Design system + navigation (layouts, header, off-canvas) | 1 week | 4 |
| 2 | Global homepage (hero, map, sermon, events, social projects) | 1 week | 4 |
| 3 | Global static pages (QuemSomos, Social, Missões, Apoiar, Contacto) | 1 week | 5 |
| 4 | Media archive + Agenda (sermon/event detail, filters, registration) | 1 week | 5 |
| 5 | Province sub-sites (7 pages per province, shared template) | 2 weeks | 5–6 |
| 6 | Location + church pages (Region, Zone, Church/Show + programs) | 1 week | 6 |
| 7 | Auth + forms (Login, Register, ContactForm) | 0.5 week | 6 |
| 8 | SEO, polish, a11y, i18n, error pages, mobile QA | 1 week | 7 |
| **Total** | **19 pages + shared system** | **~9 weeks** | **Months 4–7** |

---

## Files to Create

### Layouts
- `resources/js/layouts/GlobalLayout.tsx`
- `resources/js/layouts/ProvinceLayout.tsx`

### Navigation
- `resources/js/components/navigation/GlobalHeader.tsx`
- `resources/js/components/navigation/ProvinceHeader.tsx`
- `resources/js/components/navigation/OffCanvas.tsx`

### Pages (19 total)
- `resources/js/pages/Home.tsx`
- `resources/js/pages/QuemSomos.tsx`
- `resources/js/pages/IntervencoSocial.tsx`
- `resources/js/pages/Missoes.tsx`
- `resources/js/pages/Media.tsx`
- `resources/js/pages/SermonDetail.tsx`
- `resources/js/pages/Agenda.tsx`
- `resources/js/pages/EventDetail.tsx`
- `resources/js/pages/Apoiar.tsx`
- `resources/js/pages/Contacto.tsx`
- `resources/js/pages/Province/Index.tsx`
- `resources/js/pages/Province/Localizacoes.tsx`
- `resources/js/pages/Province/Events.tsx`
- `resources/js/pages/Province/News.tsx`
- `resources/js/pages/Province/NewsDetail.tsx`
- `resources/js/pages/Province/Missoes.tsx`
- `resources/js/pages/Province/Ministerios.tsx`
- `resources/js/pages/Province/Dar.tsx`
- `resources/js/pages/Region/Index.tsx`
- `resources/js/pages/Zone/Index.tsx`
- `resources/js/pages/Church/Show.tsx`
- `resources/js/pages/Auth/Login.tsx`
- `resources/js/pages/Auth/Register.tsx`
- `resources/js/pages/Error/NotFound.tsx`
- `resources/js/pages/Error/ServerError.tsx`

### Backend (new Laravel files)
- `app/Http/Controllers/GlobalController.php`
- `app/Http/Controllers/ProvinceController.php` (add Inertia methods)
- `app/Http/Controllers/RegionController.php`
- `app/Http/Controllers/ZoneController.php`
- `app/Http/Controllers/ChurchController.php` (add `show`)
- `app/Http/Controllers/NewsController.php` (add `show`)
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Http/Resources/` — ProvinceResource, EventResource, SermonResource, NewsResource, ChurchResource, MissionaryResource, SocialProjectResource
