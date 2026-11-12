<?php

return [
    'api' => [
        'resource_not_found' => 'The requested resource was not found on this server.',
    ],
    'server' => [
        'not_found' => 'Server not found',
        'resource_missing' => 'No server resource was located in the request parameters.',
        'installed_state_forbidden' => 'Access to this resource is not allowed due to the current installation state.',
        'not_installed_state_forbidden' => 'Access to this resource is not allowed due to the current non-installation state.',
        'status_conflict' => [
            'unsupported' => 'This server is currently in an unsupported status, please try again later.',
            'suspended' => 'This server is currently suspended and the functionality requested is unavailable.',
            'installing' => 'This server has not yet completed its installation process, please try again later.',
        ],
        'sync_network_failed' => 'Server :uuid failed to sync network settings.',
        'sync_network_failed_both' => 'Servers :old_uuid and :new_uuid failed to sync network settings.',
        'sync_hostname_failed' => 'Server :uuid failed to sync hostname.',
        'no_available_vmid' => 'There is no available VMID to use.',
        'template_inaccessible' => 'This template is inaccessible to the specified node',
        'no_available_disk_interface' => 'There is no available disk interface on the virtual machine to satisfy the request.',
        'iso_already_mounted' => 'The requested ISO is already mounted',
        'iso_already_unmounted' => 'The requested ISO is already unmounted.',
    ],
    'backup' => [
        'limit_reached' => 'Cannot create a new backup, this server has reached its limit of :limit backups.',
        'throttled' => 'Only :limit backups may be generated within a :period second span of time.',
        'locked' => 'Cannot delete a backup that is marked as locked.',
        'restore_invalid_status' => 'This server is not currently in a state that allows for a backup to be restored.',
        'restore_server_running' => 'The server needs to be stopped before a backup can be restored.',
        'restore_not_completed' => 'This backup cannot be restored at this time: not completed or failed.',
    ],
    'address' => [
        'in_use' => 'Address :id is currently in use by another server.',
    ],
    'iso' => [
        'invalid_link' => 'The ISO link provided is either unreachable or invalid.',
        'delete_not_completed' => 'This ISO cannot be deleted at this time: not completed.',
    ],
    'node' => [
        'delete_has_servers' => 'This node cannot be deleted with servers still associated.',
    ],
    'location' => [
        'delete_has_nodes' => 'The location cannot be deleted with nodes still associated.',
    ],
    'user' => [
        'delete_has_servers' => 'The user cannot be deleted with servers still associated.',
    ],
    'address_pool' => [
        'delete_has_nodes' => 'This address pool cannot be deleted while still allocated to nodes.',
    ],
    'coterm' => [
        'delete_has_nodes' => 'Cannot delete an instance of Coterm with nodes attached to it.',
    ],
];
