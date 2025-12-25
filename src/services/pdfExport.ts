import jsPDF from 'jspdf'

export interface PlanData {
  workout: string
  diet: string
  tips: string
}

// Process markdown and apply PDF formatting
function processMarkdownForPDF(text: string, pdf: jsPDF, margin: number, maxWidth: number, pageHeight: number, startY: number): number {
  // Clean the text first to remove problematic characters
  const cleanedText = text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Remove symbols & pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Remove transport & map symbols
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Remove flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Remove misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Remove dingbats
    .replace(/[\u{FE00}-\u{FEFF}]/gu, '')   // Remove variation selectors
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Remove supplemental symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Remove symbols and pictographs extended
    .trim()

  const lines = cleanedText.split('\n')
  let yPosition = startY

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) {
      yPosition += 3 // Small space for empty lines
      continue
    }

    // Check for headers
    const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
    if (headerMatch) {
      const level = headerMatch[1].length
      const headerText = headerMatch[2]

      // Set font size based on header level
      const fontSize = level === 1 ? 18 : level === 2 ? 16 : level === 3 ? 14 : 12
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', 'bold')

      const headerLines = pdf.splitTextToSize(headerText, maxWidth)
      for (const headerLine of headerLines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
        pdf.text(headerLine, margin, yPosition)
        yPosition += fontSize * 0.4
      }
      yPosition += 5
      continue
    }

    // Check for bold text
    if (trimmedLine.includes('**')) {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      const cleanLine = trimmedLine.replace(/\*\*/g, '')
      const textLines = pdf.splitTextToSize(cleanLine, maxWidth)
      for (const textLine of textLines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
        pdf.text(textLine, margin, yPosition)
        yPosition += 5
      }
      yPosition += 3
      continue
    }

    // Check for list items
    const listMatch = trimmedLine.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/)
    if (listMatch) {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      const indent = listMatch[1].length * 2
      const bullet = listMatch[2] === '-' || listMatch[2] === '*' || listMatch[2] === '+' ? '•' : listMatch[2]
      const listText = listMatch[3]

      const fullText = `${bullet} ${listText}`
      const textLines = pdf.splitTextToSize(fullText, maxWidth - indent)

      for (let i = 0; i < textLines.length; i++) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
        const xPos = i === 0 ? margin + indent : margin + indent + 10
        pdf.text(textLines[i], xPos, yPosition)
        yPosition += 5
      }
      yPosition += 2
      continue
    }

    // Regular paragraph text
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    const textLines = pdf.splitTextToSize(trimmedLine, maxWidth)

    for (const textLine of textLines) {
      if (yPosition > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
      pdf.text(textLine, margin, yPosition)
      yPosition += 5
    }
    yPosition += 3
  }

  return yPosition
}

export async function exportPlanPdf(planData: PlanData, filename: string) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - (margin * 2)
  let yPosition = margin

  // Title
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AI Fitness Coach Plan', margin, yPosition)
  yPosition += 15

  // Date
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition)
  yPosition += 10

  // Add horizontal line
  pdf.setLineWidth(0.5)
  pdf.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  // Workout Plan
  if (planData.workout) {
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Workout Plan', margin, yPosition)
    yPosition += 10

    yPosition = processMarkdownForPDF(planData.workout, pdf, margin, maxWidth, pageHeight, yPosition)
  }

  // Diet Plan
  if (planData.diet) {
    if (yPosition > pageHeight - margin - 20) {
      pdf.addPage()
      yPosition = margin
    }

    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Diet Plan', margin, yPosition)
    yPosition += 10

    yPosition = processMarkdownForPDF(planData.diet, pdf, margin, maxWidth, pageHeight, yPosition)
  }

  // Tips
  if (planData.tips) {
    if (yPosition > pageHeight - margin - 20) {
      pdf.addPage()
      yPosition = margin
    }

    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI Tips & Motivation', margin, yPosition)
    yPosition += 10

    yPosition = processMarkdownForPDF(planData.tips, pdf, margin, maxWidth, pageHeight, yPosition)
  }

  pdf.save(filename)
}
