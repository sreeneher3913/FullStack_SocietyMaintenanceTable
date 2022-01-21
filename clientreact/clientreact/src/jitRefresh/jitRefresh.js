import React, { useEffect } from 'react'


const JitRefresh = () => {
	
    
	 useEffect(() => {
		
        const req = fetch('http://localhost:1337/api/jitrefresh', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			
		});

	}, [])

	return (
		<div>

              <h2>Fully Refreshed</h2>
		</div>
	)
}

export default JitRefresh
