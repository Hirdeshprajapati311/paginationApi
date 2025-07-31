
import { PrimeReactProvider } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';



interface APIData{
  id: number;
  title: string;
  place_of_origin: string
  artist_display: string
  inscriptions: string
  date_start: string
  date_end:string
}

const App = () => {

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
  const [selectCount, setSelectCount] = useState<number | undefined>()


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
    setSelectedRows(e.value)
  }

  const onSubmithandler = async () => {
    const rowsToSelect = Number(selectCount);
    if (isNaN(rowsToSelect) || rowsToSelect <= 0) return;

    const itemsPerPage = 12;
    const pagesNeeded = Math.ceil(rowsToSelect / itemsPerPage);

    try {
      setIsLoading(true);

      const fetches = Array.from({ length: pagesNeeded }, (_, i) =>
        fetch(`https://api.artic.edu/api/v1/artworks?page=${i + 1}`).then(res => res.json())
      );

      const results = await Promise.all(fetches);
      const allItems = results.flatMap(res => res.data);

      setSelectedRows(allItems.slice(0, rowsToSelect));
      op.current?.hide();
    } catch (error) {
      console.error('Bulk fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };




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
        selectionMode={'checkbox'} selection={selectedRows.filter(row=>apiData.some(r=>r.id === row.id))} onSelectionChange={onSelectionChange} paginator rows={12}
        totalRecords={totalRecords}
        onPage={onPageChange}
        loading={isLoading}
        dataKey="id"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column selectionMode='multiple' headerStyle={{ width: '3rem' }}></Column>
        <Column body={()=>null} header={idHeaderTemplate} />
        <Column field='title' header='Title' ></Column>
        <Column field='place_of_origin' header="Origin" />
        <Column field='artist_display' header="Artist" ></Column>
        <Column field='inscriptions' header="Inscriptions" />
        <Column field='date_start' header="Start date" />
        <Column field='date_end' header="End date" />
        </DataTable>
   
      
    </PrimeReactProvider>
  );
}

export default App;



