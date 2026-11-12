<?php

return [
    'new_user' => '新增使用者',
    'settings_title' => '使用者設定',
    'create_modal' => [
        'title' => '建立使用者',
        'is_admin_warning' => '你正在授予這個使用者管理員權限。',
    ],
    'user_info' => [
        'title' => '使用者資訊',
        'override_pass' => '覆寫密碼',
    ],
    'delete_user' => [
        'title' => '刪除使用者',
        'description' => '這個使用者和相關資料都會被刪除。',
        'has_servers_error' => '這個使用者名下還有伺服器，無法刪除。',
    ],
    'validation' => [
        'name_max' => '不能超過 :max 個字元',
        'name_required' => '請填寫名稱。',
        'email_invalid' => '請輸入有效的電子郵件',
        'email_required' => '請填寫電子郵件。',
        'password_rules' => '至少 8 個字元，且須包含大寫字母、小寫字母、數字和特殊符號各一個',
        'password_required' => '請填寫密碼。',
    ],
];
