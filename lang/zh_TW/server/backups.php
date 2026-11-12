<?php

return [
    'create_backup' => '建立備份',
    'empty_state' => '目前沒有備份',
    'counter_tooltip' => '已建立的備份：:count / :max',
    'create_modal' => [
        'title' => '建立備份',
        'description' => '建立備份會複製一份伺服器的檔案。視伺服器大小而定，可能需要一段時間。',
        'compression_type' => '壓縮格式',
        'mode' => '模式',
        'modes' => [
            'snapshot' => '快照',
            'suspend' => '暫停',
            'kill' => '強制關閉',
        ],
    ],
    'delete_modal' => [
        'title' => '要刪除 :name 嗎？',
        'description' => '確定要刪除這個備份嗎？',
    ],
    'restore_modal' => [
        'title' => '要從 :name 還原嗎？',
        'description' => '確定要從這個備份還原嗎？',
    ],
    'notices' => [
        'backup_deleted' => '已刪除 :name',
        'backup_restored' => '已開始從 :name 還原伺服器',
    ],
];
