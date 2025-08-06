'use client'

import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from 'primereact/button'

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString()


function PDFViewer({ pdfUrl, paperSize = 'A4', fileName = 'document' }) {
    const [numPages, setNumPages] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageWidth, setPageWidth] = useState(0)
    const [scale, setScale] = useState(1)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fungsi navigasi halaman
    const handleFirstPage = () => setCurrentPage(1)
    const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1)
    const handleNextPage = () => currentPage < numPages && setCurrentPage(currentPage + 1)
    const handleLastPage = () => setCurrentPage(numPages)

    // Fungsi zoom
    const handleZoomIn = () => scale < 2.0 && setScale(scale + 0.1)
    const handleZoomOut = () => scale > 0.5 && setScale(scale - 0.1)

    // Fungsi download
    const handleDownloadPDF = () => {
        const downloadLink = document.createElement('a')
        downloadLink.href = pdfUrl
        downloadLink.download = `${fileName}.pdf`
        downloadLink.click()
    }

    // Fungsi print
    const handlePrint = () => {
        if (!pdfUrl) return

        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print PDF</title>
                    <style>
                        body { margin: 0; padding: 0; }
                        iframe { width: 100%; height: 100vh; border: none; }
                    </style>
                </head>
                <body>
                    <iframe src="${pdfUrl}"></iframe>
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print()
                                window.close()
                            }, 1000)
                        }
                    </script>
                </body>
            </html>
        `)
        printWindow.document.close()
    }

    // Load PDF dan atur ukuran halaman
    useEffect(() => {
        const loadPdf = async () => {
            try {
                setIsLoading(true)
                setError(null)
                
                if (!pdfUrl) {
                    throw new Error('URL PDF tidak valid')
                }

                const loadingTask = pdfjs.getDocument({ url: pdfUrl })
                const pdf = await loadingTask.promise
                setNumPages(pdf.numPages)

                // Konversi ukuran kertas ke pixel
                const mmToPixel = 3.7795275591
                const paperSizes = {
                    A4: { width: 210, height: 297 },
                    Letter: { width: 216, height: 279 },
                    Legal: { width: 216, height: 356 }
                }

                const size = paperSizes[paperSize] || paperSizes.A4
                setPageWidth(size.width * mmToPixel)
                
            } catch (err) {
                console.error('Gagal memuat PDF:', err)
                setError(`Gagal memuat PDF: ${err.message}`)
            } finally {
                setIsLoading(false)
            }
        }

        loadPdf()
    }, [pdfUrl, paperSize])

    return (
        <div className="pdf-viewer-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <div style={{
                backgroundColor: '#f0f0f0',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                position: 'sticky',
                top: '0',
                zIndex: '1000',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '5px'
            }}>
                <Button 
                    icon="pi pi-angle-double-left" 
                    onClick={handleFirstPage} 
                    disabled={currentPage === 1} 
                    tooltip="Halaman pertama"
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-angle-left" 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1} 
                    tooltip="Halaman sebelumnya"
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-search-plus" 
                    onClick={handleZoomIn} 
                    disabled={scale >= 2.0} 
                    tooltip="Zoom in"
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-search-minus" 
                    onClick={handleZoomOut} 
                    disabled={scale <= 0.5} 
                    tooltip="Zoom out"
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-angle-right" 
                    onClick={handleNextPage} 
                    disabled={currentPage === numPages} 
                    tooltip="Halaman berikutnya"
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-angle-double-right" 
                    onClick={handleLastPage} 
                    disabled={currentPage === numPages} 
                    tooltip="Halaman terakhir"
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-download" 
                    onClick={handleDownloadPDF} 
                    tooltip="Download PDF"
                    tooltipOptions={{ position: 'bottom' }}
                    severity="success"
                />
                <Button 
                    icon="pi pi-print" 
                    onClick={handlePrint} 
                    tooltip="Print PDF"
                    tooltipOptions={{ position: 'bottom' }}
                    severity="success"
                />
            </div>

            {/* Area PDF */}
            <div style={{ 
                flex: 1, 
                overflow: 'auto', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                margin: '10px 0'
            }}>
                {isLoading ? (
                    <div>Memuat PDF...</div>
                ) : error ? (
                    <div style={{ color: 'red', padding: '20px' }}>{error}</div>
                ) : (
                    <Document 
                        file={pdfUrl}
                        loading={<div>Memuat dokumen...</div>}
                        error={<div style={{ color: 'red' }}>Gagal memuat dokumen</div>}
                    >
                        <Page 
                            pageNumber={currentPage} 
                            width={pageWidth} 
                            scale={scale}
                            loading={<div>Memuat halaman...</div>}
                        />
                    </Document>
                )}
            </div>

            {/* Info halaman */}
            <div style={{
                textAlign: 'center',
                padding: '10px',
                color: '#666',
                fontSize: '14px'
            }}>
                {numPages ? `Halaman ${currentPage} dari ${numPages}` : 'Memuat informasi halaman...'}
            </div>
        </div>
    )
}

export default PDFViewer