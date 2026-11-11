import { Address, AddressVersion } from '@/types/address.ts'

import { t } from '@/lib/i18n.ts'

export const versionLabels: Record<AddressVersion, string> = {
    [AddressVersion.IPv4]: 'IPv4',
    [AddressVersion.IPv6]: 'IPv6',
}

/** What a list of addresses is, in one line: how many, and of which versions. */
export const summarizeAddresses = (addresses: Address[]): string => {
    const ipv4 = addresses.filter(a => a.version === AddressVersion.IPv4).length
    const ipv6 = addresses.length - ipv4

    if (ipv4 > 0 && ipv6 > 0) {
        return t('{{count}} addresses · {{ipv4}} IPv4 · {{ipv6}} IPv6', {
            count: addresses.length,
            ipv4,
            ipv6,
        })
    }

    return t('{{count}} {{version}} addresses', {
        count: addresses.length,
        version: versionLabels[addresses[0].version],
    })
}

export type VersionFilter = AddressVersion | 'all'

/** How many of each version a collection holds. */
export const countVersions = (addresses: Address[]) => {
    const ipv4 = addresses.filter(a => a.version === AddressVersion.IPv4).length

    return { ipv4, ipv6: addresses.length - ipv4 }
}
