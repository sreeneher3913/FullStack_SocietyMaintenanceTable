import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import "./styles.css";


const Dashboard = () => {
	const history = useHistory()
	const [quote, setQuote] = useState('')
	const [tempQuote, setTempQuote] = useState('')      
    const [name, setName] = useState('')
	const [amount, setAmount] = useState('')
	const [messageFromAdmin, setMessageFromAdmin] = useState('')
    const [flatNo, setFlatNo] = useState('')
	const [payHis, setPayHis] = useState([])
	const [forAdminUnpaid, setForAdminUnpaid] = useState([])
	
    const [forAdminSubmitted, setForAdminSubmitted] = useState([])
	const [submitApproveVariable, setsubmitApprove] = useState([])
	const [forAdminTotalPaid, setForAdminTotalPaid] = useState([])
	const [forAdminAllUsers, setForAdminAllUsers] = useState([])

    const [expenses, setExpenses] = useState([])
    const [count, setCount] = useState(6000);
	async function getDetails() {
		const req = await fetch('http://localhost:1337/api/UserDetails', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		//alert(data.payHis[0].date);
        

		data.payHis.forEach(element => {
		
		payHis.push(
			
			[element.name,element.email,element.flatNo,element.amount,element.date]
			
			);
	
		});

	    data.forAdminUnpaid.forEach(element => {
		
			forAdminUnpaid.push(
				
				[element.name,element.email,element.flatNo,element.amount]
				
				);
		
			});

			data.forAdminAllUsers.forEach(element => {
		
				{element.paid ? (
					forAdminAllUsers.push(
					
						[element.name,element.email,element.flatNo,"True"]
						
						)
				  ) : (
					forAdminAllUsers.push(
					
						[element.name,element.email,element.flatNo,"False"]
						
						)
				  )}
				
				
				
			
				});

			//alert(forAdminAllUsers[0][3]);	
          
			data.forAdminSubmitted.forEach(element => {
		

				
				forAdminSubmitted.push(
					
					[element.name,element.email,element.flatNo,element.amount]
					
					);
			
				});

				data.expenses.forEach(element => {
		

				
					expenses.push(
						
						[element.expenseName,element.expenseAmount]
						
						);
				
					});	
		    //alert(forAdminSubmitted);
			setForAdminTotalPaid(data.forAdminTotalPaid*10000)

		//alert(payHis);
		//alert(forAdminUnpaid);
		//alert(forAdminSubmitted);
        setName(data.name);
		setAmount(data.amount)
		setMessageFromAdmin(data.messageFromAdmin)
		setFlatNo(data.flatNo)
		if (data.status === 'ok') {
			setQuote(data.quote)
		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		setTimeout(() => {
		  if(count ===0){
			localStorage.clear();  
			window.location.href = '/sessionExpire' 
		  }		
		  setCount((count) => count - 1);
		}, 1000);
	  });
    
	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/login')
			} else {
				getDetails()
			}
		}

		

	}, [])
    
	async function paySubmit(){
		const req = await fetch('http://localhost:1337/api/paySubmit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				quote: tempQuote,
			}),
		});
        

		const data = await req.json()
		refresf();


	}

	async function submitApprove(e){
        
		await setsubmitApprove( e.target.id);
		const req = await fetch('http://localhost:1337/api/submitApprove', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				 submitApproveVariable,
			}),
		});
		const data = await req.json()
	

	}

	async function submitDisApprove(e){
        
		await setsubmitApprove( e.target.id);
		const req = await fetch('http://localhost:1337/api/submitDisApprove', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				 submitApproveVariable,
			}),
		});
     
        const data = await req.json()
		
	}

	async function refreshAllPayments(){
        
		const req = await fetch('http://localhost:1337/api/adminRefreshPayments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
			
		});
		const data = await req.json()
		refresf();

	}
    
	async function refresf(){
		window.location.reload();
	}

	return (


	<div>
	  {name!=="admin" ? (	
	  <div>
      {localStorage.getItem('token') ? (
		 <div> 
	    <h1>Hi, {name} <i class="fa fa-home"></i>::{flatNo}!! How are you doing today.</h1>	
			
		{amount >0 ? (
		<div className='box'>	
        <h2>

			Your Maintanance Amount Due for the month of {['January',"Febuarary","March","April","May","June", "July","August","September","October","November","December"][new Date().getMonth()]} is:<span style={{color:"red"}}>{amount}</span>
			<br />
			<span style={{color:"green"}}><b>Message from Admin: </b>{messageFromAdmin}</span>
			
		</h2>
		<button onClick={paySubmit} >Pay</button>
		</div>
      ) : (

		  <h2><span style={{color:"green"}}>You have paid the Maintenance, Thank You have a great Day</span></h2>
        
      )}
<h1>Payment History</h1>	   
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Flat No</th>
	<th>Amount</th>
	<th>Payment Date</th>
  </tr>
  

  {payHis.map(( listValue, index ) => {
          return (
            <tr key={index}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td>
              <td>{listValue[2]}</td>
              <td>10000</td>
              <td>{listValue[4]}</td>
            </tr>
          );
        })}
</table>
<br /><br /><br />
<h1>Expenses</h1>
<table>
  <tr>
    <th>Expense Name</th>
    <th>Expense Amount</th>
    
  </tr>
  

  {expenses.map(( listValue, index ) => {
          return (
            <tr key={index}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td>
            </tr>
          );
        })}
</table>

		</div>
      ) : (
		<div class="box"><h2>You are not authourized to the page</h2></div>  
        
      )}
	  	
		</div>

//User Portal Ends
      ):(
//Admin Portal Starts
   <div>
	   
   <h1>Admin Portal</h1>
   <h2>Due Users for the month of {['January',"Febuarary","March","April","May","June", "July","August","September","October","November","December"][new Date().getMonth()]}</h2>
   <table>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Flat No</th>
	<th>Amount</th>
  </tr>
  

  {forAdminUnpaid.map(( listValue, index ) => {
          return (
            <tr key={index}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td>
              <td>{listValue[2]}</td>
              <td>{listValue[3]}</td>
            </tr>
          );
        })}
</table><br /><br /><br />

<h1><span style={{color:"green"}}> Total amount collected from residents:{forAdminTotalPaid}</span></h1>
<br /><br /><br />
<h2>Users payment review</h2>
   <table>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Flat No</th>
	<th>Amount</th>
	<th></th>
	<th></th>
  </tr>
  

  {forAdminSubmitted.map(( listValue, index ) => {
	     if(listValue[3]===10000){
          return (
            <tr key={index}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td>
              <td>{listValue[2]}</td>
              <td>{listValue[3]}</td>
			  <td><button id = {listValue[0]} onClick={submitApprove}>Approve</button></td>
			  <td><button id = {listValue[0]} onClick={submitDisApprove}>Deny</button></td>
            </tr>
          );
		  }
        })}

<tr >
              <td></td>
              <td></td>
              <td></td>
              <td></td>
			  <td></td>
			  <td><button  onClick={refresf}>submit</button></td>
            </tr>	
</table>`
<br />
<button  onClick={refreshAllPayments}>refresh all paymentst</button>
<br /><br /><br />
<h1>Expenses</h1>
<table>
  <tr>
    <th>Expense Name</th>
    <th>Expense Amount</th>
    
  </tr>
  

  {expenses.map(( listValue, index ) => {
          return (
            <tr key={index}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td>
            </tr>
          );
        })}
</table>
<br /><br /><br />
<h2>All Users</h2>
<table>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Flat No</th>
	<th>Paid</th>
  </tr>
  

  {forAdminAllUsers.map(( listValue, index ) => {
          return (
            <tr key={index}>
              <td>{listValue[0]}</td>
              <td>{listValue[1]}</td>
              <td>{listValue[2]}</td>
              <td>{listValue[3]}</td>
            </tr>
          );
        })}
</table>



   </div>

	  )}	

		</div>
	)
}

export default Dashboard
