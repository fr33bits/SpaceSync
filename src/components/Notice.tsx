import { getNoticeDetails } from '../../common/notices.ts'

interface NoticeProps {
    notice: string
}

export const Notice: React.FC<NoticeProps> = ({ notice }) => {
    const noticeDetails = getNoticeDetails(notice, true, 'EN')

    if (noticeDetails.type === 'warning') {
        return (
            <>
                <div className="notice warning">
                    <span className="notice-icon material-symbols-outlined">
                        warning
                    </span>
                    {noticeDetails.message}
                </div>

            </>
        )
    } else if (noticeDetails.type === 'error') {
        return (
            <div className="notice error">
                <span className="notice-icon material-symbols-outlined">
                    error
                </span>
                {noticeDetails.message}
            </div>
        )
    }
}