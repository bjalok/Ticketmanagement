import React, { useState, useEffect } from 'react';
import {
  Search, Inbox, Cpu, Database,
  Zap, BookOpen, UserCheck, Check, Terminal, CheckCircle, Layers, Send,
  Tag, Link, Clock, AlertTriangle, Server, Phone, ExternalLink
} from 'lucide-react';

// Pre-existing sample tickets shown in agent queue 


const SAMPLE_TICKETS = [
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
    id: 't/23919',
    email: 'ashi@company.com',
    description: '[XXX YYY][XXX CONSUMER][XX YY Hive] I am unable to update RRR for alsylvain@company.com please fix it',
    status: 'Open',
    createdAt: '13 Apr 2026, 9:30 AM',
    hasUpdate: true,
    isSample: true,
    comments: [
      {
        author: 'AI Agent',
        role: 'bot',
        timestamp: '9:31 AM',
        missingFields: [
          { label: 'Specific update that is failing' },
          { label: 'Single or multiple agents' },
          { label: 'Error code or message' },
          { label: 'Program this request falls under' },
        ],
        enrichmentQuestions: [
          { field: 'Specific update that is failing', detail: 'Can you specify what specific update is failing?' },
          { field: 'Single or multiple agents', detail: 'Is this affecting a single agent or multiple agents?' },
          { field: 'Error code or message', detail: 'Are there any specific error codes or messages you are seeing?' },
          { field: 'Program this request falls under', detail: 'Please confirm the specific program this request falls under.' },
        ],
      },
      {
        author: 'ashi@company.com',
        role: 'user',
        timestamp: '9:35 AM',
        text: 'I am trying to create new profile\nthis is just one agent slivester@company.com\nthere is no error code\nthis is for CPS program',
      },
    ],
  },
  {
    id: 't/23919',
    email: 'ashi@company.com',
    description: '[XXX YYY][XXX CONSUMER][XX YY Hive] I am unable to update RRR for alsylvain@company.com please fix it',
    status: 'Open',
    createdAt: '13 Apr 2026, 10:30 AM',
    hasUpdate: true,
    isSample: true,
    comments: [],
  },
  {
    id: 't/23885',
    email: 'XYZteam@company.com',
    description: '[XXX DEMAND YYY - G FFF][ABC] GCP GGGG, TP, FGR GFT : Speak easy is not working. it wont launch please fix this ASAP as agent cannot take calls',
    status: 'Open',
    createdAt: '13 Apr 2026, 11:00 AM',
    hasUpdate: true,
    isSample: true,
    comments: [],
  },
  {
    id: 't/23408',
    email: 'reporter@cognizant.com',
    description: '[XXX_GGG_TYR.GWAZE][CCC, ER-MMM]: Request to block specific phone number(abusive caller)',
    status: 'Open',
    createdAt: '14 Apr 2026, 9:00 AM',
    hasUpdate: true,
    isSample: true,
    comments: [],
  },
];

const ThinkingDots = ({ color = 'blue' }) => (
  <span className="flex gap-0.5 items-center">
    {[0, 150, 300].map(d => (
      <span key={d} className={`w-1 h-1 bg-${color}-400 rounded-full animate-bounce`} style={{ animationDelay: `${d}ms` }} />
    ))}
  </span>
);

const S4_STEPS = [
  'Connecting to resolution knowledge base...',
  'Embedding incident context...',
  'Computing similarity scores...',
  'Ranking top historical matches...',
  'Querying KB article index...',
  'Linking related knowledge base articles...',
];

const CTI_STEPS = [
  'Parsing ticket summary and reporter context...',
  'Tokenising key phrases from user reply...',
  'Matching against CTI taxonomy database...',
  'Scoring category confidence across c-c classes...',
  'Cross-referencing program and site metadata...',
  'Validating CTI triple against historical ticket corpus...',
  'Finalising category, type, and item classification...',
];
const GSD100_PRE_STEPS = [
  'Reading ticket description and reporter details...',
  'Checking ticket against existing knowledge base...',
  'Evaluating available context information...',
  'Identifying required missing fields...',
];
const GSD100_CHECK_STEPS = [
  'Processing reporter context...',
  'Validating provided information against ticket...',
  'Context validated — proceeding to classification...',
];
const GSD100_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];
const GSD100_REC_STEPS = [
  'Loading similar ticket corpus from vector store...',
  'Fetching t/23810 (94% match) from incident archive...',
  'Extracting resolution transcript from t/23810...',
  'Parsing resolution steps from closed ticket...',
  'Mapping steps to current ticket context...',
  'Validating resolution applicability...',
];
const GSD100_REC_RESOLUTION = [
  "Verify user's AC access role in admin panel under Accounts -> Permissions.",
  'Submit access grant request to AC admin at AC-admin@internal with ticket reference.',
  'Confirm dashboard URL with user after access is granted (AC -> Reports -> Historical).',
  'Add user to the Listnr Adwords GCC distribution group for ongoing access.',
];
const GSD100_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CTI match...',
  'Matching CTI: c-c / AC historical dashboard / access...',
  'Locating SOP for AC historical dashboard access requests...',
  'Retrieving RUNBOOK-CC-047 from knowledge base...',
  'Validating runbook version and current applicability...',
];
const GSD100_RUNBOOK_RESOLUTION = [
  'Confirm user identity and site: YYY Gurgaon - XXX GCC (verified via context).',
  'Log access request in AC admin portal -> Contact: AC-support@internal.',
  'Assign dashboard role: viewer_historical via Admin -> Role Assignment panel.',
  'Notify user once role is propagated (typically 15-30 min after assignment).',
  'Verify access: ask user to navigate AC -> Reports -> Historical Dashboard.',
];
const GSD100_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for AC dashboard entries...',
  'Checking error-code catalogue for access-related entries...',
  'Scanning step-by-step guides for dashboard permission issues...',
  'Cross-referencing troubleshoot tags: c-c, dashboard, access...',
];
const GSD103_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for VV profile issues...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];
const GSD103_REC_STEPS = [
  'Loading similar ticket corpus from vector store...',
  'Fetching t/23757 (91% match) from incident archive...',
  'Extracting resolution transcript from t/23757...',
  'Parsing resolution steps from closed ticket...',
  'Mapping steps to current ticket context...',
  'Validating resolution applicability...',
];
const GSD103_REC_RESOLUTION = [
  'Log in to VV WFM admin console with admin credentials.',
  'Navigate to User Management -> New Profile and enter agent details: axelsylvain@google.com.',
  'Assign the correct program: CPS, and set site and role permissions accordingly.',
  'Save the new profile and verify login access for the agent.',
  'Notify the requester (ashi@google.com) once the profile is active.',
];
const GSD103_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CTI match...',
  'Matching CTI: c-c / ABC-XYZ / create new profile...',
  'Locating SOP for VV new agent profile creation...',
  'Retrieving RUNBOOK-WFM-012 from knowledge base...',
  'Validating runbook version and current applicability...',
];
const GSD103_RUNBOOK_RESOLUTION = [
  'Confirm agent details: name, email (slivester@company.com), program (CPS), and site.',
  'Log in to VV WFM admin portal -> User Management -> Create New User.',
  'Fill in required fields: email, program assignment (CPS), role, and site location.',
  'Set initial password and send credentials via secure IT channel.',
  'Verify profile creation by searching agent email in User Management.',
  'Notify requesting supervisor/admin once profile is active and accessible.',
];
const GSD103_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for VV profile creation issues...',
  'Checking error-code catalogue for new profile creation failures...',
  'Scanning step-by-step guides for WFM user provisioning...',
  'Cross-referencing troubleshoot tags: ABC-XYZ, create-profile, CPS...',
];
const GSD103_CONTEXT_STEPS = [
  'Reading ticket description and reporter details...',
  'Parsing ticket summary and key phrases...',
  'Checking required context fields against ticket schema...',
  'Evaluating completeness of reporter information...',
  'Verifying agent email, program, and site details in description...',
  'Context provided by reporter — all fields validated...',
];
const GSD104_CONTEXT_STEPS = [
  'Reading ticket description and reporter details...',
  'Parsing ticket summary and key phrases...',
  'Checking required context fields against ticket schema...',
  'Evaluating completeness of reporter information...',
  'Verifying program, site, and system details in description...',
  'All required fields present — context complete...',
];
// t/23408 — abusive caller phone block
const GSD105_CONTEXT_STEPS = [
  'Reading ticket description and reporter details...',
  'Parsing ticket summary and key phrases...',
  'Checking required context fields against ticket schema...',
  'Evaluating completeness of reporter information...',
  'Verifying program, site, and system details in description...',
  'All required fields present — context complete...',
];
const GSD105_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for phone number block requests...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];
const GSD105_REC_STEPS = [
  'Loading similar ticket corpus from vector store...',
  'Fetching t/23068 (93% match) from incident archive...',
  'Extracting resolution transcript from t/23068...',
  'Parsing resolution steps from closed ticket...',
  'Mapping steps to current ticket context...',
  'Linking resolution to: To block Number in RPC studio runbook...',
  'Validating resolution applicability...',
];
const GSD105_REC_RESOLUTION = [
  'Access the RPC tool from the support portal.',
  'Search for abusiveblock_create and click the v2_write templates.',
  'Input the CCSid and phone number in E.164 format to be blocked, crm_id, expiration_year, expiration_month and expiration_date.',
  'Click send. Successfully blocked number should appear on the screen.',
];
const GSD105_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CTI match...',
  'Matching CTI: c-c / easy-config / abusive-user-block...',
  'Locating SOP for blocking abusive phone numbers in RPC studio...',
  'Retrieving "To block Number in RPC studio runbook" from knowledge base...',
  'Validating runbook version and current applicability...',
];
const GSD105_RUNBOOK_RESOLUTION = [
  'Access the RPC tool from the support portal.',
  'Search for abusiveblock_create and click the v2_write templates.',
  'Input the CCSid and phone number in E.164 format to be blocked, crm_id, expiration_year, expiration_month and expiration_date.',
  'Click send. Successfully blocked number should appear on the screen.',
];
const GSD105_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for RPC abusive block entries...',
  'Checking error-code catalogue for phone number block request failures...',
  'Scanning step-by-step guides for AC abusive caller blocking...',
  'Cross-referencing troubleshoot tags: c-c, easy-config, abusive-block...',
];

const GSD104_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for AC issues...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  '3 tickets found above confidence threshold...',
];

