import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Interface for the ATM location data
interface ATMLocation {
  id: string;
  number: number;
  location: {
    lat: number;
    lng: number;
  };
  metrics: {
    score: number;
    landRate: number;
    populationDensity: number;
    competingATMs: number;
    commercialActivity: number;
    trafficFlow: number;
    publicTransport: number;
  };
  isSelected: boolean;
}

interface OptimizationResult {
  selectedLocations: ATMLocation[];
  totalValue: number;
  usedBudget: number;
}

// Define monochrome color palette
const colors = {
  primary: [50, 50, 50],       // Dark gray for main headings
  secondary: [80, 80, 80],     // Medium gray for subheadings
  tertiary: [120, 120, 120],   // Light gray for less important text
  tableHeader: [40, 40, 40],   // Dark gray for table headers
  tableBg1: [245, 245, 245],   // Very light gray for table rows (odd)
  tableBg2: [255, 255, 255],   // White for table rows (even)
  highlight: [0, 0, 0],        // Black for highlighted text
  subtle: [180, 180, 180],     // Very light gray for subtle elements
  border: [200, 200, 200]      // Light gray for borders
};

// Modified currency formatter that uses "RS" instead of ₹
const formatCurrency = (value: number): string => {
  // Format with commas manually
  const valueStr = value.toString();
  let formattedValue = '';
  
  for (let i = 0; i < valueStr.length; i++) {
    if (i > 0 && (valueStr.length - i) % 3 === 0) {
      formattedValue += ',';
    }
    formattedValue += valueStr[i];
  }
  
  return `Rs ${formattedValue}`;
};

// Calculate efficiency ratio
const calculateEfficiency = (score: number, landRate: number): number => {
  return (score / landRate) * 10000;
};

