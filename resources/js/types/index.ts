// ── Primitives ────────────────────────────────────────────────────────────────

export type Status = 'active' | 'inactive';

// ── Structure ─────────────────────────────────────────────────────────────────

export interface Province {
    id: number;
    name: string;
    slug: string;
    code: string;
    tagline: string | null;
    description: string | null;
    hero_image: string | null;
    hero_video_url: string | null;
    status: Status;
}

export interface Region {
    id: number;
    province_id: number;
    name: string;
    slug: string;
    cover_image: string | null;
    churches_count?: number;
}

export interface Zone {
    id: number;
    region_id: number;
    name: string;
    slug: string;
    churches_count?: number;
}

export interface GroupType {
    id: number;
    name: string;
    acronym: string | null;
    slug: string;
    icon: string;
    order: number;
    description?: string | null;
    whatsapp_number?: string | null;
}

export interface ChurchProgram {
    id: number;
    church_id: number;
    group_type: GroupType;
    name: string | null;
    day_of_week: string | null;
    start_time: string | null;
    end_time: string | null;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'occasional';
    location: string | null;
    description: string | null;
    status: 'active' | 'inactive' | 'suspended';
    cancelled_from: string | null;
    cancelled_until: string | null;
}

export interface Church {
    id: number;
    name: string;
    slug: string;
    type: 'church' | 'congregation';
    province: Pick<Province, 'name' | 'slug'>;
    region: Pick<Region, 'name' | 'slug'> | null;
    zone: Pick<Zone, 'name' | 'slug'> | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    pastor_name: string | null;
    phone: string | null;
    email: string | null;
    service_times: { day: string; time: string; label: string }[] | null;
    status: 'active' | 'inactive' | 'plant';
    programs?: ChurchProgram[];
}

// ── Content ───────────────────────────────────────────────────────────────────

export interface Event {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    type: 'service' | 'conference' | 'retreat' | 'seminar' | 'other';
    starts_at: string;
    ends_at: string | null;
    church_id: number | null;
    church: { id: number; name: string; address: string | null } | null;
    location: string | null;
    is_online: boolean;
    stream_url: string | null;
    cover_image: string | null;
    max_capacity: number | null;
    registration_required: boolean;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    scope_type: 'national' | 'province';
    scope_id: number | null;
}

export interface Sermon {
    id: number;
    title: string;
    speaker_name: string;
    series: string | null;
    description: string | null;
    video_url: string | null;
    audio_url: string | null;
    pdf_url: string | null;
    cover_image: string | null;
    duration_minutes: number | null;
    preached_at: string;
    status: 'draft' | 'published' | 'archived';
    scope_type: 'national' | 'province';
    scope_id: number | null;
}

export interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body?: string;
    cover_image: string | null;
    published_at: string;
    status: 'draft' | 'published';
    scope_type: 'national' | 'province';
    scope_id: number | null;
    author?: Pick<User, 'id' | 'name'>;
}

export interface Document {
    id: number;
    title: string;
    category: 'statute' | 'regulation' | 'report' | 'other';
    file_url: string;
    file_size_kb: number | null;
    is_public: boolean;
    published_at: string | null;
}

// ── Missions & Social ─────────────────────────────────────────────────────────

export interface Missionary {
    id: number;
    full_name: string;
    status: 'active' | 'inactive' | 'on_leave';
    bio: string | null;
    specialization: string | null;
    photo_url: string | null;
    phone: string | null;
    email: string | null;
    needs: string | null;
    province: Pick<Province, 'name' | 'slug'>;
}

export interface SocialProject {
    id: number;
    name: string;
    category: string;
    description: string | null;
    status: 'active' | 'completed' | 'planned';
    started_at: string | null;
    province: Pick<Province, 'name' | 'slug'>;
    impacts?: { metric_name: string; metric_value: number; recorded_at: string }[];
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface User {
    id: number;
    name: string;
    email: string;
    role_label?: string;
}

// ── Inertia shared props ──────────────────────────────────────────────────────

export interface SharedProps {
    auth: { user: User | null };
    provinces: Pick<Province, 'id' | 'name' | 'slug' | 'code'>[];
    flash: { success: string | null; error: string | null };
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}
