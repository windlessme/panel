import { useTranslation } from 'react-i18next'

import NodeContentBlock from '@/components/admin/nodes/NodeContentBlock'
import NodeDetailsBlock from '@/components/admin/nodes/overview/NodeDetailsBlock'

const NodeOverviewContainer = () => {
    const { t: tStrings } = useTranslation('strings')

    return (
        <NodeContentBlock title={tStrings('overview')}>
            <div className='grid grid-cols-10 gap-6'>
                <NodeDetailsBlock />
            </div>
        </NodeContentBlock>
    )
}

export default NodeOverviewContainer