export const generateInvestmentReport = (
  optimizationResult: OptimizationResult,
  totalBudget: number,
  userName: string = "User"
): void => {
  const { selectedLocations, totalValue, usedBudget } = optimizationResult;
  
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'ATM Investment Portfolio Report',
      subject: 'Optimized ATM Locations',
      author: 'LocaCash',
      creator: 'LocaCash ATM Optimization System'
    });
    
    // Add the header with logo (coordinates, title, styling)
    doc.setFontSize(22);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]); // Primary dark gray
    doc.text('LocaCash', 105, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]); // Secondary medium gray
    doc.text('ATM Investment Portfolio Report', 105, 25, { align: 'center' });
    
    // Add report generation details
    doc.setFontSize(10);
    doc.setTextColor(colors.tertiary[0], colors.tertiary[1], colors.tertiary[2]); // Tertiary light gray
    const today = new Date();
    doc.text(`Generated on: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`, 105, 32, { align: 'center' });
    doc.text(`Prepared for: ${userName}`, 105, 37, { align: 'center' });
    
    // Horizontal line
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]); // Border light gray
    doc.line(20, 42, 190, 42);
    
    // Executive Summary
    doc.setFontSize(14);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]); // Primary dark gray
    doc.text('Executive Summary', 20, 50);
    
    doc.setFontSize(11);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]); // Secondary medium gray
    const summaryText = [
      `This report presents an optimized ATM deployment portfolio consisting of ${selectedLocations.length} locations,`,
      `selected from the available analysis pool using our proprietary knapsack optimization algorithm.`,
      `The portfolio achieves a total viability score of ${totalValue} points with a budget utilization of`,
      `${formatCurrency(usedBudget)} (${((usedBudget / totalBudget) * 100).toFixed(1)}% of the allocated ${formatCurrency(totalBudget)}).`
    ];
    
    let yPos = 60;
    summaryText.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });
    
    // Portfolio Highlights
    yPos += 5;
    doc.setFontSize(14);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]); // Primary dark gray
    doc.text('Portfolio Highlights', 20, yPos);
    yPos += 10;
    
    // Create a table-like structure for the highlights
    const highlightsData = [
      ['Total ATM Locations:', `${selectedLocations.length}`],
      ['Total Investment:', formatCurrency(usedBudget)],
      ['Budget Allocation:', `${((usedBudget / totalBudget) * 100).toFixed(1)}%`],
      ['Average Location Score:', `${(totalValue / selectedLocations.length).toFixed(1)} points`],
      ['Cost Efficiency:', `${(totalValue / (usedBudget / 10000)).toFixed(1)} points per RS 10,000`],
      ['Remaining Budget:', formatCurrency(totalBudget - usedBudget)]
    ];
    
    // Use autoTable directly with monochrome styling
    autoTable(doc, {
      startY: yPos,
      head: [],
      body: highlightsData,
      theme: 'plain',
      styles: { 
        fontSize: 11,
        textColor: [60, 60, 60] 
      },
      columnStyles: {
        0: { 
          fontStyle: 'bold', 
          cellWidth: 60,
          textColor: [40, 40, 40] // Slightly darker for labels
        },
        1: { 
          cellWidth: 60,
          textColor: [60, 60, 60] // Standard text color for values
        }
      },
      margin: { left: 20 }
    });
    
    // Selected Locations Table
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]); // Primary dark gray
    doc.text('Selected ATM Locations', 20, yPos);
    
    // Create location table data
    const locationTableHead = [
      ['#', 'Coordinates', 'Score', 'Land Rate', 'Efficiency', 'Population', 'Commercial']
    ];
    
    const locationTableBody = selectedLocations.map((location, index) => [
      index + 1,
      `${location.location.lat.toFixed(6)}, ${location.location.lng.toFixed(6)}`,
      location.metrics.score,
      formatCurrency(location.metrics.landRate),
      calculateEfficiency(location.metrics.score, location.metrics.landRate).toFixed(1),
      location.metrics.populationDensity.toFixed(1),
      location.metrics.commercialActivity
    ]);
    
    // Use autoTable directly with increased column width for Land Rate and monochrome styling
    autoTable(doc, {
      startY: yPos + 5,
      head: locationTableHead,
      body: locationTableBody,
      theme: 'grid', // Changed from striped to grid for clearer monochrome layout
      headStyles: {
        fillColor: colors.tableHeader, // Dark gray for header
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: colors.tableBg1 // Very light gray for alternate rows
      },
      bodyStyles: {
        fillColor: colors.tableBg2 // White for standard rows
      },
      columnStyles: {
        0: { cellWidth: 10 },  // # column
        1: { cellWidth: 50 },  // Coordinates column (narrower to give space to Land Rate)
        2: { cellWidth: 15, halign: 'center' },  // Score column
        3: { 
          cellWidth: 45, // Increased width for Land Rate column
          halign: 'right',
          font: 'courier', // Use a monospace font for better alignment
          fontStyle: 'normal'
        },
        4: { cellWidth: 20, halign: 'center' },  // Efficiency column
        5: { cellWidth: 20, halign: 'center' },  // Population column
        6: { cellWidth: 20, halign: 'center' }   // Commercial column
      },
      margin: { left: 15, right: 15 }
    });
    
    // Check if we need a new page for recommendations
    if ((doc as any).lastAutoTable.finalY > 240) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Recommendations
    doc.setFontSize(14);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]); // Primary dark gray
    doc.text('Implementation Recommendations', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]); // Secondary medium gray
    const recommendationsText = [
      '1. Prioritize implementation of locations with the highest efficiency scores first to maximize',
      '   early returns on investment.',
      '2. Consider allocating the remaining budget for maintenance or operational costs of the ATMs.',
      '3. Review high-traffic locations for potential capacity upgrades or additional security features.',
      '4. Schedule regular performance reviews every quarter to evaluate actual vs. projected usage.',
      '5. Consider a phased implementation approach, starting with the top 50% of locations.'
    ];
    
    recommendationsText.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 6;
    });
    
    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(colors.subtle[0], colors.subtle[1], colors.subtle[2]); // Very light gray for footer
      doc.text(
        `Page ${i} of ${pageCount} | LocaCash ATM Optimization System | CONFIDENTIAL`,
        105,
        285,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save('ATM_Investment_Portfolio.pdf');
  } catch (error) {
    console.error("Error generating PDF report:", error);
    throw error;
  }
};