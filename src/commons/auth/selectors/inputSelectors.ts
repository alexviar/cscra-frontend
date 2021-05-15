export const getUser = (state:any)=>state.auth.user
export const getStatusOfLoadUser = (state:any)=>state.auth.loadUser
export const getLoginState = (state:any)=>state.auth.login
export const getLoginForm = (state:any)=>state.auth.loginForm
export const getIsAuthenticated = (state:any)=>state.auth.user != null