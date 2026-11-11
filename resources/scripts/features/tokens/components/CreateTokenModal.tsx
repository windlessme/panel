import {
    type TokenInput,
    createToken,
    tokenSchema,
} from '@/features/tokens/api.ts'
import {
    type PaginatedApiKeys,
    TOKEN_RESOURCES,
    resourceLabels,
} from '@/features/tokens/types.ts'
import useClipboard from '@/hooks/use-clipboard.ts'
import type { Mutator } from '@/types/query.ts'
import { handleFormErrors } from '@/utils/http.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCheck, IconCopy, IconPlus } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { t } from '@/lib/i18n.ts'

import { Button } from '@/components/ui/Button'
import { Form, FormButton } from '@/components/ui/Form'
import { CheckboxForm, InputForm, TextareaForm } from '@/components/ui/Forms'
import SelectForm from '@/components/ui/Forms/SelectForm'
import {
    ResponsiveDialog,
    ResponsiveDialogBody,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
    ResponsiveDialogTrigger,
} from '@/components/ui/ResponsiveDialog'
import { toast } from '@/components/ui/Toast'

const scopeItems = [
    { value: 'none', label: t('No access') },
    { value: 'read', label: t('Read only') },
    { value: 'write', label: t('Read & write') },
]

const defaultValues: TokenInput = {
    name: '',
    fullAccess: true,
    allowedNetworks: '',
    scopes: Object.fromEntries(
        TOKEN_RESOURCES.map(resource => [resource, 'none'])
    ) as TokenInput['scopes'],
}

interface Props {
    mutate: Mutator<PaginatedApiKeys>
}

const CreateTokenModal = ({ mutate }: Props) => {
    const [open, setOpen] = useState(false)
    const [plainTextToken, setPlainTextToken] = useState<string | null>(null)
    const { copy, copied } = useClipboard()

    const form = useForm<TokenInput>({
        resolver: zodResolver(tokenSchema),
        defaultValues,
    })

    const fullAccess = form.watch('fullAccess')

    const { mutateAsync: trigger } = useMutation({
        mutationFn: createToken,
        onSuccess: async token => {
            await mutate(data => {
                if (!data) return
                return { ...data, items: [token, ...data.items] }
            }, false)

            setPlainTextToken(token.plainTextToken ?? '')
            toast.add({ title: t('API token created'), type: 'success' })
        },
        onError: e => {
            handleFormErrors(e, form.setError)
            toast.add({ title: t('Failed to create token'), type: 'error' })
        },
    })

    const onOpenChange = (next: boolean) => {
        setOpen(next)
        if (!next) {
            // Reset after the close animation so the form doesn't flash.
            setTimeout(() => {
                form.reset(defaultValues)
                setPlainTextToken(null)
            }, 200)
        }
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogTrigger
                render={
                    <Button>
                        <IconPlus className={'size-4'} /> {t('Create token')}
                    </Button>
                }
            />
            <ResponsiveDialogContent>
                {plainTextToken ? (
                    <>
                        <ResponsiveDialogHeader>
                            <ResponsiveDialogTitle>
                                {t('Token created')}
                            </ResponsiveDialogTitle>
                            <ResponsiveDialogDescription>
                                {t(
                                    'Copy this token now. For security, it won’t be shown again.'
                                )}
                            </ResponsiveDialogDescription>
                        </ResponsiveDialogHeader>
                        <ResponsiveDialogBody>
                            <div
                                className={
                                    'bg-muted flex items-center gap-2 rounded-md border p-3'
                                }
                            >
                                <code
                                    className={
                                        'grow overflow-x-auto font-mono text-sm whitespace-nowrap'
                                    }
                                >
                                    {plainTextToken}
                                </code>
                                <Button
                                    variant={'ghost'}
                                    size={'icon'}
                                    aria-label={
                                        copied
                                            ? t('Token copied')
                                            : t('Copy token')
                                    }
                                    onClick={() => copy(plainTextToken)}
                                    className={'shrink-0'}
                                >
                                    {copied ? (
                                        <IconCheck className={'h-4 w-4'} />
                                    ) : (
                                        <IconCopy className={'h-4 w-4'} />
                                    )}
                                </Button>
                            </div>
                        </ResponsiveDialogBody>
                        <ResponsiveDialogFooter>
                            <ResponsiveDialogClose
                                render={<Button>{t('Done')}</Button>}
                            />
                        </ResponsiveDialogFooter>
                    </>
                ) : (
                    <>
                        <ResponsiveDialogHeader>
                            <ResponsiveDialogTitle>
                                {t('Create API token')}
                            </ResponsiveDialogTitle>
                            <ResponsiveDialogDescription>
                                {t(
                                    'A panel-wide token for the application API.'
                                )}
                            </ResponsiveDialogDescription>
                        </ResponsiveDialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(data =>
                                    trigger(data)
                                )}
                            >
                                <ResponsiveDialogBody className={'space-y-4'}>
                                    <InputForm
                                        name={'name'}
                                        label={t('Name')}
                                        placeholder={t('e.g. Deploy bot')}
                                    />
                                    <CheckboxForm
                                        name={'fullAccess'}
                                        label={t('Full access')}
                                        description={t(
                                            'Grant every ability. Turn off to scope the token per resource.'
                                        )}
                                    />
                                    {!fullAccess &&
                                        TOKEN_RESOURCES.map(resource => (
                                            <SelectForm
                                                key={resource}
                                                name={`scopes.${resource}`}
                                                label={resourceLabels[resource]}
                                                items={scopeItems}
                                            />
                                        ))}
                                    <TextareaForm
                                        name={'allowedNetworks'}
                                        label={t('Network access')}
                                        placeholder={
                                            '203.0.113.10\n2001:db8::/48'
                                        }
                                        rows={5}
                                        description={t(
                                            'Optional. Enter one IPv4 or IPv6 address or CIDR range per line. Leave empty to allow this token from any address.'
                                        )}
                                    />
                                </ResponsiveDialogBody>
                                <ResponsiveDialogFooter className={'mt-4'}>
                                    <ResponsiveDialogClose
                                        render={
                                            <Button
                                                variant={'outline'}
                                                type={'button'}
                                            >
                                                {t('Cancel')}
                                            </Button>
                                        }
                                    />
                                    <FormButton>{t('Create token')}</FormButton>
                                </ResponsiveDialogFooter>
                            </form>
                        </Form>
                    </>
                )}
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}

export default CreateTokenModal
