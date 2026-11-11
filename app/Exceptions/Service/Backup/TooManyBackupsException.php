<?php

namespace App\Exceptions\Service\Backup;

use App\Exceptions\HasErrorCode;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TooManyBackupsException extends BadRequestHttpException implements HasErrorCode
{
    public function __construct(int $backupLimit)
    {
        parent::__construct(
            __('Cannot create a new backup, this server has reached its limit of :limit backups.', ['limit' => $backupLimit]),
        );
    }

    public function errorCode(): string
    {
        return 'too_many_backups';
    }
}
