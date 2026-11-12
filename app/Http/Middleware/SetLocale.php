<?php

namespace Convoy\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Picks the language for validation and error messages from the request's
 * Accept-Language header, which the front-end sends in the UI's language.
 */
class SetLocale
{
    /**
     * Locales with a directory under lang/, keyed by the language tag a
     * browser sends for them.
     */
    public const LOCALES = [
        'en' => 'en_US',
        'en_US' => 'en_US',
        'zh' => 'zh_TW',
        'zh_TW' => 'zh_TW',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $preferred = $request->getPreferredLanguage(array_keys(self::LOCALES));

        if ($preferred !== null && $request->headers->has('Accept-Language')) {
            app()->setLocale(self::LOCALES[$preferred]);
        }

        return $next($request);
    }
}
