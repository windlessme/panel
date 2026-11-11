#!/usr/bin/env node
// Keeps the translation catalogs in sync with the t() calls in the frontend.
//
//   node scripts/i18n.mjs sync    add new keys to every catalog (empty value), drop unused ones
//   node scripts/i18n.mjs check   exit 1 when a key is missing, empty or unused (CI / pre-deploy)
//   node scripts/i18n.mjs todo    print keys that still need a translation
//   node scripts/i18n.mjs lint    Taiwan-usage lint: mainland terms, half-width punctuation, placeholders
//
// Keys are the English source strings, so `en` only lists plural overrides
// (`<key>_one`). Every other locale must translate every key.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'resources/scripts')
const localeDir = path.join(srcDir, 'locales')
const SKIP =
    /(routeTree\.gen\.ts|\.d\.ts|[\\/]wayfinder[\\/]|[\\/]locales[\\/])/
const FUNCTIONS = new Set(['t', 'translate'])
const PLURAL_SUFFIXES = ['_zero', '_one', '_two', '_few', '_many', '_other']

const walk = dir =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name)
        if (SKIP.test(full)) return []
        if (entry.isDirectory()) return walk(full)
        return /\.tsx?$/.test(entry.name) ? [full] : []
    })

const collectKeys = () => {
    const keys = new Map() // key -> first location
    const dynamic = []
    for (const file of walk(srcDir)) {
        const text = fs.readFileSync(file, 'utf8')
        if (!/\b(t|translate)\(/.test(text)) continue
        const source = ts.createSourceFile(
            file,
            text,
            ts.ScriptTarget.Latest,
            true,
            file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
        )
        const visit = node => {
            if (
                ts.isCallExpression(node) &&
                ts.isIdentifier(node.expression) &&
                FUNCTIONS.has(node.expression.text) &&
                node.arguments.length > 0
            ) {
                const [arg] = node.arguments
                const where = `${path.relative(root, file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`
                if (
                    ts.isStringLiteral(arg) ||
                    ts.isNoSubstitutionTemplateLiteral(arg)
                ) {
                    // `{ context: 'x' }` resolves to `<key>_x` (falling back to `<key>`).
                    const options = node.arguments[1]
                    const context =
                        options && ts.isObjectLiteralExpression(options)
                            ? options.properties.find(
                                  p =>
                                      ts.isPropertyAssignment(p) &&
                                      p.name.getText(source) === 'context'
                              )
                            : undefined
                    if (context && !ts.isStringLiteral(context.initializer))
                        dynamic.push(where)
                    const key =
                        context && ts.isStringLiteral(context.initializer)
                            ? `${arg.text}_${context.initializer.text}`
                            : arg.text
                    if (!keys.has(key)) keys.set(key, where)
                } else {
                    dynamic.push(where)
                }
            }
            ts.forEachChild(node, visit)
        }
        visit(source)
    }
    return { keys, dynamic }
}

const readCatalog = file =>
    fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}

const writeCatalog = (file, catalog) => {
    const sorted = Object.fromEntries(
        Object.keys(catalog)
            .sort((a, b) => a.localeCompare(b, 'en'))
            .map(key => [key, catalog[key]])
    )
    fs.writeFileSync(file, `${JSON.stringify(sorted, null, 4)}\n`)
}

const baseKey = key => {
    const suffix = PLURAL_SUFFIXES.find(s => key.endsWith(s))
    return suffix ? key.slice(0, -suffix.length) : key
}

// Mainland-China vocabulary that has a different Taiwanese term. Checked on
// zh-TW values only; see docs/i18n.md for the glossary.
const MAINLAND_TERMS = {
    服務器: '伺服器',
    網絡: '網路',
    信息: '資訊／訊息',
    默認: '預設',
    支持: '支援',
    設置: '設定',
    用戶: '使用者',
    賬號: '帳號',
    賬戶: '帳戶',
    登錄: '登入',
    註銷: '登出',
    運行: '執行',
    內存: '記憶體',
    磁盤: '磁碟',
    硬盤: '硬碟',
    存儲: '儲存',
    文件夾: '資料夾',
    模板: '範本',
    鏡像: '映像檔',
    創建: '建立',
    激活: '啟用',
    禁用: '停用',
    刷新: '重新整理',
    搜索: '搜尋',
    數據: '資料',
    消息: '訊息',
    視頻: '影片',
    屏幕: '螢幕',
    鼠標: '滑鼠',
    點擊: '點選',
    菜單: '選單',
    界面: '介面',
    窗口: '視窗',
    端口: '連接埠',
    字段: '欄位',
    質量: '品質',
    調用: '呼叫',
    線程: '執行緒',
    進程: '處理程序',
    緩存: '快取',
    日誌: '記錄',
    異步: '非同步',
    實時: '即時',
    在線: '線上',
    加載: '載入',
    導入: '匯入',
    導出: '匯出',
    打開: '開啟',
    重啓: '重新啟動',
    重啟: '重新啟動',
    帶寬: '頻寬',
    寬帶: '寬頻',
    互聯網: '網際網路',
    密鑰: '金鑰',
    令牌: '權杖',
    二維碼: 'QR Code',
    套餐: '方案',
    充值: '儲值',
    賬單: '帳單',
    集群: '叢集',
    宿主機: '主機',
    計算機: '電腦',
    軟件: '軟體',
    硬件: '硬體',
    芯片: '晶片',
    分辨率: '解析度',
    鏈接: '連結',
    郵箱: '電子郵件',
    短信: '簡訊',
    兼容: '相容',
    反饋: '回饋',
    運維: '維運',
    視圖: '檢視',
    地址: '位址',
    網關: '閘道',
    子網: '子網路',
    獲取: '取得',
    保存: '儲存',
    文檔: '文件',
    接口: '介面',
    回調: '回呼',
    掛起: '暫停',
    用戶名: '使用者名稱',
    入站: '輸入',
    出站: '輸出',
    快捷鍵: '快速鍵',
    粘貼: '貼上',
    黏貼: '貼上',
    剪切: '剪下',
    添加: '新增',
}
// Taiwanese words that contain a mainland term as a substring.
const TAIWAN_SUPERSTRINGS = ['子網路']
const CJK = '\\u3400-\\u9fff\\uf900-\\ufaff'
const HALF_WIDTH_PUNCT = new RegExp(
    `[${CJK}][,;:!?()]|[,;:!?(][${CJK}]|[${CJK}]\\.(\\s|$)`
)
const placeholders = text =>
    (String(text).match(/\{\{[^{}]+\}\}/g) ?? [])
        .map(p => p.replace(/\s/g, ''))
        .sort()
        .join(',')

