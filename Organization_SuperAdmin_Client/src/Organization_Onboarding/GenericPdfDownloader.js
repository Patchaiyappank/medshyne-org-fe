import React from 'react';
import { jsPDF } from 'jspdf';
import { BiDownload } from 'react-icons/bi';
import html2canvas from 'html2canvas';
import './OnboardingList.css';

const GenericPdfDownloader = ({ downloadFileName, invoiceDetails }) => {
    const downloadPdfDocument = () => {
        html2canvas(document.body).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4' // You can specify the format or use a custom size
            });

            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save(`${downloadFileName}.pdf`);
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <div>
                <button
                    className="pdf"
                    onClick={downloadPdfDocument}
                >
                    <span className=' onboard-pdfDownloader'>Download</span>
                </button>
            </div>
        </div>
    );
};

export default GenericPdfDownloader;
