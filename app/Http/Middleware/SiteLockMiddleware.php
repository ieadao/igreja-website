<?php

namespace App\Http\Middleware;

use App\Models\SiteLock;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class SiteLockMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Never lock admin panel or the unlock endpoint itself
        if ($request->is('admin', 'admin/*', 'gate/unlock')) {
            return $next($request);
        }

        // Authenticated users (admins) always bypass the gate
        if ($request->user()) {
            return $next($request);
        }

        $lock = SiteLock::config();

        if (! $lock->is_active) {
            return $next($request);
        }

        if ($request->session()->get('site_unlocked') === true) {
            return $next($request);
        }

        if (! $this->isPathLocked($request, $lock)) {
            return $next($request);
        }

        $request->session()->put('gate_intended', $request->fullUrl());

        return Inertia::render('Gate', [
            'title'   => $lock->gate_title,
            'message' => $lock->gate_message,
        ])->toResponse($request);
    }

    private function isPathLocked(Request $request, SiteLock $lock): bool
    {
        if ($lock->scope === 'global') {
            return true;
        }

        $paths = $lock->locked_paths ?? [];
        $currentPath = $request->path();

        foreach ($paths as $pattern) {
            if (fnmatch(ltrim($pattern, '/'), $currentPath)) {
                return true;
            }
        }

        return false;
    }
}
