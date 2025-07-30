
import { PrimeReactProvider } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';



interface APIData{
  id: number;
  title: string;
  artist_display:string
}

const App = () => {

  const [rowClick, setRowClick] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState<APIData[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<APIData[]>([])
  const [lazyParams, setLazyParams] = useState<DataTablePageEvent>({
    first: 0,
    rows: 10,
    page: 0,
  });
  const op = useRef<OverlayPanel>(null);
  const [selectCount, setSelectCount] = useState<number>(0)


  const fetchData = async (page: number = 1) => {
    try {
      setIsLoading(true)
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const data = await res.json();
      setApiData(data.data);
      setTotalRecords(data.pagination.total)
      
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])
  

  const onPageChange = (e: DataTablePageEvent) => {
    if (e.page !== undefined) {
      const nextPage = e.page + 1;
      setLazyParams(e);
      setCurrentPage(nextPage);
     }
  } 

  const onSelectionChange = (e: { value: APIData[] }) => {

    const updatedSelection = [...selectedRows];

    apiData.forEach(row => {
      const index = updatedSelection.findIndex(r => r.id === row.id);
      if (index > -1) {
        updatedSelection.splice(index, 1);
      }
    });

    updatedSelection.push(...e.value);   

    setSelectedRows(updatedSelection)
  }

  const onSubmithandler = async () => {
    const rowsToSelect = Number(selectCount);
    if (isNaN(rowsToSelect) || rowsToSelect <= 0) return;

    const selected: APIData[] = [];
    let page = 1;

    while (selected.length < rowsToSelect) {
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`)
      const data = await res.json();

      if (!data.data || data.data.length === 0) break;

      for (let item of data.data) {
        if (selected.length < rowsToSelect) {
          selected.push(item);
        } else {
          break;
        }
      }
      page += 1;
    }
    setSelectedRows(selected)
  } 



  const idHeaderTemplate = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <i
          className="pi pi-angle-down"
          style={{ cursor: 'pointer' }}
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <input type="text" value={selectCount} placeholder="Select Rows.." onChange={(e)=>setSelectCount(Number(e.target.value))} style={{ width: '100%',padding:"2",borderRadius:'10px',outline:'none',paddingTop:'8px',paddingBottom:'8px' ,paddingLeft:'8px'}} />
          <button onClick={onSubmithandler} style={{ marginTop: '0.5rem', justifySelf: 'end', display: 'flex', borderRadius: '5px', padding: '4px', cursor:'pointer' }}>Submit</button>
        </OverlayPanel>
      </div>
    );
  };


  return (
    <PrimeReactProvider>
   

      <DataTable
        value={apiData}
        lazy
        
        first={lazyParams.first}
        selectionMode={rowClick ? null : 'checkbox'} selection={selectedRows.filter(row=>apiData.some(r=>r.id === row.id))} onSelectionChange={onSelectionChange} paginator rows={12}
        totalRecords={totalRecords}
        onPage={onPageChange}
        loading={isLoading}
        dataKey="id"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
        <Column body={()=>null} header={idHeaderTemplate} />
        <Column field='id' header="ID" ></Column>
        <Column field='title' header='Title' ></Column>
        <Column field='artist_display' header="Artist" ></Column>
        </DataTable>
   
      
    </PrimeReactProvider>
  );
}

export default App;



