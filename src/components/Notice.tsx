import { getErrorMessage } from '../functions/common.ts'

interface NoticeProps {
    notice: string
}

export const Notice: React.FC<NoticeProps> = ({notice}) => {
    return (
        <div className="error">
            <span className="error-icon material-symbols-outlined">
                error
            </span>
            {getErrorMessage(notice, true, 'EN')}
        </div>
    )
}