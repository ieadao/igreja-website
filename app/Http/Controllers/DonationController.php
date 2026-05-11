<?php

namespace App\Http\Controllers;

use App\Models\FinancialSupport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'amount'         => 'required|numeric|min:1|max:999999',
            'type'           => 'required|in:tithe,offering,missions,social',
            'payment_method' => 'required|in:mpesa,bank,emola',
            'reference'      => 'nullable|string|max:100',
        ]);

        FinancialSupport::create([
            'name'           => $data['name'],
            'amount'         => $data['amount'],
            'currency'       => 'MZN',
            'type'           => $data['type'],
            'payment_method' => $data['payment_method'],
            'reference'      => $data['reference'] ?? null,
            'destination'    => 'national',
            'status'         => 'pending',
            'supported_at'   => now(),
        ]);

        return redirect()->back()->with('success', 'Registo de doativo efetuado. Aguardamos a confirmação do pagamento.');
    }
}
