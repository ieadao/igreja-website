# Filament v5 CMS — Plataforma MAO
## Blueprint Implementation Plan

> Reference doc for the admin/CMS layer of `alfaomega.org`.
> Stack: Laravel 12 · Filament 5 · Spatie Permission · MySQL 8

---

## Tooling

```bash
composer require laravel-shift/blueprint --dev
composer require icetalker/filamentphp-blueprint --dev  # Filament driver for Blueprint
composer require filament/filament:^5.0
composer require filament/shield   # RBAC UI for Filament — wraps Spatie Permission
```

Blueprint reads `draft.yaml` and generates:
- Migrations + Models + Factories
- Filament Resources (form + table + pages)
- Policies (wired to Spatie roles via Shield)

Run: `php artisan blueprint:build`
Then: `php artisan shield:generate --all`

---

## Panel Configuration

```php
// app/Providers/FilamentServiceProvider.php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        ->id('admin')
        ->path('admin')
        ->login()
        ->colors(['primary' => Color::hex('#7B3B2A')])
        ->font('DM Sans')
        ->navigationGroups([
            'Estrutura',
            'Conteúdo',
            'Missões & Social',
            'Utilizadores & Comunicação',
            'Financeiro',   // last
        ])
        ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
        ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
        ->middleware(['auth', 'verified'])
        ->authMiddleware(['auth'])
        ->plugins([FilamentShieldPlugin::make()]);
}
```

---

## draft.yaml — Full Blueprint Definition

