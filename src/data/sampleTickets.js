export const SAMPLE_TICKETS = [
  {
    id: 't/23887',
    email: 'user@cognizant.com',
    description: '[XXX CONSUMER][YY-ZZZ-GEN]: Dashboard Issue',
    status: 'Open',
    createdAt: '13 Apr 2026, 9:00 AM',
    hasUpdate: true,
    isSample: true,
    comments: [
      {
        author: 'AI Agent',
        role: 'bot',
        timestamp: '9:01 AM',
        missingFields: [
          { label: 'Type of issue' },
          { label: 'Dashboard & tools involved' },
          { label: 'Data range & discrepancy details' },
          { label: 'Program & site' },
        ],
        enrichmentQuestions: [
          { field: 'Type of issue', detail: 'Please clarify if this is a data discrepancy, a system error, or an access request.' },
          { field: 'Dashboard & tools involved', detail: 'Which specific dashboard are you referring to, and are there any specific related tools involved?' },
          { field: 'Data range & discrepancy details', detail: 'If this is a data discrepancy, could you provide the specific data range along with the expected vs actual data you are seeing? Screenshots are helpful.' },
          { field: 'Program & site', detail: 'Which program and site are you reporting from?' },
        ],
      },
      {
        author: 'user@cognizant.com',
        role: 'user',
        timestamp: '9:05 AM',
        text: 'its access related issue\nI am looking at AC historical Dashboard related to XXX\nThis is from YYY GCC at ZZZ Gurgaon',
      },
    ],
  },
  {
    id: 't/23885',
    email: 'XYZteam@company.com',
    description: 'HR Function Operational Dashboard access issue for Gurgaon site office',
    status: 'Open',
    createdAt: '13 Apr 2026, 11:00 AM',
    hasUpdate: true,
    isSample: true,
    comments: [],
  },
];
