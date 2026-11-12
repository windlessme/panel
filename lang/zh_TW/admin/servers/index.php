<?php

return [
    'create_server' => '建立伺服器',
    'new_server' => '新增伺服器',
    'restore_access' => '恢復存取',
    'backup_limit' => '備份上限',
    'bandwidth_limit' => '頻寬上限',
    'bandwidth_usage' => '頻寬用量',
    'snapshot_limit' => '快照上限',
    'limit_placeholder' => '留空表示無上限',
    'should_create_vm' => '建立虛擬機',
    'start_server_after_installing' => '安裝完成後啟動伺服器',
    'vmid_placeholder' => '留空則隨機產生 VMID',
    'create_modal' => [
        'title' => '建立伺服器',
    ],
    'manage_server' => '管理伺服器',
    'server_build' => [
        'title' => '伺服器規格',
    ],
    'server_info' => [
        'title' => '伺服器資訊',
    ],
    'suspension' => [
        'title' => '停權',
        'description' => '切換這台伺服器的停權狀態。',
        'not_suspended' => '這台伺服器未停權',
        'suspended' => '這台伺服器已停權',
    ],
    'delete_server' => [
        'title' => '刪除伺服器',
        'description' => '這台伺服器會從 Convoy 刪除，備份和其他相關資料也會一併銷毀。如果想在 Proxmox 節點上保留虛擬機和資料，請勾選下方的核取方塊。',
        'dont_purge' => '不要清除虛擬機和相關檔案',
    ],
    'no_servers_found_one' => '找不到伺服器',
    'no_server_found' => '找不到伺服器',
    'no_addresses_found' => '找不到位址',
    'no_nodes_found' => '找不到節點',
    'no_groups_found' => '找不到群組',
    'no_templates_found' => '找不到範本',
    'no_users_found' => '找不到使用者',
];