```yaml
models:
  # ── STRUCTURE ──────────────────────────────────────────
  Province:
    name: string:100
    slug: string:120 unique
    code: string:10 unique nullable
    country: string:60 default:'Moçambique'
    hero_image: string:500 nullable
    hero_video_url: string:500 nullable
    tagline: string:200 nullable
    description: text nullable
    status: enum:active,inactive default:active
    relationships:
      hasMany: Region, Event, News, Missionary, SocialProject

  Region:
    province_id: id foreign:provinces
    name: string:100
    slug: string:120
    description: text nullable
    cover_image: string:500 nullable
    status: enum:active,inactive default:active
    relationships:
      belongsTo: Province
      hasMany: Zone

  Zone:
    region_id: id foreign:regions
    name: string:100
    slug: string:120
    description: text nullable
    status: enum:active,inactive default:active
    relationships:
      belongsTo: Region
      hasMany: Church

  Church:
    province_id: id foreign:provinces
    region_id: id foreign:regions nullable
    zone_id: id foreign:zones nullable
    name: string:150
    slug: string:170
    type: enum:church,congregation
    address: string:255 nullable
    lat: decimal:10,7 nullable
    lng: decimal:10,7 nullable
    pastor_name: string:100 nullable
    phone: string:30 nullable
    email: string:100 nullable
    service_times: json nullable
    status: enum:active,inactive,plant default:active
    founded_at: date nullable
    relationships:
      belongsTo: Province, Region, Zone
      hasMany: ChurchProgram, FamilyGroup

  HomogeneousGroupType:
    name: string:80
    slug: string:80 unique
    icon: string:50 nullable
    order: integer default:0
    timestamps: false
    relationships:
      hasMany: ChurchProgram

  ChurchProgram:
    church_id: id foreign:churches
    group_type_id: id foreign:homogeneous_group_types
    name: string:120 nullable
    day_of_week: enum:mon,tue,wed,thu,fri,sat,sun nullable
    start_time: time nullable
    end_time: time nullable
    frequency: enum:weekly,biweekly,monthly,occasional default:weekly
    location: string:200 nullable
    description: text nullable
    status: enum:active,inactive,suspended default:active
    relationships:
      belongsTo: Church, HomogeneousGroupType

  FamilyGroup:
    church_id: id foreign:churches
    name: string:100
    zone: string:100 nullable
    leader_name: string:100
    leader_phone: string:30 nullable
    meeting_day: enum:mon,tue,wed,thu,fri,sat,sun nullable
    meeting_time: time nullable
    status: enum:active,inactive default:active
    relationships:
      belongsTo: Church

  # ── CONTENT ────────────────────────────────────────────
  Event:
    scope_type: enum:national,province,region,zone,church default:province
    scope_id: unsignedBigInteger nullable
    title: string:200
    slug: string:220 unique
    description: text nullable
    type: enum:conference,retreat,service,youth,social,other
    starts_at: datetime
    ends_at: datetime nullable
    location: string:255 nullable
    is_online: boolean default:false
    stream_url: string:500 nullable
    max_capacity: integer nullable
    registration_required: boolean default:false
    status: enum:draft,published,cancelled,completed default:draft
    relationships:
      hasMany: EventRegistration

  EventRegistration:
    event_id: id foreign:events
    user_id: id foreign nullable
    name: string:100
    email: string:100 nullable
    phone: string:30 nullable
    status: enum:confirmed,waitlisted,cancelled default:confirmed
    relationships:
      belongsTo: Event

  Sermon:
    user_id: id foreign
    scope_type: enum:national,province default:province
    scope_id: unsignedBigInteger nullable
    title: string:200
    series: string:150 nullable
    description: text nullable
    video_url: string:500 nullable
    audio_url: string:500 nullable
    pdf_url: string:500 nullable
    duration_minutes: integer nullable
    preached_at: date
    status: enum:draft,published,archived default:draft
    relationships:
      belongsTo: User

  News:
    user_id: id foreign
    scope_type: enum:national,province,region,zone,church default:province
    scope_id: unsignedBigInteger nullable
    title: string:200
    slug: string:220 unique
    body: longtext
    excerpt: text nullable
    cover_image: string:500 nullable
    status: enum:draft,published,archived default:draft
    published_at: timestamp nullable
    relationships:
      belongsTo: User

  Document:
    title: string:200
    category: enum:statute,regulation,report,other
    file_url: string:500
    file_size_kb: integer nullable
    is_public: boolean default:true
    published_at: timestamp nullable

  # ── MISSIONS & SOCIAL ──────────────────────────────────
  Missionary:
    user_id: id foreign nullable
    church_id: id foreign nullable
    province_id: id foreign:provinces
    full_name: string:150
    status: enum:active,inactive,international default:active
    bio: text nullable
    specialization: string:150 nullable
    photo_url: string:500 nullable
    phone: string:30 nullable
    email: string:100 nullable
    needs: text nullable
    started_at: date nullable
    relationships:
      belongsTo: Province, Church
      hasMany: MissionReport

  MissionReport:
    missionary_id: id foreign:missionaries
    title: string:200
    body: longtext
    report_date: date
    status: enum:draft,published default:draft
    relationships:
      belongsTo: Missionary

  SocialProject:
    province_id: id foreign:provinces
    name: string:200
    category: enum:family,education,health,other
    description: text nullable
    status: enum:active,completed,paused default:active
    started_at: date nullable
    ended_at: date nullable
    relationships:
      belongsTo: Province
      hasMany: ProjectImpact

  ProjectImpact:
    project_id: id foreign:social_projects
    metric_name: string:150
    metric_value: integer
    recorded_at: date
    relationships:
      belongsTo: SocialProject

  # ── USERS & COMMUNICATION ──────────────────────────────
  ContactRequest:
    name: string:100
    email: string:100 nullable
    phone: string:30 nullable
    type: enum:general,counseling,partnership,support
    message: text
    status: enum:new,in_progress,resolved,closed default:new
    assigned_to: unsignedBigInteger nullable
    response: text nullable

  PartnershipRequest:
    org_name: string:150
    contact_name: string:100
    email: string:100
    phone: string:30 nullable
    type: enum:institutional,business,media,theological,other
    proposal: text
    status: enum:new,reviewing,approved,rejected default:new

  # ── FINANCIAL (LAST) ────────────────────────────────────
  FinancialSupport:
    user_id: id foreign nullable
    name: string:100 nullable
    type: enum:tithe,offering,mission,social,other
    amount: decimal:12,2
    currency: string:3 default:MZN
    payment_method: enum:mpesa,bank,cash,other
    destination: string:200 nullable
    reference: string:100 nullable
    status: enum:pending,confirmed,failed default:pending
    supported_at: timestamp

filament:
  resources:
    - Province
    - Region
    - Zone
    - Church
    - HomogeneousGroupType
    - ChurchProgram
    - FamilyGroup
    - Event
    - EventRegistration
    - Sermon
    - News
    - Document
    - Missionary
    - MissionReport
    - SocialProject
    - ProjectImpact
    - ContactRequest
    - PartnershipRequest
    - FinancialSupport
```

