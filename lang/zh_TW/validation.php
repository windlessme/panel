<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => '必須接受 :attribute。',
    'accepted_if' => '當 :other 為 :value 時，必須接受 :attribute。',
    'active_url' => ':attribute 必須是有效的網址。',
    'after' => ':attribute 必須是 :date 之後的日期。',
    'after_or_equal' => ':attribute 必須是 :date 當天或之後的日期。',
    'alpha' => ':attribute 只能包含字母。',
    'alpha_dash' => ':attribute 只能包含字母、數字、連字號（-）和底線（_）。',
    'alpha_num' => ':attribute 只能包含字母和數字。',
    'any_of' => ':attribute 無效。',
    'array' => ':attribute 必須是陣列。',
    'ascii' => ':attribute 只能包含半形英數字和符號。',
    'before' => ':attribute 必須是 :date 之前的日期。',
    'before_or_equal' => ':attribute 必須是 :date 當天或之前的日期。',
    'between' => [
        'array' => ':attribute 必須有 :min 到 :max 個項目。',
        'file' => ':attribute 必須介於 :min 到 :max KB 之間。',
        'numeric' => ':attribute 必須介於 :min 到 :max 之間。',
        'string' => ':attribute 必須介於 :min 到 :max 個字元之間。',
    ],
    'boolean' => ':attribute 必須是 true 或 false。',
    'can' => ':attribute 包含未經授權的值。',
    'confirmed' => ':attribute 確認欄位不一致。',
    'contains' => ':attribute 缺少必要的值。',
    'current_password' => '密碼不正確。',
    'date' => ':attribute 必須是有效的日期。',
    'date_equals' => ':attribute 必須是等於 :date 的日期。',
    'date_format' => ':attribute 必須符合 :format 格式。',
    'decimal' => ':attribute 必須有 :decimal 位小數。',
    'declined' => '必須拒絕 :attribute。',
    'declined_if' => '當 :other 為 :value 時，必須拒絕 :attribute。',
    'different' => ':attribute 和 :other 不能相同。',
    'digits' => ':attribute 必須是 :digits 位數字。',
    'digits_between' => ':attribute 必須是 :min 到 :max 位數字。',
    'dimensions' => ':attribute 的圖片尺寸無效。',
    'distinct' => ':attribute 有重複的值。',
    'doesnt_contain' => ':attribute 不能包含下列任何一項：:values。',
    'doesnt_end_with' => ':attribute 結尾不能是下列任何一項：:values。',
    'doesnt_start_with' => ':attribute 開頭不能是下列任何一項：:values。',
    'email' => ':attribute 必須是有效的電子郵件地址。',
    'encoding' => ':attribute 必須以 :encoding 編碼。',
    'ends_with' => ':attribute 結尾必須是下列其中一項：:values。',
    'us_keyboard_characters' => ':attribute 只能包含美式鍵盤上的字元。',
    'enum' => '選擇的 :attribute 無效。',
    'exists' => '選擇的 :attribute 無效。',
    'extensions' => ':attribute 的副檔名必須是下列其中一種：:values。',
    'file' => ':attribute 必須是檔案。',
    'filled' => ':attribute 不能空白。',
    'fqdn' => [
        'https_and_ip' => '啟用 HTTPS 時，:attribute 不能是 IP 位址。',
        'unresolvable' => '無法將 :attribute 解析成有效的 IP 位址。',
    ],
    'gt' => [
        'array' => ':attribute 必須多於 :value 個項目。',
        'file' => ':attribute 必須大於 :value KB。',
        'numeric' => ':attribute 必須大於 :value。',
        'string' => ':attribute 必須多於 :value 個字元。',
    ],
    'gte' => [
        'array' => ':attribute 必須有 :value 個以上的項目。',
        'file' => ':attribute 必須大於或等於 :value KB。',
        'numeric' => ':attribute 必須大於或等於 :value。',
        'string' => ':attribute 必須有 :value 個以上的字元。',
    ],
    'hex_color' => ':attribute 必須是有效的十六進位色碼。',
    'hostname' => ':attribute 必須是有效的主機名稱。',
    'image' => ':attribute 必須是圖片。',
    'in' => '選擇的 :attribute 無效。',
    'in_array' => ':attribute 必須存在於 :other 中。',
    'in_array_keys' => ':attribute 必須包含下列至少一個鍵：:values。',
    'integer' => ':attribute 必須是整數。',
    'ip' => ':attribute 必須是有效的 IP 位址。',
    'ipv4' => ':attribute 必須是有效的 IPv4 位址。',
    'ipv6' => ':attribute 必須是有效的 IPv6 位址。',
    'json' => ':attribute 必須是有效的 JSON 字串。',
    'list' => ':attribute 必須是清單。',
    'lowercase' => ':attribute 必須是小寫。',
    'lt' => [
        'array' => ':attribute 必須少於 :value 個項目。',
        'file' => ':attribute 必須小於 :value KB。',
        'numeric' => ':attribute 必須小於 :value。',
        'string' => ':attribute 必須少於 :value 個字元。',
    ],
    'lte' => [
        'array' => ':attribute 不能多於 :value 個項目。',
        'file' => ':attribute 必須小於或等於 :value KB。',
        'numeric' => ':attribute 必須小於或等於 :value。',
        'string' => ':attribute 不能多於 :value 個字元。',
    ],
    'mac_address' => ':attribute 必須是有效的 MAC 位址。',
    'max' => [
        'array' => ':attribute 不能多於 :max 個項目。',
        'file' => ':attribute 不能大於 :max KB。',
        'numeric' => ':attribute 不能大於 :max。',
        'string' => ':attribute 不能多於 :max 個字元。',
    ],
    'max_digits' => ':attribute 不能多於 :max 位數。',
    'mimes' => ':attribute 的檔案類型必須是：:values。',
    'mimetypes' => ':attribute 的檔案類型必須是：:values。',
    'min' => [
        'array' => ':attribute 至少要有 :min 個項目。',
        'file' => ':attribute 至少要有 :min KB。',
        'numeric' => ':attribute 至少要是 :min。',
        'string' => ':attribute 至少要有 :min 個字元。',
    ],
    'min_digits' => ':attribute 至少要有 :min 位數。',
    'missing' => ':attribute 不能出現。',
    'missing_if' => '當 :other 為 :value 時，:attribute 不能出現。',
    'missing_unless' => '除非 :other 為 :value，否則 :attribute 不能出現。',
    'missing_with' => '有 :values 時，:attribute 不能出現。',
    'missing_with_all' => '有 :values 時，:attribute 不能出現。',
    'multiple_of' => ':attribute 必須是 :value 的倍數。',
    'not_in' => '選擇的 :attribute 無效。',
    'not_regex' => ':attribute 格式無效。',
    'numeric' => ':attribute 必須是數字。',
    'password' => [
        // Describes App\Rules\Password, which checks composition and a floor of 8
        // characters — there is no 50-character ceiling anywhere behind it.
        'default' => ':attribute 至少要有 8 個字元，並包含大寫字母、小寫字母、數字和特殊字元各 1 個。',
        'letters' => ':attribute 至少要包含一個字母。',
        'mixed' => ':attribute 至少要包含一個大寫字母和一個小寫字母。',
        'numbers' => ':attribute 至少要包含一個數字。',
        'symbols' => ':attribute 至少要包含一個符號。',
        'uncompromised' => '這個 :attribute 曾出現在外洩資料中，請改用其他 :attribute。',
    ],
    'present' => ':attribute 必須存在。',
    'present_if' => '當 :other 為 :value 時，:attribute 必須存在。',
    'present_unless' => '除非 :other 為 :value，否則 :attribute 必須存在。',
    'present_with' => '有 :values 時，:attribute 必須存在。',
    'present_with_all' => '有 :values 時，:attribute 必須存在。',
    'prohibited' => '不允許填寫 :attribute。',
    'prohibited_if' => '當 :other 為 :value 時，不允許填寫 :attribute。',
    'prohibited_if_accepted' => '接受 :other 時，不允許填寫 :attribute。',
    'prohibited_if_declined' => '拒絕 :other 時，不允許填寫 :attribute。',
    'prohibited_unless' => '除非 :other 在 :values 之中，否則不允許填寫 :attribute。',
    'prohibits' => '填寫 :attribute 時，不能同時填寫 :other。',
    'regex' => ':attribute 格式無效。',
    'required' => ':attribute 為必填。',
    'required_array_keys' => ':attribute 必須包含下列項目：:values。',
    'required_if' => '當 :other 為 :value 時，:attribute 為必填。',
    'required_if_accepted' => '接受 :other 時，:attribute 為必填。',
    'required_if_declined' => '拒絕 :other 時，:attribute 為必填。',
    'required_unless' => '除非 :other 在 :values 之中，否則 :attribute 為必填。',
    'required_with' => '有 :values 時，:attribute 為必填。',
    'required_with_all' => '有 :values 時，:attribute 為必填。',
    'required_without' => '沒有 :values 時，:attribute 為必填。',
    'required_without_all' => ':values 都沒有填寫時，:attribute 為必填。',
    'same' => ':attribute 必須和 :other 相同。',
    'size' => [
        'array' => ':attribute 必須包含 :size 個項目。',
        'file' => ':attribute 必須是 :size KB。',
        'numeric' => ':attribute 必須是 :size。',
        'string' => ':attribute 必須是 :size 個字元。',
    ],
    'starts_with' => ':attribute 開頭必須是下列其中一項：:values。',
    'string' => ':attribute 必須是字串。',
    'timezone' => ':attribute 必須是有效的時區。',
    'unique' => ':attribute 已被使用。',
    'unique_exists' => ':attribute 已存在。',
    'uploaded' => ':attribute 上傳失敗。',
    'uppercase' => ':attribute 必須是大寫。',
    'url' => ':attribute 必須是有效的網址。',
    'ulid' => ':attribute 必須是有效的 ULID。',
    'uuid' => ':attribute 必須是有效的 UUID。',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
