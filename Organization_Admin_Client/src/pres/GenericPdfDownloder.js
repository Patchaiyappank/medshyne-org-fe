import React from 'react';
import { jsPDF } from 'jspdf';
import { IoDownloadOutline } from "react-icons/io5";
import pdfImage from './pdfImage.png';
import pdfImage1 from './pdfImage.png.PNG'; // Import the image for design
import autoTable from 'jspdf-autotable';

const GenericPdfDownloader = ({ rootElementId, downloadFileName, profileData, prescriptionDetails  }) => {
    const downloadPdfDocument = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4' // You can specify the format or use a custom size
        });
     
        const imgWidth = 110;
        const imgHeight = 35;
        const imgX = 10;
        const imgY = 10;

        // Add the image to the PDF
        // Add the image to the PDF without borders
doc.addImage(pdfImage1, 'PNG', imgX, imgY, imgWidth, imgHeight, undefined, 'NONE');


        // Add text to the PDF
        doc.setFontSize(12);
        doc.setFont("Arial");

        const rectX = 300;
        const rectY = 10;
        const rectWidth = 70;
        const rectHeight = 15;
    
        // Draw the rectangle
        doc.rect(rectX, rectY, rectWidth, rectHeight);

        // Add header text
        doc.text('Student ID : ', 250, 20);
        const textX = rectX + 2; // Position text inside the rectangle
        const textY = rectY + 11; // Position text inside the rectangle
    
        // Ensure that profileData.id_number exists and is a string
        const idNumber = `${profileData.id_number}` || 'N/A';
        doc.text(idNumber, textX, textY);
    

        // Add fields on the left side
        doc.text(`NAME & STD :  ${profileData.patient_name}  & ${profileData.class}`, 10, 60);
    doc.text(`AGE / SEX : ${profileData.age}`, 10, 80);
        doc.text('DOB : ', 10, 100);
        doc.text(`MOBILE NUMBER :${profileData.parent_mobile}`, 10, 120);

        // Add fields on the right side
        doc.text(`CONSULTATION DATE :${profileData.date}`, 250, 60);
        doc.text(`CONSULTANT : ${profileData.doctor_name}`, 250, 80);

        // Add additional fields as per the uploaded image
        doc.text('ALLERGIES : (IF ANY)', 10, 160);
        doc.rect(30, 170, 388, 30); // rectangle for input

        // Add additional fields as per the uploaded image
        doc.text('COMPLAINTS :', 10, 220);
        doc.rect(30, 230, 388, 60); // rectangle for input

        doc.text('MEDICINES :', 10, 310);
        const tableBody = prescriptionDetails.medicine_details.map((medicine, index) => [
            index + 1,
            medicine.medicine_name,
            medicine.periods,
            medicine.food,
            medicine.days,
            medicine.count // Assuming this is the instruction field; adjust if necessary
          ]);
      
          autoTable(doc, {
            startY: 320, // Adjust startY as needed
            head: [['S.No', 'Medicines', 'Duration', 'When', 'Days', 'Instruction']],
            body: tableBody,
            theme: 'grid',
            styles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              lineColor: [0, 0, 0],
              lineWidth: 0.2,
              minCellHeight: 30 // Set minimum height for rows
            },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontSize: 12, // Set font size for header
              fontStyle: 'normal',
            },
            bodyStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontSize: 12,
            },
          });

        const drawInputBox = (x, y, width, height, placeholder) => {
            // Draw the box
            doc.setFillColor(255, 255, 255); // White fill color
            doc.rect(x, y, width, height, 'F'); // Draw filled box
            doc.rect(x, y, width, height); // Draw border

            // Add placeholder text
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(placeholder, x + 5, y + height / 2 + 5); // Position text inside the box
        };

        // Add "NEXT VISIT :" label
        doc.setFontSize(12);
        doc.text('NEXT VISIT :', 10, 400);

        // Draw input-like boxes
        const inputStartX = 30;
        const inputStartY = 390; // Starting Y position
        const inputWidth = 40;
        const inputHeight = 30;
        const spacing = 1; // Space between inputs

        // Draw each input-like box with corresponding placeholder
        drawInputBox(inputStartX + 40 + spacing, inputStartY, inputWidth, inputHeight, 'Days');
        drawInputBox(inputStartX + 40 + spacing + inputWidth + spacing, inputStartY, inputWidth, inputHeight, 'Week');
        drawInputBox(inputStartX + 40 + spacing + inputWidth + spacing + inputWidth + spacing, inputStartY, inputWidth, inputHeight, 'Month');

        // Save the PDF
        doc.save(`${downloadFileName}.pdf`);
    };

    return (
        <div style={{ position: 'relative'}}>
        <img src={pdfImage} alt="Design" className="img-fluid" style={{ height:'110px',width:'100%' }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'end',
            zIndex: 1,
          }}
        >
          <button
            className="pdf"
            style={{
              width: '100%',
              fontSize: '15px',
              height: '35%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={downloadPdfDocument}
          >
            <span style={{fontSize:'14px'}}>Download Prescription Pdf</span>
            <IoDownloadOutline
              style={{
                marginLeft: '5px',
                color: 'grey',
                borderRadius: '100px',
                padding: '7px',
                fontSize: '30px',
                backgroundColor: 'white',
              }}
            />
          </button>
        </div>
      </div>
    );
};

export default GenericPdfDownloader;