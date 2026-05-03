import { useNavigate } from 'react-router-dom'
import { IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore"

const LogOutBtn = () => {
    const navigate = useNavigate()
    const logOut = useAuthStore((state) => state.logOut)
    const resetProfile = useProfileStore((state) => state.resetProfile)

    const handleLogout = () => {
        logOut()
        resetProfile()
        navigate('/login')
    }

    return  ( <IconButton

                color="primary"
                onClick={handleLogout}
                >
                <LogoutIcon />
            </IconButton> )

}

export default LogOutBtn