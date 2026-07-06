<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;

class EventRegistrationController extends Controller
{
    public function store(Request $request, string $slug): \Illuminate\Http\RedirectResponse
    {
        $event = Event::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        if (! $event->registrations_open) {
            return back()->withErrors(['name' => 'As inscrições para este evento estão encerradas.']);
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'phone'         => 'nullable|string|max:50',
            'payment_proof' => [
                $event->is_paid ? 'required' : 'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png,webp',
                'max:5120',
            ],
        ], [
            'payment_proof.required' => 'O comprovativo de pagamento é obrigatório para este evento.',
            'payment_proof.mimes'    => 'O comprovativo deve ser um PDF ou imagem (JPG, PNG).',
            'payment_proof.max'      => 'O comprovativo não pode exceder 5 MB.',
        ]);

        $proofPath = $request->hasFile('payment_proof')
            ? $request->file('payment_proof')->store('events/payment-proofs', 'public')
            : null;

        EventRegistration::create([
            'event_id'      => $event->id,
            'name'          => $validated['name'],
            'phone'         => $validated['phone'] ?? null,
            'payment_proof' => $proofPath,
            'status'        => 'confirmed',
        ]);

        return back()->with('success', 'Inscrição confirmada! Aguardamos pela sua presença.');
    }
}
