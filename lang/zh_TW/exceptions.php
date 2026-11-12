<?php

return [
    'api' => [
        'resource_not_found' => '這台伺服器上找不到要求的資源。',
    ],
    'server' => [
        'not_found' => '找不到伺服器',
        'resource_missing' => '請求參數中找不到伺服器。',
        'installed_state_forbidden' => '伺服器目前的安裝狀態不允許存取這項資源。',
        'not_installed_state_forbidden' => '伺服器尚未安裝，目前無法存取這項資源。',
        'status_conflict' => [
            'unsupported' => '這台伺服器目前的狀態無法執行這項操作，請稍後再試。',
            'suspended' => '這台伺服器已停權，無法使用這項功能。',
            'installing' => '這台伺服器還在安裝中，請稍後再試。',
        ],
        'sync_network_failed' => '伺服器 :uuid 無法同步網路設定。',
        'sync_network_failed_both' => '伺服器 :old_uuid 和 :new_uuid 無法同步網路設定。',
        'sync_hostname_failed' => '伺服器 :uuid 無法同步主機名稱。',
        'no_available_vmid' => '沒有可用的 VMID。',
        'template_inaccessible' => '這個節點無法使用此範本',
        'no_available_disk_interface' => '虛擬機上沒有可用的磁碟介面。',
        'iso_already_mounted' => '這個 ISO 已經掛載',
        'iso_already_unmounted' => '這個 ISO 已經卸載。',
    ],
    'backup' => [
        'limit_reached' => '無法建立新備份，這台伺服器的備份已達上限（:limit 份）。',
        'throttled' => '每 :period 秒內最多只能建立 :limit 份備份。',
        'locked' => '已鎖定的備份無法刪除。',
        'restore_invalid_status' => '這台伺服器目前的狀態無法還原備份。',
        'restore_server_running' => '請先停止伺服器，再還原備份。',
        'restore_not_completed' => '這份備份尚未完成或建立失敗，目前無法還原。',
    ],
    'address' => [
        'in_use' => '位址 :id 已被其他伺服器使用。',
    ],
    'iso' => [
        'invalid_link' => '提供的 ISO 連結無法連線或無效。',
        'delete_not_completed' => '這個 ISO 尚未下載完成，目前無法刪除。',
    ],
    'node' => [
        'delete_has_servers' => '這個節點上還有伺服器，無法刪除。',
    ],
    'location' => [
        'delete_has_nodes' => '這個位置還有節點，無法刪除。',
    ],
    'user' => [
        'delete_has_servers' => '這個使用者名下還有伺服器，無法刪除。',
    ],
    'address_pool' => [
        'delete_has_nodes' => '這個位址池還分配給節點使用，無法刪除。',
    ],
    'coterm' => [
        'delete_has_nodes' => '這個 Coterm 執行個體還連結著節點，無法刪除。',
    ],
];
