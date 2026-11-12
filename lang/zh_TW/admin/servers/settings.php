<?php

return [
    'server_info' => [
        'title' => '伺服器資訊',
        'statuses' => [
            'ready' => '就緒',
            'installing' => '安裝中',
            'install_failed' => '最近一次安裝失敗',
            'suspended' => '已停權',
            'restoring_backup' => '正在從備份還原',
            'restoring_snapshot' => '正在從快照還原',
        ],
    ],
    'suspension' => [
        'title' => '停權',
        'description' => '切換這台伺服器的停權狀態。',
        'statuses' => [
            'suspended' => '這台伺服器已停權。',
            'not_suspended' => '這台伺服器未停權。',
        ],
        'suspend' => '停權',
        'unsuspend' => '解除停權',
    ],
    'deletion' => [
        'title' => '刪除伺服器',
        'description' => '這台伺服器會從 Convoy 刪除，備份和其他相關資料也會一併銷毀。如果想在 Proxmox 節點上保留虛擬機和資料，請勾選下方的核取方塊。',
        'deleting_status' => '這台伺服器正在刪除中。',
        'no_purge' => '不要清除虛擬機和相關檔案',
        'confirmation' => [
            'title' => '刪除 :name',
            'description' => '確定要刪除 :name 嗎？',
        ],
    ],
    'build' => [
        'title' => '伺服器規格',
    ],
];
