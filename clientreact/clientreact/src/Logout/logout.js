import React, { useEffect } from 'react'


const Logout = () => {
	
    
	useEffect(() => {
		localStorage.clear();
	}, [])

	return (
		<div>

              <h2>Logged out successfully</h2>
		</div>
	)
}

export default Logout
