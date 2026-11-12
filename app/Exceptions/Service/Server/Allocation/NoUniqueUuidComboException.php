<?php

namespace Convoy\Exceptions\Service\Server\Allocation;

use Convoy\Exceptions\DisplayException;

class NoUniqueUuidComboException extends DisplayException
{
    public function __construct()
    {
        parent::__construct(__('exceptions.server.no_available_vmid'));
    }
}