// Knowledge Base — t/23757 incident record
const GSD076_KB = {
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

const KB_SEARCH_STEPS = [
  'Initialising knowledge base search for incident t/23757...',
  'Connecting to GUTS (Google Universal Ticket System)...',
  'Querying GUTS for t/23757 resolution record and root cause...',
  'Fetching resolution transcript and linked KB articles from GUTS...',
  'Searching MoMA for t/23757 incident record...',
  'Querying Yaqs knowledge index for t/23757...',
  'Full incident record assembled from GUTS, MoMA and Yaqs...',
];

const AgentView = ({
  tickets,
  setTickets,
  thinkingTicketId,
  routingTicketId,
  setThinkingTicketId,
  setRoutingTicketId,
  processAIEnrichment,
  matchScenario,
  matchPastResolution,
  scenarioLibrary,
}) => {
  const [agentSelectedTicketId, setAgentSelectedTicketId] = useState(null);
  const [agentActiveTab, setAgentActiveTab] = useState('Overview');
  const [agentKBMessages, setAgentKBMessages] = useState([]);
  const [agentKBInput, setAgentKBInput] = useState('');
  const [s4Steps, setS4Steps] = useState([]);
  const [s4Done, setS4Done] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gsd100CtiSteps, setGsd100CtiSteps] = useState([]);
  const [gsd100CtiDone, setGsd100CtiDone] = useState(false);
  const [gsd100DupSteps, setGsd100DupSteps] = useState([]);
  const [gsd100DupDone, setGsd100DupDone] = useState(false);

  const [gsd100PreSteps, setGsd100PreSteps] = useState([]);
  const [gsd100PreDone, setGsd100PreDone] = useState(false);
  const [gsd100CheckSteps, setGsd100CheckSteps] = useState([]);
  const [gsd100CheckDone, setGsd100CheckDone] = useState(false);
  const [gsd100ContextSubmitted, setGsd100ContextSubmitted] = useState(false);
  const [gsd100ContextVisible, setGsd100ContextVisible] = useState(false);
  const [gsd100RecSteps, setGsd100RecSteps] = useState([]);
  const [gsd100RecDone, setGsd100RecDone] = useState(false);
  const [gsd100RunbookSteps, setGsd100RunbookSteps] = useState([]);
  const [gsd100RunbookDone, setGsd100RunbookDone] = useState(false);
  const [gsd100TroubleshootSteps, setGsd100TroubleshootSteps] = useState([]);
  const [gsd100TroubleshootDone, setGsd100TroubleshootDone] = useState(false);
  const [gsd103ContextSteps, setGsd103ContextSteps] = useState([]);
  const [gsd103ContextDone, setGsd103ContextDone] = useState(false);
  const [gsd103CtiSteps, setGsd103CtiSteps] = useState([]);
  const [gsd103CtiDone, setGsd103CtiDone] = useState(false);
  const [gsd103DupSteps, setGsd103DupSteps] = useState([]);
  const [gsd103DupDone, setGsd103DupDone] = useState(false);
  const [gsd103CommentUpdated, setGsd103CommentUpdated] = useState(false);
  const [gsd103RecSteps, setGsd103RecSteps] = useState([]);
  const [gsd103RecDone, setGsd103RecDone] = useState(false);
  const [gsd103RunbookSteps, setGsd103RunbookSteps] = useState([]);
  const [gsd103RunbookDone, setGsd103RunbookDone] = useState(false);
  const [gsd103TroubleshootSteps, setGsd103TroubleshootSteps] = useState([]);
  const [gsd103TroubleshootDone, setGsd103TroubleshootDone] = useState(false);
  const [gsd104ContextSteps, setGsd104ContextSteps] = useState([]);
  const [gsd104ContextDone, setGsd104ContextDone] = useState(false);
  const [gsd104CtiSteps, setGsd104CtiSteps] = useState([]);
  const [gsd104CtiDone, setGsd104CtiDone] = useState(false);
  const [gsd104DupSteps, setGsd104DupSteps] = useState([]);
  const [gsd104DupDone, setGsd104DupDone] = useState(false);
  const [gsd105ContextSteps, setGsd105ContextSteps] = useState([]);
  const [gsd105ContextDone, setGsd105ContextDone] = useState(false);
  const [gsd105CtiSteps, setGsd105CtiSteps] = useState([]);
  const [gsd105CtiDone, setGsd105CtiDone] = useState(false);
  const [gsd105DupSteps, setGsd105DupSteps] = useState([]);
  const [gsd105DupDone, setGsd105DupDone] = useState(false);
  const [gsd105RecSteps, setGsd105RecSteps] = useState([]);
  const [gsd105RecDone, setGsd105RecDone] = useState(false);
  const [gsd105RunbookSteps, setGsd105RunbookSteps] = useState([]);
  const [gsd105RunbookDone, setGsd105RunbookDone] = useState(false);
  const [gsd105TroubleshootSteps, setGsd105TroubleshootSteps] = useState([]);
  const [gsd105TroubleshootDone, setGsd105TroubleshootDone] = useState(false);

  // KB incident search state
  const [kbSearchTicketId, setKbSearchTicketId] = useState(null);
  const [kbSearchStepsShown, setKbSearchStepsShown] = useState([]);
  const [kbSearchDone, setKbSearchDone] = useState(false);
  const [kbResultReady, setKbResultReady] = useState(false);

  // Show all sample tickets (preserving duplicates), then append any dynamic tickets
  // that don't match a sample ID. Dynamic tickets update the first matching sample entry.
  const dynamicById = new Map(tickets.map(t => [t.id, t]));
  const allQueueTickets = [
    ...SAMPLE_TICKETS.map(s => dynamicById.get(s.id) || s),
    ...tickets.filter(t => !SAMPLE_TICKETS.some(s => s.id === t.id)),
  ];
  const filteredQueue = searchQuery.trim()
    ? allQueueTickets.filter(t =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : allQueueTickets;

  // S3/S4 animation effect
  useEffect(() => {
    const isRouting = routingTicketId === agentSelectedTicketId && agentSelectedTicketId != null;
    if (!isRouting) return;

    setS4Steps([]);
    setS4Done(false);

    const timers = [];
    S4_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setS4Steps(prev => [...prev, step]), 500 + i * 2000));
    });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routingTicketId, agentSelectedTicketId]);

  useEffect(() => {
    if (agentSelectedTicketId != null && routingTicketId == null) {
      setS4Done(true);
    }
  }, [routingTicketId, agentSelectedTicketId]);

  // t/23887: pre-step animation (runs as soon as ticket is selected)
  useEffect(() => {
    if (agentSelectedTicketId !== 't/23887') return;
    setGsd100PreSteps([]);
    setGsd100PreDone(false);
    setGsd100CheckSteps([]);
    setGsd100CheckDone(false);
    setGsd100ContextSubmitted(false);
    setGsd100ContextVisible(false);
    setGsd100CtiSteps([]);
    setGsd100CtiDone(false);
    setGsd100DupSteps([]);
    setGsd100DupDone(false);

    setGsd100RecSteps([]);
    setGsd100RecDone(false);
    setGsd100RunbookSteps([]);
    setGsd100RunbookDone(false);
    setGsd100TroubleshootSteps([]);
    setGsd100TroubleshootDone(false);
    const timers = [];
    GSD100_PRE_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100PreSteps(prev => [...prev, step]), 300 + i * 700));
    });
    const preDoneAt = 300 + GSD100_PRE_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd100PreDone(true), preDoneAt));
    timers.push(setTimeout(() => setGsd100ContextSubmitted(true), preDoneAt + 1500));
    timers.push(setTimeout(() => setGsd100ContextVisible(true), preDoneAt + 3300));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // t/23887 CTI + duplicate + recommendation animation — triggered after context submitted
  useEffect(() => {
    if (!gsd100ContextSubmitted) return;
    const timers = [];
    GSD100_CHECK_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100CheckSteps(prev => [...prev, step]), 300 + i * 700));
    });
    const checkDoneAt = 300 + GSD100_CHECK_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd100CheckDone(true), checkDoneAt));
    const ctiStart = checkDoneAt + 500;
    CTI_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100CtiSteps(prev => [...prev, step]), ctiStart + i * 900));
    });
    const ctiDoneAt = ctiStart + CTI_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd100CtiDone(true), ctiDoneAt));
    const dupStart = ctiDoneAt + 600;
    GSD100_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100DupSteps(prev => [...prev, step]), dupStart + i * 900));
    });
    const dupDoneAt = dupStart + GSD100_DUP_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd100DupDone(true), dupDoneAt));
    const recStart = dupDoneAt + 3500;
    GSD100_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + GSD100_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd100RecDone(true), recDoneAt));
    const runbookStart = recDoneAt + 800;
    GSD100_RUNBOOK_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100RunbookSteps(prev => [...prev, step]), runbookStart + i * 700));
    });
    const runbookDoneAt = runbookStart + GSD100_RUNBOOK_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd100RunbookDone(true), runbookDoneAt));
    const troubleshootStart = runbookDoneAt + 800;
    GSD100_TROUBLESHOOT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100TroubleshootSteps(prev => [...prev, step]), troubleshootStart + i * 700));
    });
    timers.push(setTimeout(() => setGsd100TroubleshootDone(true), troubleshootStart + GSD100_TROUBLESHOOT_STEPS.length * 700));
    return () => timers.forEach(clearTimeout);
  }, [gsd100ContextVisible]);


  // t/23919 context validation + CTI + duplicate + recommendation animation
  useEffect(() => {
    if (agentSelectedTicketId !== 't/23919') return;
    setGsd103ContextSteps([]);
    setGsd103ContextDone(false);
    setGsd103CtiSteps([]);
    setGsd103CtiDone(false);
    setGsd103DupSteps([]);
    setGsd103DupDone(false);
    setGsd103CommentUpdated(false);
    setGsd103RecSteps([]);
    setGsd103RecDone(false);
    setGsd103RunbookSteps([]);
    setGsd103RunbookDone(false);
    setGsd103TroubleshootSteps([]);
    setGsd103TroubleshootDone(false);
    const timers = [];
    GSD103_CONTEXT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd103ContextSteps(prev => [...prev, step]), 300 + i * 700));
    });
    const contextDoneAt = 300 + GSD103_CONTEXT_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd103ContextDone(true), contextDoneAt));
    const ctiStart = contextDoneAt + 600;
    CTI_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd103CtiSteps(prev => [...prev, step]), ctiStart + i * 900));
    });
    const ctiDoneAt = ctiStart + CTI_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd103CtiDone(true), ctiDoneAt));
    const dupStart = ctiDoneAt + 600;
    GSD103_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd103DupSteps(prev => [...prev, step]), dupStart + i * 900));
    });
    const dupDoneAt = dupStart + GSD103_DUP_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd103DupDone(true), dupDoneAt));
    // Recommendation Agent
    const recStart = dupDoneAt + 3500;
    GSD103_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd103RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + GSD103_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd103RecDone(true), recDoneAt));
    const runbookStart = recDoneAt + 800;
    GSD103_RUNBOOK_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd103RunbookSteps(prev => [...prev, step]), runbookStart + i * 700));
    });
    const runbookDoneAt = runbookStart + GSD103_RUNBOOK_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd103RunbookDone(true), runbookDoneAt));
    const troubleshootStart = runbookDoneAt + 800;
    GSD103_TROUBLESHOOT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd103TroubleshootSteps(prev => [...prev, step]), troubleshootStart + i * 700));
    });
    timers.push(setTimeout(() => setGsd103TroubleshootDone(true), troubleshootStart + GSD103_TROUBLESHOOT_STEPS.length * 700));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // t/23885 context validation + CTI + duplicate animation
  useEffect(() => {
    if (agentSelectedTicketId !== 't/23885') return;
    setGsd104ContextSteps([]);
    setGsd104ContextDone(false);
    setGsd104CtiSteps([]);
    setGsd104CtiDone(false);
    setGsd104DupSteps([]);
    setGsd104DupDone(false);
    const timers = [];
    GSD104_CONTEXT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd104ContextSteps(prev => [...prev, step]), 300 + i * 700));
    });
    const contextDoneAt = 300 + GSD104_CONTEXT_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd104ContextDone(true), contextDoneAt));
    const ctiStart = contextDoneAt + 600;
    CTI_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd104CtiSteps(prev => [...prev, step]), ctiStart + i * 900));
    });
    const ctiDoneAt = ctiStart + CTI_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd104CtiDone(true), ctiDoneAt));
    const dupStart = ctiDoneAt + 600;
    GSD104_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd104DupSteps(prev => [...prev, step]), dupStart + i * 900));
    });
    const dupDoneAt = dupStart + GSD104_DUP_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd104DupDone(true), dupDoneAt));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // t/23408 context validation + CTI + duplicate + recommendation animation
  useEffect(() => {
    if (agentSelectedTicketId !== 't/23408') return;
    setGsd105ContextSteps([]);
    setGsd105ContextDone(false);
    setGsd105CtiSteps([]);
    setGsd105CtiDone(false);
    setGsd105DupSteps([]);
    setGsd105DupDone(false);
    setGsd105RecSteps([]);
    setGsd105RecDone(false);
    setGsd105RunbookSteps([]);
    setGsd105RunbookDone(false);
    setGsd105TroubleshootSteps([]);
    setGsd105TroubleshootDone(false);
    const timers = [];
    GSD105_CONTEXT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd105ContextSteps(prev => [...prev, step]), 300 + i * 700));
    });
    const contextDoneAt = 300 + GSD105_CONTEXT_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd105ContextDone(true), contextDoneAt));
    const ctiStart = contextDoneAt + 600;
    CTI_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd105CtiSteps(prev => [...prev, step]), ctiStart + i * 900));
    });
    const ctiDoneAt = ctiStart + CTI_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd105CtiDone(true), ctiDoneAt));
    const dupStart = ctiDoneAt + 600;
    GSD105_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd105DupSteps(prev => [...prev, step]), dupStart + i * 900));
    });
    const dupDoneAt = dupStart + GSD105_DUP_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd105DupDone(true), dupDoneAt));
    const recStart = dupDoneAt + 3500;
    GSD105_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd105RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + GSD105_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd105RecDone(true), recDoneAt));
    const runbookStart = recDoneAt + 800;
    GSD105_RUNBOOK_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd105RunbookSteps(prev => [...prev, step]), runbookStart + i * 700));
    });
    const runbookDoneAt = runbookStart + GSD105_RUNBOOK_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd105RunbookDone(true), runbookDoneAt));
    const troubleshootStart = runbookDoneAt + 800;
    GSD105_TROUBLESHOOT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd105TroubleshootSteps(prev => [...prev, step]), troubleshootStart + i * 700));
    });
    timers.push(setTimeout(() => setGsd105TroubleshootDone(true), troubleshootStart + GSD105_TROUBLESHOOT_STEPS.length * 700));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // KB incident search animation
  useEffect(() => {
    if (!kbSearchTicketId) return;
    setKbSearchStepsShown([]);
    setKbSearchDone(false);
    setKbResultReady(false);
    const timers = [];
    KB_SEARCH_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setKbSearchStepsShown(prev => [...prev, step]), 400 + i * 600));
    });
    const searchDoneAt = 400 + KB_SEARCH_STEPS.length * 600;
    timers.push(setTimeout(() => setKbSearchDone(true), searchDoneAt));
    timers.push(setTimeout(() => setKbResultReady(true), searchDoneAt + 400));
    return () => timers.forEach(clearTimeout);
  }, [kbSearchTicketId]);

  // Pipeline state helper
  const getPipelineState = (ticketId) => {
    const t = allQueueTickets.find(x => x.id === ticketId);
    if (!t) return { enrichment: null, sopMatch: null, historicalMatch: null, escalation: null };
    const comments = t.comments || [];
    const routingComment = comments.find(c => c.routedAfterEnrichment);
    return {
      enrichment: comments.find(c => c.missingFields) || null,
      sopMatch: comments.find(c => c.scenario) || (routingComment?.matchedScenario ? { scenario: routingComment.matchedScenario.scenario, sop: routingComment.matchedScenario.sop } : null),
      historicalMatch: comments.find(c => c.pastResolution) || (routingComment?.matchedPast ? { pastResolution: routingComment.matchedPast } : null),
      escalation: comments.find(c => c.escalation) || null,
      isDuplicateOf: routingComment?.isDuplicateOf || null,
      kbArticlesOnly: routingComment?.kbArticlesOnly || null,
    };
  };

  const agentTicket = allQueueTickets.find(t => t.id === agentSelectedTicketId) || null;
  const pipeline = agentTicket ? getPipelineState(agentTicket.id) : null;
  const isThinking = thinkingTicketId === agentSelectedTicketId;
  const agentComments = agentTicket?.comments || [];
  const resolutionComment = agentComments.find(c => (c.scenario || c.pastResolution) && c.awaitingApproval)
    || agentComments.find(c => c.scenario || c.pastResolution)
    || agentComments.find(c => c.routedAfterEnrichment);
  const resolutionIdx = resolutionComment ? agentComments.indexOf(resolutionComment) : -1;
  const ragResolutionText = resolutionComment?.pastResolution?.steps || resolutionComment?.matchedPast?.steps || null;

  // Handlers
  const handleAgentKBSend = () => {
    const q = agentKBInput.trim();
    if (!q) return;
    setAgentKBMessages(prev => [...prev, { role: 'user', text: q, timestamp: new Date().toLocaleTimeString() }]);
    setAgentKBInput('');
    // Detect incident lookup query (e.g. "tell me about incident t/23757")
    const incidentMatch = q.match(/t\/(\d+)/i);
    if (incidentMatch) {
      const incidentId = `t/${incidentMatch[1]}`;
      setKbSearchTicketId(prev => (prev === incidentId ? null : prev)); // force re-trigger if same
      setTimeout(() => setKbSearchTicketId(incidentId), 10);
      return;
    }
    setTimeout(() => {
      const ticket = allQueueTickets.find(t => t.id === agentSelectedTicketId);
      const desc = ticket?.description || '';
      const match = matchScenario(desc + ' ' + q);
      const past = matchPastResolution(desc + ' ' + q);
      let answer = '';
      if (match) answer += `**SOP Match — ${match.scenario} (${match.sop}):**\n${match.solution}`;
      if (past) { if (answer) answer += '\n\n'; answer += `**Historical Reference — ${past.ticketRef} (${past.similarity} similarity):**\n${past.steps}`; }
      if (!answer) answer = "I couldn't find a specific KB article matching your query. Please check the SOP library or escalate to L3 if the issue persists.";
      setAgentKBMessages(prev => [...prev, { role: 'bot', text: answer, timestamp: new Date().toLocaleTimeString() }]);
    }, 800);
  };

  const handleAgentApply = (ticketId, commentIdx) => {
    const ticket = allQueueTickets.find(t => t.id === ticketId);
    const comment = ticket?.comments?.[commentIdx];
    const sopText = comment?.solution
      || (comment?.matchedScenario ? scenarioLibrary.find(s => s.scenario === comment.matchedScenario.scenario)?.solution : null)
      || '';
    const ragText = comment?.pastResolution?.steps || comment?.matchedPast?.steps || '';
    const kbText = comment?.kbSteps ? comment.kbSteps.join('\n') : '';
    const stepsText = sopText && ragText ? `${sopText}\n${ragText}` : sopText || ragText || kbText;
    let steps = stepsText.split('\n').filter(line => /^\d+\./.test(line.trim())).map(line => line.replace(/^\d+\.\s*/, '').trim());
    if (steps.length === 0) {
      steps = [
        'Authenticating agent credentials and validating ticket context',
        'Connecting to affected system and verifying current state',
        'Applying recommended configuration changes',
        'Running post-fix validation checks',
        'Logging resolution and updating ticket record',
      ];
    }
    const subStepDefs = {
      0: ['Loading agent credentials', 'Verifying OAuth2 token scope', 'Checking ticket assignment rights'],
      2: ['Snapshotting current config state', 'Writing updated parameters', 'Schema validation — passed'],
      3: ['Service health ping — 200 OK', 'Verifying API response codes', 'Post-change stability confirmed'],
    };
    const SUB_FIRST_DELAY = 380, SUB_INTERVAL = 560, SUB_DONE_OFFSET = 380, STEP_NO_SUB_DONE = 850, NEXT_GAP = 180;
    let cursor = 0;
    const stepTimings = steps.map((_, i) => {
      const subs = subStepDefs[i] || [];
      const start = cursor;
      const done = subs.length > 0 ? start + SUB_FIRST_DELAY + (subs.length - 1) * SUB_INTERVAL + SUB_DONE_OFFSET : start + STEP_NO_SUB_DONE;
      cursor = done + NEXT_GAP;
      return { start, done, subs };
    });
    const mutateTel = (prev, mutate) => prev.map(t => {
      if (t.id !== ticketId) return t;
      return { ...t, comments: t.comments.map((c, idx) => { if (idx !== commentIdx) return c; const tel = c.telemetry ? [...c.telemetry] : []; mutate(tel); return { ...c, telemetry: tel }; }) };
    });
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return { ...t, comments: t.comments.map((c, i) => i === commentIdx ? { ...c, awaitingApproval: false, telemetry: [], telemetryComplete: false } : c) };
    }));
    steps.forEach((step, i) => {
      const { start, done, subs } = stepTimings[i];
      setTimeout(() => setTickets(prev => mutateTel(prev, tel => { tel[i] = { text: step, status: 'running', subSteps: [] }; })), start);
      subs.forEach((subText, j) => {
        const subStart = start + SUB_FIRST_DELAY + j * SUB_INTERVAL;
        setTimeout(() => setTickets(prev => mutateTel(prev, tel => { if (!tel[i]) return; const ss = [...(tel[i].subSteps || [])]; ss[j] = { text: subText, status: 'running' }; tel[i] = { ...tel[i], subSteps: ss }; })), subStart);
        setTimeout(() => setTickets(prev => mutateTel(prev, tel => { if (!tel[i]) return; const ss = [...(tel[i].subSteps || [])]; if (ss[j]) ss[j] = { ...ss[j], status: 'done' }; tel[i] = { ...tel[i], subSteps: ss }; })), subStart + 300);
      });
      setTimeout(() => setTickets(prev => mutateTel(prev, tel => { if (tel[i]) tel[i] = { ...tel[i], status: 'done' }; })), done);
    });
    const totalTime = stepTimings[steps.length - 1].done + 400;
    setTimeout(() => {
      setTickets(prev => prev.map(t => {
        if (t.id !== ticketId) return t;
        return { ...t, status: 'Resolved', comments: t.comments.map((c, i) => i === commentIdx ? { ...c, telemetryComplete: true } : c) };
      }));
    }, totalTime);
  };

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* Left Sidebar: Ticket Queue */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2.5">
            <Inbox className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Queue</span>
            <span className="ml-auto text-sm bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">{filteredQueue.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-indigo-300"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Inbox className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm italic text-center">No tickets in queue</p>
            </div>
          ) : filteredQueue.map(t => (
            <button
              key={t.id + '_' + t.createdAt}
              onClick={() => {
                setAgentSelectedTicketId(t.id);
                setAgentActiveTab('Overview');
                const hasBeenRouted = t.comments && t.comments.some(c => c.routedAfterEnrichment);
                if (!hasBeenRouted && t.id !== 't/23887' && t.id !== 't/23919' && t.id !== 't/23885' && t.id !== 't/23408') {
                  // Ensure sample tickets are in shared state so processAIEnrichment can update them
                  if (t.isSample) {
                    setTickets(prev => {
                      if (prev.find(x => x.id === t.id)) return prev;
                      return [...prev, { ...t, isSample: false }];
                    });
                  }
                  const alreadyEnriched = t.comments && t.comments.some(c => c.missingFields) && t.comments.some(c => c.role === 'user');
                  if (alreadyEnriched) {
                    // S1 already done — skip thinking, go straight to S3/S4 routing animation
                    processAIEnrichment(t.id, t.description, true);
                  } else {
                    setThinkingTicketId(t.id);
                    setTimeout(() => {
                      setThinkingTicketId(null);
                      processAIEnrichment(t.id, t.description);
                    }, 3000);
                  }
                }
              }}
              className={`w-full text-left p-2.5 rounded-lg transition-colors border ${agentSelectedTicketId === t.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-50 border-transparent'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-indigo-600">{t.id}</span>
                <div className="flex items-center gap-1">
                  {t.hasUpdate && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                  <span className="text-sm bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-bold border border-blue-100">Open</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 leading-snug">{t.description}</p>
              <p className="text-sm text-slate-400 mt-1">{t.createdAt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {!agentTicket ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
          <Layers className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-base font-semibold">Select a ticket from the queue</p>
          <p className="text-sm mt-1 opacity-70">AI agent pipeline · SOP matching · resolution recommendations</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Ticket Title Bar */}
          <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-4 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-indigo-600">{agentTicket.id}</span>
                <span className="text-sm text-slate-400">{agentTicket.createdAt}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{agentTicket.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">SG</div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-700">Shivam Gupta</span>
                <span className="text-xs text-slate-400">L1 Contact Center Support</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 px-5 flex gap-1 flex-shrink-0">
            {['Overview', 'Details'].map(tab => (
              <button
                key={tab}
                onClick={() => setAgentActiveTab(tab)}
                className={`py-2.5 px-3 text-sm font-semibold border-b-2 transition-colors ${agentActiveTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ---- OVERVIEW TAB ---- */}
          {agentActiveTab === 'Overview' && (
            <div className="flex-1 flex overflow-hidden">

              {/* Col 1: Summary */}
              <div className="w-72 border-r border-slate-200 bg-white overflow-y-auto flex-shrink-0">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Summary</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3 mb-4">{agentTicket.description}</p>
                  {agentTicket.id === 't/23887' && gsd100ContextVisible && (() => {
                    const _eIdx = agentComments.indexOf(pipeline?.enrichment);
                    const _ctx = agentComments.find((c, i) => c.role === 'user' && i > _eIdx);
                    return (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-blue-600">Context Provided</span>
                          <span className="text-xs text-slate-400">13 Apr 2026, 1:05 PM</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed italic whitespace-pre-wrap">"{_ctx?.text}"</p>
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Number</p><p className="text-sm font-semibold text-indigo-600 mt-0.5">{agentTicket.id}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</p><p className="text-sm font-semibold text-orange-600 mt-0.5">HIGH</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opened</p><p className="text-sm text-slate-600 mt-0.5">{agentTicket.createdAt}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p><p className="text-sm font-semibold text-green-600 mt-0.5">{agentTicket.status}</p></div>
                  </div>
                </div>
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Caller</p>
                  {(() => {
                    const callerMap = {
                      't/23887': 'Rahul Sharma',
                      't/23919': 'Ashi Verma',
                      't/23885': 'Ravi Kumar',
                      't/23408': 'Czant PP-MMM',
                    };
                    const callerName = callerMap[agentTicket.id] || agentTicket.email;
                    return (
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-base flex-shrink-0">{callerName[0].toUpperCase()}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{callerName}</p>
                          <p className="text-sm text-slate-400">Employee</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Assigned To</p>
                  {(() => {
                    const assignee = { agent: 'Shivam Gupta', department: 'L1 Contact Center Support' };
                    return (
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                          {assignee.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{assignee.agent}</p>
                          <p className="text-sm text-indigo-500 font-medium">{assignee.department}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Col 2: AI Agent Pipeline */}
              <div className="flex-[3] overflow-y-auto p-5 bg-slate-50 min-w-0">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">AI Agent Pipeline</p>
                <div className="space-y-3">

                  {/* S1 Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Triage & Categorize Agent</p>
                          </div>
                          {isThinking ? (
                            <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analyzing <ThinkingDots /></span>
                          ) : agentTicket?.id === 't/23919' ? (
                            gsd103ContextDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Context Validated</span>
                              : gsd103ContextSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>
                                : null
                          ) : agentTicket?.id === 't/23885' ? (
                            gsd104ContextDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Context Validated</span>
                              : gsd104ContextSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>
                                : null
                          ) : agentTicket?.id === 't/23408' ? (
                            gsd105ContextDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Context Validated</span>
                              : gsd105ContextSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>
                                : null
                          ) : pipeline?.enrichment ? (() => {
                            if (agentTicket?.id === 't/23887') {
                              if (gsd100ContextSubmitted) return <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Context Provided</span>;
                              if (gsd100PreDone) return <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Enrichment Needed</span>;
                              return <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>;
                            }
                            const enrichmentIdx = agentComments.indexOf(pipeline.enrichment);
                            const hasReply = agentComments.some((c, i) => c.role === 'user' && i > enrichmentIdx);
                            return hasReply
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Context Provided</span>
                              : <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Enrichment Needed</span>;
                          })() : (
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Complete</span>
                          )}
                        </div>
                        {/* t/23919: context validation + CTI + duplicate (no duplicate found) */}
                        {agentTicket.id === 't/23919' && !isThinking && gsd103ContextSteps.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {/* Context Validation */}
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-1.5">
                                <div>
                                  <p className="text-sm font-bold text-slate-600">Validating Context</p>
                                  <p className="text-sm text-slate-400">13 Apr 2026, 10:31 AM</p>
                                </div>
                                {!gsd103ContextDone
                                  ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Analysing <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Context Validated — Context Provided</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd103ContextSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-slate-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* CTI Detection */}
                            {gsd103CtiSteps.length > 0 && (
                              <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                  {!gsd103CtiDone
                                    ? <span className="flex items-center gap-1 text-sm text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd103CtiSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-violet-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd103CtiDone && (
                                  <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                      <p className="text-sm font-semibold text-slate-700">c-c</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                      <p className="text-sm font-semibold text-slate-700">ABC-XYZ</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                      <p className="text-sm font-semibold text-slate-700">create new profile</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Duplicate Identification — no duplicate */}
                            {gsd103DupSteps.length > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                  {!gsd103DupDone
                                    ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No duplicates</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd103DupSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-slate-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd103DupDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-sm text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* t/23885: context validation + CTI + duplicate found */}
                        {agentTicket.id === 't/23885' && !isThinking && gsd104ContextSteps.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {/* Context Validation */}
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-1.5">
                                <div>
                                  <p className="text-sm font-bold text-slate-600">Validating Context</p>
                                  <p className="text-sm text-slate-400">13 Apr 2026, 11:01 AM</p>
                                </div>
                                {!gsd104ContextDone
                                  ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Analysing <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Context Validated — Complete Context</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd104ContextSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-slate-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* CTI Detection */}
                            {gsd104CtiSteps.length > 0 && (
                              <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                  {!gsd104CtiDone
                                    ? <span className="flex items-center gap-1 text-sm text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd104CtiSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-violet-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd104CtiDone && (
                                  <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                      <p className="text-sm font-semibold text-slate-700">c-c</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                      <p className="text-sm font-semibold text-slate-700">barkeep</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                      <p className="text-sm font-semibold text-slate-700">app launch</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Duplicate Identification */}
                            {gsd104DupSteps.length > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                  {!gsd104DupDone
                                    ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Duplicate Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd104DupSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-slate-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd104DupDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-sm font-semibold text-orange-700 mb-2">3 duplicate tickets identified:</p>
                                    <div className="space-y-2">
                                      {[
                                        { id: 't/238602912', time: '13 Apr 2026, 9:45 AM' },
                                        { id: 't/238603568', time: '13 Apr 2026, 8:52 AM' },
                                        { id: 't/23166', time: '13 Apr 2026, 8:10 AM' },
                                      ].map(dup => (
                                        <div key={dup.id} className="bg-white rounded-lg border border-orange-200 p-2.5 shadow-sm">
                                          <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-bold text-indigo-600">{dup.id}</span>
                                            <div className="flex items-center gap-1.5">
                                              <Clock className="w-3 h-3 text-slate-400" />
                                              <span className="text-sm text-slate-400">{dup.time}</span>
                                            </div>
                                          </div>
                                          <p className="text-sm font-semibold text-slate-700 mb-1">Speak easy not working</p>
                                          <p className="text-sm text-slate-500 leading-snug">XXX DEMAND YYY-GGGT VGT GCP Generalists TP VGTR BBB : AC not Working</p>
                                          <div className="mt-1.5 flex items-center gap-2">
                                            <span className="text-sm bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full font-bold border border-orange-100">Open</span>
                                            <span className="text-sm text-slate-400">XYZteam@company.com</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* t/23408: context validation + CTI + duplicate (no duplicate found) */}
                        {agentTicket.id === 't/23408' && !isThinking && gsd105ContextSteps.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {/* Context Validation */}
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-1.5">
                                <div>
                                  <p className="text-sm font-bold text-slate-600">Validating Context</p>
                                  <p className="text-sm text-slate-400">14 Apr 2026, 9:01 AM</p>
                                </div>
                                {!gsd105ContextDone
                                  ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Analysing <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Context Validated — Context Provided</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd105ContextSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-slate-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* CTI Detection */}
                            {gsd105CtiSteps.length > 0 && (
                              <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                  {!gsd105CtiDone
                                    ? <span className="flex items-center gap-1 text-sm text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd105CtiSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-violet-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd105CtiDone && (
                                  <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                      <p className="text-sm font-semibold text-slate-700">c-c</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                      <p className="text-sm font-semibold text-slate-700">AC config</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                      <p className="text-sm font-semibold text-slate-700">abusive user block</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Duplicate Identification — no duplicate */}
                            {gsd105DupSteps.length > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                  {!gsd105DupDone
                                    ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No duplicates</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd105DupSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-slate-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd105DupDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-sm text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {agentTicket.id !== 't/23919' && agentTicket.id !== 't/23885' && agentTicket.id !== 't/23408' && pipeline?.enrichment && !isThinking ? (() => {
                          const enrichmentIdx = agentComments.indexOf(pipeline.enrichment);
                          const reporterReply = agentComments.find((c, i) => c.role === 'user' && i > enrichmentIdx);
                          const enrichmentResolved = !!(reporterReply);
                          return (
                            <div className="mt-2 space-y-2">
                              {/* t/23887: pre-check telemetry */}
                              {agentTicket.id === 't/23887' && gsd100PreSteps.length > 0 && (
                                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div>
                                      <p className="text-sm font-bold text-slate-600">Checking Context</p>
                                      <p className="text-sm text-slate-400">13 Apr 2026, 9:15 AM</p>
                                    </div>
                                    {!gsd100PreDone
                                      ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Analysing <ThinkingDots /></span>
                                      : <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Done</span>}
                                  </div>
                                  <div className="space-y-1 font-mono">
                                    {gsd100PreSteps.map((step, i) => (
                                      <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                        <span className="text-slate-400">*</span><span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {agentTicket.id === 't/23887' && gsd100PreDone && (
                                <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-100">
                                  <p className="text-sm font-bold text-orange-600 mb-2">Required Details Missing</p>
                                  <div className="space-y-2">
                                    {pipeline.enrichment.enrichmentQuestions.map((q, i) => (
                                      <div key={i} className={`p-2 rounded-md border text-sm ${gsd100ContextSubmitted ? 'bg-green-50 border-green-200' : 'bg-white border-orange-200'}`}>
                                        <p className={`font-bold mb-0.5 flex items-center gap-1 ${gsd100ContextSubmitted ? 'text-green-700' : 'text-orange-700'}`}>
                                          {gsd100ContextSubmitted && <CheckCircle className="w-2.5 h-2.5" />}* {q.field}
                                        </p>
                                        <p className={gsd100ContextSubmitted ? 'text-green-600' : 'text-slate-600'}>{q.detail}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {agentTicket.id === 't/23887' && gsd100ContextVisible && (
                                <>
                                  <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-sm font-bold text-blue-600">Context provided by reporter:</p>
                                      <span className="text-sm text-slate-400">13 Apr 2026, 1:05 PM</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed italic whitespace-pre-wrap">"{agentComments.find((c, i) => c.role === 'user' && i > enrichmentIdx)?.text}"</p>
                                  </div>
                                  {/* second checking context */}
                                  {gsd100CheckSteps.length > 0 && (
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <div>
                                          <p className="text-sm font-bold text-slate-600">Checking Context</p>
                                          <p className="text-sm text-slate-400">13 Apr 2026, 1:06 PM</p>
                                        </div>
                                        {!gsd100CheckDone
                                          ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Analysing <ThinkingDots /></span>
                                          : <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Context Provided</span>}
                                      </div>
                                      <div className="space-y-1 font-mono">
                                        {gsd100CheckSteps.map((step, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <span className="text-slate-400">*</span><span>{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {/* t/23887: CTI detection + duplicate identification (only after context submitted) */}
                              {agentTicket.id === 't/23887' && gsd100ContextSubmitted && gsd100CtiSteps.length > 0 && (
                                <div className="space-y-2">
                                  {/* CTI Section */}
                                  <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-sm font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                      {!gsd100CtiDone ? (
                                        <span className="flex items-center gap-1 text-sm text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                      ) : (
                                        <span className="text-sm font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>
                                      )}
                                    </div>
                                    <div className="space-y-1 font-mono">
                                      {gsd100CtiSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                          <span className="text-violet-400">*</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {gsd100CtiDone && (
                                      <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                        <div>
                                          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                          <p className="text-sm font-semibold text-slate-700">c-c</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                          <p className="text-sm font-semibold text-slate-700">AC historical dashboard</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                          <p className="text-sm font-semibold text-slate-700">access</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {/* Duplicate Identification Section */}
                                  {gsd100DupSteps.length > 0 && (
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                        {!gsd100DupDone ? (
                                          <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                        ) : (
                                          <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No duplicates</span>
                                        )}
                                      </div>
                                      <div className="space-y-1 font-mono">
                                        {gsd100DupSteps.map((step, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <span className="text-slate-400">*</span>
                                            <span>{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {gsd100DupDone && (
                                        <div className="mt-2 pt-2 border-t border-slate-200">
                                          <p className="text-sm text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* t/23919: CTI detection + duplicate identification */}
                              {agentTicket.id === 't/23919' && enrichmentResolved && gsd103CtiSteps.length > 0 && (
                                <div className="space-y-2">
                                  {/* CTI Section */}
                                  <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-sm font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                      {!gsd103CtiDone
                                        ? <span className="flex items-center gap-1 text-sm text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                        : <span className="text-sm font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>}
                                    </div>
                                    <div className="space-y-1 font-mono">
                                      {gsd103CtiSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                          <span className="text-violet-400">*</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {gsd103CtiDone && (
                                      <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                        <div>
                                          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                          <p className="text-sm font-semibold text-slate-700">c-c</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                          <p className="text-sm font-semibold text-slate-700">ABC-XYZ</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                          <p className="text-sm font-semibold text-slate-700">create new profile</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {/* Duplicate Identification Section */}
                                  {gsd103DupSteps.length > 0 && (
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                        {!gsd103DupDone
                                          ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                          : <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No duplicates</span>}
                                      </div>
                                      <div className="space-y-1 font-mono">
                                        {gsd103DupSteps.map((step, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <span className="text-slate-400">*</span>
                                            <span>{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {gsd103DupDone && (
                                        <>
                                          <div className="mt-2 pt-2 border-t border-slate-200">
                                            <p className="text-sm text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                          </div>
                                          {!gsd103CommentUpdated ? (
                                            <div className="mt-3">
                                              <p className="text-sm text-slate-600 font-medium mb-2">Do you want to update these comments in this ticket?</p>
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => setGsd103CommentUpdated(true)}
                                                  className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                                                >
                                                  <CheckCircle className="w-3 h-3" /> Approve
                                                </button>
                                                <button
                                                  onClick={() => {}}
                                                  className="flex-1 py-1.5 bg-white hover:bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1"
                                                >
                                                  Reject
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2 border border-green-100">
                                              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                              <span className="font-semibold">Comments updated in ticket</span>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })() : agentTicket.id !== 't/23919' && agentTicket.id !== 't/23885' && agentTicket.id !== 't/23408' && !isThinking && (
                          <p className="text-sm text-slate-500 mt-0.5">All required context fields present. Ticket routed to resolution agents.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* S4 Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Recommendation Agent</p>
                          </div>
                          {(() => {
                            const isRouting = routingTicketId === agentSelectedTicketId;
                            if (isThinking || isRouting) return <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 't/23887' && gsd100TroubleshootDone) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 't/23887' && gsd100DupDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 't/23919' && gsd103TroubleshootDone) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 't/23919' && gsd103DupDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 't/23885' && gsd104DupDone) return <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Duplicate Identified</span>;
                            if (agentTicket?.id === 't/23885' && gsd104CtiDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Scanning <ThinkingDots /></span>;
                            if (agentTicket?.id === 't/23408' && gsd105TroubleshootDone) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 't/23408' && gsd105DupDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (pipeline?.historicalMatch) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Match Found</span>;
                            if (pipeline?.isDuplicateOf) return <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">Skipped</span>;
                            if (pipeline?.kbArticlesOnly) return <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1"><BookOpen className="w-3 h-3" /> KB Articles Found</span>;
                            if (s4Done || pipeline) return <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">No Match</span>;
                            return null;
                          })()}
                        </div>
                        {routingTicketId === agentSelectedTicketId && s4Steps.length > 0 && (
                          <div className="mt-2 space-y-1 font-mono">
                            {s4Steps.map((step, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                <span className="text-amber-400">*</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* t/23887 Recommendation Agent — similar ticket, runbook, troubleshoot */}
                        {agentTicket?.id === 't/23887' && gsd100RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            {/* Similar Ticket Resolution */}
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-amber-700">Resolution from Similar Ticket</p>
                                {!gsd100RecDone
                                  ? <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd100RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-amber-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {gsd100RecDone && (
                                <div className="mt-2 pt-2 border-t border-amber-200">
                                  <p className="text-sm font-semibold text-amber-600 mb-2">t/23810 · 94% match</p>
                                  <p className="text-sm font-bold text-amber-800 mb-1.5">Resolution Steps (from t/23810):</p>
                                  <div className="space-y-1.5">
                                    {GSD100_REC_RESOLUTION.map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-base flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Scenario Runbook */}
                            {gsd100RunbookSteps.length > 0 && (
                              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-blue-700">Scenario Runbook (RUNBOOK-CC-047)</p>
                                  {!gsd100RunbookDone
                                    ? <span className="flex items-center gap-1 text-sm text-blue-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-blue-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd100RunbookSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-blue-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd100RunbookDone && (
                                  <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="text-sm font-bold text-blue-800 mb-1.5">Resolution Steps (RUNBOOK-CC-047):</p>
                                    <div className="space-y-1.5">
                                      {GSD100_RUNBOOK_RESOLUTION.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-base flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Troubleshoot Guide */}
                            {gsd100TroubleshootSteps.length > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-slate-600">Troubleshoot Guide</p>
                                  {!gsd100TroubleshootDone
                                    ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-sm text-slate-400 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-slate-400" /> No Steps Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd100TroubleshootSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-slate-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd100TroubleshootDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-sm text-slate-500 font-medium">No troubleshoot guide steps found for this issue type.</p>
                                    <p className="text-sm text-slate-400 mt-0.5">Refer to similar ticket resolution or runbook steps above.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* t/23919 Recommendation Agent — similar ticket, runbook (found), troubleshoot (no steps) */}
                        {agentTicket?.id === 't/23919' && gsd103RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            {/* Similar Ticket Resolution */}
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-amber-700">Resolution from Similar Ticket</p>
                                {!gsd103RecDone
                                  ? <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd103RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-amber-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {gsd103RecDone && (
                                <div className="mt-2 pt-2 border-t border-amber-200">
                                  <p className="text-sm font-semibold text-amber-600 mb-2">t/23757 · 91% match</p>
                                  <p className="text-sm font-bold text-amber-800 mb-1.5">Resolution Steps (from t/23757):</p>
                                  <div className="space-y-1.5">
                                    {GSD103_REC_RESOLUTION.map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-base flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Scenario Runbook — found */}
                            {gsd103RunbookSteps.length > 0 && (
                              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-blue-700">Scenario Runbook (RUNBOOK-WFM-012)</p>
                                  {!gsd103RunbookDone
                                    ? <span className="flex items-center gap-1 text-sm text-blue-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-blue-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd103RunbookSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-blue-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd103RunbookDone && (
                                  <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="text-sm font-bold text-blue-800 mb-1.5">Resolution Steps (RUNBOOK-WFM-012):</p>
                                    <div className="space-y-1.5">
                                      {GSD103_RUNBOOK_RESOLUTION.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-base flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Troubleshoot Guide — no steps found */}
                            {gsd103TroubleshootSteps.length > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-slate-600">Troubleshoot Guide</p>
                                  {!gsd103TroubleshootDone
                                    ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-sm text-slate-400 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-slate-400" /> No Steps Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd103TroubleshootSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-slate-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd103TroubleshootDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-sm text-slate-500 font-medium">Could not find any resolution steps in the troubleshoot guide for this issue type.</p>
                                    <p className="text-sm text-slate-400 mt-0.5">Refer to similar ticket resolution or runbook steps above.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* t/23885 Recommendation Agent — duplicate ticket */}
                        {agentTicket?.id === 't/23885' && gsd104DupDone && (
                          <div className="mt-2">
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-start gap-2.5">
                              <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-orange-700 mb-0.5">Duplicate Ticket</p>
                                <p className="text-sm text-slate-700">This is a duplicate ticket. Please refer to the parent ticket <span className="font-bold text-indigo-600">t/23166</span> for resolution.</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* t/23408 Recommendation Agent — similar ticket, runbook, troubleshoot */}
                        {agentTicket?.id === 't/23408' && gsd105RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            {/* Similar Ticket Resolution */}
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-amber-700">Resolution from Similar Ticket</p>
                                {!gsd105RecDone
                                  ? <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd105RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-amber-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {gsd105RecDone && (
                                <div className="mt-2 pt-2 border-t border-amber-200">
                                  <p className="text-sm font-semibold text-amber-600 mb-2">t/23068 · 93% match</p>
                                  <p className="text-sm font-bold text-amber-800 mb-1.5">Resolution Steps (from t/23068):</p>
                                  <div className="space-y-1.5">
                                    {GSD105_REC_RESOLUTION.map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-base flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Scenario Runbook */}
                            {gsd105RunbookSteps.length > 0 && (
                              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-blue-700">Scenario Runbook (To block Number in RPC studio runbook)</p>
                                  {!gsd105RunbookDone
                                    ? <span className="flex items-center gap-1 text-sm text-blue-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-blue-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd105RunbookSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-blue-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd105RunbookDone && (
                                  <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="text-sm font-bold text-blue-800 mb-1.5">Resolution Steps (To block Number in RPC studio runbook):</p>
                                    <div className="space-y-1.5">
                                      {GSD105_RUNBOOK_RESOLUTION.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-base flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-blue-100 flex items-center gap-1.5">
                                      <ExternalLink className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                      <a
                                        href="#"
                                        onClick={e => e.preventDefault()}
                                        className="text-sm text-blue-600 font-semibold hover:underline"
                                      >
                                        To block Number in RPC studio runbook
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Troubleshoot Guide — no steps found */}
                            {gsd105TroubleshootSteps.length > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-slate-600">Troubleshoot Guide</p>
                                  {!gsd105TroubleshootDone
                                    ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-sm text-slate-400 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-slate-400" /> No Steps Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd105TroubleshootSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-slate-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd105TroubleshootDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-sm text-slate-500 font-medium">No troubleshoot guide steps found for this issue type.</p>
                                    <p className="text-sm text-slate-400 mt-0.5">Refer to similar ticket resolution or runbook steps above.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {agentTicket?.id !== 't/23887' && agentTicket?.id !== 't/23919' && agentTicket?.id !== 't/23885' && agentTicket?.id !== 't/23408' && !isThinking && routingTicketId !== agentSelectedTicketId && (
                          pipeline?.isDuplicateOf ? (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-sm text-slate-500">Analysis skipped — this is a duplicate ticket.</p>
                              <p className="text-sm text-slate-600 mt-1">Refer to <span className="font-bold text-indigo-600">{pipeline.isDuplicateOf}</span> for historical match and resolution recommendation.</p>
                            </div>
                          ) : pipeline?.historicalMatch ? (
                            <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                              {s4Done && (
                                <div className="mb-1.5 space-y-0.5 font-mono">
                                  {S4_STEPS.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-400">
                                      <Check className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-1.5 pt-1.5 border-t border-amber-100">
                                <p className="text-sm font-bold text-amber-800">{pipeline.historicalMatch.pastResolution.ticketRef}</p>
                                <p className="text-sm text-amber-600 mt-0.5">Resolved {pipeline.historicalMatch.pastResolution.resolvedOn} · {pipeline.historicalMatch.pastResolution.similarity} similarity</p>
                                {ragResolutionText && <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-2 pt-2 border-t border-amber-100">{ragResolutionText}</p>}
                                {pipeline.historicalMatch.pastResolution.kbArticles?.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-amber-100">
                                    <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-1.5 flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> Related KB Articles</p>
                                    <div className="space-y-1">
                                      {pipeline.historicalMatch.pastResolution.kbArticles.map(kb => (
                                        <div key={kb.id} className="flex items-center gap-2 text-sm">
                                          <span className="font-mono text-amber-600 font-semibold flex-shrink-0">{kb.id}</span>
                                          <span className="text-slate-600 flex-1 truncate">{kb.title}</span>
                                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-sm font-medium flex-shrink-0">{kb.tag}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : pipeline?.kbArticlesOnly ? (
                            <div className="mt-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="mb-1.5 space-y-0.5 font-mono">
                                {S4_STEPS.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <Check className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-1.5 pt-1.5 border-t border-blue-100">
                                <p className="text-sm text-slate-500 font-medium">No similar resolved tickets found in historical records.</p>
                                <div className="mt-2">
                                  <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-1.5 flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> Related KB Articles Found</p>
                                  <div className="space-y-1">
                                    {pipeline.kbArticlesOnly.map(kb => (
                                      <div key={kb.id} className="flex items-center gap-2 text-sm">
                                        <span className="font-mono text-blue-600 font-semibold flex-shrink-0">{kb.id}</span>
                                        <span className="text-slate-600 flex-1 truncate">{kb.title}</span>
                                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium flex-shrink-0">{kb.tag}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (pipeline || s4Done) ? (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="mb-1.5 space-y-0.5 font-mono">
                                {S4_STEPS.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <Check className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                                <p className="text-sm text-slate-500 font-medium">No similar resolved tickets found in knowledge base.</p>
                                <p className="text-sm text-slate-400 mt-0.5">No related KB articles found for this incident type.</p>
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>

                  {/* S5 Card — duplicate override */}
                  {pipeline?.isDuplicateOf && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-sm font-bold text-green-500 uppercase tracking-wider">Agent</span>
                              <p className="text-sm font-bold text-slate-800">Autonomous Execution</p>
                            </div>
                            <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">Skipped</span>
                          </div>
                          <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-500">Execution skipped — this ticket is a confirmed duplicate.</p>
                            <p className="text-sm text-slate-600 mt-1">Refer to <span className="font-bold text-indigo-600">{pipeline.isDuplicateOf}</span> for all active resolution steps and autonomous execution trace.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* S5 Card */}
                  {!pipeline?.isDuplicateOf && resolutionComment && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <span className="text-sm font-bold text-green-500 uppercase tracking-wider">Agent</span>
                            <p className="text-sm font-bold text-slate-800">Autonomous Execution</p>
                          </div>
                          {resolutionComment.telemetry && resolutionComment.telemetry.length > 0 ? (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <Terminal className="w-3 h-3 text-slate-400" />
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Execution Trace</span>
                                {!resolutionComment.telemetryComplete && (
                                  <span className="ml-auto flex items-center gap-1 text-sm text-red-400 font-semibold animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />Running
                                  </span>
                                )}
                                {resolutionComment.telemetryComplete && (
                                  <span className="ml-auto flex items-center gap-1 text-sm text-green-500 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Complete
                                  </span>
                                )}
                              </div>
                              <div className="relative">
                                {resolutionComment.telemetry.map((step, i) => (
                                  <div key={i} className="flex items-start gap-3 mb-1">
                                    <div className="relative flex flex-col items-center flex-shrink-0">
                                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step.status === 'done' ? 'bg-green-500 border-green-500' : step.status === 'running' ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-white border-slate-300'}`}>
                                        {step.status === 'done' && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                      </div>
                                      {i < resolutionComment.telemetry.length - 1 && <div className="w-px flex-1 min-h-[12px] bg-slate-200 mt-0.5" />}
                                    </div>
                                    <div className="flex-1 pb-3">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-sm font-medium leading-snug transition-colors duration-200 ${step.status === 'done' ? 'text-slate-700' : step.status === 'running' ? 'text-red-600' : 'text-slate-400'}`}>{step.text}</span>
                                        {step.status === 'running' && <span className="text-sm bg-red-50 text-red-500 px-1.5 py-0.5 rounded border border-red-100 font-bold uppercase tracking-wider animate-pulse">Processing</span>}
                                        {step.status === 'done' && <span className="text-sm bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100 font-bold uppercase tracking-wider">Done</span>}
                                      </div>
                                      {step.subSteps && step.subSteps.length > 0 && (
                                        <div className="mt-2 relative pl-4">
                                          <div className="absolute left-[5px] top-1 bottom-1 w-px bg-slate-100" />
                                          {step.subSteps.map((sub, j) => (
                                            <div key={j} className="flex items-center gap-2 mb-1.5">
                                              <div className={`w-2 h-2 rounded-full flex-shrink-0 border transition-all duration-200 ${sub.status === 'done' ? 'bg-green-400 border-green-400' : 'bg-red-300 border-red-300 animate-pulse'}`} />
                                              <span className={`text-sm leading-snug transition-colors duration-200 ${sub.status === 'done' ? 'text-slate-500' : 'text-red-400'}`}>{sub.text}</span>
                                              {sub.status === 'done' && <Check className="w-2.5 h-2.5 text-green-400 flex-shrink-0" strokeWidth={3} />}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {resolutionComment.telemetryComplete && (
                                  <div className="flex items-center gap-3 pt-1">
                                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-bold text-green-600">All steps executed</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (resolutionComment.routedAfterEnrichment || resolutionComment.awaitingApproval) ? (
                            <div>
                              <p className="text-sm font-semibold text-slate-600 mb-2">Apply above resolutions to close the ticket?</p>
                              <button onClick={() => handleAgentApply(agentTicket.id, resolutionIdx)} className="px-4 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Apply Fix</button>
                            </div>
                          ) : resolutionComment.applying ? (
                            <span className="text-sm font-semibold text-blue-500 flex items-center gap-1.5">Applying fix <ThinkingDots /></span>
                          ) : resolutionComment.approved ? (
                            <span className="text-sm font-bold text-green-600 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Fix applied — resolution steps executed successfully.</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Col 3: Record Info + Support Navigator */}
              <div className="flex-[2] border-l border-slate-200 bg-white overflow-y-auto min-w-0">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">SLAs &amp; Timings</p>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Response SLA</span>
                      <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Completed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Resolution SLA</span>
                      {(() => {
                        const sla = null;
                        return sla
                          ? <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{sla}</span>
                          : <span className="text-sm text-slate-400">No matching SLA</span>;
                      })()}
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mt-1">
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Opened</p>
                      <p className="text-sm font-semibold text-slate-700">{agentTicket.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Support Ops Assistant</p>
                    <span className="text-sm text-slate-400 ml-auto">Answers generated by AI</span>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-3 mb-3 border border-indigo-100">
                    <p className="text-sm font-semibold text-indigo-900 mb-1">Hi! 👋</p>
                    <p className="text-sm text-indigo-700 leading-relaxed">I've analyzed this ticket through the AI pipeline. Here's what I found:</p>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    <div className="flex gap-2 items-start">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5"><Cpu className="w-2.5 h-2.5 text-blue-600" /></div>
                      <p className="text-sm text-slate-600 leading-snug">
                        {pipeline?.enrichment ? `Enrichment triggered — requester asked for ${pipeline.enrichment.missingFields.length} missing field(s).` : 'Ticket had complete context — no enrichment needed.'}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5"><BookOpen className="w-2.5 h-2.5 text-purple-600" /></div>
                      <p className="text-sm text-slate-600 leading-snug">
                        {pipeline?.sopMatch ? `Scenario: "${pipeline.sopMatch.scenario}" via ${pipeline.sopMatch.sop}.` : 'No matching SOP scenario found.'}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5"><Database className="w-2.5 h-2.5 text-amber-600" /></div>
                      <p className="text-sm text-slate-600 leading-snug">
                        {pipeline?.historicalMatch ? `Past match: ${pipeline.historicalMatch.pastResolution.ticketRef} (${pipeline.historicalMatch.pastResolution.similarity}).` : 'No historical match found.'}
                      </p>
                    </div>
                    {pipeline?.escalation && (
                      <div className="flex gap-2 items-start">
                        <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5"><UserCheck className="w-2.5 h-2.5 text-orange-600" /></div>
                        <p className="text-sm text-slate-600 leading-snug">Escalated to {pipeline.escalation.escalation.agent} ({pipeline.escalation.escalation.department}).</p>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ask Knowledge Base</p>
                    {(agentKBMessages.length > 0 || kbSearchTicketId) && (
                      <div className="mb-2 space-y-2 max-h-[28rem] overflow-y-auto">
                        {agentKBMessages.map((m, i) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 rounded-bl-sm'}`}>
                              {m.text}
                            </div>
                          </div>
                        ))}
                        {/* Incident KB lookup telemetry */}
                        {kbSearchTicketId && (
                          <div className="mt-1 space-y-2">
                            {/* Single unified search telemetry card */}
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-4 h-4 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                  <Database className="w-2.5 h-2.5 text-indigo-600" />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">Searching Knowledge Base</span>
                                {kbSearchDone
                                  ? <span className="ml-auto text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Record Found</span>
                                  : <span className="ml-auto flex items-center gap-1 text-xs text-indigo-500 font-medium">Searching <ThinkingDots color="indigo" /></span>
                                }
                              </div>
                              <div className="space-y-1 pl-6">
                                {kbSearchStepsShown.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-500">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Incident result card */}
                            {kbResultReady && kbSearchTicketId === 't/23757' && (
                              <div className="p-3 bg-white rounded-lg border border-indigo-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-100">
                                  <span className="text-sm font-bold text-indigo-700">{GSD076_KB.id}</span>
                                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{GSD076_KB.status}</span>
                                  <span className="ml-auto text-xs text-slate-400">{GSD076_KB.createdAt}</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">{GSD076_KB.summary}</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-2.5">
                                  {[
                                    { label: 'Reporter', value: GSD076_KB.reporter },
                                    { label: 'Assigned To', value: GSD076_KB.assignedTo },
                                    { label: 'Department', value: GSD076_KB.department },
                                    { label: 'Program', value: GSD076_KB.program },
                                    { label: 'Site', value: GSD076_KB.site },
                                    { label: 'Priority', value: GSD076_KB.priority },
                                    { label: 'Resolved At', value: GSD076_KB.resolvedAt },
                                    { label: 'Resolution Time', value: GSD076_KB.resolutionTime },
                                  ].map(({ label, value }) => (
                                    <div key={label}>
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                                      <p className="text-xs text-slate-700 font-medium">{value}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="mb-2.5">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">CTI</p>
                                  <div className="flex gap-1.5 flex-wrap">
                                    {[GSD076_KB.cti.category, GSD076_KB.cti.type, GSD076_KB.cti.item].map(v => (
                                      <span key={v} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{v}</span>
                                    ))}
                                  </div>
                                </div>
                                <div className="mb-2.5">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Description</p>
                                  <p className="text-xs text-slate-600 leading-relaxed">{GSD076_KB.description}</p>
                                </div>
                                <div className="mb-2.5">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Root Cause</p>
                                  <p className="text-xs text-slate-600 leading-relaxed">{GSD076_KB.rootCause}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Resolution Steps</p>
                                  <ol className="space-y-1">
                                    {GSD076_KB.resolutionSteps.map((step, i) => (
                                      <li key={i} className="flex gap-2 items-start">
                                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                        <span className="text-xs text-slate-700 leading-snug">{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            )}
                            {/* Fallback for unknown incident IDs */}
                            {kbResultReady && kbSearchTicketId !== 't/23757' && (
                              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-sm text-amber-700">No record found for <span className="font-bold">{kbSearchTicketId}</span> in GUTS. Verify the ticket ID and try again.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 items-end">
                      <textarea
                        value={agentKBInput}
                        onChange={e => setAgentKBInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAgentKBSend())}
                        rows={2}
                        placeholder="Ask anything..."
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder-slate-400"
                      />
                      <button onClick={handleAgentKBSend} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex-shrink-0">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ---- DETAILS TAB ---- */}
          {agentActiveTab === 'Details' && agentTicket && (() => {
            const info = { category: 'General IT', subcategory: 'User Support', ci: 'N/A', service: 'Internal IT', department: 'Corporate IT', location: 'HQ', phone: 'N/A', tags: ['it-support'], assignmentGroup: 'L1 Service Desk', assignedTo: 'Unassigned', escalationTier: 'L1' };
            const relatedTickets = {};
            const related = relatedTickets[agentTicket.id] || [];
            return (
              <div className="flex-1 overflow-y-auto bg-slate-50 p-5">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">

                  {/* Classification */}
                  <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Server className="w-3 h-3" /> Classification</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                      {[
                        { label: 'Category', value: info.category },
                        { label: 'Subcategory', value: info.subcategory },
                        { label: 'Configuration Item', value: info.ci },
                        { label: 'Affected Service', value: info.service },
                        { label: 'Priority', value: 'HIGH', color: 'text-orange-600 font-semibold' },
                        { label: 'Status', value: agentTicket.status, color: 'text-green-600' },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                          <p className={`text-sm font-semibold ${color || 'text-slate-700'}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Reporter</p>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">{agentTicket.email[0].toUpperCase()}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{agentTicket.email}</p>
                        <p className="text-sm text-slate-400">Employee</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Department', value: info.department },
                        { label: 'Location', value: info.location },
                        { label: 'Phone', value: info.phone },
                        { label: 'Opened', value: agentTicket.createdAt },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                          <p className="text-sm text-slate-700">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><UserCheck className="w-3 h-3" /> Assignment</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Assignment Group', value: info.assignmentGroup },
                        { label: 'Assigned To', value: info.assignedTo },
                        { label: 'Escalation Tier', value: info.escalationTier },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-sm font-semibold text-slate-700">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SLA */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Clock className="w-3 h-3" /> SLA Timings</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Response SLA', value: 'Completed', color: 'text-green-600 bg-green-50 border-green-100' },
                        { label: 'Resolution SLA', value: '4h remaining', color: 'text-orange-600 bg-orange-50 border-orange-100' },
                        { label: 'Business Elapsed', value: '1h 12m', color: 'text-slate-600 bg-slate-50 border-slate-100' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">{label}</span>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${color}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Tag className="w-3 h-3" /> AI-Generated Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {info.tags.map(tag => (
                        <span key={tag} className="text-sm bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Related Tickets */}
                  <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Link className="w-3 h-3" /> Related Records</p>
                    {related.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No related tickets found</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {related.map(r => (
                          <div key={r.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-sm font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{r.type}</span>
                            <span className="text-sm font-bold text-indigo-600">{r.id}</span>
                            <span className="text-sm text-slate-600">{r.label}</span>
                            <ExternalLink className="w-3 h-3 text-slate-300 ml-auto" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })()}


        </div>
      )}
    </div>
  );
};

// â"€â"€ Scenario library & matching helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const SCENARIO_LIBRARY = [
  {
    scenario: 'Email Notification Failure',
    sop: 'SOP-EMAIL-001',
    solution: '1. Verify email service configuration in admin panel\n2. Check SMTP relay settings and credentials\n3. Review spam filter rules that may block system emails\n4. Test email delivery with a manual trigger\n5. Confirm resolution by asking user to verify receipt',
  },
  {
    scenario: 'Dashboard / Visualization Issue',
    sop: 'SOP-DASH-002',
    solution: '1. Clear browser cache and reload the dashboard\n2. Verify data source connectivity and credentials\n3. Check if the issue occurred after a recent deployment\n4. Re-run the data pipeline or ETL job for the affected charts\n5. Confirm charts load correctly after data refresh',
  },
  {
    scenario: 'VPN / Remote Access Issue',
    sop: 'SOP-VPN-003',
    solution: '1. Confirm VPN client version is up to date\n2. Re-enter credentials and verify MFA is active\n3. Flush DNS and reset network adapter\n4. Test connectivity with alternate VPN endpoint\n5. Escalate to network team if issue persists',
  },
  {
    scenario: 'Application Login / SSO Failure',
    sop: 'SOP-AUTH-004',
    solution: '1. Verify user account is active in IAM/AD\n2. Reset password and clear cached credentials\n3. Check SSO provider status page for incidents\n4. Re-provision MFA device if needed\n5. Test login in incognito to rule out browser issues',
  },
  {
    scenario: 'Kubernetes Pod Failure / CrashLoopBackOff',
    sop: 'SOP-K8S-005',
    solution: '1. Run kubectl get pods -n <namespace> to identify failing pods\n2. Inspect logs with kubectl logs <pod-name> --previous to capture crash reason\n3. Check resource limits — OOMKilled indicates memory exhaustion; increase limits or optimize app\n4. Review recent deployments via kubectl rollout history and rollback if needed\n5. Verify ConfigMaps and Secrets referenced by the pod are present and correctly mounted\n6. Confirm node health with kubectl describe node and check for disk/memory pressure\n7. Re-deploy the affected workload and monitor pod restarts until stable',
  },
  {
    scenario: 'Snowflake Queue Congestion',
    sop: 'SOP-DW-006',
    solution: '1. Log into Snowflake console and check active query queue on TRANSFORM_WH\n2. Identify and terminate long-running or blocking queries using SYSTEM$CANCEL_QUERY\n3. Resize warehouse from Small to Medium to handle increased ETL load\n4. Enable multi-cluster auto-scaling with minimum 1 and maximum 3 clusters\n5. Stagger ETL job schedules to avoid concurrent warehouse saturation\n6. Monitor query queue depth and warehouse credit usage after changes\n7. Confirm data pipeline is running without delays and alert the reporter',
  },
  {
    scenario: 'Snowflake User Account Locked',
    sop: 'SOP-SF-007',
    solution: '1. Admin logs into Snowflake console and navigates to Admin -> Users & Roles\n2. Locate the locked user account and click "Unlock User" to restore access\n3. Reset the user\'s temporary password and communicate via secure IT channel\n4. Review INFORMATION_SCHEMA.LOGIN_HISTORY to identify failed authentication attempts and their source\n5. Verify MFA enforcement policy and IP allowlist configuration for the user role\n6. Confirm user can log in with new credentials from their browser and environment\n7. Update incident record and close ticket with resolution summary',
  },
];

const PAST_RESOLUTIONS = [
  {
    ticketRef: 't/23919',
    similarity: '94%',
    resolvedOn: '12 Mar 2026',
    keywords: ['email', 'notification', 'inbox', 'smtp', 'mail'],
    steps: '1. Updated SMTP relay configuration\n2. Whitelisted notification sender in spam filter\n3. Restarted email service daemon\n4. User confirmed emails received after fix',
    kbArticles: [
      { id: 'KB-3310', title: 'SMTP relay configuration and troubleshooting', tag: 'Email' },
      { id: 'KB-3287', title: 'Notification service architecture overview', tag: 'Platform' },
      { id: 'KB-3201', title: 'Spam filter whitelist management', tag: 'Email' },
    ],
  },
  {
    ticketRef: 'GSD-109',
    similarity: '88%',
    resolvedOn: '20 Mar 2026',
    keywords: ['dashboard', 'chart', 'blank', 'data', 'visualization', 'loading'],
    steps: '1. Identified broken data source connection post-migration\n2. Reconfigured database connection string\n3. Triggered manual ETL refresh\n4. All charts restored and verified',
    kbArticles: [
      { id: 'KB-2205', title: 'Data source connection string reference', tag: 'Database' },
      { id: 'KB-2188', title: 'ETL refresh procedures and scheduling', tag: 'Data' },
      { id: 'KB-2144', title: 'Dashboard blank screen diagnosis guide', tag: 'BI' },
    ],
  },
  {
    ticketRef: 'GSD-117',
    similarity: '91%',
    resolvedOn: '28 Mar 2026',
    keywords: ['vpn', 'remote', 'access', 'connect', 'network'],
    steps: '1. Updated VPN client to latest version\n2. Reconfigured endpoint settings\n3. Issued new authentication certificate\n4. Remote access confirmed stable',
    kbArticles: [
      { id: 'KB-1901', title: 'VPN client installation and upgrade guide', tag: 'Network' },
      { id: 'KB-1876', title: 'Certificate renewal for remote access', tag: 'Security' },
      { id: 'KB-1850', title: 'Remote access troubleshooting playbook', tag: 'Network' },
    ],
  },
  {
    ticketRef: 'GSD-112',
    similarity: '96%',
    resolvedOn: '1 Apr 2026',
    keywords: ['kubernetes', 'pod', 'crash', 'crashloopbackoff', 'container', 'kubectl', 'namespace', 'deployment', 'oomkilled', 'restart'],
    steps: '1. Identified OOMKilled error via kubectl logs --previous\n2. Increased memory limit from 512Mi to 1Gi in deployment spec\n3. Applied updated manifest with kubectl apply\n4. Verified pods reached Running state with 0 restarts\n5. Added HorizontalPodAutoscaler to prevent recurrence under load',
    kbArticles: [
      { id: 'KB-4421', title: 'Diagnosing OOMKilled containers in Kubernetes', tag: 'Memory' },
      { id: 'KB-4398', title: 'CrashLoopBackOff root cause analysis guide', tag: 'K8s' },
      { id: 'KB-4350', title: 'Rolling back Kubernetes deployments safely', tag: 'Deployment' },
    ],
  },
];

const ESCALATION_AGENTS = [
  { agent: 'Sarah Mitchell', department: 'L2 Infrastructure' },
  { agent: 'James Okafor', department: 'L2 Applications' },
  { agent: 'Priya Nair', department: 'L2 Platform Engineering' },
];

function matchScenario(description) {
  const lower = description.toLowerCase();
  const scored = SCENARIO_LIBRARY.map(s => {
    const keywords = s.scenario.toLowerCase().split(/\W+/);
    const hits = keywords.filter(k => k.length > 3 && lower.includes(k)).length;
    return { ...s, hits };
  });
  const best = scored.sort((a, b) => b.hits - a.hits)[0];
  return best?.hits > 0 ? best : null;
}

function matchPastResolution(text) {
  const lower = text.toLowerCase();
  const scored = PAST_RESOLUTIONS.map(r => {
    const hits = r.keywords.filter(k => lower.includes(k)).length;
    return { ...r, hits };
  });
  const best = scored.sort((a, b) => b.hits - a.hits)[0];
  return best?.hits > 0 ? best : null;
}

// â"€â"€ Root App component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
const App = () => {
  const [tickets, setTickets] = useState([]);
  const [thinkingTicketId, setThinkingTicketId] = useState(null);
  const [routingTicketId, setRoutingTicketId] = useState(null);

  const processAIEnrichment = (ticketId, description, skipEnrichmentCheck = false) => {
    const now = new Date().toLocaleTimeString();
    const scenario = matchScenario(description);
    const past = matchPastResolution(description);
    const wordCount = description.trim().split(/\s+/).length;

    if (!skipEnrichmentCheck && wordCount < 10) {
      // Ask for more context
      setTickets(prev => prev.map(t => t.id === ticketId ? {
        ...t,
        comments: [...t.comments, {
          author: 'AI Agent',
          role: 'bot',
          timestamp: now,
          missingFields: [
            { label: 'Affected System / URL' },
            { label: 'Steps to Reproduce' },
            { label: 'Error Message' },
          ],
        }],
      } : t));
      return;
    }

    // Trigger S3/S4 routing animation
    setRoutingTicketId(ticketId);

    const totalAnimTime = 7500 + S4_STEPS.length * 2000 + 1200;
    setTimeout(() => {
      const escalation = ESCALATION_AGENTS[Math.floor(Math.random() * ESCALATION_AGENTS.length)];
      const kbOnly = null;
      const ts = new Date().toLocaleTimeString();
      setTickets(prev => prev.map(t => t.id === ticketId ? {
        ...t,
        comments: [...t.comments, {
          author: 'AI Agent',
          role: 'bot',
          timestamp: ts,
          routedAfterEnrichment: true,
          matchedScenario: scenario || null,
          matchedPast: past ? { ticketRef: past.ticketRef, similarity: past.similarity, resolvedOn: past.resolvedOn, steps: past.steps, kbArticles: past.kbArticles || [] } : null,
          escalation: { agent: escalation.agent, department: escalation.department },
          solution: scenario?.solution || null,
          kbArticlesOnly: kbOnly?.articles || null,
          kbSteps: kbOnly?.steps || null,
          awaitingApproval: true,
        }],
      } : t));
      setRoutingTicketId(null);
    }, totalAnimTime);
  };

  return (
    <AgentView
      tickets={tickets}
      setTickets={setTickets}
      thinkingTicketId={thinkingTicketId}
      routingTicketId={routingTicketId}
      setThinkingTicketId={setThinkingTicketId}
      setRoutingTicketId={setRoutingTicketId}
      processAIEnrichment={processAIEnrichment}
      matchScenario={matchScenario}
      matchPastResolution={matchPastResolution}
      scenarioLibrary={SCENARIO_LIBRARY}
    />
  );
};

export default App;

