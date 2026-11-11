import { locale } from '@/lib/i18n.ts'
import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': locale,
    },
})

export default axios
