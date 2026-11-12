<?php

namespace Convoy\Http\Middleware\Client\Server;

use Closure;
use Convoy\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ServerNotInstalled
{
    /**
     * Checks that the server is installed before allowing access through the route.
     */
    public function handle(Request $request, Closure $next): \Symfony\Component\HttpFoundation\Response
    {
        /** @var Server|null $server */
        $server = $request->route()->parameter('server');

        if (! $server instanceof Server) {
            throw new NotFoundHttpException(__('exceptions.server.resource_missing'));
        }

        if (! $server->isInstalled()) {
            throw new HttpException(Response::HTTP_FORBIDDEN, __('exceptions.server.not_installed_state_forbidden'));
        }

        return $next($request);
    }
}
