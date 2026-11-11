import { ConnectionErrorType } from '@/types/node.ts'

import { t } from '@/lib/i18n.ts'

interface ConnectionErrorCopy {
    /** What went wrong, in the admin's terms rather than cURL's. */
    title: string
    /** Why it happened and what to do about it, ideally on this very screen. */
    description: string
}

/**
 * The API already classifies failures (see `App\Enums\Node\Testing\
 * ConnectionErrorCode`), so the UI's job is to turn that classification into
 * something actionable. Each message names the control that fixes it where one
 * exists; the raw cURL text stays available behind the details disclosure for
 * the cases where it genuinely helps.
 *
 * Shared by the create screen's connection test and the node overview, which is
 * why it lives at the feature root: both turn the same `ConnectionErrorCode`
 * into the same sentence, and a node whose certificate is untrusted should read
 * identically whether you meet it while adding the node or a month later.
 */
const CONNECTION_ERROR_COPY: Record<ConnectionErrorType, ConnectionErrorCopy> =
    {
        [ConnectionErrorType.TlsError]: {
            title: t("Couldn't verify the TLS certificate"),
            description: t(
                'Convoy reached the host but could not verify its certificate. Proxmox generates a self-signed certificate when it installs, which is normal on a private network — switch off “Verify TLS certificate” and try again. On a host that faces the internet, install a trusted certificate instead.'
            ),
        },
        [ConnectionErrorType.ConnectionRefused]: {
            title: t('The host refused the connection'),
            description: t(
                'Convoy reached the host, but nothing was listening on that port. Check the port is right — Proxmox uses 8006 by default — and that the host’s firewall allows connections from Convoy.'
            ),
        },
        [ConnectionErrorType.Timeout]: {
            title: t('The host did not respond in time'),
            description: t(
                'Convoy could not get a reply before giving up. The host may be powered off or unreachable from this network, or a firewall may be silently dropping the traffic rather than refusing it.'
            ),
        },
        [ConnectionErrorType.DnsError]: {
            title: t("That hostname doesn't resolve"),
            description: t(
                'Convoy could not look up the FQDN, so it never reached a host. Check it for typos, and make sure the name resolves from wherever Convoy runs — an internal-only name will not resolve from outside your network.'
            ),
        },
        [ConnectionErrorType.TokenInvalid]: {
            title: t('Proxmox rejected the API token'),
            description: t(
                'The host answered, but it does not recognise this token. Check the Token ID and Token Secret. Proxmox shows the secret only once, when the token is created, so if it was not saved you will need to generate a new one.'
            ),
        },
        [ConnectionErrorType.TokenMissingPermissions]: {
            title: t('The token lacks the required permissions'),
            description: t(
                'The token is valid, but Proxmox will not let it manage this node. Convoy needs a token with root privileges and privilege separation disabled — set that on the token in Proxmox, then try again.'
            ),
        },
        [ConnectionErrorType.Other]: {
            title: t('Convoy could not connect to this host'),
            description: t(
                'The connection failed for a reason Convoy does not recognise. The technical details below are the raw error from the host.'
            ),
        },
    }

export const connectionErrorCopy = (
    code: ConnectionErrorType | null
): ConnectionErrorCopy =>
    CONNECTION_ERROR_COPY[code ?? ConnectionErrorType.Other] ??
    CONNECTION_ERROR_COPY[ConnectionErrorType.Other]