const lintTranslation = (key, value) => {
    const issues = []
    if (placeholders(baseKey(key)) !== placeholders(value))
        issues.push(`placeholders differ from key`)
    for (const [term, fix] of Object.entries(MAINLAND_TERMS)) {
        if (
            TAIWAN_SUPERSTRINGS.reduce(
                (text, word) => text.replaceAll(word, ''),
                String(value)
            ).includes(term)
        )
            issues.push(`mainland term 「${term}」→「${fix}」`)
    }
    if (
        HALF_WIDTH_PUNCT.test(value) ||
        (new RegExp(`[${CJK}]`).test(value) && /[?!:;,]$/.test(value))
    )
        issues.push('half-width punctuation next to Chinese')
    if (/[“”]/.test(value)) issues.push('curly quotes, use 「」')
    if (/\.\.\./.test(value)) issues.push('three dots, use …')
    return issues
}

const command = process.argv[2] ?? 'check'
const { keys, dynamic } = collectKeys()
const catalogs = fs
    .readdirSync(localeDir)
    .filter(name => name.endsWith('.json'))
    .map(name => ({
        locale: name.replace(/\.json$/, ''),
        file: path.join(localeDir, name),
    }))

let problems = 0
for (const { locale, file } of catalogs) {
    const catalog = readCatalog(file)
    const isSource = locale === 'en'
    const unused = Object.keys(catalog).filter(key => !keys.has(baseKey(key)))
    const missing = isSource
        ? []
        : [...keys.keys()].filter(key => !(key in catalog))
    const empty = isSource
        ? []
        : Object.entries(catalog)
              .filter(
                  ([key, value]) =>
                      keys.has(baseKey(key)) && !String(value).trim()
              )
              .map(([key]) => key)

    const lint = isSource
        ? []
        : Object.entries(catalog)
              .filter(
                  ([key, value]) =>
                      keys.has(baseKey(key)) && String(value).trim()
              )
              .flatMap(([key, value]) =>
                  lintTranslation(key, value).map(issue => ({
                      key,
                      value,
                      issue,
                  }))
              )

    if (command === 'lint') {
        for (const { key, value, issue } of lint)
            console.log(
                `${locale}\t${issue}\t${JSON.stringify(key)} => ${JSON.stringify(value)}`
            )
        problems += lint.length
        continue
    }

    if (command === 'sync') {
        for (const key of unused) delete catalog[key]
        for (const key of missing) catalog[key] = ''
        writeCatalog(file, catalog)
        console.log(
            `${locale}: +${missing.length} new, -${unused.length} unused, ${empty.length + missing.length} untranslated`
        )
    } else if (command === 'todo') {
        for (const key of [...missing, ...empty])
            console.log(
                `${locale}\t${JSON.stringify(key)}\t${keys.get(baseKey(key))}`
            )
    } else {
        const count =
            missing.length + empty.length + unused.length + lint.length
        problems += count
        console.log(
            `${locale}: ${keys.size} keys, ${missing.length} missing, ${empty.length} untranslated, ${unused.length} unused, ${lint.length} lint issues`
        )
        for (const { key, value, issue } of lint.slice(0, 20))
            console.log(
                `  lint     ${issue}: ${JSON.stringify(key)} => ${JSON.stringify(value)}`
            )
        for (const key of missing.slice(0, 20))
            console.log(`  missing  ${JSON.stringify(key)} (${keys.get(key)})`)
        for (const key of empty.slice(0, 20))
            console.log(`  empty    ${JSON.stringify(key)}`)
        for (const key of unused.slice(0, 20))
            console.log(`  unused   ${JSON.stringify(key)}`)
    }
}

if (dynamic.length && command !== 'todo') {
    console.log(
        `\n${dynamic.length} t() call(s) with a non-literal key (cannot be checked):`
    )
    for (const where of dynamic) console.log(`  ${where}`)
}

if ((command === 'check' || command === 'lint') && problems > 0) process.exit(1)
