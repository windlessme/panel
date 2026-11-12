<?php

namespace Convoy\Exceptions\Service\Network;

use Convoy\Exceptions\DisplayException;

class AddressInUseException extends DisplayException
{
    /**
     * TooManyBackupsException constructor.
     */
    public function __construct(int $addressId)
    {
        parent::__construct(
            __('exceptions.address.in_use', ['id' => $addressId]),
        );
    }
}
