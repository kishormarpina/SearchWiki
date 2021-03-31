import {useState, useEffect} from 'react';
import axios from 'axios'
import ListGroup from 'react-bootstrap/ListGroup'

function App() {
  let [results, setResults] = useState([])
  let [term, setTerm] = useState('')
  let [cache, setCache] = useState({})
  let [page, setPage] = useState(1)
  const itemsPerPage = 5
  useEffect(()=>{
    console.log("in effect",page,term,cache,results)
    const search = async ()=>{
      if(term.length >2){
        if(cache[term]){
          setResults(cache[term])
        }else{
          const res = await axios.get(`https://en.wikipedia.org/w/api.php`,{
            params:{
              action: 'query',
              list: 'search',
              origin: '*',
              format: 'json',
              srsearch: term,
              srlimit:20
            }
          })
          console.log(typeof(res),res.data.query.search.length)
          let finalRes =res.data.query.search// JSON.stringify(res.data).split('\n')
          console.log(finalRes)
          setCache((prev) => ({...prev,[term] :finalRes}))
          setResults(finalRes)
        }
      }else{
        // 'type atleast 3 chars'
      }
    }
    const timeOutid = setTimeout(()=>{
      search()
    },1000);
    return()=>{
      clearTimeout(timeOutid)
    }
  });
  const handleChange =(event)=>{
    setTerm(event.target.value)
    setPage(1)
  }
  let htmlres = results.slice((page-1)*itemsPerPage,(page-1)*itemsPerPage+itemsPerPage).map((ele,ind) =>{
    return <ListGroup.Item key={ind}>{ele.title}</ListGroup.Item>
  })
  let leftButton = '';
  let rightButton = '';
  if(results.length && page!=1){
    leftButton= (<button onClick={()=>{
      setPage(page-1)
    }}>Prev</button>)
  }
  if(results.length && page!=parseInt(results.length/itemsPerPage)){
    rightButton= (<button onClick={()=>{
      setPage(page+1)
    }}>Next</button>)
  }
  let curPage = ''
  if(results.length>0){
    curPage = page
  }
  return (
    <div className="App">
      <label>Enter Search Term </label>
      <input type='text' value={term} placeholder='Type at least 3 Characters' onChange={handleChange}></input>
      <ListGroup>{ htmlres}</ListGroup>
      <div align ='center'>{leftButton}<label>{curPage}</label>{rightButton}</div>
    </div>
  );
}

export default App;
