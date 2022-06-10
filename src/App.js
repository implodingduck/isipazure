import React from 'react';
import './App.css';
import CIDRUtils from './CIDRUtils';
import servicetags from './ServiceTags_Public.json'

function App() {
  const cidrUtils = new CIDRUtils()

  const [ipspace, setIpspace] = React.useState("")
  const [results, setResults] = React.useState("")

  const performIpLookup = (ip) => {
    let ipspace = ip
    if (ipspace.indexOf('/') === -1){
      ipspace = `${ipspace}/32`
    }
    for (let v of servicetags.values){
      //console.log(v)
      for (let p of v.properties.addressPrefixes){
        //console.log(p)
        if (p.indexOf(':') === -1 && cidrUtils.isInRange(ipspace, p)){
          return `IP Space ${ipspace} is in: \n${JSON.stringify(v, null, 2)}`
        }
      }
    }
    return `IP Space ${ipspace} not in Azure Service Tags list`
  }

  const checkIp = ()=>{
    try {
      setResults("Calculating...")
      let r = performIpLookup(ipspace)
      setResults(r)
    }catch(e){
      console.log(e)
      setResults("Invalid CIDR")
    }
    
  }

  const handleIpSpaceChange = (e) => {
    //console.log(e.target.value)
    setIpspace(e.target.value);
  }

  return (
    <div className="App">
      <fieldset>
      <legend>Is IP Azure?</legend>
      <label htmlFor='ipspace'>IP or CIDR:</label>
      <input type="text" onChange={handleIpSpaceChange} name="ipspace" value={ipspace}/>
      <button onClick={checkIp}>Check!</button>
      </fieldset>
      { (results.length === 0) ? "" :
      (<fieldset>
        <legend>Results</legend>
        <pre>
          {results}
        </pre>
      </fieldset>)
    }
    </div>
  );
}

export default App;
