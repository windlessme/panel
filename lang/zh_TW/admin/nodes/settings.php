<?php

return [
    'node_info' => [
        'title' => '節點資訊',
    ],
    'coterm' => [
        'title' => 'Coterm',
        'description' => '使用者開啟網頁主控台時，Coterm 可以隱藏節點的實際來源位址。',
        'enable' => '啟用 Coterm',
        'tls' => '已啟用 TLS/SSL',
        'token_created' => [
            'title' => '已建立權杖',
            'description' => '這是剛建立的權杖。請記下權杖的值，關閉後就不會再顯示。',
            'action' => '好，我記下了',
        ],
        'reset' => [
            'title' => '要重設權杖嗎？',
            'description' => '確定要重設這個節點的 Coterm 權杖嗎？所有依賴這個權杖的 Coterm 執行個體都會失效。',
            'action' => '重設權杖',
        ],
    ],
];
