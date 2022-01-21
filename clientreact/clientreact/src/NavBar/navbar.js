import React, { Component } from "react";

import "./navbar.css";
class Navbar extends Component{

 lo(e) {
localStorage.clear();
window.location.href = '/logout' 
}  

render() 
{ return ( 
<div> 
<ul class="nav">
  <li class="nav"><a class="active" href="/">Home</a></li>
  <li class="nav"><a class="nav" href="/register">Register</a></li>
  {localStorage.getItem('token') ? (
       <li class="nav"><button class="nav" onClick={this.lo}>Logout</button></li>
 
      ) : (
        <li class="nav"><a class="nav" href="/login">Login</a></li>
 
  )}
</ul>



</div>   
)

}
}
export default Navbar;