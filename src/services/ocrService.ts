export interface OcrResult {
  detectedType: string;
  category: 'Identity Documents' | 'Financial' | 'Medical' | 'Insurance' | 'Education' | 'Legal' | 'Personal';
  title: string;
  extractedFields: Record<string, string>;
  expiryDate?: string;
  suggestedTags: string[];
  rawText: string;
}

export const ocrService = {
  /**
   * Simulates step-by-step OCR scanning and document extraction
   */
  async processFile(file: File): Promise<OcrResult> {
    const filename = file.name.toLowerCase();

    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (filename.includes('pan') || filename.includes('tax') || filename.includes('card')) {
      return {
        detectedType: 'Permanent Account Number (PAN Card)',
        category: 'Identity Documents',
        title: 'PAN Card — Govt of India',
        extractedFields: {
          'Document Type': 'Income Tax Department PAN Card',
          'PAN Number': 'ABCDE1234F',
          'Full Name': 'Vishnu Sharma',
          'Father\'s Name': 'R. K. Sharma',
          'Date of Birth': '14/05/1998'
        },
        expiryDate: '2031-12-31',
        suggestedTags: ['PAN', 'Identity', 'Tax', 'Government'],
        rawText: 'INCOME TAX DEPARTMENT GOVT OF INDIA \nPAN: ABCDE1234F \nNAME: VISHNU SHARMA \nDOB: 14/05/1998'
      };
    }

    if (filename.includes('passport')) {
      return {
        detectedType: 'International Passport',
        category: 'Identity Documents',
        title: 'Official Passport Scan',
        extractedFields: {
          'Passport No': 'Z8394019',
          'Country Code': 'IND',
          'Given Names': 'Vishnu',
          'Surname': 'Sharma',
          'Date of Issue': '10/05/2017',
          'Date of Expiry': '09/05/2027'
        },
        expiryDate: '2027-05-09',
        suggestedTags: ['Passport', 'Travel', 'Identity', 'Visa'],
        rawText: 'PASSPORT REPUBLIC OF INDIA P<INDPASSPORT<<Z8394019<VISHNU<SHARMA'
      };
    }

    if (filename.includes('receipt') || filename.includes('bill') || filename.includes('invoice')) {
      return {
        detectedType: 'Expense Receipt',
        category: 'Financial',
        title: 'Travel Dining Receipt',
        extractedFields: {
          'Merchant': 'Fisherman\'s Wharf Goa',
          'Total Amount': '₹2,450.00',
          'Payment Method': 'UPI / Credit Card',
          'Date': '14/08/2026'
        },
        suggestedTags: ['Goa', 'Receipt', 'Dining', 'Expenses'],
        rawText: 'FISHERMANS WHARF GOA \nDATE: 14-AUG-2026 \nTOTAL: INR 2450.00 \nPAID VIA UPI'
      };
    }

    // Default document OCR extraction fallback
    return {
      detectedType: 'Scanned Document',
      category: 'Personal',
      title: file.name.replace(/\.[^/.]+$/, ""),
      extractedFields: {
        'File Name': file.name,
        'File Size': `${(file.size / 1024).toFixed(1)} KB`,
        'Extracted Text': 'Standard layout detected. Text parsed successfully.'
      },
      suggestedTags: ['Document', 'Scanned', 'LifeVault'],
      rawText: `Sample parsed content from ${file.name}`
    };
  }
};
