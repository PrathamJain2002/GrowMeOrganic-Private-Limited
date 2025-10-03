import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { useState, useEffect, useRef } from 'react';
import './App.css'

interface ArtworkData {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

function App() {
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedArtworks, setSelectedArtworks] = useState<ArtworkData[]>([]);
  const [rowClick, setRowClick] = useState(false);
  const [pageSelections, setPageSelections] = useState<{page: number, selectedArtworks: ArtworkData[]}[]>([]);
  const [selectRowsInput, setSelectRowsInput] = useState('');
  const [pendingSelections, setPendingSelections] = useState<{page: number, count: number}[]>([]);
  const overlayPanelRef = useRef<OverlayPanel>(null);

  const fetchArtworks = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const data = await response.json();
      
      const mappedArtworks = data.data.map((item: any) => ({
        title: item.title || 'Untitled',
        place_of_origin: item.place_of_origin || 'Unknown',
        artist_display: item.artist_display || 'Unknown Artist',
        inscriptions: item.inscriptions || 'No inscriptions',
        date_start: item.date_start || 0,
        date_end: item.date_end || 0
      }));
      
      setArtworks(mappedArtworks);
      setTotalRecords(data.pagination.total);
      setRowsPerPage(data.pagination.limit);
      
      const pendingForThisPage = pendingSelections.find(p => p.page === page);
      if (pendingForThisPage) {
        const rowsToSelect = mappedArtworks.slice(0, pendingForThisPage.count);
        setSelectedArtworks(rowsToSelect);
        
        setPageSelections(prev => {
          const filtered = prev.filter(p => p.page !== page);
          return [...filtered, { page: page, selectedArtworks: rowsToSelect }];
        });
        
        setPendingSelections(prev => prev.filter(p => p.page !== page));
      } else {
        const currentPageSelection = pageSelections.find(p => p.page === page);
        if (currentPageSelection) {
          setSelectedArtworks(currentPageSelection.selectedArtworks);
        } else {
          setSelectedArtworks([]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(1);
  }, []);



  const onPageChange = (event: any) => {
    const newPage = event.page + 1;
    setCurrentPage(newPage);
    
    if (selectedArtworks.length > 0) {
      setPageSelections(prev => {
        const filtered = prev.filter(p => p.page !== currentPage);
        return [...filtered, { page: currentPage, selectedArtworks: [...selectedArtworks] }];
      });
    }
    
    setSelectedArtworks([]);
    fetchArtworks(newPage);
  };

  const handleSelectionChange = (e: any) => {
    const newSelections = e.value;
    setSelectedArtworks(newSelections);
    
    setPageSelections(prev => {
      const filtered = prev.filter(p => p.page !== currentPage);
      return [...filtered, { page: currentPage, selectedArtworks: [...newSelections] }];
    });
  };

  const handleSelectRows = () => {
    const numRows = parseInt(selectRowsInput);
    
    if (numRows > 0) {
      if (numRows <= artworks.length) {
        const rowsToSelect = artworks.slice(0, numRows);
        setSelectedArtworks(rowsToSelect);
        
        setPageSelections(prev => {
          const filtered = prev.filter(p => p.page !== currentPage);
          return [...filtered, { page: currentPage, selectedArtworks: [...rowsToSelect] }];
        });
      } else {
        setSelectedArtworks([...artworks]);
        
        setPageSelections(prev => {
          const filtered = prev.filter(p => p.page !== currentPage);
          return [...filtered, { page: currentPage, selectedArtworks: [...artworks] }];
        });
        
        const remainingRows = numRows - artworks.length;
        const newPendingSelections = [];
        
        let remainingCount = remainingRows;
        let pageNum = currentPage + 1;
        
        while (remainingCount > 0) {
          const rowsForThisPage = Math.min(remainingCount, rowsPerPage);
          newPendingSelections.push({ page: pageNum, count: rowsForThisPage });
          remainingCount -= rowsForThisPage;
          pageNum++;
        }
        
        setPendingSelections(newPendingSelections);
      }
    }
    
    setSelectRowsInput('');
    overlayPanelRef.current?.hide();
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Row Click Mode:</span>
        <InputSwitch checked={rowClick} onChange={(e) => setRowClick(e.value)} />
         <span>Selected: {pageSelections.reduce((total, page) => total + page.selectedArtworks.length, 0) + pendingSelections.reduce((total, pending) => total + pending.count, 0)}</span>
      </div>

      <DataTable 
        value={artworks} 
        selectionMode={rowClick ? null : 'checkbox'} 
        selection={selectedArtworks} 
        onSelectionChange={handleSelectionChange} 
        dataKey="title"
        paginator 
        rows={rowsPerPage}
        totalRecords={totalRecords}
        first={(currentPage - 1) * rowsPerPage}
        onPage={onPageChange}
        lazy={true}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="title" header="Title"></Column>
        <Column 
          header={
            <Button 
              icon="pi pi-chevron-down" 
              className="p-button-text p-button-sm"
              size="small"
              style={{ padding: '0.25rem', minWidth: 'auto' }}
              onClick={(e) => overlayPanelRef.current?.toggle(e)}
            />
          }
          headerStyle={{ width: '3rem', textAlign: 'center' }}
        ></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>
      
      <OverlayPanel ref={overlayPanelRef}>
        <div style={{ padding: '1rem', minWidth: '200px' }}>
          <input 
            type="number" 
            placeholder="Select rows..." 
            value={selectRowsInput}
            onChange={(e) => setSelectRowsInput(e.target.value)}
            min="1"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onClick={handleSelectRows}
            >
              submit
            </button>
          </div>
        </div>
      </OverlayPanel>
    </div>
  )
}

export default App
