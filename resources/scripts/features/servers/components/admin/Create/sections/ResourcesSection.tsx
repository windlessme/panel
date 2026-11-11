import StoragePicker from '@/features/servers/components/admin/Create/pickers/StoragePicker'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import byteSize from 'byte-size'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card'
import { FieldFold, InputForm } from '@/components/ui/Forms'
import { Separator } from '@/components/ui/Separator'

const iec = { units: 'iec' as const, precision: 1 }

/** The form holds mebibytes; the rest of the panel prints bytes via byte-size. */
const fromMib = (value: unknown) => {
    const mib = Number(value)

    return Number.isFinite(mib) && mib > 0
        ? byteSize(mib * 1024 * 1024, iec).toString()
        : null
}

/**
 * Everything this server is allowed to consume, said in one line.
 *
 * Not a field count — the shape of the build is what an admin recognises, so
 * the summary reads the way they would say it out loud.
 */
const useResourceSummary = () => {
    const [cpu, memory, disk, bandwidth, speedLimit, backupCount, disks] =
        useWatch({
            name: [
                'cpu',
                'memory',
                'disk',
                'bandwidth',
                'speedLimit',
                'backupCount',
                'disks',
            ],
        })

    const parts: string[] = []

    if (Number(cpu) > 0) parts.push(t('{{count}} vCPU', { count: Number(cpu) }))

    const ram = fromMib(memory)
    if (ram) parts.push(ram)

    const primary = fromMib(disk)
    if (primary) parts.push(t('{{size}} disk', { size: primary }))

    if (Array.isArray(disks) && disks.length > 0) {
        parts.push(t('+{{count}} volumes', { count: disks.length }))
    }

    if (Number(bandwidth) === -1) {
        parts.push(t('unmetered'))
    } else {
        const transfer = fromMib(bandwidth)
        parts.push(
            transfer
                ? t('{{size}} transfer', { size: transfer })
                : t('no transfer')
        )
    }

    if (Number(speedLimit) > 0)
        parts.push(t('{{speed}} MB/s cap', { speed: speedLimit }))

    const backups = Number(backupCount)
    if (backups === -1) parts.push(t('unlimited backups'))
    else if (backups > 0) parts.push(t('{{count}} backups', { count: backups }))
    else parts.push(t('no backups'))

    return parts.join(' · ')
}

/** Extra data disks, sized in GiB — PVE allocates whole GiB. */
const AdditionalDisks = () => {
    const { control } = useFormContext()
    const nodeId = useWatch({ name: 'nodeId' })
    const { fields, append, remove } = useFieldArray({ control, name: 'disks' })

    return (
        <div className={'space-y-3'}>
            <div className={'flex items-center justify-between gap-3'}>
                <p className={'text-sm font-medium'}>{t('Additional disks')}</p>
                <Button
                    type={'button'}
                    variant={'outline'}
                    size={'sm'}
                    disabled={!nodeId}
                    onClick={() => append({ storageId: '', size: 10 })}
                >
                    <IconPlus className={'size-4'} /> {t('Add disk')}
                </Button>
            </div>

            {fields.length === 0 ? (
                <p className={'text-muted-foreground text-sm'}>
                    {nodeId
                        ? t('None. The primary disk is set above.')
                        : t(
                              'Choose a node first — data disks come from its storages.'
                          )}
                </p>
            ) : (
                fields.map((field, index) => (
                    <div
                        key={field.id}
                        className={'flex items-end gap-3 rounded-lg border p-3'}
                    >
                        <div
                            className={
                                'grid flex-1 grid-cols-1 gap-3 @lg:grid-cols-2'
                            }
                        >
                            <StoragePicker
                                nodeId={nodeId ? Number(nodeId) : null}
                                requiredContentTypes={['storesKvm']}
                                name={`disks.${index}.storageId`}
                            />
                            <InputForm
                                name={`disks.${index}.size`}
                                label={t('Size')}
                                type={'number'}
                                min={1}
                                suffix={'GiB'}
                            />
                        </div>
                        <Button
                            type={'button'}
                            variant={'ghost'}
                            size={'icon'}
                            className={'text-destructive mb-1'}
                            onClick={() => remove(index)}
                            aria-label={t('Remove disk')}
                        >
                            <IconTrash className={'size-4'} />
                        </Button>
                    </div>
                ))
            )}
        </div>
    )
}

/**
 * Seven number boxes that almost every build accepts as they arrive — from the
 * form's own defaults, or from the preset that just filled them in. So the card
 * states the result and opens on request; see `FieldFold` for when it opens
 * itself.
 */
const ResourcesSection = () => {
    const summary = useResourceSummary()

    return (
        <Card className={'@container'}>
            <CardHeader>
                <CardTitle>{t('Resources')}</CardTitle>
                <CardDescription>
                    {t(
                        'The limits this server is built with. All of them can be changed later from its settings.'
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldFold
                    fields={[
                        'cpu',
                        'memory',
                        'disk',
                        'bandwidth',
                        'speedLimit',
                        'backupCount',
                        'backupSize',
                        'disks',
                    ]}
                    summary={summary}
                >
                    <div className={'space-y-4'}>
                        <div
                            className={'grid grid-cols-1 gap-3 @lg:grid-cols-3'}
                        >
                            <InputForm
                                name={'cpu'}
                                label={'vCPU'}
                                type={'number'}
                            />
                            <InputForm
                                name={'memory'}
                                label={t('Memory')}
                                type={'number'}
                                suffix={'MiB'}
                            />
                            <InputForm
                                name={'disk'}
                                label={t('Primary disk')}
                                type={'number'}
                                suffix={'MiB'}
                            />
                        </div>

                        <div
                            className={'grid grid-cols-1 gap-3 @lg:grid-cols-2'}
                        >
                            <InputForm
                                name={'bandwidth'}
                                label={t('Bandwidth')}
                                type={'number'}
                                min={-1}
                                suffix={'MiB'}
                                description={t('-1 for unmetered.')}
                            />
                            <InputForm
                                name={'speedLimit'}
                                label={t('Speed limit')}
                                type={'number'}
                                min={-1}
                                step={'any'}
                                suffix={'MB/s'}
                                description={t(
                                    'Caps every NIC. -1 for uncapped.'
                                )}
                            />
                        </div>

                        <div
                            className={'grid grid-cols-1 gap-3 @lg:grid-cols-2'}
                        >
                            <InputForm
                                name={'backupCount'}
                                label={t('Backups')}
                                type={'number'}
                                description={t('-1 for unlimited.')}
                            />
                            <InputForm
                                name={'backupSize'}
                                label={t('Backup storage')}
                                type={'number'}
                                suffix={'MiB'}
                                description={t('-1 for unlimited.')}
                            />
                        </div>

                        <Separator />

                        <AdditionalDisks />
                    </div>
                </FieldFold>
            </CardContent>
        </Card>
    )
}

export default ResourcesSection