---

## Phased Implementation

### Phase 1 — Panel Setup + Organizational Structure
**Duration**: 2 weeks | **Nav group**: Estrutura

**Setup steps:**
```bash
php artisan filament:install --panels
php artisan make:filament-user  # first super_admin
php artisan shield:install --fresh
php artisan shield:generate --all
```

**Resources to build:**

| Resource | Key form fields | Table columns | Roles with access |
|----------|----------------|---------------|-------------------|
| `ProvinceResource` | name, slug (auto), code, country, hero_image, tagline, description, status | name, code, status, churches_count | super_admin, admin |
| `RegionResource` | province_id (Select), name, slug, cover_image, status | name, province.name, zones_count, status | super_admin, admin, province_manager |
| `ZoneResource` | region_id (Select → filtered by province), name, slug, status | name, region.name, churches_count | super_admin, admin, province_manager, region_leader |
| `ChurchResource` | province_id, region_id, zone_id (cascading selects), name, type, address, lat, lng, pastor_name, phone, email, service_times (repeater), status, founded_at | name, type, province.name, pastor_name, status | super_admin, admin, province_manager, region_leader |
| `HomogeneousGroupTypeResource` | name, slug, icon, order (read-only for non super_admin) | name, slug, icon, order | view all; edit: super_admin only |
| `ChurchProgramResource` | church_id (pastor sees only own church), group_type_id (Select — fixed list, no create), name, day_of_week, start_time, end_time, frequency, location, description, status | church.name, groupType.name, day_of_week, start_time, status | super_admin, admin, province_manager, pastor (own church only) |
| `FamilyGroupResource` | church_id, name, zone, leader_name, leader_phone, meeting_day, meeting_time, status | church.name, name, leader_name, meeting_day, status | super_admin, admin, province_manager, region_leader, pastor (own church) |

**Filament v5 patterns for this phase:**

```php
// Cascading selects — Region filtered by Province
Select::make('province_id')
    ->relationship('province', 'name')
    ->live()
    ->afterStateUpdated(fn (Set $set) => $set('region_id', null)),

Select::make('region_id')
    ->relationship('region', 'name', fn (Builder $query, Get $get) =>
        $query->where('province_id', $get('province_id'))
    )
    ->live(),

// ChurchProgram — pastor scoping
Select::make('church_id')
    ->relationship('church', 'name', fn (Builder $query) =>
        auth()->user()->hasRole('pastor')
            ? $query->where('id', auth()->user()->church_id)
            : $query
    )
    ->disabled(fn () => auth()->user()->hasRole('pastor')),

// HomogeneousGroupType — no create allowed for non super_admin
Select::make('group_type_id')
    ->relationship('groupType', 'name')
    ->createOptionForm(null)  // disables inline creation
    ->preload(),

// service_times as Repeater
Repeater::make('service_times')
    ->schema([
        Select::make('day')->options(DayOfWeek::class),
        TimePicker::make('time'),
        TextInput::make('label')->placeholder('ex: Culto Principal'),
    ])
    ->collapsible()
    ->defaultItems(0),
```

**Seeders to run:**
```bash
php artisan db:seed --class=HomogeneousGroupTypeSeeder   # run once, never again
php artisan db:seed --class=ProvinceSeeder               # 10 Mozambique provinces
php artisan db:seed --class=RolesAndPermissionsSeeder    # via Shield
```

---

### Phase 2 — Content Management
**Duration**: 2 weeks | **Nav group**: Conteúdo

| Resource | Key features | Scope behaviour |
|----------|-------------|-----------------|
| `EventResource` | scope_type+scope_id (admin sees picker; province_manager auto-fills own province), starts_at datepicker, registration_required toggle, status workflow | province_manager sees only own scope |
| `SermonResource` | YouTube URL, series select/create, preached_at, speaker (user select), PDF upload via Storage | province_manager sees only own province |
| `NewsResource` | Rich text body (TipTap), cover_image upload, published_at, status (draft→published workflow) | province_manager sees own; admin sees all |
| `DocumentResource` | file upload (PDF), category, is_public toggle, published_at | admin/super_admin only |
| `EventRegistrationResource` | Read-only list per event, export to XLSX (Laravel Excel) | province_manager sees own events |

