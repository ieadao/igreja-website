<?php

namespace App\Http\Controllers;

use App\Models\AccessCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GateController extends Controller
{
    public function unlock(Request $request): RedirectResponse
    {
        $request->validate(['code' => 'required|string']);

        $code = AccessCode::valid()
            ->where('code', strtoupper(trim($request->string('code'))))
            ->first();

        if (! $code) {
            return back()->withErrors(['code' => 'Código inválido ou expirado.']);
        }

        $code->increment('uses');
        $request->session()->put('site_unlocked', true);

        $intended = $request->session()->pull('gate_intended', '/');

        return redirect($intended);
    }
}
