import { useEffect, useState } from "react"
import Footer from "./components/Footer/Footer"
import Main from "./components/Main/Main"
import SideBar from "./components/SideBar/SideBar"

function App() {
  
  const [data, setData] = useState(null);
  const [locading, setLocading] = useState(false);
  const [showModal,setShowModal] = useState(false);
  
  useEffect(()=>{
    async function fetchAPIData(){
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
      const url = "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`;

      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;

      if(localStorage.getItem(localKey)){
        const apiData = JSON.parse(localStorage.getItem(localKey));
        setData(apiData);
        console.log("Fetched from cache today");
        return;
      }
      localStorage.clear();

      try {
        const response = await fetch(url);
        const apiData = await response.json();

        localStorage.setItem(localKey,JSON.stringify(apiData));
        setData(apiData);
        console.log("Fetch from API today");
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAPIData();
  },[]);

  function handleToggleModal(){
    setShowModal(!showModal);
  }

  return (
    <>
      {data 
        ? (<Main data={data}/>)
        : <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      }
      { showModal 
        ? (<SideBar data={data} handleToggleModal={handleToggleModal}/>)
        : null
      }

      {data && (<Footer data={data} handleToggleModal={handleToggleModal}/>)}
    </>
  )
}

export default App
