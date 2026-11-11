<?php

namespace App\Exceptions\Service\Server;

use App\Exceptions\HasErrorCode;
use App\Models\Server;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

/**
 * The server's placement is flagged for a human (see ServerPlacementService)
 * and the requested operation could act on stale or ambiguous coordinates.
 */
class ServerFlaggedException extends ConflictHttpException implements HasErrorCode
{
    public function __construct(Server $server)
    {
        parent::__construct(__('Server :server is flagged: :reason Resolve the flag before retrying.', [
            'server' => $server->uuid_short,
            'reason' => rtrim((string) $server->flag_reason, '.').'.',
        ]));
    }

    public function errorCode(): string
    {
        return 'server_flagged';
    }
}
