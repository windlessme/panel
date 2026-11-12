<?php

namespace Convoy\Exceptions\Service\Backup;

use Convoy\Exceptions\DisplayException;

class BackupLockedException extends DisplayException
{
    /**
     * TooManyBackupsException constructor.
     */
    public function __construct()
    {
        parent::__construct(__('exceptions.backup.locked'));
    }
}
