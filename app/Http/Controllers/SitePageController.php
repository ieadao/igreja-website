<?php

namespace App\Http\Controllers;

use App\Models\SitePage;
use App\SitePages\SitePageTemplateRegistry;
use Inertia\Inertia;
use Inertia\Response;

class SitePageController extends Controller
{
    public function about(): Response
    {
        return $this->renderRouteFamilyPage('about', 'sobre');
    }

    public function homogeneousGroup(string $slug): Response
    {
        return $this->renderRouteFamilyPage('homogeneous_groups', $slug);
    }

    public function churchStructure(): Response
    {
        return $this->renderRouteFamilyPage('church_structure', 'estrutura-da-igreja');
    }

    private function renderRouteFamilyPage(string $routeFamily, string $slug): Response
    {
        $templateClass = SitePageTemplateRegistry::forRouteFamily($routeFamily);

        $page = SitePage::query()
            ->with('groupType:id,name,slug,acronym,icon,order,description,whatsapp_number')
            ->where('slug', $slug)
            ->where('template', $templateClass::key())
            ->where('is_published', true)
            ->firstOrFail();

        $relatedData = $templateClass::enrich($page);

        return Inertia::render('SitePage', [
            'page' => $this->transformPage($page),
            'relatedData' => $relatedData,
        ]);
    }

    private function transformPage(SitePage $page): array
    {
        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'template' => $page->template,
            'hero_image' => $page->hero_image,
            'excerpt' => $page->excerpt,
            'content' => $page->content,
            'sections' => $page->sections ?? [],
            'whatsapp_number' => $page->whatsapp_number,
            'is_published' => $page->is_published,
            'group_type' => $page->groupType ? [
                'id' => $page->groupType->id,
                'name' => $page->groupType->name,
                'slug' => $page->groupType->slug,
                'acronym' => $page->groupType->acronym,
                'icon' => $page->groupType->icon,
                'order' => $page->groupType->order,
                'description' => $page->groupType->description,
                'whatsapp_number' => $page->groupType->whatsapp_number,
            ] : null,
        ];
    }
}
