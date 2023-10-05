import Loading from './Loading';
import Pagination from "./Pagination";
import Search from "./Search";
import Sort from "./Sort";
import PendingTable from "./PendingTable";
import { useSortPay } from "./hooks/useSortPay";
import { useSearch } from "./hooks/useSearch";
import { usePagination } from "./hooks/usePagination";
import { useFetchUserDataPending } from "./hooks/useFetchUserDataPending";

function Pending() {

    // fetch User Data hook
    const {userData} = useFetchUserDataPending();

    // Custom Search hook 
    const { searchValue, filteredData, clearSearch, handleSearch } = useSearch(userData);

    // Sorting Table hook
    const {state, handleSortName, handleSortPrice, handleSortPay}  = useSortPay(filteredData);

    // Pagination Hook that also handles rerenders on search and Sorting table
    const { currentRecords, currentPage, setCurrentPage, nPages } = usePagination(state, userData, filteredData);
    

    if (currentRecords) {
        
        return (
            <>
                <Search clearSearch={clearSearch} handleSearch={handleSearch} searchValue={searchValue} />
                <table className='table table-dark table-striped table-hover'>
                    <thead>
                        <tr>
                            <th className="list-header" scope='col'>
                                Item
                                <span onClick={handleSortName} >
                                    <Sort sort={state.sortName}/>
                                </span>
                            </th>
                            <th className="list-header" scope='col'>
                                Price Sold
                                <span onClick={handleSortPrice} >
                                    <Sort sort={state.sortPrice}/>
                                </span>
                            </th>
                            <th className="list-header" scope='col'>
                                Payout
                                <span onClick={handleSortPay} >
                                    <Sort sort={state.sortPay} />
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <PendingTable currentRecords={currentRecords} />
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

export default Pending;