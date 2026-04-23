export const S4_STEPS = [
  'Connecting to resolution knowledge base...',
  'Embedding incident context...',
  'Computing similarity scores...',
  'Ranking top historical matches...',
  'Querying KB article index...',
  'Linking related knowledge base articles...',
];

export const CSI_STEPS = [
  'Parsing ticket summary and reporter context...',
  'Tokenising key phrases from user reply...',
  'Matching against CSI taxonomy database...',
  'Scoring category confidence across IT classes...',
  'Cross-referencing program and site metadata...',
  'Validating CSI triple against historical ticket corpus...',
  'Finalising category, type, and item classification...',
];

export const GSD100_PRE_STEPS = [
  'Reading ticket description and reporter details...',
  'Checking ticket against existing knowledge base...',
  'Evaluating available context information...',
  'Identifying required missing fields...',
];

export const GSD100_CHECK_STEPS = [
  'Processing reporter context...',
  'Validating provided information against ticket...',
  'Context validated — proceeding to classification...',
];

export const GSD100_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];

export const GSD100_REC_STEPS = [
  'Loading similar ticket corpus from vector store...',
  'Fetching t/23810 (94% match) from incident archive...',
  'Extracting resolution transcript from t/23810...',
  'Parsing resolution steps from closed ticket...',
  'Mapping steps to current ticket context...',
  'Validating resolution applicability...',
];

export const GSD100_REC_RESOLUTION = [
  "Verify user's AC access role in admin panel under Accounts -> Permissions.",
  'Submit access grant request to AC admin at AC-admin@internal with ticket reference.',
  'Confirm dashboard URL with user after access is granted (AC -> Reports -> Historical).',
  'Add user to the Listnr Adwords GCC distribution group for ongoing access.',
];

export const GSD100_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CSI match...',
  'Matching CSI: IT / HR Function dashboard / access...',
  'Locating SOP for HR Function dashboard access requests...',
  'Retrieving RUNBOOK-CC-047 from knowledge base...',
  'Validating runbook version and current applicability...',
];

export const GSD100_RUNBOOK_RESOLUTION = [
  'Confirm user identity and site: YYY Gurgaon - XXX GCC (verified via context).',
  'Log access request in AC admin portal -> Contact: AC-support@internal.',
  'Assign dashboard role: viewer_historical via Admin -> Role Assignment panel.',
  'Notify user once role is propagated (typically 15-30 min after assignment).',
  'Verify access: ask user to navigate AC -> Reports -> Historical Dashboard.',
];

export const GSD100_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for AC dashboard entries...',
  'Checking error-code catalogue for access-related entries...',
  'Scanning step-by-step guides for dashboard permission issues...',
  'Cross-referencing troubleshoot tags: IT, dashboard, access...',
];

export const GSD103_CONTEXT_STEPS = [
  'Reading ticket description and reporter details...',
  'Parsing ticket summary and key phrases...',
  'Checking required context fields against ticket schema...',
  'Evaluating completeness of reporter information...',
  'Verifying agent email, program, and site details in description...',
  'Context provided by reporter — all fields validated...',
];

export const GSD103_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for VV profile issues...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];

export const GSD103_REC_STEPS = [
  'Loading similar ticket corpus from vector store...',
  'Fetching t/23757 (91% match) from incident archive...',
  'Extracting resolution transcript from t/23757...',
  'Parsing resolution steps from closed ticket...',
  'Mapping steps to current ticket context...',
  'Validating resolution applicability...',
];

export const GSD103_REC_RESOLUTION = [
  'Log in to VV WFM admin console with admin credentials.',
  'Navigate to User Management -> New Profile and enter agent details: axelsylvain@google.com.',
  'Assign the correct program: CPS, and set site and role permissions accordingly.',
  'Save the new profile and verify login access for the agent.',
  'Notify the requester (ashi@google.com) once the profile is active.',
];

export const GSD103_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CSI match...',
  'Matching CSI: c-c / ABC-XYZ / create new profile...',
  'Locating SOP for VV new agent profile creation...',
  'Retrieving RUNBOOK-WFM-012 from knowledge base...',
  'Validating runbook version and current applicability...',
];

export const GSD103_RUNBOOK_RESOLUTION = [
  'Confirm agent details: name, email (slivester@company.com), program (CPS), and site.',
  'Log in to VV WFM admin portal -> User Management -> Create New User.',
  'Fill in required fields: email, program assignment (CPS), role, and site location.',
  'Set initial password and send credentials via secure IT channel.',
  'Verify profile creation by searching agent email in User Management.',
  'Notify requesting supervisor/admin once profile is active and accessible.',
];

export const GSD103_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for VV profile creation issues...',
  'Checking error-code catalogue for new profile creation failures...',
  'Scanning step-by-step guides for WFM user provisioning...',
  'Cross-referencing troubleshoot tags: ABC-XYZ, create-profile, CPS...',
];

export const GSD104_CONTEXT_STEPS = [
  'Reading ticket description and reporter details...',
  'Parsing ticket summary and key phrases...',
  'Checking required context fields against ticket schema...',
  'Evaluating completeness of reporter information...',
  'Verifying program, site, and system details in description...',
  'All required fields present — context complete...',
];

export const GSD104_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for AC issues...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  '3 tickets found above confidence threshold...',
];


export const GSD076_KB = {
  id: 't/23757',
  summary: 'Unable to update VV profile for agent slivester@company.com',
  reporter: 'ashi@company.com',
  createdAt: '10 Apr 2026, 2:14 PM',
  resolvedAt: '10 Apr 2026, 4:47 PM',
  status: 'Resolved',
  priority: 'HIGH',
  program: 'CPS',
  site: 'Cognizant Bangalore',
  cti: { category: 'c-c', type: 'ABC-XYZ', item: 'update profile' },
  description: 'Supervisor ashi@company.com reported that she is unable to update the VV WFM profile for agent slivester@company.com. The update operation fails silently — no error message, and changes are not saved. This is preventing the agent from being assigned the correct schedule for the upcoming week.',
  rootCause: 'The agent profile had a stale session lock from a failed bulk-import job run two days prior. The lock prevented any single-profile edits from persisting.',
  resolutionSteps: [
    'Logged in to VV WFM admin console with elevated admin credentials.',
    'Navigated to User Management → searched agent by email: slivester@company.com.',
    'Identified a stale session lock on the profile (lock timestamp: 8 Apr 2026, 11:22 AM).',
    'Released the lock via Admin Tools → Session Manager → Force Release.',
    'Re-applied the pending profile updates: program assignment (CPS), site (Cognizant Bangalore), schedule group.',
    'Saved changes and verified all fields were persisted correctly.',
    'Notified ashi@company.com that the profile was updated successfully.',
    'Monitored the profile for 15 minutes — no re-lock occurred.',
  ],
  assignedTo: 'Neha Joshi',
  department: 'L2 WFM Operations',
  resolutionTime: '2h 33m',
};

export const KB_SEARCH_STEPS = [
  'Initialising knowledge base search for incident t/23757...',
  'Connecting to GUTS (Google Universal Ticket System)...',
  'Querying GUTS for t/23757 resolution record and root cause...',
  'Fetching resolution transcript and linked KB articles from GUTS...',
  'Searching MoMA for t/23757 incident record...',
  'Querying Yaqs knowledge index for t/23757...',
  'Full incident record assembled from GUTS, MoMA and Yaqs...',
];
