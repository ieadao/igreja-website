<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Inertia\Inertia;

class DocumentsController extends Controller
{
    public function index(): \Inertia\Response
    {
        $documents = Document::where('is_public', true)
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->get();

        return Inertia::render('Documents', ['documents' => $documents]);
    }
}