**Filament v5 patterns for this phase:**

```php
// Scope picker — hidden for province_manager, auto-filled
Hidden::make('scope_type')
    ->default(fn () => auth()->user()->scope_type)
    ->visible(fn () => auth()->user()->hasRole(['super_admin', 'admin'])),

Select::make('scope_type')
    ->options(ScopeType::class)
    ->live()
    ->visible(fn () => auth()->user()->hasRole(['super_admin', 'admin'])),

// RichText for News body
RichEditor::make('body')
    ->toolbarButtons(['bold','italic','link','bulletList','orderedList','h2','h3','blockquote'])
    ->required(),

// File upload to local Storage
FileUpload::make('cover_image')
    ->disk('public')
    ->directory('news/covers')
    ->image()
    ->imageResizeWidth(1200)
    ->imageResizeHeight(630),

// Status workflow with badge
TextColumn::make('status')
    ->badge()
    ->color(fn (string $state) => match($state) {
        'published' => 'success',
        'draft'     => 'gray',
        'archived'  => 'danger',
    }),
```

---

### Phase 3 — Missions & Social Projects
**Duration**: 2 weeks | **Nav group**: Missões & Social

| Resource | Key features | Roles |
|----------|-------------|-------|
| `MissionaryResource` | photo upload, status badge, province/church relation, needs (textarea) | super_admin, admin, province_manager; missionary (own profile only) |
| `MissionReportResource` | Rich text body, status workflow, relation to missionary | missionary (own), province_manager |
| `SocialProjectResource` | category, status, date range, province scope | province_manager, admin |
| `ProjectImpactResource` | Inline repeater inside SocialProject (RelationManager), metric name + value + date | province_manager, admin |

**Filament v5 patterns:**

```php
// RelationManager for ProjectImpacts inside SocialProjectResource
class ProjectImpactsRelationManager extends RelationManager
{
    protected static string $relationship = 'projectImpacts';

    public function form(Form $form): Form {
        return $form->schema([
            TextInput::make('metric_name')->required(),
            TextInput::make('metric_value')->numeric()->required(),
            DatePicker::make('recorded_at')->required(),
        ]);
    }

    public function table(Table $table): Table {
        return $table->columns([
            TextColumn::make('metric_name'),
            TextColumn::make('metric_value')->numeric(),
            TextColumn::make('recorded_at')->date(),
        ]);
    }
}

// Missionary — self-edit scope
public static function getEloquentQuery(): Builder
{
    $query = parent::getEloquentQuery();
    if (auth()->user()->hasRole('missionary')) {
        return $query->where('user_id', auth()->id());
    }
    if (auth()->user()->hasRole('province_manager')) {
        return $query->where('province_id', auth()->user()->province_id);
    }
    return $query;
}
```

---

### Phase 4 — Users, Contacts & Dashboards
**Duration**: 2 weeks | **Nav group**: Utilizadores & Comunicação

| Resource | Key features | Roles |
|----------|-------------|-------|
| `UserResource` | role assignment (Shield), scope_type+scope_id, province_id, church_id | super_admin, admin; province_manager (own province users only) |
| `ContactRequestResource` | Inbox view, assign_to (user select), status workflow, response textarea | admin, province_manager |
| `PartnershipRequestResource` | Status workflow (new→reviewing→approved/rejected), proposal readonly after submit | admin |

**Widgets (Dashboards):**

```php
// Global dashboard widgets (admin/super_admin)
class GlobalStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array {
        return [
            Stat::make('Igrejas', Church::active()->count()),
            Stat::make('Missionários', Missionary::active()->count()),
            Stat::make('Eventos este mês', Event::thisMonth()->published()->count()),
            Stat::make('Contactos novos', ContactRequest::where('status','new')->count()),
        ];
    }
}

// Province dashboard (province_manager — scoped)
class ProvinceStatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array {
        $pid = auth()->user()->province_id;
        return [
            Stat::make('Igrejas', Church::where('province_id', $pid)->count()),
            Stat::make('Eventos', Event::forProvince($pid)->published()->count()),
            Stat::make('Notícias', News::forProvince($pid)->published()->count()),
        ];
    }
}
```

**ContactRequest Inbox pattern:**

