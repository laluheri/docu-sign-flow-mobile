export interface Document {
  id: string;
  title: string;
  sender: string;
  date: string;
  status: 'pending' | 'signed' | 'rejected';
  content: string;
}

export const documents: Document[] = [
  {
    id: '1',
    title: 'Employment Contract',
    sender: 'HR Department',
    date: '2025-04-05',
    status: 'pending',
    content: `
# EMPLOYMENT CONTRACT

This Employment Agreement ("Agreement") is entered into as of April 5, 2025, by and between ABC Company ("Employer") and John Doe ("Employee").

## 1. POSITION AND DUTIES
Employee shall be employed in the position of Software Engineer. Employee shall perform such duties as are customarily performed by other persons in similar positions.

## 2. TERM
This Agreement shall commence on April 15, 2025, and shall continue until terminated according to the provisions of this Agreement.

## 3. COMPENSATION
As compensation for services rendered under this Agreement, Employee shall be entitled to receive from Employer a salary of $90,000 per year, payable in accordance with Employer's normal payroll procedures.

## 4. BENEFITS
Employee shall be entitled to participate in benefit programs provided by Employer to its employees.

## 5. TERMINATION
This Agreement may be terminated by either party upon providing 30 days' written notice to the other party.

## 6. CONFIDENTIALITY
Employee acknowledges that during employment, Employee will have access to confidential information. Employee agrees to maintain the confidentiality of such information.

## 7. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

ABC Company                       Employee
______________________           ______________________
Authorized Signature             John Doe
    `,
  },
  {
    id: '2',
    title: 'Purchase Agreement',
    sender: 'Sales Department',
    date: '2025-04-06',
    status: 'pending',
    content: `
# PURCHASE AGREEMENT

This Purchase Agreement ("Agreement") is entered into as of April 6, 2025, by and between XYZ Corporation ("Seller") and ABC Company ("Buyer").

## 1. SALE OF GOODS
Seller agrees to sell and Buyer agrees to purchase the following goods: 
- 10 desktop computers
- 5 laser printers
- 20 software licenses

## 2. PRICE AND PAYMENT
The total purchase price for the goods is $25,000. Buyer agrees to pay 50% upon signing of this Agreement and the remaining 50% upon delivery of the goods.

## 3. DELIVERY
Seller shall deliver the goods to Buyer's premises located at 123 Business Street, Cityville, State, within 30 days of the execution of this Agreement.

## 4. WARRANTIES
Seller warrants that the goods are free from defects in materials and workmanship for a period of one year from the date of delivery.

## 5. TERMINATION
This Agreement may be terminated by either party if the other party breaches any material term of this Agreement.

## 6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of New York.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

XYZ Corporation                  ABC Company
______________________          ______________________
Authorized Signature            Authorized Signature
    `,
  },
  {
    id: '3',
    title: 'Confidentiality Agreement',
    sender: 'Legal Department',
    date: '2025-04-07',
    status: 'pending',
    content: `
# CONFIDENTIALITY AGREEMENT

This Confidentiality Agreement ("Agreement") is entered into as of April 7, 2025, by and between DEF Inc. ("Disclosing Party") and John Doe ("Receiving Party").

## 1. CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by Disclosing Party to Receiving Party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as "Confidential," "Proprietary" or some similar designation.

## 2. NON-DISCLOSURE
Receiving Party agrees not to use any Confidential Information for any purpose except to evaluate and engage in discussions concerning a potential business relationship between the parties.

## 3. TERM
The obligations of Receiving Party under this Agreement shall survive until such time as all Confidential Information disclosed hereunder becomes publicly known and made generally available through no action or inaction of Receiving Party.

## 4. RETURN OF MATERIALS
All documents and other tangible objects containing or representing Confidential Information shall be and remain the property of Disclosing Party and shall be promptly returned to Disclosing Party upon written request.

## 5. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Washington.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

DEF Inc.                       John Doe
______________________        ______________________
Authorized Signature          Signature
    `,
  },
  {
    id: '4',
    title: 'Service Agreement',
    sender: 'Operations',
    date: '2025-04-08',
    status: 'pending',
    content: `
# SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of April 8, 2025, by and between GHI Services Co. ("Provider") and MNO Corp. ("Client").

## 1. SERVICES
Provider agrees to provide to Client the following services: IT support, network maintenance, and software updates.

## 2. COMPENSATION
Client agrees to pay Provider a monthly fee of $2,000 for the services provided. Payment is due on the first day of each month.

## 3. TERM
This Agreement shall commence on May 1, 2025, and shall continue for a period of one year. Thereafter, this Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least 30 days prior to the end of the then-current term.

## 4. TERMINATION
Either party may terminate this Agreement upon 60 days' written notice to the other party.

## 5. LIMITATION OF LIABILITY
Provider's liability under this Agreement shall be limited to the amounts paid by Client to Provider during the six months preceding the event giving rise to the claim.

## 6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Texas.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

GHI Services Co.                MNO Corp.
______________________         ______________________
Authorized Signature           Authorized Signature
    `,
  }
];

export interface DashboardStats {
  pending: number;
  signed: number;
  rejected: number;
  total: number;
}

export const getDashboardStats = (): DashboardStats => {
  const pending = documents.filter(doc => doc.status === 'pending').length;
  const signed = documents.filter(doc => doc.status === 'signed').length;
  const rejected = documents.filter(doc => doc.status === 'rejected').length;
  
  return {
    pending,
    signed,
    rejected,
    total: pending + signed + rejected
  };
};

export interface ActivityItem {
  id: string;
  type: 'signed' | 'rejected' | 'received' | 'updated';
  documentId: string;
  documentTitle: string;
  date: string;
  user: string;
  department?: string;
}

export const recentActivities: ActivityItem[] = [
  {
    id: 'act1',
    type: 'signed',
    documentId: '2',
    documentTitle: 'Purchase Agreement',
    date: '2025-04-12T14:30:00',
    user: 'Budi Santoso',
    department: 'Finance Department'
  },
  {
    id: 'act2',
    type: 'rejected',
    documentId: '3',
    documentTitle: 'Confidentiality Agreement',
    date: '2025-04-11T10:15:00',
    user: 'Sarah Johnson',
    department: 'Legal Department'
  }
];
