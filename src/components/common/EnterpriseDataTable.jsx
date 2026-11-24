import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown, 
  SlidersHorizontal, 
  Eye, 
  MoreVertical, 
  X, 
  Check, 
  FileSpreadsheet, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Layers,
  Inbox
} from 'lucide-react';

export const EnterpriseDataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  loading = false,
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  quickFilterTabs = [],
  activeQuickFilter,
  onQuickFilterChange,
  filterFields = [],
  activeFilters = {},
  onFilterChange,
  onFilterReset,
  bulkActions = [],
  primaryAction,
  secondaryActions = [],
  rowActions,
  onRowClick,
  exportFileName = 'export',
  defaultDensity = 'standard',
  pageSizeOptions = [10, 25, 50, 100],
  currentPage = 1,
  pageSize = 10,
  totalRecords,
  onPageChange,
  onPageSizeChange
}) => {
  // Density state: 'compact' (32px), 'standard' (44px), 'comfortable' (56px)
  const [density, setDensity] = useState(defaultDensity);
  const [densityDropdownOpen, setDensityDropdownOpen] = useState(false);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const initial = {};
    columns.forEach(col => {
      initial[col.key] = col.visible !== false;
    });
    return initial;
  });
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);

  // Sorting state
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter Drawer open state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Column sort toggle
  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Process data (client-side sort if not handled by server)
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortKey] ?? '';
      let valB = b[sortKey] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  // Selection handlers
  const allIds = data.map(r => r[keyField]);
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds([...allIds]);
  };

  const handleSelectRow = (id, e) => {
    e?.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // CSV Export
  const handleExportCSV = () => {
    if (data.length === 0) return;
    const activeCols = columns.filter(c => visibleColumns[c.key]);
    const headers = activeCols.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const rows = sortedData.map(row => {
      return activeCols.map(col => {
        let val = row[col.key] ?? '';
        if (typeof val === 'object') val = JSON.stringify(val);
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = "\uFEFF" + [headers, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exportFileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Active filter count
  const activeFilterCount = Object.values(activeFilters).filter(v => v !== undefined && v !== '' && v !== 'all' && v !== 'All').length;

  // Density padding styles
  const cellPadding = density === 'compact' ? '6px 12px' : density === 'comfortable' ? '16px 20px' : '11px 16px';
  const fontSize = density === 'compact' ? '0.82rem' : '0.88rem';

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      
      {/* 1. TABLE TOP TOOLBAR */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Header Title + Actions */}
        {(title || primaryAction || secondaryActions.length > 0) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              {title && (
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#002970', margin: '0 0 2px 0' }}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                  {subtitle}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {secondaryActions.map((sec, idx) => {
                const SecIcon = sec.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={sec.onClick}
                    style={{
                      padding: '8px 14px',
                      background: '#FFFFFF',
                      color: '#002970',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {SecIcon && <SecIcon size={14} />}
                    <span>{sec.label}</span>
                  </button>
                );
              })}

              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  style={{
                    padding: '8px 18px',
                    background: '#00BAF2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,186,242,0.25)'
                  }}
                >
                  {primaryAction.icon && <primaryAction.icon size={15} />}
                  <span>{primaryAction.label}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Filter Tabs (if provided) */}
        {quickFilterTabs.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px', overflowX: 'auto' }}>
            {quickFilterTabs.map(tab => {
              const active = activeQuickFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onQuickFilterChange && onQuickFilterChange(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: 'none',
                    background: active ? '#002970' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#475569',
                    fontWeight: active ? '700' : '600',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span style={{
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      background: active ? '#00BAF2' : '#E2E8F0',
                      color: active ? '#FFFFFF' : '#334155',
                      fontWeight: '700'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Search Bar + Controls (Filter, Columns, Density, Export, Print) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Left: Search Bar */}
          <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '420px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.86rem',
                color: '#1E293B',
                outline: 'none'
              }}
            />
            {searchValue && (
              <X
                size={14}
                color="#94A3B8"
                style={{ position: 'absolute', right: '12px', top: '10px', cursor: 'pointer' }}
                onClick={() => onSearchChange && onSearchChange('')}
              />
            )}
          </div>

          {/* Right: Table Utility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Filter Drawer Button */}
            {filterFields.length > 0 && (
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                style={{
                  padding: '7px 12px',
                  background: activeFilterCount > 0 ? '#E0F2FE' : '#FFFFFF',
                  color: activeFilterCount > 0 ? '#008BCB' : '#475569',
                  border: activeFilterCount > 0 ? '1px solid #00BAF2' : '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Filter size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span style={{ background: '#00BAF2', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* Density Toggler */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setDensityDropdownOpen(!densityDropdownOpen);
                  setColumnDropdownOpen(false);
                }}
                style={{
                  padding: '7px 10px',
                  background: '#FFFFFF',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Table Density"
              >
                <SlidersHorizontal size={14} />
              </button>

              {densityDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '38px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 40,
                  minWidth: '140px',
                  padding: '6px 0'
                }}>
                  {['compact', 'standard', 'comfortable'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setDensity(d); setDensityDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '6px 14px',
                        background: density === d ? '#F0F9FF' : 'none',
                        color: density === d ? '#008BCB' : '#1E293B',
                        fontWeight: density === d ? '700' : '500',
                        fontSize: '0.82rem',
                        textAlign: 'left',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Column Visibility Selector */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setColumnDropdownOpen(!columnDropdownOpen);
                  setDensityDropdownOpen(false);
                }}
                style={{
                  padding: '7px 10px',
                  background: '#FFFFFF',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Toggle Columns"
              >
                <Eye size={14} />
              </button>

              {columnDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '38px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 40,
                  minWidth: '180px',
                  padding: '8px'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748B', marginBottom: '6px', padding: '0 4px' }}>
                    VISIBLE COLUMNS
                  </div>
                  {columns.map(col => (
                    <label
                      key={col.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 6px',
                        fontSize: '0.82rem',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.key]}
                        onChange={(e) => setVisibleColumns({ ...visibleColumns, [col.key]: e.target.checked })}
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Export CSV / Excel */}
            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                padding: '7px 12px',
                background: '#FFFFFF',
                color: '#002970',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Export as CSV/Excel"
            >
              <FileSpreadsheet size={14} color="#16A34A" />
              <span>Export</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '7px 10px',
                background: '#FFFFFF',
                color: '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
              title="Print Table"
            >
              <Printer size={14} />
            </button>

          </div>

        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '700' }}>Active Filters:</span>
            {Object.entries(activeFilters).map(([k, v]) => {
              if (!v || v === 'all' || v === 'All') return null;
              const field = filterFields.find(f => f.key === k);
              return (
                <span
                  key={k}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: '#F0F9FF',
                    color: '#008BCB',
                    border: '1px solid #BAE6FD',
                    fontSize: '0.76rem',
                    fontWeight: '600'
                  }}
                >
                  <span>{field?.label || k}: {v}</span>
                  <X
                    size={12}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onFilterChange && onFilterChange(k, '')}
                  />
                </span>
              );
            })}
            <button
              type="button"
              onClick={onFilterReset}
              style={{
                padding: '2px 8px',
                background: 'none',
                border: 'none',
                color: '#DC2626',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Bulk Action Bar (when rows selected) */}
        {selectedIds.length > 0 && (
          <div style={{
            background: '#002970',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.86rem', fontWeight: '700' }}>
              {selectedIds.length} record{selectedIds.length > 1 ? 's' : ''} selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {bulkActions.map((ba, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => ba.onClick(selectedIds)}
                  style={{
                    padding: '5px 12px',
                    background: ba.variant === 'danger' ? '#DC2626' : 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {ba.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#93C5FD',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Deselect all
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 2. TABLE BODY */}
      <div style={{ overflowX: 'auto', position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
              
              {/* Checkbox Column */}
              <th style={{ padding: cellPadding, width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>

              {/* Data Columns */}
              {columns.map(col => {
                if (!visibleColumns[col.key]) return null;
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    style={{
                      padding: cellPadding,
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: col.sortable !== false ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: col.width
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>{col.label}</span>
                      {col.sortable !== false && (
                        <span style={{ color: isSorted ? '#00BAF2' : '#CBD5E1', display: 'flex', flexDirection: 'column' }}>
                          {isSorted && sortOrder === 'asc' ? <ChevronUp size={14} /> : isSorted && sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={12} color="#CBD5E1" />}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {/* Action Column */}
              {rowActions && (
                <th style={{ padding: cellPadding, width: '100px', textAlign: 'right', fontSize: '0.8rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              // Skeleton loading rows
              [...Array(pageSize > 10 ? 10 : pageSize)].map((_, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: cellPadding, textAlign: 'center' }}>
                    <div style={{ width: '14px', height: '14px', background: '#E2E8F0', borderRadius: '3px', margin: '0 auto' }} />
                  </td>
                  {columns.map((c, cIdx) => {
                    if (!visibleColumns[c.key]) return null;
                    return (
                      <td key={cIdx} style={{ padding: cellPadding }}>
                        <div style={{
                          height: '14px',
                          background: '#F1F5F9',
                          borderRadius: '4px',
                          width: `${Math.floor(50 + (cIdx * 15) % 40)}%`,
                          animation: 'pulse 1.5s infinite'
                        }} />
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td style={{ padding: cellPadding, textAlign: 'right' }}>
                      <div style={{ height: '14px', width: '50px', background: '#F1F5F9', borderRadius: '4px', marginLeft: 'auto' }} />
                    </td>
                  )}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.filter(c => visibleColumns[c.key]).length + (rowActions ? 2 : 1)} style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ maxWidth: '320px', margin: '0 auto' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F8FAFC', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Inbox size={24} />
                    </div>
                    <div style={{ fontWeight: '700', color: '#002970', fontSize: '1rem', marginBottom: '4px' }}>
                      No matching records found
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 16px 0' }}>
                      Try adjusting your search criteria, clearing active filters, or adding a new record.
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={onFilterReset}
                        style={{ padding: '7px 14px', background: '#00BAF2', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Actual Table Rows
              sortedData.map((row) => {
                const rowId = row[keyField];
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: isSelected ? '#F0F9FF' : '#FFFFFF',
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = '#FFFFFF'; }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: cellPadding, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(rowId, e)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>

                    {/* Data Cells */}
                    {columns.map(col => {
                      if (!visibleColumns[col.key]) return null;
                      return (
                        <td key={col.key} style={{ padding: cellPadding, color: '#1E293B' }}>
                          {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                        </td>
                      );
                    })}

                    {/* Row Actions */}
                    {rowActions && (
                      <td style={{ padding: cellPadding, textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        {typeof rowActions === 'function' ? rowActions(row) : rowActions}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. TABLE FOOTER & PAGINATION */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.85rem',
        color: '#64748B'
      }}>
        {/* Left: Total Records & Page Size Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>
            Total: <strong>{totalRecords !== undefined ? totalRecords : data.length}</strong> records
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              style={{
                padding: '4px 8px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.82rem',
                color: '#1E293B',
                cursor: 'pointer'
              }}
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Page Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            style={{
              padding: '6px 10px',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              background: currentPage <= 1 ? '#F8FAFC' : '#FFFFFF',
              color: currentPage <= 1 ? '#94A3B8' : '#002970',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          <span style={{ padding: '0 6px', fontWeight: '600', color: '#002970' }}>
            Page {currentPage} of {Math.max(1, Math.ceil((totalRecords !== undefined ? totalRecords : data.length) / pageSize))}
          </span>

          <button
            type="button"
            disabled={currentPage >= Math.ceil((totalRecords !== undefined ? totalRecords : data.length) / pageSize)}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            style={{
              padding: '6px 10px',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              background: currentPage >= Math.ceil((totalRecords !== undefined ? totalRecords : data.length) / pageSize) ? '#F8FAFC' : '#FFFFFF',
              color: currentPage >= Math.ceil((totalRecords !== undefined ? totalRecords : data.length) / pageSize) ? '#94A3B8' : '#002970',
              cursor: currentPage >= Math.ceil((totalRecords !== undefined ? totalRecords : data.length) / pageSize) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>

    </div>
  );
};
