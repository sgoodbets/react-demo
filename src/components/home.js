import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ScriptTag from 'react-script-tag';
// import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
import axios from 'axios';
import Table from './betTable';


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email:null,
      bets: null,
      keys: null
    };

  }

  componentDidMount() {
    this.getBettor()
    this.getBets()
  }


  refreshBets(){
    axios.post(`https://api.sharpsports.io/v1/bettors/${this.state.bettor_id}/refreshbets`,{},{headers: { 'Authorization': 'Token 1fb886d9aff543cb6e2d87691a8b977abf12d312' }})
      .then(response => {
        console.log("REFRESH RESPONSE",response.data)
      }).catch(error => {
        console.log(error)
      });
  }

  redirectToLogin() {
    this.props.history.push('/login');
  }

  getBettor() {
    axios.get('http://localhost:4000/user/me', { headers: { 'token': localStorage.getItem('token') }})
    .then(response => {
        if(response.status !== 200){
          this.redirectToLogin()
        }
        console.log("GET BETTOR RESPONSE",response.data);
        this.setState({email: response.data.email});
        this.setState({bettor_id:response.data.bettorId},() => this.refreshBets())
    }).catch(error => {
      this.redirectToLogin();
    });
  }

  getBets() {
    axios.get('http://localhost:4000/user/bets', {headers: { 'token': localStorage.getItem('token') }})
    .then(response => {
      console.log("BETS RESPONSE",response.data)
      this.setState({bets:response.data})
    }).catch(error => {
      console.log("BETS ERROR",error)
    })
  }

  render() {
    // if (this.state.bets){
    // var keys = Object.keys(this.state.bets[0]);
    // var header = null;
    // keys.map((key, index)=>{
    //   header = this.state.bets.map((d) => {<th key={key}>{key.toUpperCase()}</th>});
    // })
    // }

    var keys = null;
    var header = null;
    if (this.state.bets){
      keys = Object.keys(this.state.bets[0]);
      header = keys.map((key, index) => {return <th key={key} scope="col">{key.toUpperCase()}</th>});
    }

    var betdata = null;
    if (this.state.bets){
      var items = this.state.bets;
      betdata = items.map((row, index)=>{
        return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
      })
    }

    // var mappedbets = null;
    // if (this.state.bets){
    //   mappedbets = this.state.bets.map((d) => {return <li key={d.id}>{d.id}</li>});
    // }

    return (
        <div>
        <ScriptTag type="text/javascript" src="https://d388bvybj12fcd.cloudfront.net/button.js"
            token = "1fb886d9aff543cb6e2d87691a8b977abf12d312"
            internalid = {String(this.state.email)}

            buttonText='BookLink'
            padding='15px 32px'
            background-color='#2b2c2e'
            border='none'
            color='#2ce384'
            text-align='center'
            text-decoration='none'
            // display='inline-block'
            font-size='20px'
            border-radius='8px'
            font-family='Impact,Charcoal,sans-serif'
            logo-url='https://sample-app-logo.s3.amazonaws.com/sample-logo-final-small.png'/>
          <div id="SSLink" style={{top:"5%", left:"5%",position:"absolute"}}>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div>
            <table class="table table-striped table-dark">
              <thead>
                <tr>{header}</tr>
              </thead>
              <tbody>
                {betdata}
              </tbody>
            </table>
          </div>
          {/* <div>
            {mappedbets}
          </div> */}
        </div>
    );

}

}

const RenderRow = (props) =>{
  return props.keys.map((key, index)=>{
    return <td key={props.data[key]}>{props.data[key]}</td>
  })
}

export default Home;
