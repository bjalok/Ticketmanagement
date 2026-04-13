import React, { useState, useEffect } from 'react';
import {
  Search, Inbox, Cpu, Database,
  Zap, BookOpen, UserCheck, Check, Terminal, CheckCircle, Layers, Send,
  Tag, Link, Clock, AlertTriangle, Server, Phone, ExternalLink
} from 'lucide-react';

// ── Pre-existing sample tickets shown in agent queue ──────────────────────────
const GSD100_DUPLICATES = [
  { id: 'GSD-072', title: 'Speakeasy historical dashboard access – Listnr Adwords', confidence: 94 },
  { id: 'GSD-058', title: 'Dashboard access request – Speakeasy Listnr GCC', confidence: 91 },
  { id: 'GSD-083', title: 'Cannot access Speakeasy reports – Cognizant Gurgaon', confidence: 88 },
  { id: 'GSD-041', title: 'Access issue historical dashboard Adwords GCC', confidence: 85 },
  { id: 'GSD-067', title: 'Speakeasy dashboard permission denied – contact-center', confidence: 82 },
];

const SAMPLE_TICKETS = [
  {
    id: 'GSD-100',
    email: 'user@cognizant.com',
    description: 'Dashboard Issue',
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
        text: 'its access related issue\nI am looking at Speakeasy historical Dashboard related to Listnr\nThis is from Adwords GCC at Cognizant Gurgaon',
      },
    ],
  },
  {
    id: 'GSD-101',
    email: 'user@cognizant.com',
    description: 'Duplicate verint profile',
    status: 'Open',
    createdAt: '13 Apr 2026, 9:15 AM',
    hasUpdate: true,
    isSample: true,
    comments: [
      {
        author: 'AI Agent',
        role: 'bot',
        timestamp: '9:16 AM',
        missingFields: [
          { label: 'Affected agent email / employee ID' },
          { label: 'Profile to keep active' },
          { label: 'Single or multiple agents affected' },
          { label: 'Project & site location' },
        ],
        enrichmentQuestions: [
          { field: 'Affected agent email or employee ID', detail: 'Could you provide the affected agent\'s email address or employee ID?' },
          { field: 'Profile to keep active', detail: 'Which profile should be kept active?' },
          { field: 'Single or multiple agents affected', detail: 'Is this affecting a single agent or multiple agents?' },
          { field: 'Project & site location', detail: 'Please provide the project and site location.' },
        ],
      },
      {
        author: 'user@cognizant.com',
        role: 'user',
        timestamp: '9:20 AM',
        text: 'email id : jow@companty.com\nkeep ID 12324 active and remove 1234-A\nit is just single agent\nYoutube Paid Product support at MNL site',
      },
    ],
  },
  {
    id: 'GSD-103',
    email: 'ashi@company.com',
    description: 'unable to update ashi@company.com',
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
    id: 'GSD-103',
    email: 'ashi@company.com',
    description: 'unable to update ashi@company.com',
    status: 'Open',
    createdAt: '13 Apr 2026, 10:30 AM',
    hasUpdate: true,
    isSample: true,
    comments: [
      {
        author: 'AI Agent',
        role: 'bot',
        timestamp: '10:31 AM',
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
        timestamp: '10:38 AM',
        text: 'I am trying to create new profile\nthis is just one agent slivester@company.com\nthere is no error code\nthis is for CPS program',
      },
    ],
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
  'Connecting to resolution knowledge base…',
  'Embedding incident context…',
  'Computing similarity scores…',
  'Ranking top historical matches…',
  'Querying KB article index…',
  'Linking related knowledge base articles…',
];

