import Element from "./DashElement";
import axios from 'axios';
import { useState, useEffect, useContext, useReducer } from 'react';
import ebayLogo from '../images/ebay-logo.png'
import Loading from './Loading';
import Pagination from "./Pagination";
import { AuthContext } from '../App';
import Sort from "./Sort";

const serverUrl = 'http://localhost:8080'

const ACTION = {
    SORTNAME: 'sortName',
    SORTPRICE: 'sortPrice',
    SORTTIME: 'sortTime',
}

function reducer(state, action) {
    switch (action.type) {
        case ACTION.SORTNAME:
            return {
                sortPrice: 'default', 
                sortTime: 'default',
                sortName: action.value,
                sorted: action.filter
            }
        case ACTION.SORTPRICE:
            return {
                sortName: 'default', 
                sortTime: 'default',
                sortPrice: action.value,
                sorted: action.filter
            }
        case ACTION.SORTTIME:
            return {
                sortName: 'default', 
                sortPrice: 'default',
                sortTime: action.value,
                sorted: action.filter
            }
        default:
            return state
    }
  }

function Listings(props) {
    
    // States to store user auth Data and fetched user Data
    const [ userAuth, setUserAuth ]             = useContext(AuthContext);
    const [ userData, setUserData ]             = useState();

     // Search table 
    const [ searchValue, setSearchValue ]       = useState('');
    const [ filteredData, setFilteredData ]     = useState(userData);

     // Pagination 
    const [ currentRecords, setCurrentRecords]  = useState();
    const [ currentPage, setCurrentPage ]       = useState(1); 
    const [ nPages, setNPages ]                 = useState();  
    const [ recordsPerPage ]                    = useState(10);
    const indexOfLastRecord                     = currentPage * recordsPerPage;
    const indexOfFirstRecord                    = indexOfLastRecord - recordsPerPage;  

    // sort Table 
    const [ state, dispatch ]                   = useReducer(reducer, { sorted: [], sortName: 'default', sortPrice: 'default', sortTime: 'default'});

    const handleSortName = () =>{
        if(state.sortName === 'default'){
            let sorted = filteredData.sort((a,b) => (a.title > b.title ? 1: -1));
            dispatch({ type: ACTION.SORTNAME, value:'ascend', filter: sorted });
        }
        if(state.sortName === 'ascend'){
            let sorted = filteredData.sort((a,b) => (a.title < b.title ? 1: -1));
            dispatch({ type: ACTION.SORTNAME, value:'descend', filter: sorted  });
        }
        if(state.sortName === 'descend'){
            let sorted = filteredData.sort((a,b) => (a.title > b.title ? 1: -1));
            dispatch({ type: ACTION.SORTNAME, value:'ascend', filter: sorted  });
        }
    }
    const handleSortPrice = () =>{
        if(state.sortPrice === 'default'){
            let sorted = filteredData.sort((a,b) => (a.currentprice > b.currentprice ? 1: -1));
            dispatch({ type: ACTION.SORTPRICE, value:'ascend', filter: sorted });
        }
        if(state.sortPrice === 'ascend'){
            let sorted = filteredData.sort((a,b) => (a.currentprice < b.currentprice ? 1: -1));
            dispatch({ type: ACTION.SORTPRICE, value:'descend', filter: sorted  });
        }
        if(state.sortPrice === 'descend'){
            let sorted = filteredData.sort((a,b) => (a.currentprice > b.currentprice ? 1: -1));
            dispatch({ type: ACTION.SORTPRICE, value:'ascend', filter: sorted  });
        }
    }
    const handleSortTime = () =>{
        if(state.sortTime === 'default'){
            let sorted = filteredData.sort((a,b) => (a.timeleft > b.timeleft ? 1: -1));
            dispatch({ type: ACTION.SORTTIME, value:'ascend', filter: sorted });
        }
        if(state.sortTime === 'ascend'){
            let sorted = filteredData.sort((a,b) => (a.timeleft < b.timeleft ? 1: -1));
            dispatch({ type: ACTION.SORTTIME, value:'descend', filter: sorted  });
        }
        if(state.sortTime === 'descend'){
            let sorted = filteredData.sort((a,b) => (a.timeleft > b.timeleft ? 1: -1));
            dispatch({ type: ACTION.SORTTIME, value:'ascend', filter: sorted  });
        }
    }
    
    useEffect(() => {
        if(state.sorted){
            let sortedData = state.sorted
            const currentRecord = sortedData.slice(indexOfFirstRecord, indexOfLastRecord); 
            setCurrentRecords(currentRecord) 
            const Page = Math.ceil(sortedData.length / recordsPerPage);
            setNPages(Page)
        }
    }, [state, state.sorted])

    useEffect(() => {
        async function fetchData(){
            await axios.get(serverUrl + '/user/listings',
                {params:{
                        userAuth
                }})
                .then(async res => {
                    console.log(res.data);
                    let data = (res.data)
                    setUserData(data);
                })
                .catch(err => console.log(err));
        }
    fetchData();
    },[]);

    useEffect(() => {
        if (searchValue) {
            let filtered = userData.filter((data) => {
                    return data.title.toString().toLowerCase().includes(searchValue.toLowerCase()) 
                 })
            console.log(searchValue)
            console.log(filtered)
            console.log(filteredData)
            setFilteredData(filtered);
        }else {
        setFilteredData(userData)
        };
    },[searchValue, userData])

    useEffect(()=>{
        if(filteredData){
            console.log(userData);
            const currentRecord = filteredData.slice(indexOfFirstRecord, indexOfLastRecord); 
            setCurrentRecords(currentRecord) 
            const Page = Math.ceil(filteredData.length / recordsPerPage);
            setNPages(Page)
            console.log(currentRecords);
        }
    },[userData, filteredData, currentPage])

    const clearSearch = () => {
        setSearchValue('');
    }

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    }

    async function getImages(url) {
        // await axios.post(serverUrl + '/getimage', {
        //   imageUrl: url
        // })
        // .then(function(res) {
        //     console.log(res)
        // })
        // .catch(function (error) {
        //     console.log(error);
        //   });
    }
    

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    const today = month + " - " + day + " - " + year;

    function listed(data) {
        let fixed = data.substring(0, 10);
        return fixed
    }

    function time(data){
        let fixed = data.replace('D', 'd ').replace('H', 'h ').replace('M', 'min ').replace('S', 'sec').slice(1).substr(0, 12).split('T')
        return fixed
    }

    if (currentRecords) {
        
        return (
            <>
                <input placeholder="Search" className="search" name="text" type="text" value={searchValue} onChange={handleSearch}/>
                <svg className="clear-search" onClick={clearSearch} fill="#CFE6FC" width="20px" height="20px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                    <path d="M202.82861,197.17188a3.99991,3.99991,0,1,1-5.65722,5.65624L128,133.65723,58.82861,202.82812a3.99991,3.99991,0,0,1-5.65722-5.65624L122.343,128,53.17139,58.82812a3.99991,3.99991,0,0,1,5.65722-5.65624L128,122.34277l69.17139-69.17089a3.99991,3.99991,0,0,1,5.65722,5.65624L133.657,128Z"/>
                </svg>
                <table className='table table-dark table-striped table-hover'>
                <thead>
                    <tr>
                        <th className="list-header" scope='col'>
                            Listing
                            <span onClick={handleSortName} >
                                <Sort sort={state.sortName}/>
                            </span>
                        </th>
                        <th className="list-header" scope='col'>
                            Time Left
                            <span onClick={handleSortTime} >
                                <Sort sort={state.sortTime}/>
                            </span>
                        </th>
                        <th className="list-header" scope='col'>
                            Price
                            <span onClick={handleSortPrice} >
                                <Sort sort={state.sortPrice} />
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((data, key) => {
                        return(
                            <tr key={key}>
                                <td>
                                    <div className="accordion">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button 
                                                    className="accordion-button collapsed bg-dark" 
                                                    type="button" 
                                                    data-bs-toggle="collapse" 
                                                    data-bs-target={`#flush-collapse${key}`} 
                                                    aria-expanded="false" 
                                                    aria-controls="flush-collapseOne"
                                                >
                                                    {data.title}
                                                </button>
                                            </h2>
                                            <div id={`flush-collapse${key}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                                <div className="accordion-body">
                                                    <div className='container'>
                                                        <div className='row'>
                                                            <div className='col-sm-6'>
                                                                <Element
                                                                    class='listing-img' 
                                                                    body={(
                                                                        <>
                                                                            <img src='https://i.ebayimg.com/images/g/6-IAAOSwOolkrJ8b/s-l1600.jpg' className='product-img' />
                                                                            {/* <img src={getImages(data.ListingDetails.ViewItemURL._text)} className='product-img' /> */}
                                                                        </>
                                                                    )}
                                                                />    
                                                            </div>
                                                            <div className='col'>
                                                                <div className='row'>
                                                                    <div className='col d-flex justify-content-center'>
                                                                        {/* <Element
                                                                            class='listing-details' 
                                                                        title= {<a href={data.itemurl} target="_blank">View in  <img src={ebayLogo} style={{height:"1.2rem", width:"auto"}} /> </a>}
                                                                        />     */}
                                                                        <div className="card listing-box">
                                                                            <div className="card-header listing-header">
                                                                                View on
                                                                            </div>
                                                                            <div className="card-body listing-body">
                                                                            <a href={data.itemurl} target="_blank"><img src={ebayLogo} style={{height:"1.5rem", width:"auto"}} /> </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col d-flex justify-content-center'>
                                                                        {/* <Element
                                                                            class='listing-details' 
                                                                            title='Listed on:'
                                                                            subtitle={( 
                                                                                <>
                                                                                    {listed(data.starttime)}
                                                                                </> 
                                                                            )}
                                                                        /> */}
                                                                        <div className="card listing-box">
                                                                            <div className="card-header listing-header">
                                                                                Listed on
                                                                            </div>
                                                                            <div className="card-body listing-body">
                                                                                {listed(data.starttime)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col d-flex justify-content-center'>
                                                                        {/* <Element
                                                                            class='listing-details' 
                                                                            title='Bids:'
                                                                            subtitle={( 
                                                                                    <>
                                                                                        {data.bidcount}
                                                                                    </>
                                                                                )}
                                                                        /> */}
                                                                        <div className="card listing-box">
                                                                            <div className="card-header listing-header">
                                                                                Bids
                                                                            </div>
                                                                            <div className="card-body listing-body">
                                                                                {data.bidcount}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col d-flex justify-content-center'>
                                                                        {/* <Element
                                                                            class='listing-details' 
                                                                            title='Watching:'
                                                                            subtitle={(  
                                                                                <>
                                                                                    {data.watchcount}
                                                                                </> 
                                                                                )}
                                                                        /> */}
                                                                        <div className="card listing-box">
                                                                            <div className="card-header listing-header">
                                                                                Watching:
                                                                            </div>
                                                                            <div className="card-body listing-body">
                                                                                {data.watchcount}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col d-flex justify-content-center'>
                                                                        {/* <Element
                                                                            class='listing-details' 
                                                                            title='Time Left:'
                                                                            subtitle={( 
                                                                                    <>
                                                                                        <span className='time-left'>
                                                                                            {time(data.timeleft)}
                                                                                        </span>
                                                                                    </>
                                                                            )}
                                                                        /> */}
                                                                        <div className="card listing-box">
                                                                            <div className="card-header listing-header">
                                                                                Time Left
                                                                            </div>
                                                                            <div className="card-body listing-body">
                                                                                {time(data.timeleft)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col d-flex justify-content-center'>
                                                                        {/* <Element
                                                                            class='listing-details'
                                                                            title='Current Price:' 
                                                                            subtitle={( 
                                                                                <>
                                                                                    <span className='price'>
                                                                                        ${data.currentprice}
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        /> */}
                                                                        <div className="card listing-box">
                                                                            <div className="card-header listing-header">
                                                                                Current Price:
                                                                            </div>
                                                                            <div className="card-body listing-body">
                                                                                $ {data.currentprice}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className='time-left'>
                                        {time(data.timeleft)}
                                    </span>
                                </td>
                                <td>
                                    <span className='price'>
                                        $ {data.currentprice}
                                    </span>
                                </td>
                            </tr>
                        )
                    })} 
                </tbody>
            </table>
            <div className="container">
                    <div className="row">
                        <div className="col d-flex justify-content-center">
                            <Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                        </div>
                    </div>
                </div>
        </>
        )
    } else {
        return (
            <> 
                <Loading/>
            </>
        )
    }
}

export default Listings;