<?php

namespace App\Http\Controllers;

use App\Models\ContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'nullable|email|max:255',
            'phone'       => 'nullable|string|max:30',
            'type'        => 'required|in:general,prayer,volunteer,partnership,other',
            'message'     => 'required|string|max:2000',
            'province_id' => 'nullable|exists:provinces,id',
        ]);

        ContactRequest::create($data + ['status' => 'new']);

        return redirect()->back()->with('success', 'Mensagem enviada com sucesso. Entraremos em contacto em breve.');
    }
}