```php
// Inbox with status filter tabs
public function getTabs(): array {
    return [
        'new'         => Tab::make('Novos')->badge(ContactRequest::where('status','new')->count()),
        'in_progress' => Tab::make('Em curso'),
        'resolved'    => Tab::make('Resolvidos'),
    ];
}
```

---

### Phase 5 — Financial / Donations (LAST)
**Duration**: 1 week | **Nav group**: Financeiro

| Resource | Key features | Roles |
|----------|-------------|-------|
| `FinancialSupportResource` | type, amount, currency (MZN default), payment_method, destination, status, supported_at | super_admin, admin; province_manager (view own province) |

**Key features:**
- Summary stats widget: total confirmed by type (tithe/offering/mission/social)
- Export to XLSX via Laravel Excel action
- Status badge: pending (gray) → confirmed (green) → failed (red)
- No create form for public — records come from public donation form; Filament is read/update only

```php
// Table actions
->actions([
    Action::make('confirm')
        ->icon('heroicon-o-check-circle')
        ->color('success')
        ->visible(fn ($record) => $record->status === 'pending')
        ->action(fn ($record) => $record->update(['status' => 'confirmed'])),
    ExportAction::make()->exporter(FinancialSupportExporter::class),
])

// Summary widget
class FinancialSummaryWidget extends StatsOverviewWidget
{
    protected function getStats(): array {
        return [
            Stat::make('Total confirmado', 'MZN ' . number_format(
                FinancialSupport::confirmed()->sum('amount'), 2
            )),
            Stat::make('Dízimos', 'MZN ' . number_format(
                FinancialSupport::confirmed()->where('type','tithe')->sum('amount'), 2
            )),
            Stat::make('Missões', 'MZN ' . number_format(
                FinancialSupport::confirmed()->where('type','mission')->sum('amount'), 2
            )),
        ];
    }
}
```

---

## RBAC Summary (Shield Policies)

| Resource | super_admin | admin | province_manager | province_editor | region_leader | pastor | missionary |
|----------|:-----------:|:-----:|:----------------:|:---------------:|:-------------:|:------:|:----------:|
| Province | CRUD | R | R | R | R | R | R |
| Region | CRUD | CRUD | CRUD (own) | R | R | R | R |
| Zone | CRUD | CRUD | CRUD (own) | R | CRUD (own) | R | — |
| Church | CRUD | CRUD | CRUD (own) | R | CRUD (own) | R (own) | — |
| HomogeneousGroupType | CRUD | R | R | R | R | R | R |
| ChurchProgram | CRUD | CRUD | CRUD (own prov) | — | — | CRUD (own church) | — |
| FamilyGroup | CRUD | CRUD | CRUD (own) | — | CRUD (own) | CRUD (own) | — |
| Event | CRUD | CRUD | CRUD (own) | CRU (own) | — | — | — |
| Sermon | CRUD | CRUD | CRUD (own) | CRU (own) | — | — | — |
| News | CRUD | CRUD | CRUD (own) | CRU (own) | — | — | — |
| Document | CRUD | CRUD | R | R | — | — | — |
| Missionary | CRUD | CRUD | CRUD (own prov) | — | — | — | RU (own) |
| MissionReport | CRUD | CRUD | CRUD (own prov) | — | — | — | CRU (own) |
| SocialProject | CRUD | CRUD | CRUD (own) | — | — | — | — |
| User | CRUD | CRUD | CRU (own prov) | — | — | — | — |
| ContactRequest | CRUD | CRUD | CRUD (own) | — | — | — | — |
| PartnershipRequest | CRUD | CRUD | R | — | — | — | — |
| FinancialSupport | CRUD | CRUD | R (own) | — | — | — | — |

*C=Create R=Read U=Update D=Delete*

---

## Implementation Order & Checklist

### Phase 1 — Estrutura (Week 1–2)
- [ ] Install Filament 5 + Shield + configure panel colors/fonts
- [ ] Run `php artisan blueprint:build` from draft.yaml (Phase 1 models)
- [ ] `php artisan shield:generate --all`
- [ ] Implement Province, Region, Zone, Church resources with cascading selects
- [ ] Implement HomogeneousGroupType (read-only for non super_admin)
- [ ] Implement ChurchProgram with pastor scope + fixed group type dropdown
- [ ] Implement FamilyGroup
- [ ] Run seeders: HomogeneousGroupTypeSeeder, ProvinceSeeder, RolesAndPermissionsSeeder
- [ ] Test: pastor can edit own programs but not create group types

