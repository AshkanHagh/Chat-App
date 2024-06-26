import { useState } from "react"
import { Link } from "react-router-dom"
import useLogin from "../../hooks/useLogin"
import { TbMessageChatbot } from "react-icons/tb";

function Login() {
  const { loading, sendLoginForm } = useLogin()

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  })

  const handleInputChange = e => {
    setLoginForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    await sendLoginForm(loginForm)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full h-full border border-primary_200 bg-gradient-to-br from-background_200 to-accent_color p-2 px-5 rounded-lg shadow-lg shadow-primary_200 sm:w-[410px] sm:h-min">
      <div>
        <h1 className="text-center text-2xl font-semibold mb-3">Login</h1>
        <div>
          <div className="label">
            <span className="label-text">Username</span>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              value={loginForm.username}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input
              type="password"
              className="grow"
              placeholder="password"
              name="password"
              value={loginForm.password}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <Link to='/signup' className="text-sm inline-block my-3 mt-6 hover:underline" href="#">Don't have account?</Link>
        <button disabled={loading} type="submit" className="btn border w-full">
          {loading ? <span className="loading loading-spinner"></span> : "Login"}
        </button>
      </div>

      <div className="flex justify-center mt-16 sm:hidden shadow-custom">
      <TbMessageChatbot className="text-8xl text-primary_300 md:text-7xl " />
      </div>
    </form>
  )
}

export default Login
