<?php

namespace Convoy\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;

class LocaleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'locale' => ['required', 'string', 'regex:/^(en_US|zh_TW)( (en_US|zh_TW))*$/'],
            'namespace' => ['required', 'string', 'regex:/^(?!.*\.\.)[A-Za-z_. ]{1,191}$/'],
        ];
    }
}