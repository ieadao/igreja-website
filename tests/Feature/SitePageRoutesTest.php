<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\HomogeneousGroupType;
use App\Models\SitePage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SitePageRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_about_route_resolves_published_about_page_and_loads_related_data(): void
    {
        Document::create([
            'title' => 'Estatutos Gerais',
            'category' => 'statute',
            'file_url' => 'documents/statute.pdf',
            'file_size_kb' => 1024,
            'is_public' => true,
            'published_at' => now(),
        ]);

        Role::create(['name' => 'admin', 'guard_name' => 'web']);

        $leader = User::factory()->create();
        $leader->assignRole('admin');

        $this->get('/sobre')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('SitePage')
                ->where('page.slug', 'sobre')
                ->where('page.template', 'about')
                ->has('relatedData.documents', 1)
                ->has('relatedData.leadership', 1)
                ->where('relatedData.leadership.0.name', $leader->name));
    }

    public function test_homogeneous_group_route_requires_published_page(): void
    {
        $groupType = HomogeneousGroupType::create([
            'name' => 'Grupo Homogéneo de Homens',
            'acronym' => 'GHH',
            'slug' => 'grupo-homogeneo-de-homens',
            'icon' => 'heroicon-o-user',
            'order' => 1,
        ]);

        SitePage::create([
            'group_type_id' => $groupType->id,
            'title' => 'Grupo Homogéneo de Homens',
            'slug' => 'ghh-interno',
            'template' => 'homogeneous_group',
            'excerpt' => 'Página interna',
            'content' => '<p>Privado.</p>',
            'sections' => ['homogeneous_group' => ['key_points' => []]],
            'is_published' => false,
        ]);

        $this->get('/grupos-homogeneos/ghh-interno')->assertNotFound();
    }

    public function test_homogeneous_group_route_resolves_published_page(): void
    {
        $groupType = HomogeneousGroupType::create([
            'name' => 'Grupo Homogéneo de Jovens',
            'acronym' => 'GHJ',
            'slug' => 'grupo-homogeneo-de-jovens',
            'icon' => 'heroicon-o-sparkles',
            'order' => 2,
        ]);

        SitePage::create([
            'group_type_id' => $groupType->id,
            'title' => 'Grupo Homogéneo de Jovens',
            'slug' => 'grupo-homogeneo-de-jovens-publico',
            'template' => 'homogeneous_group',
            'excerpt' => 'Página pública',
            'content' => '<p>Conteúdo público.</p>',
            'sections' => ['homogeneous_group' => ['key_points' => [['title' => 'Propósito', 'body' => 'Servir.']]]],
            'is_published' => true,
        ]);

        $this->get('/grupos-homogeneos/grupo-homogeneo-de-jovens-publico')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('SitePage')
                ->where('page.template', 'homogeneous_group')
                ->where('relatedData.groupType.slug', $groupType->slug));
    }

    public function test_church_structure_route_resolves_published_page(): void
    {
        $page = SitePage::where('slug', 'estrutura-da-igreja')->firstOrFail();
        $page->update(['is_published' => true]);

        $this->get('/estrutura-da-igreja')
            ->assertOk()
            ->assertInertia(fn (Assert $response) => $response
                ->component('SitePage')
                ->where('page.slug', 'estrutura-da-igreja')
                ->where('page.template', 'church_structure'));
    }
}
