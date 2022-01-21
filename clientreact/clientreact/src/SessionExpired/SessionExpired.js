import React, { useEffect } from 'react'


const SessionExpired = () => {
	
    
	useEffect(() => {
		localStorage.clear();
	}, [])

	return (
		<div>

              <h2>Session Expired</h2>
		</div>
	)
}

export default SessionExpired
