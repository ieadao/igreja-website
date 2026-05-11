<?php

namespace App\Http\Controllers;

use App\Models\PartnershipRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PartnershipController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'org_name'     => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'phone'        => 'nullable|string|max:30',
            'type'         => 'required|in:educational,health,charity,other',
            'proposal'     => 'required|string|max:2000',
        ]);

        PartnershipRequest::create($data + ['status' => 'pending']);

        return redirect()->back()->with('success', 'Proposta de parceria enviada com sucesso. Entraremos em contacto brevemente.');
    }
}
