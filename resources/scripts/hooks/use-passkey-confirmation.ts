import {
    type IdentityStatus,
    confirmIdentity,
    getPasskeyAuthenticationOptions,
} from '@/features/auth/identity/api.ts'
import { getApiErrorMessage } from '@/utils/http.ts'
import { startAuthentication } from '@simplewebauthn/browser'
import {
    AuthenticationResponseJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser'
import { useState } from 'react'

import { t } from '@/lib/i18n.ts'

const usePasskeyConfirmation = () => {
    const [loading, setLoading] = useState(false)
    // Returns the confirmation status so the caller can seed it, exactly as the
    // password branch does.
    const confirm = async (): Promise<IdentityStatus> => {
        setLoading(true)
        let optionsJSON: PublicKeyCredentialRequestOptionsJSON
        try {
            optionsJSON = await getPasskeyAuthenticationOptions()
        } catch (e) {
            setLoading(false)

            throw Error(
                getApiErrorMessage(
                    e,
                    t('Failed to get passkey authentication options')
                )
            )
        }

        let authResponse: AuthenticationResponseJSON
        try {
            authResponse = await startAuthentication({ optionsJSON })
        } catch (e) {
            setLoading(false)

            throw Error(t('Authentication failed'))
        }

        let status: IdentityStatus
        try {
            status = await confirmIdentity({ passkey: authResponse })
        } catch (e) {
            setLoading(false)

            // The server distinguishes an unrecognised passkey from one that
            // belongs to another account; don't flatten that back to one string.
            throw Error(
                getApiErrorMessage(e, t('Invalid passkey. Please try again.'))
            )
        }

        setLoading(false)

        return status
    }

    return { loading, confirm }
}

export default usePasskeyConfirmation
