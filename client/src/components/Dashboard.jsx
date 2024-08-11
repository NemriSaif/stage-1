import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Edit } from 'react-feather';
import { Trash } from 'react-feather';
import { ChevronLeft } from 'react-feather';
import { ChevronRight } from 'react-feather';
import CPopUp from "./CPopUp";
import ClientUpPopUp from "./ClientUpPopUp";
import UpdateClient from "./UpdateClient";
import ClientForm from "./ClientForm";
import { PlusCircle } from 'react-feather';
import ConfirmDialog from "./ConfirmDialog";
import 'bootstrap/dist/css/bootstrap.min.css'

function Dashboard() {
    const [clients, setClients] = useState([]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [CopenPopup, setCopenPopup] = useState(false);
    const [ClientUpopenPopup, setClientUpopenPopup] = useState(false);
    const [SelectedClient, setSelectedClient] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({isOpen:false, title:'', subTitle:''});

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate pagination values
    let indexOfLastItem = currentPage * itemsPerPage; 
    if (indexOfLastItem > clients.length) {
        indexOfLastItem = clients.length;

    }
    let indexOfFirstItem;
if (indexOfLastItem === clients.length) {
    indexOfFirstItem = clients.length - (clients.length % itemsPerPage);
    if (clients.length % itemsPerPage === 0) {
        indexOfFirstItem = clients.length - itemsPerPage ; // If the last page is a full page
    }
} else {
    indexOfFirstItem = indexOfLastItem - itemsPerPage ;
}
    const currentItems = clients.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(clients.length / itemsPerPage);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, totalPages]);

    const prePage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);

    const changeCPage = useCallback((page) => {
        setCurrentPage(page);
    }, []);
    
    useEffect(() => {
        console.log('Clients state:', clients);
    }, [clients]);

    useEffect(() => {
        if (query.length >= 2) {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setResults([]);
            fetchClients();
        }
    }, [query]);

    const fetchClients = () => {
        console.log('Fetching clients...');
        setIsLoading(true);
        axios.get('http://localhost:3001/Dashboard')
            .then(result => {
                console.log('Fetched clients:', result.data);
                setClients(result.data);
                setResults([]); // Clear search results when fetching all clients
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false));
    };

    const handleUpdateC = (Client) => {
        setClientUpopenPopup(true);
        setSelectedClient(Client);
    };

    const handleDelete = (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen:false})
        axios.delete('http://localhost:3001/Dashboard/deleteClient/' + id)
            .then(res => {
                console.log(res);
                fetchClients(); // Refresh the list after deletion
            })
            .catch(err => console.error("Error deleting client:", err));
    };

    const handleSearch = async () => {
        try {
            if (query.length >= 2) {
                const response = await axios.get(`http://localhost:3001/Dashboard/search?term=${query}`);
                setResults(response.data);
            } else {
                setResults([]); // Clear results if query is too short
                fetchClients(); // Fetch all clients if query is cleared
            }
        } catch (error) {
            console.error('Error searching clients:', error);
        }
    };

    const displayClients = results.length > 0 ? results : currentItems;

    const refreshData = () => {
        setIsLoading(true);
        axios.get('http://localhost:3001/Dashboard')
            .then(result => {
                console.log("Refreshed client data", result.data);
                setClients(result.data);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!clients.length) {
        return <div>No clients available</div>;
    }

    return (
        <main className="content">
            <div className="container-fluid p-0">
                <h1 className="h3 mb-3">Client's list</h1>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center ml-4">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search clients..."
                                        className="form-control d-inline-block w-50 mr-2"
                                    />
                                     <nav>
                                    <ul className="pagination mb-0">
                                        {/* Previous Page Icon */}
                                        <li >
                                            <ChevronLeft className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={prePage} />
                                            <span>{indexOfFirstItem+1}</span>
                                        </li>
                                        <span>-</span>
                                        {/* Next Page Icon */}
                                        <li >
                                        <span>{indexOfLastItem}</span>
                                        <span> out of {clients.length}</span>
                                            <ChevronRight className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={nextPage} />
                                        </li>   
                                    </ul>
                                </nav>
                                </div>
                                
                               
                               
                                <table className="table table-hover my-0">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th className="d-none d-xl-table-cell">Code</th>
                                            <th className="d-none d-xl-table-cell">Contract</th>
                                            <th>Address</th>
                                            <th className="d-none d-md-table-cell"></th>
                                            <th>
                                                <div className="mb-2">
                                                    <PlusCircle className="align-middle me-2" onClick={()=>setCopenPopup(true)}/>
                                                    <span className="align-middle" onClick={()=>setCopenPopup(true)}>Add New</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {console.log('Rendering clients:', displayClients)}
                                        {displayClients.map((client) => (
                                            <tr key={client._id}>
                                                <td>{client.Name}</td>
                                                <td>{client.Code}</td>
                                                <td>{client.Contract}</td>
                                                <td>{client.Address}</td>
                                                <td>
                                                    <Link to={`/Details/${client._id}`} className="btn btn-dark">Details</Link>
                                                </td>
                                                <td>
                                                    <Edit style={{ marginLeft: '5px' }} onClick={() => handleUpdateC(client._id)} />
                                                    <Trash  style={{ marginLeft: '10px' }} onClick={() => {
                                                        setConfirmDialog({
                                                            isOpen:true,
                                                            title:'Are you sure you want to delete this client?',
                                                            subTitle:"Deleting this client will result in deleting the corresponding Environments and Keys",
                                                            onConfirm:()=>{handleDelete(client._id)}
                                                        })
                                                    }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                   
                                </table>	
                               
                            </div>
                           
                            
                        </div>
                    </div>
                </div>
            </div>

            <CPopUp CopenPopup={CopenPopup} setCopenPopup={setCopenPopup}>
                <ClientForm 
                    refreshData={refreshData} 
                    setCopenPopup={setCopenPopup}
                />
            </CPopUp>

            <ClientUpPopUp ClientUpopenPopup={ClientUpopenPopup} setClientUpopenPopup={setClientUpopenPopup}>
                <UpdateClient 
                    SelectedClient={SelectedClient}
                    refreshData={refreshData} 
                    setClientUpopenPopup={setClientUpopenPopup}
                />
            </ClientUpPopUp>

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </main>
    );
}

export default Dashboard;