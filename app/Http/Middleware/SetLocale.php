<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Picks the response language from the Accept-Language header the SPA sends.
 *
 * Every Chinese variant (zh, zh-TW, zh-Hant, zh-CN, …) resolves to zh_TW, the
 * only Chinese catalog shipped; anything else falls back to English. The
 * locale is set on every request, so nothing leaks between requests on a
 * long-lived worker.
 */
class SetLocale
{
    /** The first entry is the fallback when no preferred language matches. */
    private const SUPPORTED = ['en', 'zh_TW'];

    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale($request->getPreferredLanguage(self::SUPPORTED) ?? self::SUPPORTED[0]);

        return $next($request);
    }
}
