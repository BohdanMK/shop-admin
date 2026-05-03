import { useProfileStore } from "@/store/profileStore"


const ProfileShortName = () => {
    const shortName = useProfileStore((state) => {
        if (!state.profile) return ''
        const names = state.profile.userName
        return names
    })
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
        }}>
            {shortName}
        </div>
    )
}

export default ProfileShortName