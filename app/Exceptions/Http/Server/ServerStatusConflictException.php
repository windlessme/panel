<?php

namespace Convoy\Exceptions\Http\Server;

use Throwable;
use Convoy\Models\Server;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ServerStatusConflictException extends ConflictHttpException
{
    /**
     * Exception thrown when the server is in an unsupported state for API access or
     * certain operations within the codebase.
     */
    public function __construct(Server $server, Throwable $previous = null)
    {
        $message = __('exceptions.server.status_conflict.unsupported');
        if ($server->isSuspended()) {
            $message = __('exceptions.server.status_conflict.suspended');
        } elseif (! $server->isInstalled()) {
            $message = __('exceptions.server.status_conflict.installing');
        }

        parent::__construct($message, $previous);
    }
}