### Phase 2 — Conteúdo (Week 3–4)
- [ ] Event resource with scope picker + date/time + registration toggle
- [ ] Sermon resource with video URL + PDF upload
- [ ] News resource with TipTap rich text + cover image upload
- [ ] Document resource (admin-only create)
- [ ] EventRegistration read-only list + XLSX export
- [ ] Test: province_manager cannot see other province's content

### Phase 3 — Missões & Social (Week 5–6)
- [ ] Missionary resource with photo upload + self-edit for missionary role
- [ ] MissionReport with rich text + status workflow
- [ ] SocialProject + ProjectImpact RelationManager inline
- [ ] Test: missionary can only edit own profile and reports

### Phase 4 — Utilizadores & Comunicação (Week 7–8)
- [ ] User resource with Shield role assignment + scope fields
- [ ] ContactRequest inbox with tabs (new / in_progress / resolved)
- [ ] PartnershipRequest list with status workflow
- [ ] GlobalStatsWidget + ProvinceStatsWidget dashboards
- [ ] Test: province_manager cannot manage users outside own province

### Phase 5 — Financeiro (Week 9)
- [ ] FinancialSupport read/update resource (no public create in Filament)
- [ ] FinancialSummaryWidget with totals by type
- [ ] Confirm/reject actions + XLSX export
- [ ] Test: province_manager can only view own province donations

---

## Artisan Commands Reference

```bash
# Generate from Blueprint YAML
php artisan blueprint:build

# Filament resource (manual, if not using Blueprint)
php artisan make:filament-resource Province --generate --soft-deletes
php artisan make:filament-resource ChurchProgram --generate

# Shield — generate policies from Spatie roles
php artisan shield:install
php artisan shield:generate --all
php artisan shield:publish   # publishes policy stubs

# Widgets
php artisan make:filament-widget GlobalStatsWidget --stats-overview
php artisan make:filament-widget ProvinceStatsWidget --stats-overview
php artisan make:filament-widget FinancialSummaryWidget --stats-overview

# RelationManagers
php artisan make:filament-relation-manager SocialProjectResource projectImpacts metric_name

# Run seeders
php artisan db:seed --class=HomogeneousGroupTypeSeeder
php artisan db:seed --class=ProvinceSeeder
php artisan db:seed --class=RolesAndPermissionsSeeder
```

---

## Files to Create

```
app/
├── Filament/
│   ├── Resources/
│   │   ├── ProvinceResource.php + Pages/
│   │   ├── RegionResource.php + Pages/
│   │   ├── ZoneResource.php + Pages/
│   │   ├── ChurchResource.php + Pages/
│   │   ├── HomogeneousGroupTypeResource.php + Pages/
│   │   ├── ChurchProgramResource.php + Pages/
│   │   ├── FamilyGroupResource.php + Pages/
│   │   ├── EventResource.php + Pages/ + RelationManagers/EventRegistrationsRelationManager.php
│   │   ├── SermonResource.php + Pages/
│   │   ├── NewsResource.php + Pages/
│   │   ├── DocumentResource.php + Pages/
│   │   ├── MissionaryResource.php + Pages/ + RelationManagers/MissionReportsRelationManager.php
│   │   ├── SocialProjectResource.php + Pages/ + RelationManagers/ProjectImpactsRelationManager.php
│   │   ├── UserResource.php + Pages/
│   │   ├── ContactRequestResource.php + Pages/
│   │   ├── PartnershipRequestResource.php + Pages/
│   │   └── FinancialSupportResource.php + Pages/    ← Phase 5 (last)
│   └── Widgets/
│       ├── GlobalStatsWidget.php
│       ├── ProvinceStatsWidget.php
│       └── FinancialSummaryWidget.php               ← Phase 5 (last)
├── Providers/
│   └── FilamentServiceProvider.php
└── Policies/    ← generated by Shield
    ├── ProvincePolicy.php
    ├── ChurchProgramPolicy.php
    └── ...
database/
├── seeders/
│   ├── HomogeneousGroupTypeSeeder.php   ← run ONCE
│   ├── ProvinceSeeder.php
│   └── RolesAndPermissionsSeeder.php
└── blueprint/
    └── draft.yaml
```
