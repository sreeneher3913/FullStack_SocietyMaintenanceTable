import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Navbar from './NavBar/navbar'
import Logout from './Logout/logout'

import JitRefresh from './jitRefresh/jitRefresh'
import SessionExpired from './SessionExpired/SessionExpired'
const App = () => {
	return (
		<div>
			<Navbar />
			<BrowserRouter>
				<Route path="/login" exact component={Login} />
				<Route path="/register" exact component={Register} />
				<Route path="/dashboard" exact component={Dashboard} />
				<Route path="/logout" exact component={Logout} />
				<Route path="/jitRefresh" exact component={JitRefresh} />
                <Route path="/sessionExpire" exact component={SessionExpired} />
			</BrowserRouter>
		</div>
	)
}

export default App
