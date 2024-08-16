import React, { useState, useEffect } from "react";
import { redirect, useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { PlusCircle, RotateCw, Search, Edit, Trash, ChevronDown, ChevronLeft, ChevronRight} from 'react-feather';
import PopUp from "./PopUp";
import KPopUp from "./KPopUp";
import EnvUpPopUp from "./EnvUpPopUp";
import KeyUpPopUp from "./KeyUpPopUp";
import EnvironmentForm from "./EnvironmentForm";
import UpdateEnv from "./UpdateEnv";
import UpdateKey from "./UpdateKey";
import KeyForm from "./KeyForm";
import SearchPopUp from "./SearchPopUp";
import SearchForm from "./SearchForm";
import ClientUpPopUp from "./ClientUpPopUp";
import UpdateClient from "./UpdateClient";
import ConfirmDialog from "./ConfirmDialog";

function Details() {
  const { id } = useParams();

  const [clientDetails, setClientDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopup, setopenPopup] = useState(false);
  const [openSPopup, setopenSPopup] = useState(false);
  const [openEnvUpPopUp, setopenEnvUpPopUp] = useState(false);
  const [KopenPopup, setKopenPopup] = useState(false);
  const [openKeyUpPopUp, setopenKeyUpPopUp] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedEnvId, setSelectedEnvId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({isOpen:false, title:'', subTitle:''});

  const [ClientUpopenPopup, setClientUpopenPopup] = useState(false);

  // Pagination states
  const [currentEnvPage, setCurrentEnvPage] = useState(1);
  const [currentKeyPage, setCurrentKeyPage] = useState({});
  const itemsPerPage = 5;

  // Search states
  const [envSearchQuery, setEnvSearchQuery] = useState('');
  const [keySearchQuery, setKeySearchQuery] = useState('');
  const [envSearchResults, setEnvSearchResults] = useState([]);
  const [keySearchResults, setKeySearchResults] = useState([]);
  const [isEnvSearchActive, setIsEnvSearchActive] = useState(false);
  const [isKeySearchActive, setIsKeySearchActive] = useState(false);

  const navigate = useNavigate();

 



  const handleEnvSearch = async () => {
    try {
      if (envSearchQuery.length >= 1) {
        const response = await axios.get(`http://localhost:3001/Details/searchEnv?clientId=${id}&term=${envSearchQuery}`);
        setEnvSearchResults(response.data.map((key)=> ({...key, environmentId: id })));
        setIsEnvSearchActive(true);
      } else {
        setEnvSearchResults([]);
        setIsEnvSearchActive(false);
      }
    } catch (error) {
      console.error('Error searching environments:', error);
    }
  };

  const handleKeySearch = async () => {
    try {
      if (keySearchQuery.length >= 1) {
        const response = await axios.get(
          `http://localhost:3001/Details/searchKey?clientId=${id}&environmentId=${selectedEnvId}&term=${keySearchQuery}`
        );
        console.log("Response from searchKey:", response.data);
        setKeySearchResults(response.data.map((key) => ({ ...key, environmentId: id })));
        setIsKeySearchActive(true);
      } else {
        setKeySearchResults([]);
        setIsKeySearchActive(false);
      }
    } catch (error) {
      console.error('Error searching keys:', error);
    }
  };

  const clearEnvSearch = () => {
    setIsEnvSearchActive(false);
    setEnvSearchResults([]);
    setEnvSearchQuery('');
  };

  const clearKeySearch = () => {
    setIsKeySearchActive(false);
    setKeySearchResults([]);
    setKeySearchQuery('');
  };

  const handleDropdownToggle = (envId) => {
    setSelectedEnvId(selectedEnvId === envId ? null : envId);
  };

  const handleClick = (id) => {
    setKopenPopup(true);
    setSelectedEnv(id);
  };

  const handleUpdateE = (env) => {
    setopenEnvUpPopUp(true);
    setSelectedEnv(env);
  };

  const handleUpdateK = (key) => {
    setopenKeyUpPopUp(true);
    setSelectedKey(key);
  };

  const handleDeleteE = (id) => {
    setConfirmDialog({...confirmDialog, isOpen:false});
    axios.delete('http://localhost:3001/Details/deleteEnvironments/'+id)
      .then(res => {
        console.log(res);
        refreshData();
      })
      .catch(err => console.error("Error deleting environment:", err));
  };

  const handleDeleteK = (id) => {
    setConfirmDialog({...confirmDialog, isOpen:false});
    axios.delete('http://localhost:3001/Details/deleteKey/'+id)
      .then(res => {
        console.log(res);
        refreshData();
      })
      .catch(err => console.error("Error deleting key:", err));
  };
  const handleDelete = (id) => {
    setConfirmDialog({...confirmDialog, isOpen:false});
    axios.delete('http://localhost:3001/Dashboard/deleteClient/' + id)
      .then(res => {
        console.log(res);
        // Redirect to Dashboard
        navigate('/');
      })
      .catch(error => {
        console.error("Error deleting client:", error);
        // Optionally, you can show an error message to the user here
      });
  };

  const refreshData = () => {
    setIsLoading(true);
    axios.get(`http://localhost:3001/Details/${id}`)
      .then(result => {
        console.log("Refreshed client details", result.data);
        setClientDetails(result.data);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:3001/Details/${id}`)
      .then(result => {
        console.log("Fetched client details", result.data);
        setClientDetails(result.data);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleEnvSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [envSearchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleKeySearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keySearchQuery]);

  const totalEnvs = clientDetails?.Environments?.length || 0;
  // Pagination functions
  let indexOfLastEnv = currentEnvPage * itemsPerPage;
  if (indexOfLastEnv > totalEnvs) {
    indexOfLastEnv = totalEnvs;

}
  let indexOfFirstEnv;
    if(totalEnvs==0){
      indexOfLastEnv=0;
      indexOfLastEnv=0;
    }
    else if (indexOfLastEnv === totalEnvs) {
      indexOfFirstEnv = totalEnvs - (totalEnvs % itemsPerPage);
      if (totalEnvs % itemsPerPage === 0) {
          indexOfFirstEnv = totalEnvs - itemsPerPage ; // If the last page is a full page
      }
  } else {
      indexOfFirstEnv = indexOfLastEnv - itemsPerPage ;
  }
  const currentEnvs = clientDetails?.Environments?.slice(indexOfFirstEnv, indexOfLastEnv) || [];
  const totalEnvPages = Math.ceil((clientDetails?.Environments?.length || 0) / itemsPerPage);

  const nextEnvPage = () => {
    if (currentEnvPage < totalEnvPages) {
      setCurrentEnvPage(currentEnvPage + 1);
    }
  };

  const prevEnvPage = () => {
    if (currentEnvPage > 1) {
      setCurrentEnvPage(currentEnvPage - 1);
    }
  };

  const changeEnvPage = (pageNumber) => {
    setCurrentEnvPage(pageNumber);
  };
  const getTotalKeysForEnv = (envId) => {
      const env = clientDetails?.Environments?.find(env => env._id === envId);
      return env?.Keys?.length || 0;
  };
  const getCurrentKeys = (envId) => {
    const env = clientDetails.Environments.find(env => env._id === envId);
  if (!env || !env.Keys) {
    return { keys: [], indexOfFirstKey: 0, indexOfLastKey: 0, totalKeys: 0 };
  }

  let totalKeys = env.Keys.length;
  let indexOfLastKey = (currentKeyPage[envId] || 1) * itemsPerPage;
  
  if (indexOfLastKey > totalKeys) {
    indexOfLastKey = totalKeys;
  }
  
  let indexOfFirstKey = indexOfLastKey - itemsPerPage;
  if (indexOfFirstKey < 0) {
    indexOfFirstKey = 0;
  }
  
  const keys = env.Keys.slice(indexOfFirstKey, indexOfLastKey);
  return { keys, indexOfFirstKey, indexOfLastKey, totalKeys };
};

    const getTotalKeyPages = (envId) => {
      const env = clientDetails.Environments.find(env => env._id === envId);
      return Math.ceil(env.Keys.length / itemsPerPage);
    };

    const nextKeyPage = (envId) => {
      const totalPages = getTotalKeyPages(envId);
      setCurrentKeyPage(prev => ({
        ...prev,
        [envId]: Math.min((prev[envId] || 1) + 1, totalPages)
      }));
    };

    const prevKeyPage = (envId) => {
      setCurrentKeyPage(prev => ({
        ...prev,
        [envId]: Math.max((prev[envId] || 1) - 1, 1)
      }));
    };

    const changeKeyPage = (envId, pageNumber) => {
      setCurrentKeyPage(prev => ({
        ...prev,
        [envId]: pageNumber
      }));
    };
   
  //let totalKeys = (envId) => getTotalKeysForEnv(envId);
  const totalKeyPages = (envId) => getTotalKeyPages(envId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!clientDetails) {
    return <div>No client details available</div>;
  }

  return (
    <main className="content">
      {/* Client details section */}
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Client Details</h1>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <table className="table table-hover my-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="d-none d-xl-table-cell">Code</th>
                      <th className="d-none d-xl-table-cell">Contract</th>
                      <th>Address</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={clientDetails._id}>
                      <td>{clientDetails.Name}</td>
                      <td>{clientDetails.Code}</td>
                      <td>{clientDetails.Contract}</td>
                      <td>{clientDetails.Address}</td>
                      <td>
                          <Edit style={{ marginLeft: '5px' }} onClick={()=>setClientUpopenPopup(true)} />
                          <Trash  style={{ marginLeft: '10px' }} onClick={() => {
                               setConfirmDialog({
                               isOpen:true,
                               title:'Are you sure you want to delete this client?',
                               subTitle:"Deleting this client will result in deleting the corresponding Environments and Keys",
                               onConfirm:()=>{handleDelete(id)}
                                })
                          }} />
                      </td>
                    </tr>
                  </tbody>
                </table>	
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environments section */}
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Environments</h1>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center ml-4">
                  <input
                    type="text"
                    value={envSearchQuery}
                    onChange={(e) => setEnvSearchQuery(e.target.value)}
                    placeholder="Search environments..."
                    className="form-control d-inline-block w-50 mr-2"
                  />
                  {isEnvSearchActive && (
                    <RotateCw onClick={clearEnvSearch} />
                  )}
                   <nav>
                                    <ul className="pagination mb-0">
                                        {/* Previous Page Icon */}
                                        <li>
                                          {totalEnvs> 0 ? (
                                            <>
                                            <span>{indexOfFirstEnv+1}</span>
                                            <span>-</span>
                                            <span>{indexOfLastEnv}</span>
                                            </>
                                          ) : (
                                            <span>0</span>
                                          )}
                                        
                                        <span> out of {totalEnvs}</span>
                                        </li>
                                        <li >
                                            <ChevronLeft className={`page-item ${currentEnvPage === 1 ? 'disabled' : ''}`} onClick={prevEnvPage} />
                                            
                                        </li>
                                        <li > 
                                            <ChevronRight className={`page-item ${currentEnvPage === totalEnvPages ? 'disabled' : ''}`} onClick={nextEnvPage} />
                                        </li>   
                                    </ul>
                                </nav>
                </div>
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Environment Actions</th>
                      <th>Key Actions</th>
                      <th>
                        <div className="mb-2">
                          <PlusCircle className="align-middle me-2" />
                          <span className="align-middle" onClick={()=>setopenPopup(true)}>Add New</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(isEnvSearchActive ? envSearchResults : currentEnvs).map(env => (
                      
                      <React.Fragment key={env._id}>
                        <tr>
                          <td>{env.Name}</td>
                          <td>{env.Type}</td>
                          <td>
                            <Edit style={{ marginLeft: '5px' }} onClick={()=>handleUpdateE(env._id)}/>
                            <Trash style={{ marginLeft: '10px' }} onClick={() => {
                              setConfirmDialog({
                                isOpen:true,
                                title:'Are you sure you want to delete this Environment?',
                                subTitle:"Deleting this Environment will result in deleting the corresponding Keys",
                                onConfirm:()=>{handleDeleteE(env._id)}
                              })
                            }} />
                          </td>
                          <td>
                            <PlusCircle style={{ marginLeft: '5px' }} onClick={() => handleClick(env._id)} />
                            <span style={{ marginLeft: '10px' }} className="align-middle ml-4" onClick={() => handleClick(env._id)}>Add key</span>
                          </td>
                          <td>
                            <div className="ml-10">
                              <ChevronDown onClick={() => handleDropdownToggle(env._id)} />
                            </div>
                          </td>
                        </tr>
                        {selectedEnvId === env._id && (
                          <tr>
                            <td colSpan="5">
                              <div className="d-flex justify-content-between align-items-center ml-4">
                                <input
                                  type="text"
                                  value={keySearchQuery}
                                  onChange={(e) => setKeySearchQuery(e.target.value)}
                                  onClick={()=>setSelectedEnvId(env._id)}     
                                  placeholder="Search keys..."
                                  className="form-control d-inline-block w-50 mr-2"
                                />
                                {isKeySearchActive && (
                                  <RotateCw onClick={clearKeySearch} />
                                )}
                                    {/* Key pagination */}
                                {(() => {
                                  const { indexOfFirstKey, indexOfLastKey, totalKeys } = getCurrentKeys(env._id);
                                  return (
                                    <nav>
                                      <ul className="pagination mb-0">
                                        <li>
                                          {totalKeys > 0 ? (
                                            <>
                                              <span>{indexOfFirstKey + 1}</span>
                                              <span>-</span>
                                              <span>{indexOfLastKey}</span>
                                            </>
                                          ) : (
                                            <span>0</span>
                                          )}
                                          <span> out of {totalKeys}</span>
                                        </li>
                                      </ul>
                                    </nav>
                                  );
                                })()}
                                </div>
                              <table className="table table-striped table-hover">
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>URL</th>
                                    <th>Configuration</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                {(isKeySearchActive ? (keySearchResults || []) : (getCurrentKeys(env._id).keys || [])).map(key => (

                                    <tr key={key._id}>
                                      <td>{key.Name}</td>
                                      <td>{key.URL}</td>
                                      <td>{key.Configuration}</td>
                                      <td>{key.Type}</td>
                                      <td>
                                        <Edit onClick={() => handleUpdateK(key._id)} />                                        
                                        <Trash onClick={() => {
                                          setConfirmDialog({
                                            isOpen:true,
                                            title:'Are you sure you want to delete this key?',
                                            subTitle:" ",
                                            onConfirm:()=>{handleDeleteK(key._id)}
                                          })
                                        }} />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                                                          </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                
              </div>	
            </div>
          </div>
        </div>
      </div>

      <PopUp openPopup={openPopup} setopenPopup={setopenPopup}>
        <EnvironmentForm 
          selectedClientId={clientDetails._id}
          refreshData={refreshData} 
          setopenPopup={setopenPopup}
        />
      </PopUp>

      <EnvUpPopUp openEnvUpPopUp={openEnvUpPopUp} setopenEnvUpPopUp={setopenEnvUpPopUp}>
        <UpdateEnv 
          SelectedEnv={selectedEnv} 
          refreshData={refreshData} 
          setopenEnvUpPopUp={setopenEnvUpPopUp}
        />
      </EnvUpPopUp>

      <KPopUp KopenPopup={KopenPopup} setKopenPopup={setKopenPopup}>
        <KeyForm 
          SelectedEnv={selectedEnv}
          refreshData={refreshData} 
          setKopenPopup={setKopenPopup}
        />
      </KPopUp>

      <KeyUpPopUp openKeyUpPopUp={openKeyUpPopUp} setopenKeyUpPopUp={setopenKeyUpPopUp}>
        <UpdateKey 
          selectedKey={selectedKey}
          refreshData={refreshData} 
          setopenKeyUpPopUp={setopenKeyUpPopUp}
        />
      </KeyUpPopUp>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />

      <SearchPopUp openSPopup={openSPopup} setopenSPopup={setopenSPopup}>
        <SearchForm  
          setopenSPopup={setopenSPopup}
        />
      </SearchPopUp>


      <ClientUpPopUp ClientUpopenPopup={ClientUpopenPopup} setClientUpopenPopup={setClientUpopenPopup}>
                <UpdateClient 
                    SelectedClient={id}
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

export default Details;