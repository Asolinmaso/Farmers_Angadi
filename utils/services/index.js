import cookie from 'js-cookie'

export const handleLogin = (token) => {
    cookie.set('auth', token);
    window.location.assign("/")
}

export const settingEncryptedData = (data) => {
    cookie.set("min", data)
}

export const handleLogout = () => {
    cookie.remove('auth')
    cookie.remove("min")
    window.location.assign("/")
}