#!/usr/bin/env node
// Translation tooling for the lang/ catalogs.
//
//   node scripts/i18n.mjs check            fail on missing keys, mismatched placeholders, lint issues
//   node scripts/i18n.mjs todo [locale]    print untranslated keys per file as JSON
//   node scripts/i18n.mjs keys             fail on t('key') calls that en_US doesn't define
//
// Catalogs are PHP arrays (Laravel lang files, also served to the front-end by
// LocaleController), so this shells out to `php` to read them.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const langDir = path.join(root, 'lang')
const SOURCE = 'en_US'

const walk = dir =>
    fs.existsSync(dir)
        ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
              const full = path.join(dir, entry.name)
              return entry.isDirectory() ? walk(full) : [full]
          })
        : []

const readCatalogs = locale => {
    const dir = path.join(langDir, locale)
    const files = walk(dir).filter(f => f.endsWith('.php'))
    if (files.length === 0) return {}
    const json = execFileSync(
        'php',
        [
            '-r',
            '$o = []; foreach (array_slice($argv, 1) as $f) { $o[$f] = require $f; } echo json_encode($o, JSON_UNESCAPED_UNICODE | JSON_FORCE_OBJECT);',
            '--',
            ...files,
        ],
        { encoding: 'utf8', maxBuffer: 64 << 20 }
    )
    return Object.fromEntries(
        Object.entries(JSON.parse(json)).map(([file, data]) => [
            path.relative(dir, file).replace(/\.php$/, ''),
            flatten(data),
        ])
    )
}

const flatten = (data, prefix = '') =>
    Object.entries(data ?? {}).reduce((out, [key, value]) => {
        const full = prefix ? `${prefix}.${key}` : key
        return value !== null && typeof value === 'object'
            ? { ...out, ...flatten(value, full) }
            : { ...out, [full]: String(value) }
    }, {})

// Mainland-China vocabulary that has a different Taiwanese term.
const MAINLAND_TERMS = {
    服務器: '伺服器', 網絡: '網路', 信息: '資訊／訊息', 默認: '預設', 支持: '支援',
    設置: '設定', 用戶: '使用者', 賬號: '帳號', 賬戶: '帳戶', 登錄: '登入', 註銷: '登出',
    運行: '執行', 內存: '記憶體', 磁盤: '磁碟', 硬盤: '硬碟', 存儲: '儲存', 文件夾: '資料夾',
    模板: '範本', 鏡像: '映像檔', 創建: '建立', 激活: '啟用', 禁用: '停用', 刷新: '重新整理',
    搜索: '搜尋', 數據: '資料', 消息: '訊息', 視頻: '影片', 屏幕: '螢幕', 鼠標: '滑鼠',
    點擊: '點選', 菜單: '選單', 界面: '介面', 窗口: '視窗', 端口: '連接埠', 字段: '欄位',
    質量: '品質', 調用: '呼叫', 線程: '執行緒', 進程: '處理程序', 緩存: '快取', 日誌: '記錄',
    異步: '非同步', 實時: '即時', 在線: '線上', 加載: '載入', 導入: '匯入', 導出: '匯出',
    打開: '開啟', 重啓: '重新啟動', 重啟: '重新啟動', 帶寬: '頻寬', 寬帶: '寬頻',
    互聯網: '網際網路', 密鑰: '金鑰', 令牌: '權杖', 二維碼: 'QR Code', 套餐: '方案',
    充值: '儲值', 賬單: '帳單', 集群: '叢集', 宿主機: '主機', 計算機: '電腦', 軟件: '軟體',
    硬件: '硬體', 芯片: '晶片', 分辨率: '解析度', 鏈接: '連結', 郵箱: '電子郵件', 短信: '簡訊',
    兼容: '相容', 反饋: '回饋', 運維: '維運', 視圖: '檢視', 地址: '位址', 網關: '閘道',
    子網: '子網路', 獲取: '取得', 保存: '儲存', 文檔: '文件', 接口: '介面', 回調: '回呼',
    掛起: '暫停', 用戶名: '使用者名稱', 入站: '輸入', 出站: '輸出', 快捷鍵: '快速鍵',
    粘貼: '貼上', 黏貼: '貼上', 剪切: '剪下', 添加: '新增',
}
// Taiwanese words that contain a mainland term as a substring.
const TAIWAN_SUPERSTRINGS = ['子網路']
const CJK = '\\u3400-\\u9fff\\uf900-\\ufaff'
const HAS_CJK = new RegExp(`[${CJK}]`)
const HALF_WIDTH_PUNCT = new RegExp(
    `[${CJK}][,;:!?()]|[,;:!?(][${CJK}]|[${CJK}]\\.(\\s|$)`
)

// Laravel ":name" replacements, i18next "{{name}}" interpolation and
// react-i18next <0></0> component tags must survive translation unchanged.
const tokens = text =>
    [
        ...(text.match(/(?<![A-Za-z0-9/]):[A-Za-z_]+/g) ?? []),
        ...(text.match(/\{\{-?\s*[^{}]+\}\}/g) ?? []).map(p => p.replace(/\s/g, '')),
        ...(text.match(/<\/?\d+\/?>/g) ?? []),
    ]
        .sort()
        .join(' ')