const CTI_STEPS = [
  'Parsing ticket summary and reporter context…',
  'Tokenising key phrases from user reply…',
  'Matching against CTI taxonomy database…',
  'Scoring category confidence across contact-center classes…',
  'Cross-referencing program and site metadata…',
  'Validating CTI triple against historical ticket corpus…',
  'Finalising category, type, and item classification…',
];
const GSD100_DUP_STEPS = [
  'Scanning active incident queue for similar issues…',
  'Embedding ticket description for semantic similarity…',
  'Comparing against open tickets (last 90 days)…',
  'Querying resolved ticket history…',
  'Computing cosine similarity scores across corpus…',
  'Applying 80% confidence threshold filter…',
  'Ranking top candidates by similarity score…',
];
const GSD100_REC_STEPS = [
  'Loading similar ticket corpus from vector store…',
  'Fetching GSD-072 (94% match) from incident archive…',
  'Extracting resolution transcript from GSD-072…',
  'Parsing resolution steps from closed ticket…',
  'Mapping steps to current ticket context…',
  'Validating resolution applicability…',
];
const GSD100_REC_RESOLUTION = [
  "Verify user's Speakeasy access role in admin panel under Accounts → Permissions.",
  'Submit access grant request to Speakeasy admin at speakeasy-admin@internal with ticket reference.',
  'Confirm dashboard URL with user after access is granted (Speakeasy → Reports → Historical).',
  'Add user to the Listnr Adwords GCC distribution group for ongoing access.',
];
const GSD100_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CTI match…',
  'Matching CTI: contact-center / Speakeasy historical dashboard / access…',
  'Locating SOP for Speakeasy historical dashboard access requests…',
  'Retrieving RUNBOOK-CC-047 from knowledge base…',
  'Validating runbook version and current applicability…',
];
const GSD100_RUNBOOK_RESOLUTION = [
  'Confirm user identity and site: Cognizant Gurgaon – Adwords GCC (verified via context).',
  'Log access request in Speakeasy admin portal → Contact: speakeasy-support@internal.',
  'Assign dashboard role: viewer_historical via Admin → Role Assignment panel.',
  'Notify user once role is propagated (typically 15–30 min after assignment).',
  'Verify access: ask user to navigate Speakeasy → Reports → Historical Dashboard.',
];
const GSD100_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for Speakeasy dashboard entries…',
  'Checking error-code catalogue for access-related entries…',
  'Scanning step-by-step guides for dashboard permission issues…',
  'Cross-referencing troubleshoot tags: contact-center, dashboard, access…',
];
const GSD101_REC_STEPS = [
  'Loading similar ticket corpus from vector store…',
  'Fetching GSD-089 (87% match) from incident archive…',
  'Extracting resolution transcript from GSD-089…',
  'Parsing resolution steps from closed ticket…',
  'Mapping steps to current ticket context…',
  'Validating resolution applicability…',
];
const GSD101_REC_RESOLUTION = [
  'Identify duplicate Verint profiles for the agent (jow@companty.com) in admin console.',
  'Deactivate profile 1234-A in Verint admin → User Management → Set status: Inactive.',
  'Confirm profile 12324 remains active with correct role and schedule assignments.',
  'Notify agent and team lead once the duplicate profile is removed and verified.',
];
const GSD101_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CTI match…',
  'Matching CTI: contact-center / wfm-verint / others…',
  'Searching SOP index for Verint duplicate profile resolution…',
  'Scanning RUNBOOK-WFM-* entries for profile management procedures…',
  'Validating runbook coverage for this issue type…',
];
const GSD101_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for Verint profile issues…',
  'Checking error-code catalogue for duplicate profile entries…',
  'Scanning step-by-step guides for WFM profile management…',
  'Cross-referencing troubleshoot tags: wfm-verint, profile, duplicate…',
];
const GSD101_TROUBLESHOOT_RESOLUTION = [
  'Log in to Verint WFM admin console with admin credentials.',
  'Navigate to User Management → search agent by email: jow@companty.com.',
  'Identify both profiles (12324 and 1234-A) and confirm which is the active one.',
  'Select profile 1234-A → set status to Inactive → Save changes.',
  'Verify profile 12324 retains all schedule and adherence history.',
  'Confirm fix with the agent and close the ticket once verified.',
];
const GSD101_DUP_STEPS = [
  'Scanning active incident queue for similar issues…',
  'Embedding ticket description for semantic similarity…',
  'Comparing against open tickets (last 90 days)…',
  'Querying resolved ticket history for Verint profile issues…',
  'Computing cosine similarity scores across corpus…',
  'Applying 80% confidence threshold filter…',
  'No tickets found above confidence threshold…',
];
const GSD103_DUP_STEPS = [
  'Scanning active incident queue for similar issues…',
  'Embedding ticket description for semantic similarity…',
  'Comparing against open tickets (last 90 days)…',
  'Querying resolved ticket history for Verint profile issues…',
  'Computing cosine similarity scores across corpus…',
  'Applying 80% confidence threshold filter…',
  'No tickets found above confidence threshold…',
];
const GSD103_REC_STEPS = [
  'Loading similar ticket corpus from vector store…',
  'Fetching GSD-076 (91% match) from incident archive…',
  'Extracting resolution transcript from GSD-076…',
  'Parsing resolution steps from closed ticket…',
  'Mapping steps to current ticket context…',
  'Validating resolution applicability…',
];
const GSD103_REC_RESOLUTION = [
  'Log in to Verint WFM admin console with admin credentials.',
  'Navigate to User Management → New Profile and enter agent details: slivester@company.com.',
  'Assign the correct program: CPS, and set site and role permissions accordingly.',
  'Save the new profile and verify login access for the agent.',
  'Notify the requester (ashi@company.com) once the profile is active.',
];
const GSD103_RUNBOOK_STEPS = [
  'Querying scenario runbook library for CTI match…',
  'Matching CTI: contact-center / wfm-verint / create new profile…',
  'Locating SOP for Verint new agent profile creation…',
  'Retrieving RUNBOOK-WFM-012 from knowledge base…',
  'Validating runbook version and current applicability…',
];
const GSD103_RUNBOOK_RESOLUTION = [
  'Confirm agent details: name, email (slivester@company.com), program (CPS), and site.',
  'Log in to Verint WFM admin portal → User Management → Create New User.',
  'Fill in required fields: email, program assignment (CPS), role, and site location.',
  'Set initial password and send credentials via secure IT channel.',
  'Verify profile creation by searching agent email in User Management.',
  'Notify requesting supervisor/admin once profile is active and accessible.',
];
const GSD103_TROUBLESHOOT_STEPS = [
  'Searching troubleshoot guide index for Verint profile creation issues…',
  'Checking error-code catalogue for new profile creation failures…',
  'Scanning step-by-step guides for WFM user provisioning…',
  'Cross-referencing troubleshoot tags: wfm-verint, create-profile, CPS…',
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
  const [gsd100CommentUpdated, setGsd100CommentUpdated] = useState(false);
  const [gsd100RecSteps, setGsd100RecSteps] = useState([]);
  const [gsd100RecDone, setGsd100RecDone] = useState(false);
  const [gsd100RunbookSteps, setGsd100RunbookSteps] = useState([]);
  const [gsd100RunbookDone, setGsd100RunbookDone] = useState(false);
  const [gsd100TroubleshootSteps, setGsd100TroubleshootSteps] = useState([]);
  const [gsd100TroubleshootDone, setGsd100TroubleshootDone] = useState(false);
  const [gsd101CtiSteps, setGsd101CtiSteps] = useState([]);
  const [gsd101CtiDone, setGsd101CtiDone] = useState(false);
  const [gsd101DupSteps, setGsd101DupSteps] = useState([]);
  const [gsd101DupDone, setGsd101DupDone] = useState(false);
  const [gsd101CommentUpdated, setGsd101CommentUpdated] = useState(false);
  const [gsd101RecSteps, setGsd101RecSteps] = useState([]);
  const [gsd101RecDone, setGsd101RecDone] = useState(false);
  const [gsd101RunbookSteps, setGsd101RunbookSteps] = useState([]);
  const [gsd101RunbookDone, setGsd101RunbookDone] = useState(false);
  const [gsd101TroubleshootSteps, setGsd101TroubleshootSteps] = useState([]);
  const [gsd101TroubleshootDone, setGsd101TroubleshootDone] = useState(false);
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

  // Combine sample tickets + real tickets; real tickets override sample if same ID
  const ticketMap = new Map();
  SAMPLE_TICKETS.forEach(t => ticketMap.set(t.id, t));
  tickets.forEach(t => ticketMap.set(t.id, t)); // real state wins
  const allQueueTickets = Array.from(ticketMap.values());
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

  // GSD-100 CTI + duplicate animation
  useEffect(() => {
    if (agentSelectedTicketId !== 'GSD-100') return;
    setGsd100CtiSteps([]);
    setGsd100CtiDone(false);
    setGsd100DupSteps([]);
    setGsd100DupDone(false);
    setGsd100CommentUpdated(false);
    setGsd100RecSteps([]);
    setGsd100RecDone(false);
    setGsd100RunbookSteps([]);
    setGsd100RunbookDone(false);
    setGsd100TroubleshootSteps([]);
    setGsd100TroubleshootDone(false);
    const timers = [];
    CTI_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100CtiSteps(prev => [...prev, step]), 400 + i * 900));
    });
    const ctiDoneAt = 400 + CTI_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd100CtiDone(true), ctiDoneAt));
    const dupStart = ctiDoneAt + 600;
    GSD100_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100DupSteps(prev => [...prev, step]), dupStart + i * 900));
    });
    const dupDoneAt = dupStart + GSD100_DUP_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd100DupDone(true), dupDoneAt));
    // Recommendation Agent — similar ticket search
    const recStart = dupDoneAt + 3500;
    GSD100_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + GSD100_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd100RecDone(true), recDoneAt));
    // Runbook search
    const runbookStart = recDoneAt + 800;
    GSD100_RUNBOOK_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100RunbookSteps(prev => [...prev, step]), runbookStart + i * 700));
    });
    const runbookDoneAt = runbookStart + GSD100_RUNBOOK_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd100RunbookDone(true), runbookDoneAt));
    // Troubleshoot guide search
    const troubleshootStart = runbookDoneAt + 800;
    GSD100_TROUBLESHOOT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100TroubleshootSteps(prev => [...prev, step]), troubleshootStart + i * 700));
    });
    timers.push(setTimeout(() => setGsd100TroubleshootDone(true), troubleshootStart + GSD100_TROUBLESHOOT_STEPS.length * 700));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // GSD-101 CTI + duplicate animation
  useEffect(() => {
    if (agentSelectedTicketId !== 'GSD-101') return;
    setGsd101CtiSteps([]);
    setGsd101CtiDone(false);
    setGsd101DupSteps([]);
    setGsd101DupDone(false);
    setGsd101CommentUpdated(false);
    setGsd101RecSteps([]);
    setGsd101RecDone(false);
    setGsd101RunbookSteps([]);
    setGsd101RunbookDone(false);
    setGsd101TroubleshootSteps([]);
    setGsd101TroubleshootDone(false);
    const timers = [];
    CTI_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd101CtiSteps(prev => [...prev, step]), 400 + i * 900));
    });
    const ctiDoneAt = 400 + CTI_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd101CtiDone(true), ctiDoneAt));
    const dupStart = ctiDoneAt + 600;
    GSD101_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd101DupSteps(prev => [...prev, step]), dupStart + i * 900));
    });
    const dupDoneAt = dupStart + GSD101_DUP_STEPS.length * 900;
    timers.push(setTimeout(() => setGsd101DupDone(true), dupDoneAt));
    // Recommendation Agent
    const recStart = dupDoneAt + 3500;
    GSD101_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd101RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + GSD101_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd101RecDone(true), recDoneAt));
    const runbookStart = recDoneAt + 800;
    GSD101_RUNBOOK_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd101RunbookSteps(prev => [...prev, step]), runbookStart + i * 700));
    });
    const runbookDoneAt = runbookStart + GSD101_RUNBOOK_STEPS.length * 700;
    timers.push(setTimeout(() => setGsd101RunbookDone(true), runbookDoneAt));
    const troubleshootStart = runbookDoneAt + 800;
    GSD101_TROUBLESHOOT_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd101TroubleshootSteps(prev => [...prev, step]), troubleshootStart + i * 700));
    });
    timers.push(setTimeout(() => setGsd101TroubleshootDone(true), troubleshootStart + GSD101_TROUBLESHOOT_STEPS.length * 700));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // GSD-103 CTI + duplicate + recommendation animation
  useEffect(() => {
    if (agentSelectedTicketId !== 'GSD-103') return;
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
    CTI_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd103CtiSteps(prev => [...prev, step]), 400 + i * 900));
    });
    const ctiDoneAt = 400 + CTI_STEPS.length * 900;
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
    const comment = ticket?.comments[commentIdx];
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
      <div className="w-60 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2.5">
            <Inbox className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Queue</span>
            <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">{filteredQueue.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-indigo-300"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Inbox className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs italic text-center">No tickets in queue</p>
            </div>
          ) : filteredQueue.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setAgentSelectedTicketId(t.id);
                setAgentActiveTab('Overview');
                const hasBeenRouted = t.comments && t.comments.some(c => c.routedAfterEnrichment);
                if (!hasBeenRouted && t.id !== 'GSD-100' && t.id !== 'GSD-101' && t.id !== 'GSD-103') {
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
                <span className="text-[10px] font-bold text-indigo-600">{t.id}</span>
                <div className="flex items-center gap-1">
                  {t.hasUpdate && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-bold border border-blue-100">Open</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">{t.description}</p>
              <p className="text-[10px] text-slate-400 mt-1">{t.createdAt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {!agentTicket ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
          <Layers className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-sm font-semibold">Select a ticket from the queue</p>
          <p className="text-xs mt-1 opacity-70">AI agent pipeline · SOP matching · resolution recommendations</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Ticket Title Bar */}
          <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-start gap-4 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-indigo-600">{agentTicket.id}</span>
                <span className="text-[10px] text-slate-400">{agentTicket.createdAt}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{agentTicket.description}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-slate-200 px-5 flex gap-1 flex-shrink-0">
            {['Overview', 'Details'].map(tab => (
              <button
                key={tab}
                onClick={() => setAgentActiveTab(tab)}
                className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${agentActiveTab === tab ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Summary</p>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3 mb-4">{agentTicket.description}</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                    <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Number</p><p className="text-xs font-semibold text-indigo-600 mt-0.5">{agentTicket.id}</p></div>
                    <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Priority</p><p className="text-xs font-semibold text-orange-600 mt-0.5">2 – High</p></div>
                    <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Opened</p><p className="text-xs text-slate-600 mt-0.5">{agentTicket.createdAt}</p></div>
                    <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">State</p><p className="text-xs font-semibold text-green-600 mt-0.5">{agentTicket.status}</p></div>
                    <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Impact</p><p className="text-xs text-slate-600 mt-0.5">3 – Low</p></div>
                    <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Urgency</p><p className="text-xs text-slate-600 mt-0.5">2 – High</p></div>
                  </div>
                </div>
                <div className="p-4 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Caller</p>
                  {(() => {
                    const callerMap = {
                      'GSD-100': 'Rahul Sharma',
                      'GSD-101': 'Priya Menon',
                      'GSD-103': 'Ashi Verma',
                    };
                    const callerName = callerMap[agentTicket.id] || agentTicket.email;
                    return (
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">{callerName[0].toUpperCase()}</div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{callerName}</p>
                          <p className="text-[10px] text-slate-400">Employee</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Assigned To</p>
                  {(() => {
                    const assigneeMap = {
                      'GSD-100': { agent: 'Shivam Gupta', department: 'L1 Contact Center Support' },
                      'GSD-101': { agent: 'Ankit Rawat', department: 'L2 WFM Operations' },
                      'GSD-103': { agent: 'Neha Joshi', department: 'L2 WFM Operations' },
                    };
                    const assignee = assigneeMap[agentTicket.id];
                    if (!assignee) return <p className="text-xs text-slate-400 italic">Unassigned</p>;
                    return (
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                          {assignee.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{assignee.agent}</p>
                          <p className="text-[10px] text-indigo-500 font-medium">{assignee.department}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Col 2: AI Agent Pipeline */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">AI Agent Pipeline</p>
                <div className="space-y-3 max-w-2xl">

                  {/* S1 Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Agent</span>
                            <p className="text-xs font-bold text-slate-800">Context Enrichment</p>
                          </div>
                          {isThinking ? (
                            <span className="flex items-center gap-1.5 text-[10px] text-blue-500 font-medium">Analyzing <ThinkingDots /></span>
                          ) : pipeline?.enrichment ? (() => {
                            const enrichmentIdx = agentComments.indexOf(pipeline.enrichment);
                            const hasReply = agentComments.some((c, i) => c.role === 'user' && i > enrichmentIdx);
                            return hasReply
                              ? <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Context Provided</span>
                              : <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Enrichment Needed</span>;
                          })() : (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Complete</span>
                          )}
                        </div>
                        {pipeline?.enrichment && !isThinking ? (() => {
                          const enrichmentIdx = agentComments.indexOf(pipeline.enrichment);
                          const reporterReply = agentComments.find((c, i) => c.role === 'user' && i > enrichmentIdx);
                          const enrichmentResolved = !!(reporterReply);
                          const hasDetailedQuestions = pipeline.enrichment.enrichmentQuestions?.length > 0;
                          return (
                            <div className="mt-2 space-y-2">
                              <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-100">
                                {hasDetailedQuestions ? (
                                  <>
                                    <p className="text-[10px] font-bold text-orange-600 mb-1.5">Required Details Missing</p>
                                    <div className="flex flex-wrap gap-1">
                                      {pipeline.enrichment.enrichmentQuestions.map((q, i) => (
                                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${enrichmentResolved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-orange-700 border-orange-200'}`}>
                                          {enrichmentResolved && <CheckCircle className="w-2.5 h-2.5" />}{q.field}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-[10px] font-bold text-orange-600 mb-1.5">Missing fields requested from requester:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {pipeline.enrichment.missingFields.map((f, i) => (
                                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${enrichmentResolved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-orange-700 border-orange-200'}`}>
                                          {enrichmentResolved && <CheckCircle className="w-2.5 h-2.5" />}{f.label}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                              {enrichmentResolved && reporterReply && (
                                <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                                  <p className="text-[10px] font-bold text-blue-600 mb-1">Context provided by reporter:</p>
                                  <p className="text-[11px] text-slate-700 leading-relaxed italic whitespace-pre-wrap">"{reporterReply.text}"</p>
                                </div>
                              )}
                              {/* GSD-100: CTI detection + duplicate identification */}
                              {agentTicket.id === 'GSD-100' && enrichmentResolved && gsd100CtiSteps.length > 0 && (
                                <div className="space-y-2">
                                  {/* CTI Section */}
                                  <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-[10px] font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                      {!gsd100CtiDone ? (
                                        <span className="flex items-center gap-1 text-[10px] text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                      ) : (
                                        <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>
                                      )}
                                    </div>
                                    <div className="space-y-1 font-mono">
                                      {gsd100CtiSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                          <span className="text-violet-400">›</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {gsd100CtiDone && (
                                      <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                          <p className="text-[10px] font-semibold text-slate-700">contact-center</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                          <p className="text-[10px] font-semibold text-slate-700">Speakeasy historical dashboard</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                          <p className="text-[10px] font-semibold text-slate-700">access</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {/* Duplicate Identification Section */}
                                  {gsd100DupSteps.length > 0 && (
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-bold text-slate-600">Identifying Duplicates</p>
                                        {!gsd100DupDone ? (
                                          <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                        ) : (
                                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> 5 found</span>
                                        )}
                                      </div>
                                      <div className="space-y-1 font-mono">
                                        {gsd100DupSteps.map((step, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                            <span className="text-slate-400">›</span>
                                            <span>{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {gsd100DupDone && (
                                        <>
                                          <div className="mt-2 pt-2 border-t border-slate-200 space-y-1.5">
                                            {GSD100_DUPLICATES.map((dup, i) => (
                                              <div key={i} className="flex items-center justify-between gap-2 text-[10px]">
                                                <div className="flex items-center gap-2 min-w-0">
                                                  <span className="font-mono font-bold text-indigo-600 flex-shrink-0">{dup.id}</span>
                                                  <span className="text-slate-600 truncate">{dup.title}</span>
                                                </div>
                                                <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] flex-shrink-0 ${dup.confidence >= 90 ? 'bg-red-100 text-red-700' : dup.confidence >= 85 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                  {dup.confidence}%
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                          {!gsd100CommentUpdated ? (
                                            <button
                                              onClick={() => setGsd100CommentUpdated(true)}
                                              className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                            >
                                              <CheckCircle className="w-3 h-3" /> Update Changes in Ticket
                                            </button>
                                          ) : (
                                            <div className="mt-3 flex items-center gap-2 text-[10px] text-green-700 bg-green-50 rounded-lg p-2 border border-green-100">
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
                              {/* GSD-103: CTI detection + duplicate identification */}
                              {agentTicket.id === 'GSD-103' && enrichmentResolved && gsd103CtiSteps.length > 0 && (
                                <div className="space-y-2">
                                  {/* CTI Section */}
                                  <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-[10px] font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                      {!gsd103CtiDone
                                        ? <span className="flex items-center gap-1 text-[10px] text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                        : <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>}
                                    </div>
                                    <div className="space-y-1 font-mono">
                                      {gsd103CtiSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                          <span className="text-violet-400">›</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {gsd103CtiDone && (
                                      <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                          <p className="text-[10px] font-semibold text-slate-700">contact-center</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                          <p className="text-[10px] font-semibold text-slate-700">wfm-verint</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                          <p className="text-[10px] font-semibold text-slate-700">create new profile</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {/* Duplicate Identification Section */}
                                  {gsd103DupSteps.length > 0 && (
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-bold text-slate-600">Identifying Duplicates</p>
                                        {!gsd103DupDone
                                          ? <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                          : <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No duplicates</span>}
                                      </div>
                                      <div className="space-y-1 font-mono">
                                        {gsd103DupSteps.map((step, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                            <span className="text-slate-400">›</span>
                                            <span>{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {gsd103DupDone && (
                                        <>
                                          <div className="mt-2 pt-2 border-t border-slate-200">
                                            <p className="text-[10px] text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                          </div>
                                          {!gsd103CommentUpdated ? (
                                            <button
                                              onClick={() => setGsd103CommentUpdated(true)}
                                              className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                            >
                                              <CheckCircle className="w-3 h-3" /> Update Changes in Ticket
                                            </button>
                                          ) : (
                                            <div className="mt-3 flex items-center gap-2 text-[10px] text-green-700 bg-green-50 rounded-lg p-2 border border-green-100">
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
                              {/* GSD-101: CTI detection + duplicate identification */}
                              {agentTicket.id === 'GSD-101' && enrichmentResolved && gsd101CtiSteps.length > 0 && (
                                <div className="space-y-2">
                                  {/* CTI Section */}
                                  <div className="p-2.5 bg-violet-50 rounded-lg border border-violet-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-[10px] font-bold text-violet-700">Determining CTI (Category, Type, Item)</p>
                                      {!gsd101CtiDone
                                        ? <span className="flex items-center gap-1 text-[10px] text-violet-500 font-medium">Analysing <ThinkingDots /></span>
                                        : <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Detected</span>}
                                    </div>
                                    <div className="space-y-1 font-mono">
                                      {gsd101CtiSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                          <span className="text-violet-400">›</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {gsd101CtiDone && (
                                      <div className="mt-2 pt-2 border-t border-violet-100 grid grid-cols-3 gap-2">
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Category</p>
                                          <p className="text-[10px] font-semibold text-slate-700">contact-center</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Type</p>
                                          <p className="text-[10px] font-semibold text-slate-700">wfm-verint</p>
                                        </div>
                                        <div>
                                          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-wider mb-0.5">Item</p>
                                          <p className="text-[10px] font-semibold text-slate-700">others</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {/* Duplicate Identification Section */}
                                  {gsd101DupSteps.length > 0 && (
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-bold text-slate-600">Identifying Duplicates</p>
                                        {!gsd101DupDone
                                          ? <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                          : <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No duplicates</span>}
                                      </div>
                                      <div className="space-y-1 font-mono">
                                        {gsd101DupSteps.map((step, i) => (
                                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                            <span className="text-slate-400">›</span>
                                            <span>{step}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {gsd101DupDone && (
                                        <>
                                          <div className="mt-2 pt-2 border-t border-slate-200">
                                            <p className="text-[10px] text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                          </div>
                                          {!gsd101CommentUpdated ? (
                                            <button
                                              onClick={() => setGsd101CommentUpdated(true)}
                                              className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                            >
                                              <CheckCircle className="w-3 h-3" /> Update Changes in Ticket
                                            </button>
                                          ) : (
                                            <div className="mt-3 flex items-center gap-2 text-[10px] text-green-700 bg-green-50 rounded-lg p-2 border border-green-100">
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
                        })() : !isThinking && (
                          <p className="text-[11px] text-slate-500 mt-0.5">All required context fields present. Ticket routed to resolution agents.</p>
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
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Agent</span>
                            <p className="text-xs font-bold text-slate-800">Recommendation Agent</p>
                          </div>
                          {(() => {
                            const isRouting = routingTicketId === agentSelectedTicketId;
                            if (isThinking || isRouting) return <span className="flex items-center gap-1.5 text-[10px] text-blue-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 'GSD-100' && gsd100TroubleshootDone) return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 'GSD-100' && gsd100DupDone) return <span className="flex items-center gap-1.5 text-[10px] text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 'GSD-101' && gsd101TroubleshootDone) return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 'GSD-101' && gsd101DupDone) return <span className="flex items-center gap-1.5 text-[10px] text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 'GSD-103' && gsd103TroubleshootDone) return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 'GSD-103' && gsd103DupDone) return <span className="flex items-center gap-1.5 text-[10px] text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (pipeline?.historicalMatch) return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Match Found</span>;
                            if (pipeline?.isDuplicateOf) return <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">Skipped</span>;
                            if (pipeline?.kbArticlesOnly) return <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1"><BookOpen className="w-3 h-3" /> KB Articles Found</span>;
                            if (s4Done || pipeline) return <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">No Match</span>;
                            return null;
                          })()}
                        </div>
                        {routingTicketId === agentSelectedTicketId && s4Steps.length > 0 && (
                          <div className="mt-2 space-y-1 font-mono">
                            {s4Steps.map((step, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                <span className="text-amber-400">›</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* GSD-100 Recommendation Agent — similar ticket, runbook, troubleshoot */}
                        {agentTicket?.id === 'GSD-100' && gsd100RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            {/* Similar Ticket Resolution */}
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-bold text-amber-700">Resolution from Similar Ticket (GSD-072 · 94% match)</p>
                                {!gsd100RecDone
                                  ? <span className="flex items-center gap-1 text-[10px] text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd100RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <span className="text-amber-400">›</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {gsd100RecDone && (
                                <div className="mt-2 pt-2 border-t border-amber-200">
                                  <p className="text-[10px] font-bold text-amber-800 mb-1.5">Resolution Steps (from GSD-072):</p>
                                  <div className="space-y-1.5">
                                    {GSD100_REC_RESOLUTION.map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-[10px] text-slate-700">
                                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-[9px] flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
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
                                  <p className="text-[10px] font-bold text-blue-700">Scenario Runbook (RUNBOOK-CC-047)</p>
                                  {!gsd100RunbookDone
                                    ? <span className="flex items-center gap-1 text-[10px] text-blue-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd100RunbookSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                      <span className="text-blue-400">›</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd100RunbookDone && (
                                  <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="text-[10px] font-bold text-blue-800 mb-1.5">Resolution Steps (RUNBOOK-CC-047):</p>
                                    <div className="space-y-1.5">
                                      {GSD100_RUNBOOK_RESOLUTION.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[10px] text-slate-700">
                                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
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
                                  <p className="text-[10px] font-bold text-slate-600">Troubleshoot Guide</p>
                                  {!gsd100TroubleshootDone
                                    ? <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-slate-400" /> No Steps Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd100TroubleshootSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                      <span className="text-slate-400">›</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd100TroubleshootDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-[11px] text-slate-500 font-medium">No troubleshoot guide steps found for this issue type.</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Refer to similar ticket resolution or runbook steps above.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* GSD-101 Recommendation Agent — similar ticket, runbook (no steps), troubleshoot */}
                        {agentTicket?.id === 'GSD-101' && gsd101RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            {/* Similar Ticket Resolution */}
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-bold text-amber-700">Resolution from Similar Ticket (GSD-089 · 87% match)</p>
                                {!gsd101RecDone
                                  ? <span className="flex items-center gap-1 text-[10px] text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd101RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <span className="text-amber-400">›</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {gsd101RecDone && (
                                <div className="mt-2 pt-2 border-t border-amber-200">
                                  <p className="text-[10px] font-bold text-amber-800 mb-1.5">Resolution Steps (from GSD-089):</p>
                                  <div className="space-y-1.5">
                                    {GSD101_REC_RESOLUTION.map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-[10px] text-slate-700">
                                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-[9px] flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Scenario Runbook — no steps found */}
                            {gsd101RunbookSteps.length > 0 && (
                              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-[10px] font-bold text-slate-600">Scenario Runbook</p>
                                  {!gsd101RunbookDone
                                    ? <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No Steps Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd101RunbookSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                      <span className="text-slate-400">›</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd101RunbookDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-[11px] text-slate-500 font-medium">No resolution steps found in scenario runbook for this issue type.</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Refer to similar ticket resolution or troubleshoot guide below.</p>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Troubleshoot Guide — steps found */}
                            {gsd101TroubleshootSteps.length > 0 && (
                              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-[10px] font-bold text-blue-700">Troubleshoot Guide</p>
                                  {!gsd101TroubleshootDone
                                    ? <span className="flex items-center gap-1 text-[10px] text-blue-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Steps Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd101TroubleshootSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                      <span className="text-blue-400">›</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd101TroubleshootDone && (
                                  <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="text-[10px] font-bold text-blue-800 mb-1.5">Troubleshoot Guide Steps:</p>
                                    <div className="space-y-1.5">
                                      {GSD101_TROUBLESHOOT_RESOLUTION.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[10px] text-slate-700">
                                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                          <span>{step}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* GSD-103 Recommendation Agent — similar ticket, runbook (found), troubleshoot (no steps) */}
                        {agentTicket?.id === 'GSD-103' && gsd103RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            {/* Similar Ticket Resolution */}
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-bold text-amber-700">Resolution from Similar Ticket (GSD-076 · 91% match)</p>
                                {!gsd103RecDone
                                  ? <span className="flex items-center gap-1 text-[10px] text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd103RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <span className="text-amber-400">›</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {gsd103RecDone && (
                                <div className="mt-2 pt-2 border-t border-amber-200">
                                  <p className="text-[10px] font-bold text-amber-800 mb-1.5">Resolution Steps (from GSD-076):</p>
                                  <div className="space-y-1.5">
                                    {GSD103_REC_RESOLUTION.map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-[10px] text-slate-700">
                                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold text-[9px] flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
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
                                  <p className="text-[10px] font-bold text-blue-700">Scenario Runbook (RUNBOOK-WFM-012)</p>
                                  {!gsd103RunbookDone
                                    ? <span className="flex items-center gap-1 text-[10px] text-blue-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd103RunbookSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                      <span className="text-blue-400">›</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd103RunbookDone && (
                                  <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="text-[10px] font-bold text-blue-800 mb-1.5">Resolution Steps (RUNBOOK-WFM-012):</p>
                                    <div className="space-y-1.5">
                                      {GSD103_RUNBOOK_RESOLUTION.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[10px] text-slate-700">
                                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
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
                                  <p className="text-[10px] font-bold text-slate-600">Troubleshoot Guide</p>
                                  {!gsd103TroubleshootDone
                                    ? <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">Searching <ThinkingDots /></span>
                                    : <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-slate-400" /> No Steps Found</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {gsd103TroubleshootSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                      <span className="text-slate-400">›</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {gsd103TroubleshootDone && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-[11px] text-slate-500 font-medium">Could not find any resolution steps in the troubleshoot guide for this issue type.</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Refer to similar ticket resolution or runbook steps above.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {agentTicket?.id !== 'GSD-100' && agentTicket?.id !== 'GSD-101' && agentTicket?.id !== 'GSD-103' && !isThinking && routingTicketId !== agentSelectedTicketId && (
                          pipeline?.isDuplicateOf ? (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-[11px] text-slate-500">Analysis skipped — this is a duplicate ticket.</p>
                              <p className="text-[11px] text-slate-600 mt-1">Refer to <span className="font-bold text-indigo-600">{pipeline.isDuplicateOf}</span> for historical match and resolution recommendation.</p>
                            </div>
                          ) : pipeline?.historicalMatch ? (
                            <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                              {s4Done && (
                                <div className="mb-1.5 space-y-0.5 font-mono">
                                  {S4_STEPS.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                      <Check className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-1.5 pt-1.5 border-t border-amber-100">
                                <p className="text-[11px] font-bold text-amber-800">{pipeline.historicalMatch.pastResolution.ticketRef}</p>
                                <p className="text-[10px] text-amber-600 mt-0.5">Resolved {pipeline.historicalMatch.pastResolution.resolvedOn} · {pipeline.historicalMatch.pastResolution.similarity} similarity</p>
                                {ragResolutionText && <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap mt-2 pt-2 border-t border-amber-100">{ragResolutionText}</p>}
                                {pipeline.historicalMatch.pastResolution.kbArticles?.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-amber-100">
                                    <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mb-1.5 flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> Related KB Articles</p>
                                    <div className="space-y-1">
                                      {pipeline.historicalMatch.pastResolution.kbArticles.map(kb => (
                                        <div key={kb.id} className="flex items-center gap-2 text-[10px]">
                                          <span className="font-mono text-amber-600 font-semibold flex-shrink-0">{kb.id}</span>
                                          <span className="text-slate-600 flex-1 truncate">{kb.title}</span>
                                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-medium flex-shrink-0">{kb.tag}</span>
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
                                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <Check className="w-2.5 h-2.5 text-blue-400 flex-shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-1.5 pt-1.5 border-t border-blue-100">
                                <p className="text-[11px] text-slate-500 font-medium">No similar resolved tickets found in historical records.</p>
                                <div className="mt-2">
                                  <p className="text-[9px] font-bold text-blue-700 uppercase tracking-widest mb-1.5 flex items-center gap-1"><BookOpen className="w-2.5 h-2.5" /> Related KB Articles Found</p>
                                  <div className="space-y-1">
                                    {pipeline.kbArticlesOnly.map(kb => (
                                      <div key={kb.id} className="flex items-center gap-2 text-[10px]">
                                        <span className="font-mono text-blue-600 font-semibold flex-shrink-0">{kb.id}</span>
                                        <span className="text-slate-600 flex-1 truncate">{kb.title}</span>
                                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-medium flex-shrink-0">{kb.tag}</span>
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
                                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <Check className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                                <p className="text-[11px] text-slate-500 font-medium">No similar resolved tickets found in knowledge base.</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">No related KB articles found for this incident type.</p>
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
                              <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">Agent</span>
                              <p className="text-xs font-bold text-slate-800">Autonomous Execution</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">Skipped</span>
                          </div>
                          <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-[11px] text-slate-500">Execution skipped — this ticket is a confirmed duplicate.</p>
                            <p className="text-[11px] text-slate-600 mt-1">Refer to <span className="font-bold text-indigo-600">{pipeline.isDuplicateOf}</span> for all active resolution steps and autonomous execution trace.</p>
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
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">Agent</span>
                            <p className="text-xs font-bold text-slate-800">Autonomous Execution</p>
                          </div>
                          {resolutionComment.telemetry && resolutionComment.telemetry.length > 0 ? (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                <Terminal className="w-3 h-3 text-slate-400" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Execution Trace</span>
                                {!resolutionComment.telemetryComplete && (
                                  <span className="ml-auto flex items-center gap-1 text-[9px] text-red-400 font-semibold animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />Running
                                  </span>
                                )}
                                {resolutionComment.telemetryComplete && (
                                  <span className="ml-auto flex items-center gap-1 text-[9px] text-green-500 font-semibold">
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
                                        <span className={`text-[11px] font-medium leading-snug transition-colors duration-200 ${step.status === 'done' ? 'text-slate-700' : step.status === 'running' ? 'text-red-600' : 'text-slate-400'}`}>{step.text}</span>
                                        {step.status === 'running' && <span className="text-[8px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded border border-red-100 font-bold uppercase tracking-wider animate-pulse">Processing</span>}
                                        {step.status === 'done' && <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100 font-bold uppercase tracking-wider">Done</span>}
                                      </div>
                                      {step.subSteps && step.subSteps.length > 0 && (
                                        <div className="mt-2 relative pl-4">
                                          <div className="absolute left-[5px] top-1 bottom-1 w-px bg-slate-100" />
                                          {step.subSteps.map((sub, j) => (
                                            <div key={j} className="flex items-center gap-2 mb-1.5">
                                              <div className={`w-2 h-2 rounded-full flex-shrink-0 border transition-all duration-200 ${sub.status === 'done' ? 'bg-green-400 border-green-400' : 'bg-red-300 border-red-300 animate-pulse'}`} />
                                              <span className={`text-[10px] leading-snug transition-colors duration-200 ${sub.status === 'done' ? 'text-slate-500' : 'text-red-400'}`}>{sub.text}</span>
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
                                    <span className="text-xs font-bold text-green-600">All steps executed</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (resolutionComment.routedAfterEnrichment || resolutionComment.awaitingApproval) ? (
                            <div>
                              <p className="text-[11px] font-semibold text-slate-600 mb-2">Apply above resolutions to close the ticket?</p>
                              <button onClick={() => handleAgentApply(agentTicket.id, resolutionIdx)} className="px-4 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Apply Fix</button>
                            </div>
                          ) : resolutionComment.applying ? (
                            <span className="text-xs font-semibold text-blue-500 flex items-center gap-1.5">Applying fix <ThinkingDots /></span>
                          ) : resolutionComment.approved ? (
                            <span className="text-xs font-bold text-green-600 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Fix applied — resolution steps executed successfully.</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Col 3: Record Info + Support Navigator */}
              <div className="w-72 border-l border-slate-200 bg-white overflow-y-auto flex-shrink-0">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">SLAs &amp; Timings</p>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Response SLA</span>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Completed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Resolution SLA</span>
                      {(() => {
                        const sla = null;
                        return sla
                          ? <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{sla}</span>
                          : <span className="text-[10px] text-slate-400">No matching SLA</span>;
                      })()}
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mt-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Opened</p>
                      <p className="text-xs font-semibold text-slate-700">{agentTicket.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Support Ops Assistant</p>
                    <span className="text-[9px] text-slate-400 ml-auto">Answers generated by AI</span>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-3 mb-3 border border-indigo-100">
                    <p className="text-xs font-semibold text-indigo-900 mb-1">Hi! 👋</p>
                    <p className="text-[11px] text-indigo-700 leading-relaxed">I've analyzed this ticket through the AI pipeline. Here's what I found:</p>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    <div className="flex gap-2 items-start">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5"><Cpu className="w-2.5 h-2.5 text-blue-600" /></div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {pipeline?.enrichment ? `Enrichment triggered — requester asked for ${pipeline.enrichment.missingFields.length} missing field(s).` : 'Ticket had complete context — no enrichment needed.'}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5"><BookOpen className="w-2.5 h-2.5 text-purple-600" /></div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {pipeline?.sopMatch ? `Scenario: "${pipeline.sopMatch.scenario}" via ${pipeline.sopMatch.sop}.` : 'No matching SOP scenario found.'}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5"><Database className="w-2.5 h-2.5 text-amber-600" /></div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {pipeline?.historicalMatch ? `Past match: ${pipeline.historicalMatch.pastResolution.ticketRef} (${pipeline.historicalMatch.pastResolution.similarity}).` : 'No historical match found.'}
                      </p>
                    </div>
                    {pipeline?.escalation && (
                      <div className="flex gap-2 items-start">
                        <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5"><UserCheck className="w-2.5 h-2.5 text-orange-600" /></div>
                        <p className="text-[11px] text-slate-600 leading-snug">Escalated to {pipeline.escalation.escalation.agent} ({pipeline.escalation.escalation.department}).</p>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ask Knowledge Base</p>
                    {agentKBMessages.length > 0 && (
                      <div className="mb-2 space-y-2 max-h-52 overflow-y-auto">
                        {agentKBMessages.map((m, i) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 rounded-bl-sm'}`}>
                              {m.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 items-end">
                      <textarea
                        value={agentKBInput}
                        onChange={e => setAgentKBInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAgentKBSend())}
                        rows={2}
                        placeholder="Ask about SOP, past tickets…"
                        className="flex-1 px-3 py-2 text-[11px] border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder-slate-400"
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Server className="w-3 h-3" /> Classification</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                      {[
                        { label: 'Category', value: info.category },
                        { label: 'Subcategory', value: info.subcategory },
                        { label: 'Configuration Item', value: info.ci },
                        { label: 'Affected Service', value: info.service },
                        { label: 'Priority', value: '2 — High', color: 'text-orange-600' },
                        { label: 'Impact', value: '3 — Low' },
                        { label: 'Urgency', value: '2 — High', color: 'text-orange-600' },
                        { label: 'State', value: agentTicket.status, color: 'text-green-600' },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                          <p className={`text-xs font-semibold ${color || 'text-slate-700'}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Reporter</p>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">{agentTicket.email[0].toUpperCase()}</div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{agentTicket.email}</p>
                        <p className="text-[10px] text-slate-400">Employee</p>
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
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                          <p className="text-[11px] text-slate-700">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><UserCheck className="w-3 h-3" /> Assignment</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Assignment Group', value: info.assignmentGroup },
                        { label: 'Assigned To', value: info.assignedTo },
                        { label: 'Escalation Tier', value: info.escalationTier },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-xs font-semibold text-slate-700">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SLA */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Clock className="w-3 h-3" /> SLA Timings</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Response SLA', value: 'Completed', color: 'text-green-600 bg-green-50 border-green-100' },
                        { label: 'Resolution SLA', value: '4h remaining', color: 'text-orange-600 bg-orange-50 border-orange-100' },
                        { label: 'Business Elapsed', value: '1h 12m', color: 'text-slate-600 bg-slate-50 border-slate-100' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">{label}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Tag className="w-3 h-3" /> AI-Generated Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {info.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Related Tickets */}
                  <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Link className="w-3 h-3" /> Related Records</p>
                    {related.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No related tickets found</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {related.map(r => (
                          <div key={r.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{r.type}</span>
                            <span className="text-[10px] font-bold text-indigo-600">{r.id}</span>
                            <span className="text-[11px] text-slate-600">{r.label}</span>
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

// ── Scenario library & matching helpers ──────────────────────────────────────
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
    solution: '1. Admin logs into Snowflake console and navigates to Admin → Users & Roles\n2. Locate the locked user account and click "Unlock User" to restore access\n3. Reset the user\'s temporary password and communicate via secure IT channel\n4. Review INFORMATION_SCHEMA.LOGIN_HISTORY to identify failed authentication attempts and their source\n5. Verify MFA enforcement policy and IP allowlist configuration for the user role\n6. Confirm user can log in with new credentials from their browser and environment\n7. Update incident record and close ticket with resolution summary',
  },
];

const PAST_RESOLUTIONS = [
  {
    ticketRef: 'GSD-103',
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

// ── Root App component ────────────────────────────────────────────────────────
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
