<?php

return [
    'power_actions' => [
        'start' => '啟動',
        'restart' => '重新啟動',
        'kill' => '強制關閉',
        'shutdown' => '關機',
    ],
    'notices' => [
        'power_action_sent_success' => '已送出電源操作，可能需要一點時間處理。',
        'power_action_sent_fail' => '無法送出電源操作。',
    ],
    'state' => '狀態',
    'states' => [
        'stopped' => '已停止',
        'running' => '執行中',
        'stopping' => '停止中',
        'starting' => '啟動中',
        'shutting_down' => '關機中',
    ],
    'uptime' => '運作時間',
    'uptime_units' => [
        'seconds' => '秒',
        'minutes' => '分鐘',
        'hours' => '小時',
        'days' => '天',
    ],
    'poll_status_error' => '無法取得伺服器狀態，5 秒後重試…',
    'terminal' => [
        'title' => '終端機',
        'description' => '透過網頁遠端管理你的伺服器。',
        'novnc_description' => '相容性最好，但功能和效能較有限。',
        'xtermjs_description' => '效能最好，但不支援所有作業系統。',
        'starting' => '正在啟動終端機',
        'steps' => [
            'initializing' => '正在初始化',
            'checking_remote_health' => '正在檢查遠端狀態',
            'generating_token' => '正在產生權杖',
            'connecting' => '正在連線',
        ],
    ],
    'server_config' => [
        'title' => '設定這台伺服器',
        'description' => '你是管理員，可以按下方按鈕編輯這台伺服器的規格設定。',
        'configure_server' => '設定伺服器',
    ],
];
