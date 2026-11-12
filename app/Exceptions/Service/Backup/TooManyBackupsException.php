<?php

namespace Convoy\Exceptions\Service\Backup;

use Convoy\Exceptions\DisplayException;

class TooManyBackupsException extends DisplayException
{
    /**
     * TooManyBackupsException constructor.
     */
    public function __construct(int $backupLimit)
    {
        parent::__construct(
            __('exceptions.backup.limit_reached', ['limit' => $backupLimit])
        );
    }
}