const lint = (source, value) => {
    const issues = []
    if (tokens(source) !== tokens(value))
        issues.push(`placeholders differ (${tokens(source)} → ${tokens(value)})`)
    const stripped = TAIWAN_SUPERSTRINGS.reduce(
        (text, word) => text.replaceAll(word, ''),
        value
    )
    for (const [term, fix] of Object.entries(MAINLAND_TERMS))
        if (stripped.includes(term)) issues.push(`mainland term 「${term}」→「${fix}」`)
    if (
        HALF_WIDTH_PUNCT.test(value) ||
        (HAS_CJK.test(value) && /[?!;,]$/.test(value))
    )
        issues.push('half-width punctuation next to Chinese')
    if (/[“”]/.test(value)) issues.push('curly quotes, use 「」')
    if (new RegExp(`[${CJK}] [${CJK}]`).test(value))
        issues.push('space between Chinese characters')
    if (/\.\.\./.test(value)) issues.push('three dots, use …')
    if (value.trim() === '') issues.push('empty translation')
    return issues
}

// --- t('key') calls in the front-end -------------------------------------
const checkUsedKeys = source => {
    const problems = []
    const srcDir = path.join(root, 'resources/scripts')
    for (const file of walk(srcDir).filter(f => /\.tsx?$/.test(f))) {
        const text = fs.readFileSync(file, 'utf8')
        const bindings = new Map()
        for (const m of text.matchAll(
            /const\s*\{\s*t(?:\s*:\s*(\w+))?\s*\}\s*=\s*useTranslation\(\s*'([^']+)'/g
        ))
            bindings.set(m[1] ?? 't', m[2])
        const check = (ns, key, index) => {
            const [nsPart, keyPart] = key.includes(':') ? key.split(':') : [ns, key]
            const catalog = source[nsPart.replace(/\./g, '/')]
            const exists =
                catalog &&
                Object.keys(catalog).some(
                    k => k === keyPart || k.startsWith(`${keyPart}_`) || k.startsWith(`${keyPart}.`)
                )
            if (!exists) {
                const line = text.slice(0, index).split('\n').length
                problems.push(`${path.relative(root, file)}:${line}  ${nsPart}:${keyPart}`)
            }
        }
        for (const [name, ns] of bindings)
            for (const m of text.matchAll(new RegExp(`\\b${name}\\(\\s*'([^']+)'`, 'g')))
                check(ns, m[1], m.index)
        for (const m of text.matchAll(/<Translate\s[^>]*?ns='([^']+)'[^>]*?i18nKey='([^']+)'/gs))
            check(m[1], m[2], m.index)
        for (const m of text.matchAll(/<Translate\s[^>]*?i18nKey='([^']+)'[^>]*?ns='([^']+)'/gs))
            check(m[2], m[1], m.index)
    }
    return problems
}

const command = process.argv[2] ?? 'check'
const source = readCatalogs(SOURCE)
const targets = (process.argv[3] ? [process.argv[3]] : fs.readdirSync(langDir))
    .filter(l => l !== SOURCE && fs.statSync(path.join(langDir, l)).isDirectory())

if (command === 'todo') {
    for (const locale of targets) {
        const catalog = readCatalogs(locale)
        const todo = {}
        for (const [file, entries] of Object.entries(source))
            for (const [key, value] of Object.entries(entries))
                if (catalog[file]?.[key] === undefined) (todo[file] ??= {})[key] = value
        console.log(JSON.stringify({ [locale]: todo }, null, 2))
    }
    process.exit(0)
}

let failures = 0
const report = (title, lines) => {
    if (lines.length === 0) return
    failures += lines.length
    console.log(`\n${title} (${lines.length})`)
    for (const line of lines.slice(0, 200)) console.log(`  ${line}`)
}

report('t() keys missing from lang/en_US', checkUsedKeys(source))

if (command === 'check') {
    for (const locale of targets) {
        const catalog = readCatalogs(locale)
        const missing = []
        const extra = []
        const issues = []
        for (const [file, entries] of Object.entries(source))
            for (const [key, value] of Object.entries(entries)) {
                const translated = catalog[file]?.[key]
                if (translated === undefined) missing.push(`${file}.php  ${key}`)
                else if (locale.startsWith('zh'))
                    for (const issue of lint(value, translated))
                        issues.push(`${file}.php  ${key}: ${issue}  「${translated}」`)
            }
        for (const [file, entries] of Object.entries(catalog))
            for (const key of Object.keys(entries))
                if (source[file]?.[key] === undefined) extra.push(`${file}.php  ${key}`)
        report(`${locale}: missing translations`, missing)
        report(`${locale}: keys not in en_US`, extra)
        report(`${locale}: lint`, issues)
    }
}

console.log(failures ? `\n${failures} problem(s).` : 'i18n: OK')
process.exit(failures ? 1 : 0)
