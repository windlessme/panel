<?php

namespace Convoy\Exceptions\Service\Server\Allocation;

use Convoy\Exceptions\DisplayException;

class IsoAlreadyMountedException extends DisplayException
{
    public function __construct()
    {
        parent::__construct(__('exceptions.server.iso_already_mounted'));
    }
}
