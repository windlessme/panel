import { useUser as useCurrentUser } from '@/features/auth/api.ts'
import { deleteUser, userQueries } from '@/features/users/api.ts'
import type { AdminUser } from '@/types/admin/user.ts'
import { useMutation } from '@tanstack/react-query'

import { t } from '@/lib/i18n.ts'
import { queryClient } from '@/lib/query-client.ts'

import useConfirmationStore from '@/components/ui/AlertDialog/use-confirmation-store.ts'
import { toast } from '@/components/ui/Toast'

interface Options {
    /** Runs after a successful delete — the detail page leaves for the list, the list stays put. */
    onDeleted?: () => void
}

/**
 * Deleting a user, with the refusals stated in the confirmation rather than by hiding the action.
 *
 * Shared by the list row and the detail page header so the two cannot answer differently. Delete is
 * always offered and the dialog is where it is refused — the same shape the anchors list uses:
 * hiding the item an operator came for leaves them working out why it is missing, whereas asking
 * and then answering "because four servers belong to them" is the same refusal with its reason
 * attached.
 */
const useUserDeletion = ({ onDeleted }: Options = {}) => {
    const confirm = useConfirmationStore(state => state.confirm)
    const { data: currentUser } = useCurrentUser()

    const { mutate: remove } = useMutation({
        mutationFn: (user: AdminUser) => deleteUser(user.id),
        onSuccess: async () => {
            toast.add({ title: t('User deleted'), type: 'success' })
            // A delete changes counts on rows this page cannot see, so this refetches rather than
            // patching the cached page in place.
            await queryClient.invalidateQueries({ queryKey: userQueries.all() })
            onDeleted?.()
        },
        onError: () =>
            toast.add({ title: t('Failed to delete user'), type: 'error' }),
    })

    const confirmAndDelete = async (user: AdminUser) => {
        const isSelf = user.id === currentUser?.id
        const owns = user.serversCount > 0

        const confirmed = await confirm({
            title: isSelf
                ? t('You are signed in as this account')
                : owns
                  ? t('{{name}} still owns servers', { name: user.name })
                  : t('Delete user'),
            description: isSelf
                ? t(
                      'An account cannot delete itself. Another administrator can remove it for you.'
                  )
                : owns
                  ? t(
                        '{{count}} servers still belong to this account. Transfer or delete them first.',
                        { count: user.serversCount }
                    )
                  : t(
                        'Delete {{name}} ({{email}})? Their API tokens, SSH keys and sessions go with them. This cannot be undone.',
                        { name: user.name, email: user.email }
                    ),
            confirmText: t('Delete'),
            cancelText: isSelf || owns ? t('Close') : t('Cancel'),
            confirmButton: {
                variant: 'destructive',
                disabled: isSelf || owns,
            },
        })

        if (confirmed) remove(user)
    }

    return { confirmAndDelete, currentUserId: currentUser?.id }
}

export default useUserDeletion
