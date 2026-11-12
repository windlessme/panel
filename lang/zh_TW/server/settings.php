<?php

return [
    'title' => '伺服器設定',
    'ip_allocation' => [
        'empty_state' => '這台伺服器沒有任何位址。',
    ],
    'display_info' => [
        'title' => '伺服器名稱',
    ],
    'reinstall' => [
        'title' => '重新安裝伺服器',
        'description' => '讓伺服器從全新狀態重新開始。',
        'start_server_after_installing' => '安裝完成後啟動伺服器',
        'modal' => [
            'title' => '確認重新安裝',
            'description' => '確定要重新安裝這台伺服器嗎？所有資料都會遺失。',
        ],
    ],
    'isos' => [
        'title' => '可掛載的 ISO',
        'empty' => '沒有 ISO',
    ],
    'templates' => [
        'no_groups_found' => '找不到群組',
        'no_templates_found' => '找不到範本',
    ],
    'device_config' => [
        'title' => '裝置設定',
        'current' => '目前的開機順序（越上面越優先）',
        'unused' => '未使用的裝置',
        'unused_empty' => '沒有未使用的裝置。',
        'no_boot_device_warning' => '尚未設定開機裝置，虛擬機將無法啟動。',
        'drag_handle' => '拖曳按鈕圖示',
    ],
    'nameservers' => [
        'title' => '名稱伺服器',
        'nameserver' => '名稱伺服器 :index',
        'add' => '新增名稱伺服器',
    ],
    'auth' => [
        'title' => '驗證',
    ],
    'hardware' => [
        'bandwidth_used' => '已用頻寬',
        'bandwidth_alloted' => '配置頻寬',
    ],
];
