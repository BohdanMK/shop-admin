import logo192 from '@/assets/logo192.png'

const LogoItem = ({ text }: { text: string }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px', flexDirection: 'column' }}>
            <img
                src={logo192}
                alt="Logo"
                
            />
            <span style={{ display: 'block', fontSize: '18px', fontWeight: 'bold' }}>{text}</span>
        </div>
    )
}

export default LogoItem