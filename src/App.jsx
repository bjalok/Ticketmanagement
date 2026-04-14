import React, { useState, useEffect } from 'react';
import {
  Search, Inbox, Cpu, Database,
  Zap, BookOpen, UserCheck, Check, Terminal, CheckCircle, Layers, Send,
  Tag, Link, Clock, AlertTriangle, Server, Phone, ExternalLink, RefreshCw
} from 'lucide-react';

// Pre-existing sample tickets shown in agent queue


const SAMPLE_TICKETS = [
  {
    id: 'b/452279135',
    email: 'user@cognizant.com',
    description: 'DatabridgeStepFailed: Your step "SaleforceToCapacitor - UAT" has failed to run',
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
    id: 'b/448326226',
    email: 'prasadbabuk@google.com',
    description: 'DatabridgeStepFailed: Your step "SaleforceToCapacitor -UAT" has failed run',
    status: 'Open',
    createdAt: '11 Apr 2026, 10:30 AM',
    hasUpdate: true,
    isSample: true,
    comments: [],
  },
  {
    id: 'b/471136666',
    email: 'subbu@company.com',
    description: 'DatabridgeStepFailed: Your step "[PROD] Salesforce to Gin Integration - Android BD Prod" has failed run',
    status: 'Open',
    createdAt: '6 Apr 2026, 3:05 AM',
    hasUpdate: true,
    isSample: true,
    comments: [],
  },
  {
    id: 'b/446740953',
    email: 'mdb.databridge-workflow-controller@google.com',
    description: 'DatabridgeStepFailed: Your step "[PROD] Salesforce to Gin Integration - Google Play Merchandising Prod" has failed to run',
    status: 'Open',
    createdAt: '20 Mar 2026, 3:00 PM',
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

const GSD100_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'Duplicate ticket identified — b/448326226 (96% match)...',
];

const B448_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for DataBridge pipeline failures...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];

const B448_RCA_STEPS = [
  'Connecting to pipeline execution logs...',
  'Fetching SalesforceToCapacitor - UAT run logs from Databridge...',
  'Parsing error stack trace from failed pipeline run...',
  'Identifying root cause: NullPointerException at file path resolution...',
  'Cross-referencing PermissionDeniedException against IAM policies...',
  'Querying MPM package version for corp/salesforcehub/integrations/sawmill...',
  'Checking UAT label applied to MPM build — includes cl/816241916...',
  'Comparing build date: pre-2025-10-31 (missing fix) vs required version...',
  'Root cause confirmed — MPM version mismatch and file permission error...',
];

const B448_REC_STEPS = [
  'Querying g3doc for SalesforceToCapacitor pipeline configuration guides...',
  'Searching Yaqs for MPM UAT label update procedures...',
  'Scanning MoMA for cl/816241916 fix documentation and known issues...',
  'Fetching resolution steps from similar resolved DataBridge incidents...',
  'Applying RCA finding #1: MPM version mismatch — mapping fix steps for cl/816241916...',
  'Applying RCA finding #2: relative sub-transformation path — mapping absolute path correction...',
  'Applying RCA finding #3: PermissionDeniedException — mapping IAM policy remediation steps...',
  'Compiling standard resolution steps from knowledge platform...',
  'Validating compiled steps against current pipeline configuration...',
];



const B448_LIFECYCLE_STEPS = [
  'Fetching pipeline execution history for SalesforceToCapacitor - UAT...',
  'Scanning run records post-failure timestamp (after 10:30 AM)...',
  'Locating Recent Run attempt at 11:15 AM...',
  'Verifying step-level execution status across pipeline steps...',
  'Detecting failure in Recent Run — NullPointerException in sub-transformation path...',
  'Confirming PermissionDeniedException — same IAM policy error as original failure...',
  'Issue persists — root cause unresolved, not a transient failure...',
];

const B471_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for Salesforce to Gin pipeline failures...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];

const B471_RCA_STEPS = [
  'Connecting to Databridge pipeline execution logs...',
  'Fetching [PROD] Salesforce to Gin Integration - Android BD Prod run logs...',
  'Parsing error stack trace from failed pipeline run...',
  'Identifying failing step: Convert_Search_Fields 2...',
  'Extracting failed value: "2495245546" — exceeds INT32 max (2,147,483,647)...',
  'Tracing exception to StringValue.asInt() in corp/databridge/sdk/propertysheet...',
  'Cross-referencing ConvertTypesDofn field schema definition...',
  'Confirming: Convert_Search_Fields 2 output type configured as INT32...',
  'Root cause confirmed — NumberFormatException due to INT32 overflow on Salesforce ID field...',
];

const B471_REC_STEPS = [
  'Querying g3doc for Databridge field type conversion guides...',
  'Searching Yaqs for INT32 overflow handling in pipeline steps...',
  'Scanning MoMA for similar NumberFormatException incidents and resolutions...',
  'Applying RCA finding: INT32 overflow on Convert_Search_Fields 2 output type...',
];

const B471_LIFECYCLE_STEPS = [
  'Fetching pipeline execution history for [PROD] Salesforce to Gin Integration - Android BD Prod...',
  'Scanning run records post-failure timestamp (after 03:01 AM)...',
  'Locating Recent Run attempt at 03:47 AM...',
  'Verifying step-level execution status for Convert_Search_Fields 2...',
  'Confirming pipeline exit code: 0 — no errors detected...',
  'Cross-checking Salesforce record batch — offending ID absent in retry batch...',
  'Transient pattern confirmed — single occurrence, self-resolved on retry...',
];

const B446_DUP_STEPS = [
  'Scanning active incident queue for similar issues...',
  'Embedding ticket description for semantic similarity...',
  'Comparing against open tickets (last 90 days)...',
  'Querying resolved ticket history for Salesforce to Gin pipeline failures...',
  'Computing cosine similarity scores across corpus...',
  'Applying 80% confidence threshold filter...',
  'No tickets found above confidence threshold...',
];

const B446_RCA_STEPS = [
  'Connecting to Databridge pipeline execution logs...',
  'Fetching [PROD] Salesforce to Gin Integration - Google Play Merchandising Prod run logs...',
  'Parsing error stack trace from failed pipeline run...',
  'Identifying failing step: EventLogFileCSV endpoint — READ-BY-ID operation...',
  'Detecting UserCodeException wrapping RuntimeException at step execution...',
  'Tracing root: Endpoint "EventLogFileCSV" READ-BY-ID failed — 5 total operation attempts exhausted...',
  'Cross-referencing IllegalStateException — step transformation state invalid at invocation...',
  'Querying related Gin Integration Setup Request — ticket b/438480218 (setup completed Sep 19)...',
  'Root cause confirmed — API endpoint failure on EventLogFileCSV causing pipeline termination...',
];

const B446_REC_STEPS = [
  'Querying g3doc for Salesforce to Gin Integration pipeline configuration guides...',
  'Searching Yaqs for EventLogFileCSV endpoint READ-BY-ID failure handling procedures...',
  'Scanning MoMA for similar UserCodeException incidents in Gin Integration pipelines...',
  'Applying RCA finding: EventLogFileCSV endpoint unavailability on READ-BY-ID operation...',
  'Cross-referencing Gin Integration Setup ticket b/438480218 for endpoint configuration...',
  'Compiling resolution steps from knowledge platform...',
];

const B446_LIFECYCLE_STEPS = [
  'Fetching pipeline execution history for [PROD] Salesforce to Gin Integration - Google Play Merchandising Prod...',
  'Scanning run records post-failure timestamp (after Mar 20, 3:00 PM)...',
  'Locating Recent Run attempt at 15:30 PM...',
  'Verifying step-level execution status for EventLogFileCSV endpoint...',
  'Detecting failure in Recent Run — UserCodeException on EventLogFileCSV READ-BY-ID...',
  'Confirming same API error pattern — endpoint returning 5 consecutive failures...',
  'Ticket has been open for 2 months — issue is persistent and unresolved...',
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
  const [gsd100DupSteps, setGsd100DupSteps] = useState([]);
  const [gsd100DupDone, setGsd100DupDone] = useState(false);
  const [gsd100InvestigateDone, setGsd100InvestigateDone] = useState(false);
  const [gsd100RecDone, setGsd100RecDone] = useState(false);
  const [gsd100LifecycleDone, setGsd100LifecycleDone] = useState(false);
  const [b448DupSteps, setB448DupSteps] = useState([]);
  const [b448DupDone, setB448DupDone] = useState(false);
  const [b448RcaSteps, setB448RcaSteps] = useState([]);
  const [b448RcaDone, setB448RcaDone] = useState(false);
  const [b448RecSteps, setB448RecSteps] = useState([]);
  const [b448RecDone, setB448RecDone] = useState(false);
  const [b448LifecycleSteps, setB448LifecycleSteps] = useState([]);
  const [b448LifecycleDone, setB448LifecycleDone] = useState(false);
  const [b471DupSteps, setB471DupSteps] = useState([]);
  const [b471DupDone, setB471DupDone] = useState(false);
  const [b471RcaSteps, setB471RcaSteps] = useState([]);
  const [b471RcaDone, setB471RcaDone] = useState(false);
  const [b471RecSteps, setB471RecSteps] = useState([]);
  const [b471RecDone, setB471RecDone] = useState(false);
  const [b471LifecycleSteps, setB471LifecycleSteps] = useState([]);
  const [b471LifecycleDone, setB471LifecycleDone] = useState(false);
  const [b446DupSteps, setB446DupSteps] = useState([]);
  const [b446DupDone, setB446DupDone] = useState(false);
  const [b446RcaSteps, setB446RcaSteps] = useState([]);
  const [b446RcaDone, setB446RcaDone] = useState(false);
  const [b446RecSteps, setB446RecSteps] = useState([]);
  const [b446RecDone, setB446RecDone] = useState(false);
  const [b446LifecycleSteps, setB446LifecycleSteps] = useState([]);
  const [b446LifecycleDone, setB446LifecycleDone] = useState(false);

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

  // b/452279135: duplicate scan animation (fires immediately on ticket selection)
  useEffect(() => {
    if (agentSelectedTicketId !== 'b/452279135') return;
    setGsd100DupSteps([]);
    setGsd100DupDone(false);
    setGsd100InvestigateDone(false);
    setGsd100RecDone(false);
    setGsd100LifecycleDone(false);
    const timers = [];
    GSD100_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setGsd100DupSteps(prev => [...prev, step]), 300 + i * 800));
    });
    const dupDoneAt = 300 + GSD100_DUP_STEPS.length * 800;
    timers.push(setTimeout(() => setGsd100DupDone(true), dupDoneAt));
    timers.push(setTimeout(() => setGsd100InvestigateDone(true), dupDoneAt + 1800));
    const recDoneAt = dupDoneAt + 2800;
    timers.push(setTimeout(() => setGsd100RecDone(true), recDoneAt));
    timers.push(setTimeout(() => setGsd100LifecycleDone(true), recDoneAt + 2500));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);


  // b/448326226: dup scan (no dup) → RCA → recommendation → LifecycleOps animation
  useEffect(() => {
    if (agentSelectedTicketId !== 'b/448326226') return;
    setB448DupSteps([]);
    setB448DupDone(false);
    setB448RcaSteps([]);
    setB448RcaDone(false);
    setB448RecSteps([]);
    setB448RecDone(false);
    setB448LifecycleSteps([]); setB448LifecycleDone(false);
    const timers = [];
    B448_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB448DupSteps(prev => [...prev, step]), 300 + i * 800));
    });
    const dupDoneAt = 300 + B448_DUP_STEPS.length * 800;
    timers.push(setTimeout(() => setB448DupDone(true), dupDoneAt));
    const rcaStart = dupDoneAt + 1200;
    B448_RCA_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB448RcaSteps(prev => [...prev, step]), rcaStart + i * 700));
    });
    const rcaDoneAt = rcaStart + B448_RCA_STEPS.length * 700;
    timers.push(setTimeout(() => setB448RcaDone(true), rcaDoneAt));
    const recStart = rcaDoneAt + 1200;
    B448_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB448RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + B448_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setB448RecDone(true), recDoneAt));
    const lifecycleStart = recDoneAt + 1200;
    B448_LIFECYCLE_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB448LifecycleSteps(prev => [...prev, step]), lifecycleStart + i * 700));
    });
    const lifecycleDoneAt = lifecycleStart + B448_LIFECYCLE_STEPS.length * 700;
    timers.push(setTimeout(() => setB448LifecycleDone(true), lifecycleDoneAt));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // b/471136666: dup scan (no dup) → RCA → recommendation → LifecycleOps animation
  useEffect(() => {
    if (agentSelectedTicketId !== 'b/471136666') return;
    setB471DupSteps([]); setB471DupDone(false);
    setB471RcaSteps([]); setB471RcaDone(false);
    setB471RecSteps([]); setB471RecDone(false);
    setB471LifecycleSteps([]); setB471LifecycleDone(false);
    const timers = [];
    B471_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB471DupSteps(prev => [...prev, step]), 300 + i * 800));
    });
    const dupDoneAt = 300 + B471_DUP_STEPS.length * 800;
    timers.push(setTimeout(() => setB471DupDone(true), dupDoneAt));
    const rcaStart = dupDoneAt + 1200;
    B471_RCA_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB471RcaSteps(prev => [...prev, step]), rcaStart + i * 700));
    });
    const rcaDoneAt = rcaStart + B471_RCA_STEPS.length * 700;
    timers.push(setTimeout(() => setB471RcaDone(true), rcaDoneAt));
    const recStart = rcaDoneAt + 1200;
    B471_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB471RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + B471_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setB471RecDone(true), recDoneAt));
    const lifecycleStart = recDoneAt + 1200;
    B471_LIFECYCLE_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB471LifecycleSteps(prev => [...prev, step]), lifecycleStart + i * 700));
    });
    const lifecycleDoneAt = lifecycleStart + B471_LIFECYCLE_STEPS.length * 700;
    timers.push(setTimeout(() => setB471LifecycleDone(true), lifecycleDoneAt));
    return () => timers.forEach(clearTimeout);
  }, [agentSelectedTicketId]);

  // b/446740953: dup scan (no dup) → RCA → recommendation → LifecycleOps animation
  useEffect(() => {
    if (agentSelectedTicketId !== 'b/446740953') return;
    setB446DupSteps([]); setB446DupDone(false);
    setB446RcaSteps([]); setB446RcaDone(false);
    setB446RecSteps([]); setB446RecDone(false);
    setB446LifecycleSteps([]); setB446LifecycleDone(false);
    const timers = [];
    B446_DUP_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB446DupSteps(prev => [...prev, step]), 300 + i * 800));
    });
    const dupDoneAt = 300 + B446_DUP_STEPS.length * 800;
    timers.push(setTimeout(() => setB446DupDone(true), dupDoneAt));
    const rcaStart = dupDoneAt + 1200;
    B446_RCA_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB446RcaSteps(prev => [...prev, step]), rcaStart + i * 700));
    });
    const rcaDoneAt = rcaStart + B446_RCA_STEPS.length * 700;
    timers.push(setTimeout(() => setB446RcaDone(true), rcaDoneAt));
    const recStart = rcaDoneAt + 1200;
    B446_REC_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB446RecSteps(prev => [...prev, step]), recStart + i * 700));
    });
    const recDoneAt = recStart + B446_REC_STEPS.length * 700;
    timers.push(setTimeout(() => setB446RecDone(true), recDoneAt));
    const lifecycleStart = recDoneAt + 1200;
    B446_LIFECYCLE_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setB446LifecycleSteps(prev => [...prev, step]), lifecycleStart + i * 700));
    });
    const lifecycleDoneAt = lifecycleStart + B446_LIFECYCLE_STEPS.length * 700;
    timers.push(setTimeout(() => setB446LifecycleDone(true), lifecycleDoneAt));
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
      const qLower = q.toLowerCase();

      // Duplicate count question for b/448326226
      if ((qLower.includes('duplic') || qLower.includes('how many')) && (qLower.includes('448326226') || qLower.includes('b/448326226'))) {
        const dupLinks = [
          { id: 'b/452279135', date: '13 Apr 2026, 9:00 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/453112847', date: '13 Apr 2026, 10:15 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/453445023', date: '13 Apr 2026, 11:30 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/453889261', date: '13 Apr 2026, 1:45 PM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/454201938', date: '13 Apr 2026, 3:20 PM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/454567492', date: '14 Apr 2026, 8:55 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/455023781', date: '14 Apr 2026, 10:40 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/455341206', date: '14 Apr 2026, 2:10 PM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/455789034', date: '15 Apr 2026, 9:25 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/456102847', date: '15 Apr 2026, 11:05 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/456490215', date: '15 Apr 2026, 3:45 PM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/456834907', date: '16 Apr 2026, 8:30 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
          { id: 'b/457123856', date: '16 Apr 2026, 10:20 AM', priority: 'P2', type: 'Bug', severity: 'S2' },
        ];
        const DUP_TEL_STEPS = [
          'Connecting to Buganizer duplicate detection index...',
          'Querying tickets matching SalesforceToCapacitor — UAT pipeline failure description...',
          'Running semantic similarity scan across open + closed ticket corpus...',
          'Applying 80% cosine similarity confidence threshold filter...',
          'Cross-referencing Buganizer incident history (last 90 days)...',
          'Scanning for known duplicate cluster patterns around b/448326226...',
          '13 matches found — compiling confirmed duplicate ticket list...',
        ];
        const msgId = Date.now();
        setAgentKBMessages(prev => [...prev, {
          role: 'bot',
          id: msgId,
          text: '',
          steps: [],
          done: false,
          links: null,
          timestamp: new Date().toLocaleTimeString(),
        }]);
        DUP_TEL_STEPS.forEach((step, i) => {
          setTimeout(() => {
            setAgentKBMessages(prev => prev.map(m =>
              m.id === msgId ? { ...m, steps: [...(m.steps || []), step] } : m
            ));
          }, i * 700);
        });
        setTimeout(() => {
          setAgentKBMessages(prev => prev.map(m =>
            m.id === msgId ? {
              ...m,
              text: '13 duplicate tickets identified for b/448326226 (SalesforceToCapacitor — UAT pipeline failure).\n\nAll detected with ≥80% cosine similarity.',
              done: true,
              links: dupLinks,
            } : m
          ));
        }, DUP_TEL_STEPS.length * 700 + 500);
        return;
      }

      // Ticket-specific detail lookup
      if (qLower.includes('b/448326226') || qLower.includes('448326226')) {
        const answer =
`Incident b/448326226

Reporter: prasadbabuk@google.com
Status: Open
Created: 11 Apr 2026, 10:30 AM
Description: DatabridgeStepFailed — SalesforceToCapacitor - UAT pipeline has failed to run.

Root Cause (Investigate Agent):
• MPM version mismatch — build date 2025-09-14 predates required fix cl/816241916 (2025-10-31).
• NullPointerException in sub-transformation path due to relative path resolution failure.
• PermissionDeniedException on /google_src/files/head/depot/google3/corp/salesforcehub/.

Resolution Steps (Recommendation Agent):
1. Apply UAT label to MPM build that includes cl/816241916 (built after 2025-10-31).
2. Update sub-transformation path from relative to absolute in pipeline step configuration.
3. Validate IAM permissions for the pipeline service account.
4. Re-trigger the SalesforceToCapacitor - UAT pipeline and monitor execution logs.
5. Notify reporter (prasadbabuk@google.com) once pipeline is confirmed healthy and close the ticket.

LifecycleOps Status:
Recent Run at 11:15 AM also failed with the same errors. Issue is active and recurring — ticket should be reopened immediately.`;
        setAgentKBMessages(prev => [...prev, { role: 'bot', text: answer, timestamp: new Date().toLocaleTimeString() }]);
        return;
      }

      if (qLower.includes('b/452279135') || qLower.includes('452279135')) {
        const answer =
`Incident b/452279135

Reporter: user@cognizant.com
Status: Open
Created: 13 Apr 2026, 9:00 AM
Description: DatabridgeStepFailed — SalesforceToCapacitor - UAT pipeline has failed to run.

Triage Agent:
Duplicate ticket identified — matches b/448326226 at 96% confidence.

LifecycleOps Status:
Confirmed duplicate. Please refer to the parent ticket b/448326226 for resolution.`;
        setAgentKBMessages(prev => [...prev, { role: 'bot', text: answer, timestamp: new Date().toLocaleTimeString() }]);
        return;
      }

      if (qLower.includes('b/471136666') || qLower.includes('471136666')) {
        const answer =
`Incident b/471136666

Reporter: subbu@company.com
Status: Open
Created: 6 Apr 2026, 3:05 AM
Description: DatabridgeStepFailed — [PROD] Salesforce to Gin Integration - Android BD Prod has failed run.

Root Cause (Investigate Agent):
• NumberFormatException — Salesforce ID "2495245546" exceeds INT32 max (2,147,483,647).
• Field schema mismatch — Convert_Search_Fields 2 output type is INT32, requires INT64.

Resolution Steps (Recommendation Agent):
1. Document the INT32 overflow root cause in the ticket.
2. File a follow-up task to update Convert_Search_Fields 2 output type from INT32 → INT64.
3. Mark this ticket as Transient / Won't Fix for this occurrence.
4. Notify reporter (subbu@company.com) that the root cause has been identified.

LifecycleOps Status:
Recent Run at 03:47 AM completed successfully — transient failure confirmed. Ticket can be closed.`;
        setAgentKBMessages(prev => [...prev, { role: 'bot', text: answer, timestamp: new Date().toLocaleTimeString() }]);
        return;
      }

      if (qLower.includes('b/446740953') || qLower.includes('446740953')) {
        const answer =
`Incident b/446740953

Reporter: mdb.databridge-workflow-controller@google.com
Status: Open
Created: 20 Mar 2026, 3:00 PM
Priority: P2 | Severity: S2 | Type: Bug
Description: DatabridgeStepFailed — [PROD] Salesforce to Gin Integration - Google Play Merchandising Prod pipeline has failed to run.

Root Cause (Investigate Agent):
• UserCodeException wrapping RuntimeException — Endpoint "EventLogFileCSV" READ-BY-ID operation failed after 5 consecutive attempts.
• IllegalStateException — Step TransformOfFcEventsData>EventLogFileCSV entered an invalid state due to endpoint failure, causing pipeline termination.

Resolution Steps (Recommendation Agent):
1. Investigate availability of the EventLogFileCSV API endpoint — check with the Gin Integration team for outage around Mar 20, 3:00 PM.
2. Review Gin Integration Setup Request ticket b/438480218 (completed Sep 19) for endpoint configuration changes.
3. Validate pipeline step configuration for EventLogFileCSV — confirm endpoint URL, credentials, and READ-BY-ID parameters.
4. Re-trigger the pipeline and monitor EventLogFileCSV endpoint response during execution.
5. Notify reporter once pipeline is confirmed healthy and close the ticket.

LifecycleOps Status:
Recent Run at 15:30 PM also failed with the same UserCodeException. Ticket has been open for 2 months — issue is active, recurring, and requires immediate escalation.`;
        setAgentKBMessages(prev => [...prev, { role: 'bot', text: answer, timestamp: new Date().toLocaleTimeString() }]);
        return;
      }

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
              key={t.id}
              onClick={() => {
                setAgentSelectedTicketId(t.id);
                setAgentActiveTab('Overview');
                const hasBeenRouted = t.comments && t.comments.some(c => c.routedAfterEnrichment);
                if (!hasBeenRouted && t.id !== 'b/452279135' && t.id !== 'b/448326226' && t.id !== 'b/471136666' && t.id !== 'b/446740953') {
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
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="text-sm font-bold text-indigo-600 flex-shrink-0">{t.id}</span>
                  <span className="text-xs text-slate-400 truncate">{t.createdAt}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                  {t.hasUpdate && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                  <span className="text-sm bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-bold border border-blue-100">Open</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 leading-snug">{t.description}</p>
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
          <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-start gap-4 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-indigo-600">{agentTicket.id}</span>
                <span className="text-sm text-slate-400">{agentTicket.createdAt}</span>
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
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Number</p><p className="text-sm font-semibold text-indigo-600 mt-0.5">{agentTicket.id}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</p><p className="text-sm font-semibold text-orange-600 mt-0.5">{agentTicket.id === 'b/448326226' ? 'P1' : 'P2'}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opened</p><p className="text-sm text-slate-600 mt-0.5">{agentTicket.createdAt}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</p><p className="text-sm font-semibold text-green-600 mt-0.5">{agentTicket.status}</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</p><p className="text-sm text-slate-600 mt-0.5">Bug</p></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Severity</p><p className="text-sm text-slate-600 mt-0.5">{agentTicket.id === 'b/448326226' ? 'S1' : 'S2'}</p></div>
                  </div>
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
                            <p className="text-sm font-bold text-slate-800">Triage Agent</p>
                          </div>
                          {isThinking ? (
                            <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analyzing <ThinkingDots /></span>
                          ) : agentTicket?.id === 'b/452279135' ? (
                            gsd100DupDone
                              ? <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Duplicate Found</span>
                              : gsd100DupSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Scanning <ThinkingDots /></span>
                                : null
                          ) : agentTicket?.id === 'b/448326226' ? (
                            b448DupDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> No Duplicate</span>
                              : b448DupSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Scanning <ThinkingDots /></span>
                                : null
                          ) : agentTicket?.id === 'b/471136666' ? (
                            b471DupDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> No Duplicate</span>
                              : b471DupSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Scanning <ThinkingDots /></span>
                                : null
                          ) : agentTicket?.id === 'b/446740953' ? (
                            b446DupDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> No Duplicate</span>
                              : b446DupSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Scanning <ThinkingDots /></span>
                                : null
                          ) : pipeline?.enrichment ? (() => {
                            const enrichmentIdx = agentComments.indexOf(pipeline.enrichment);
                            const hasReply = agentComments.some((c, i) => c.role === 'user' && i > enrichmentIdx);
                            return hasReply
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Context Provided</span>
                              : <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Enrichment Needed</span>;
                          })() : (
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Complete</span>
                          )}
                        </div>
                        {agentTicket.id === 'b/452279135' && gsd100DupSteps.length > 0 && (
                          <div className="mt-2">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                {!gsd100DupDone
                                  ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Duplicate Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {gsd100DupSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-slate-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {gsd100DupDone && (
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                  <div className="bg-white rounded-lg border border-orange-200 p-2.5">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-sm font-bold text-indigo-600">b/448326226</span>
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-sm text-slate-400">11 Apr 2026, 10:30 AM</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-snug">DatabridgeStepFailed: Your step "SaleforceToCapacitor -UAT" has failed run</p>
                                    <div className="mt-1.5">
                                      <span className="text-sm bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full font-bold border border-orange-100">Open</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {agentTicket.id === 'b/448326226' && !isThinking && b448DupSteps.length > 0 && (
                          <div className="mt-2">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                {!b448DupDone
                                  ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No Duplicate</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {b448DupSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-slate-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {b448DupDone && (
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                  <p className="text-sm text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {agentTicket.id === 'b/471136666' && !isThinking && b471DupSteps.length > 0 && (
                          <div className="mt-2">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                {!b471DupDone
                                  ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No Duplicate</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {b471DupSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-slate-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {b471DupDone && (
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                  <p className="text-sm text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {agentTicket.id === 'b/446740953' && !isThinking && b446DupSteps.length > 0 && (
                          <div className="mt-2">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-600">Identifying Duplicates</p>
                                {!b446DupDone
                                  ? <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">Scanning <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> No Duplicate</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {b446DupSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-slate-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {b446DupDone && (
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                  <p className="text-sm text-slate-500 italic">No duplicate tickets found above 80% confidence threshold.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Investigate Agent Card — only for b/452279135 */}
                  {agentTicket?.id === 'b/452279135' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">Investigate Agent</p>
                            {gsd100InvestigateDone
                              ? <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Duplicate Identified</span>
                              : gsd100DupDone
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>
                                : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {gsd100InvestigateDone && (
                            <div className="mt-2">
                              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-start gap-2.5">
                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-bold text-orange-700 mb-0.5">Duplicate Ticket</p>
                                  <p className="text-sm text-slate-700">This is a duplicate ticket. Please refer to the parent ticket <span className="font-bold text-indigo-600">b/448326226</span> for root cause.</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investigate Agent Card — b/446740953 RCA (UserCodeException / EventLogFileCSV) */}
                  {agentTicket?.id === 'b/446740953' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">Investigate Agent</p>
                            {b446RcaDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> RCA Complete</span>
                              : b446DupDone
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>
                                : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {b446RcaSteps.length > 0 && (
                            <div className="mt-2">
                              <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-purple-700">Root Cause Analysis</p>
                                  {!b446RcaDone
                                    ? <span className="flex items-center gap-1 text-sm text-purple-500 font-medium">Analysing <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Complete</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {b446RcaSteps.map((step, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-sm text-slate-500">
                                      <span className="text-purple-400 flex-shrink-0">*</span>
                                      <span className="inline-flex items-center gap-1 flex-wrap">
                                        {step}
                                        {i === 1 && (
                                          <a href="#" onClick={e => e.preventDefault()} title="View pipeline run logs"
                                            className="inline-flex items-center gap-0.5 text-indigo-500 hover:text-indigo-700 underline underline-offset-2 font-medium transition-colors">
                                            <ExternalLink className="w-3 h-3" />
                                            <span className="text-xs">View logs</span>
                                          </a>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                {b446RcaDone && (
                                  <div className="mt-3 pt-2 border-t border-purple-100">
                                    <p className="text-sm font-bold text-purple-800 mb-2">Error Logs:</p>
                                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-0.5 mb-3 overflow-x-auto">
                                      <p className="text-slate-400 whitespace-nowrap">{'[2026-03-20 15:00:07] INFO  Databridge pipeline started: [PROD] Salesforce to Gin Integration - Google Play Merchandising Prod'}</p>
                                      <p className="text-slate-400 whitespace-nowrap">{'[2026-03-20 15:00:09] INFO  Initialising step: EventLogFileCSV — operation READ-BY-ID'}</p>
                                      <p className="text-yellow-400 whitespace-nowrap">{'[2026-03-20 15:00:11] WARN  Endpoint "EventLogFileCSV" READ-BY-ID attempt 1/5 — no response'}</p>
                                      <p className="text-yellow-400 whitespace-nowrap">{'[2026-03-20 15:00:14] WARN  Endpoint "EventLogFileCSV" READ-BY-ID attempt 3/5 — timeout'}</p>
                                      <p className="text-red-400 whitespace-nowrap">{'[2026-03-20 15:00:20] ERROR Endpoint "EventLogFileCSV" READ-BY-ID attempt 5/5 — FAILED (5 total operations exhausted)'}</p>
                                      <p className="text-red-400 whitespace-nowrap mt-1">{'Completed work item 2318146419733207274 UNSUCCESSFULLY: UNKNOWN:'}</p>
                                      <p className="text-red-400 whitespace-nowrap">{'  org.apache.beam.sdk.util.UserCodeException'}</p>
                                      <p className="text-red-400 whitespace-nowrap pl-4">{'at org.apache.beam.sdk.util.UserCodeException.wrap(UserCodeException.java:39)'}</p>
                                      <p className="text-red-400 whitespace-nowrap mt-1">{'Caused by: java.lang.RuntimeException: Endpoint "EventLogFileCSV", op READ-BY-ID:'}</p>
                                      <p className="text-red-400 whitespace-nowrap pl-4">{'  failed: 5 total operations, last error: API endpoint unavailable'}</p>
                                      <p className="text-red-400 whitespace-nowrap mt-1">{'Caused by: org.apache.beam.sdk.util.UserCodeException: java.lang.IllegalStateException:'}</p>
                                      <p className="text-red-400 whitespace-nowrap pl-4">{'  Step [TransformOfFcEventsData>EventLogFileCSV] has failed'}</p>
                                      <p className="text-slate-500 whitespace-nowrap mt-1">{'[2026-03-20 15:43:30] INFO  Pipeline terminated. Exit code: 1'}</p>
                                    </div>
                                    <p className="text-sm font-bold text-purple-800 mb-2">Root Cause:</p>
                                    <div className="space-y-2.5">
                                      <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">1</span>
                                        <p className="text-sm text-slate-700"><span className="font-semibold">UserCodeException / RuntimeException:</span> The <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">EventLogFileCSV</span> endpoint failed all 5 READ-BY-ID operation attempts — the API endpoint was unreachable during pipeline execution.</p>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">2</span>
                                        <p className="text-sm text-slate-700"><span className="font-semibold">IllegalStateException:</span> Step <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">TransformOfFcEventsData&gt;EventLogFileCSV</span> entered an invalid state due to the endpoint failure, causing pipeline termination.</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investigate Agent Card — b/448326226 RCA */}
                  {agentTicket?.id === 'b/448326226' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">Investigate Agent</p>
                            {b448RcaDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> RCA Complete</span>
                              : b448DupDone
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>
                                : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {b448RcaSteps.length > 0 && (
                            <div className="mt-2">
                              <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-purple-700">Root Cause Analysis</p>
                                  {!b448RcaDone
                                    ? <span className="flex items-center gap-1 text-sm text-purple-500 font-medium">Analysing <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Complete</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {b448RcaSteps.map((step, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-sm text-slate-500">
                                      <span className="text-purple-400 flex-shrink-0">*</span>
                                      <span className="inline-flex items-center gap-1 flex-wrap">
                                        {step}
                                        {i === 1 && (
                                          <a
                                            href="#"
                                            onClick={e => e.preventDefault()}
                                            title="View pipeline run logs"
                                            className="inline-flex items-center gap-0.5 text-indigo-500 hover:text-indigo-700 underline underline-offset-2 font-medium transition-colors"
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                            <span className="text-xs">View logs</span>
                                          </a>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                {b448RcaDone && (
                                  <div className="mt-3 pt-2 border-t border-purple-100">
                                    <p className="text-sm font-bold text-purple-800 mb-2">Error Logs:</p>
                                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-0.5 mb-3 overflow-x-auto">
                                      <p className="text-slate-400">{'[2026-04-11 10:28:14] INFO  Databridge pipeline started: SalesforceToCapacitor-UAT'}</p>
                                      <p className="text-slate-400">{'[2026-04-11 10:28:15] INFO  Loading MPM package: corp/salesforcehub/integrations/sawmill/salesforce_sawmill_d_v7_pipeline'}</p>
                                      <p className="text-slate-400">{'[2026-04-11 10:28:16] INFO  UAT label resolved → build: 2025-09-14 (cl/814203001)'}</p>
                                      <p className="text-yellow-400">{'[2026-04-11 10:28:17] WARN  Build predates required fix cl/816241916 (2025-10-07)'}</p>
                                      <p className="text-slate-400">{'[2026-04-11 10:28:18] INFO  Initialising sub-transformation: ShgSawmillIntegrationPipelineUAT'}</p>
                                      <p className="text-yellow-400">{'[2026-04-11 10:28:19] WARN  Sub-transformation path is relative — attempting to resolve against working dir'}</p>
                                      <p className="text-red-400">{'[2026-04-11 10:28:20] ERROR Step "SaleforceToCapacitor - UAT" FAILED'}</p>
                                      <p className="text-red-400 mt-1">{'java.lang.RuntimeException: Step execution failed'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.databridge.StepRunner.execute(StepRunner.java:241)'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.databridge.PipelineExecutor.runStep(PipelineExecutor.java:189)'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.databridge.PipelineExecutor.run(PipelineExecutor.java:112)'}</p>
                                      <p className="text-red-400 mt-1">{'Caused by: com.google.io.file.PermissionDeniedException:'}</p>
                                      <p className="text-red-400 pl-4">{'/google_src/files/head/depot/google3/corp/'}</p>
                                      <p className="text-red-400 pl-4">{'salesforcehub/integrations/sawmill/'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.io.file.FileSystem.open(FileSystem.java:88)'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.sawmill.SawmillConfig.load(SawmillConfig.java:55)'}</p>
                                      <p className="text-red-400 mt-1">{'Caused by: java.lang.NullPointerException: Cannot match any'}</p>
                                      <p className="text-red-400 pl-4">{'file paths with file pattern'}</p>
                                      <p className="text-red-400 pl-4">{'/placer/test/scratch/home/shg-databridge-sawm*'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.placer.FileResolver.resolve(FileResolver.java:134)'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.sawmill.SawmillConfig.resolveSubTransform(SawmillConfig.java:201)'}</p>
                                      <p className="text-slate-500 mt-1">{'[2026-04-11 10:28:20] INFO  Pipeline terminated. Exit code: 1'}</p>
                                    </div>
                                    <p className="text-sm font-bold text-purple-800 mb-2">Root Cause:</p>
                                    <div className="space-y-2.5">
                                      <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">1</span>
                                        <p className="text-sm text-slate-700"><span className="font-semibold">PermissionDeniedException:</span> The SalesforceToCapacitor - UAT step uses MPM package <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">salesforce_sawmill_d_v7_pipeline</span>. The UAT label is applied to an MPM build from before 2025-10-31, which does not include fix <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">cl/816241916</span>.</p>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">2</span>
                                        <p className="text-sm text-slate-700"><span className="font-semibold">NullPointerException:</span> Sub-transformation path is configured as relative, not absolute — file pattern resolution fails at <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">/placer/test/scratch/home/shg-databridge-sawm*</span>.</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investigate Agent Card — b/471136666 RCA (transient INT32 overflow) */}
                  {agentTicket?.id === 'b/471136666' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">Investigate Agent</p>
                            {b471RcaDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> RCA Complete</span>
                              : b471DupDone
                                ? <span className="flex items-center gap-1.5 text-sm text-blue-500 font-medium">Analysing <ThinkingDots /></span>
                                : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {b471RcaSteps.length > 0 && (
                            <div className="mt-2">
                              <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-purple-700">Root Cause Analysis</p>
                                  {!b471RcaDone
                                    ? <span className="flex items-center gap-1 text-sm text-purple-500 font-medium">Analysing <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Complete</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {b471RcaSteps.map((step, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-sm text-slate-500">
                                      <span className="text-purple-400 flex-shrink-0">*</span>
                                      <span className="inline-flex items-center gap-1 flex-wrap">
                                        {step}
                                        {i === 1 && (
                                          <a href="#" onClick={e => e.preventDefault()} title="View pipeline run logs"
                                            className="inline-flex items-center gap-0.5 text-indigo-500 hover:text-indigo-700 underline underline-offset-2 font-medium transition-colors">
                                            <ExternalLink className="w-3 h-3" />
                                            <span className="text-xs">View logs</span>
                                          </a>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                {b471RcaDone && (
                                  <div className="mt-3 pt-2 border-t border-purple-100">
                                    <p className="text-sm font-bold text-purple-800 mb-2">Error Logs:</p>
                                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-0.5 mb-3 overflow-x-auto">
                                      <p className="text-slate-400">{'[2026-04-06 03:00:51] INFO  Databridge pipeline started: [PROD] Salesforce to Gin Integration - Android BD Prod'}</p>
                                      <p className="text-slate-400">{'[2026-04-06 03:00:52] INFO  Initialising step: Convert_Search_Fields 2'}</p>
                                      <p className="text-slate-400">{'[2026-04-06 03:00:53] INFO  Step Convert_Search_Fields 2 — reading field schema: output type = INT32'}</p>
                                      <p className="text-slate-400">{'[2026-04-06 03:00:54] INFO  Processing Salesforce record batch — 1,423 records'}</p>
                                      <p className="text-yellow-400">{'[2026-04-06 03:01:07] WARN  Numeric field value "2495245546" approaches INT32 boundary'}</p>
                                      <p className="text-red-400">{'[2026-04-06 03:01:08] ERROR Step Convert_Search_Fields 2 FAILED'}</p>
                                      <p className="text-red-400 mt-1">{'E 2026-04-06 03:01:08.846898 PCollectionConsumerRegistry.logAndRethrow:291]'}</p>
                                      <p className="text-red-400">{'Failed to process element for bundle process_bundle_Convert_Search_Fields_2'}</p>
                                      <p className="text-red-400 mt-1">{'org.apache.beam.sdk.util.UserCodeException: java.lang.IllegalStateException:'}</p>
                                      <p className="text-red-400 pl-4">{'Step [TransformOfFcEventsData>Convert_Search_Fields 2] has failed'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.corp.pipelines.woodwind.engine.common.transforms'}</p>
                                      <p className="text-red-400 pl-8">{'.ConvertTypesDofnInvoker$49c2d6dc.invokeProcessElement(Unknown Source)'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.corp.pipelines.woodwind.engine.common.transforms.BaseDofn'}</p>
                                      <p className="text-red-400 pl-8">{'.processElement(BaseDofn.java:27)'}</p>
                                      <p className="text-red-400 pl-4">{'at org.apache.beam.fn.harness.data.PCollectionConsumerRegistry'}</p>
                                      <p className="text-red-400 pl-8">{'$MetricTrackingFnDataReceiver.accept(PCollectionConsumerRegistry.java:375)'}</p>
                                      <p className="text-red-400 mt-1">{'Caused by: java.lang.NumberFormatException: For input string: "2495245546"'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.corp.databridge.sdk.propertysheet.mem.StringValue.asInt(StringValue.kt:88)'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.corp.pipelines.woodwind.engine.dataflow.steps.utility'}</p>
                                      <p className="text-red-400 pl-8">{'.PropertySheetReader.writeField(ConvertTypesDofn.java:178)'}</p>
                                      <p className="text-red-400 mt-1">{'Caused by: java.lang.UnsupportedOperationException: cannot convert "2495245546" to int'}</p>
                                      <p className="text-red-400 pl-4">{'at com.google.corp.databridge.sdk.propertysheet.mem.StringValue.asInt(StringValue.kt:88)'}</p>
                                      <p className="text-slate-500 mt-1">{'[2026-04-06 03:01:08] INFO  Pipeline terminated. Exit code: 1'}</p>
                                    </div>
                                    <p className="text-sm font-bold text-purple-800 mb-2">Root Cause:</p>
                                    <div className="space-y-2.5">
                                      <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">1</span>
                                        <p className="text-sm text-slate-700"><span className="font-semibold">NumberFormatException / UnsupportedOperationException:</span> Step <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">Convert_Search_Fields 2</span> has its output type configured as <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">INT32</span>, but the incoming Salesforce ID value <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">2495245546</span> exceeds the INT32 maximum of 2,147,483,647.</p>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">2</span>
                                        <p className="text-sm text-slate-700"><span className="font-semibold">Field schema mismatch:</span> <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">StringValue.asInt()</span> in <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">corp/databridge/sdk/propertysheet</span> cannot cast the value to int — the field requires <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">INT64</span> to safely handle large Salesforce numeric IDs.</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

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
                            if (agentTicket?.id === 'b/452279135' && gsd100RecDone) return <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Duplicate Identified</span>;
                            if (agentTicket?.id === 'b/452279135' && gsd100DupDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Analysing <ThinkingDots /></span>;
                            if (agentTicket?.id === 'b/452279135') return <span className="text-sm text-slate-400 font-medium">Pending...</span>;
                            if (agentTicket?.id === 'b/448326226' && b448RecDone) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 'b/448326226' && b448RcaDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 'b/448326226') return <span className="text-sm text-slate-400 font-medium">Pending...</span>;
                            if (agentTicket?.id === 'b/471136666' && b471RecDone) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 'b/471136666' && b471RcaDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 'b/471136666') return <span className="text-sm text-slate-400 font-medium">Pending...</span>;
                            if (agentTicket?.id === 'b/446740953' && b446RecDone) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Recommendations Ready</span>;
                            if (agentTicket?.id === 'b/446740953' && b446RcaDone) return <span className="flex items-center gap-1.5 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>;
                            if (agentTicket?.id === 'b/446740953') return <span className="text-sm text-slate-400 font-medium">Pending...</span>;
                            if (pipeline?.historicalMatch) return <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Match Found</span>;
                            if (pipeline?.isDuplicateOf) return <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">Skipped</span>;
                            if (pipeline?.kbArticlesOnly) return <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1"><BookOpen className="w-3 h-3" /> KB Articles Found</span>;
                            if (agentTicket?.id === 'b/448326226' || agentTicket?.id === 'b/452279135' || agentTicket?.id === 'b/471136666') return null;
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
                        {/* b/452279135 Recommendation Agent — duplicate */}
                        {agentTicket?.id === 'b/452279135' && gsd100RecDone && (
                          <div className="mt-2">
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-start gap-2.5">
                              <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-orange-700 mb-0.5">Duplicate Ticket</p>
                                <p className="text-sm text-slate-700">This is a duplicate ticket. Please refer to the parent ticket <span className="font-bold text-indigo-600">b/448326226</span> for resolution.</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* b/448326226 Recommendation Agent — knowledge platform search + resolution steps */}
                        {agentTicket?.id === 'b/448326226' && b448RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-amber-700">Knowledge Platform Search</p>
                                {!b448RecDone
                                  ? <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {b448RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-amber-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {b448RecDone && (
                                <div className="mt-3 pt-2 border-t border-amber-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm font-semibold text-amber-700">Sources:</p>
                                    {['g3doc', 'Yaqs', 'MoMA'].map(src => (
                                      <span key={src} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">{src}</span>
                                    ))}
                                  </div>
                                  <p className="text-sm font-bold text-amber-800 mb-2">Standard Resolution Steps:</p>
                                  <div className="space-y-2">
                                    {[
                                      'Open the SalesforceToCapacitor - UAT pipeline configuration and identify the MPM package: corp/salesforcehub/integrations/sawmill/salesforce_sawmill_d_v7_pipeline.',
                                      'Apply the UAT label to the latest MPM version that includes cl/816241916 (built after 2025-10-31) to replace the stale build.',
                                      'Update the sub-transformation path from relative to absolute in the pipeline step configuration to fix the NullPointerException.',
                                      'Validate IAM permissions for the pipeline service account on /google_src/files/head/depot/google3/corp/salesforcehub/integrations/sawmill/.',
                                      'Re-trigger the SalesforceToCapacitor - UAT pipeline run and monitor execution logs in Databridge.',
                                      'Confirm successful completion with no PermissionDeniedException or NullPointerException in the run log.',
                                      'Notify the reporter (prasadbabuk@google.com) once pipeline is confirmed healthy and close the ticket.',
                                    ].map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {/* b/471136666 Recommendation Agent — resolution steps */}
                        {agentTicket?.id === 'b/471136666' && b471RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-amber-700">Knowledge Platform Search</p>
                                {!b471RecDone
                                  ? <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {b471RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-amber-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {b471RecDone && (
                                <div className="mt-3 pt-2 border-t border-amber-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm font-semibold text-amber-700">Sources:</p>
                                    {['g3doc', 'Yaqs', 'MoMA'].map(src => (
                                      <span key={src} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">{src}</span>
                                    ))}
                                  </div>
                                  <p className="text-sm font-bold text-amber-800 mb-2">Resolution Steps:</p>
                                  <div className="space-y-2">
                                    {[
                                      'Document the INT32 overflow root cause — Salesforce ID "2495245546" exceeds INT32 max (2,147,483,647), triggering NumberFormatException in Convert_Search_Fields 2.',
                                      'File a follow-up task to update Convert_Search_Fields 2 output type from INT32 → INT64 in the pipeline schema to prevent recurrence with large Salesforce IDs.',
                                      "Mark this ticket as Transient / Won't Fix for this occurrence — the pipeline self-recovered on retry and no immediate manual intervention is required.",
                                      'Notify the reporter (subbu@company.com) that the root cause has been identified and a permanent schema fix has been scheduled.',
                                    ].map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {/* b/446740953 Recommendation Agent — resolution steps */}
                        {agentTicket?.id === 'b/446740953' && b446RecSteps.length > 0 && (
                          <div className="mt-2 space-y-3">
                            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-amber-700">Knowledge Platform Search</p>
                                {!b446RecDone
                                  ? <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">Searching <ThinkingDots /></span>
                                  : <span className="text-sm font-bold text-amber-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Found</span>}
                              </div>
                              <div className="space-y-1 font-mono">
                                {b446RecSteps.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <span className="text-amber-400">*</span><span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              {b446RecDone && (
                                <div className="mt-3 pt-2 border-t border-amber-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm font-semibold text-amber-700">Sources:</p>
                                    {['g3doc', 'Yaqs', 'MoMA'].map(src => (
                                      <span key={src} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">{src}</span>
                                    ))}
                                  </div>
                                  <p className="text-sm font-bold text-amber-800 mb-2">Resolution Steps:</p>
                                  <div className="space-y-2">
                                    {[
                                      'Investigate the availability of the EventLogFileCSV API endpoint — check with the Gin Integration team whether the endpoint experienced an outage around Mar 20, 3:00 PM.',
                                      'Review the Gin Integration Setup Request ticket b/438480218 (completed Sep 19) for any endpoint configuration changes that may have broken the READ-BY-ID operation.',
                                      'Validate the pipeline step configuration for EventLogFileCSV — confirm the endpoint URL, authentication credentials, and READ-BY-ID parameters are correct.',
                                      'Re-trigger the [PROD] Salesforce to Gin Integration - Google Play Merchandising Prod pipeline and monitor EventLogFileCSV endpoint response during execution.',
                                      'Notify the reporter (mdb.databridge-workflow-controller@google.com) once the pipeline is confirmed healthy and close the ticket.',
                                    ].map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {agentTicket?.id !== 'b/452279135' && agentTicket?.id !== 'b/448326226' && agentTicket?.id !== 'b/471136666' && agentTicket?.id !== 'b/446740953' && !isThinking && routingTicketId !== agentSelectedTicketId && (
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

                  {/* LifecycleOps Agent Card — b/452279135: duplicate ticket */}
                  {agentTicket?.id === 'b/452279135' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                          <RefreshCw className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">LifecycleOps Agent</p>
                            {gsd100LifecycleDone
                              ? <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Duplicate Confirmed</span>
                              : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {gsd100LifecycleDone && (
                            <div className="mt-2">
                              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-start gap-2.5">
                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-bold text-orange-700 mb-0.5">Duplicate Ticket</p>
                                  <p className="text-sm text-slate-700">This is a duplicate ticket. Please refer to the parent ticket <span className="font-bold text-indigo-600">b/448326226</span> for resolution.</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LifecycleOps Agent Card — b/448326226: Recent Run also failed */}
                  {agentTicket?.id === 'b/448326226' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                          <RefreshCw className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">LifecycleOps Agent</p>
                            {b448LifecycleDone
                              ? <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Reopen Recommended</span>
                              : b448LifecycleSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-teal-500 font-medium">Checking <ThinkingDots /></span>
                                : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {b448LifecycleSteps.length > 0 && (
                            <div className="mt-2">
                              <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-teal-700">Recent Run Verification</p>
                                  {!b448LifecycleDone
                                    ? <span className="flex items-center gap-1 text-sm text-teal-500 font-medium">Checking <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Failed</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {b448LifecycleSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-teal-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {b448LifecycleDone && (
                                  <div className="mt-3 pt-2 border-t border-teal-100 space-y-3">
                                    {/* Recent Run failure banner */}
                                    <div className="flex items-start gap-2.5 p-2.5 bg-red-50 rounded-lg border border-red-200">
                                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-bold text-red-700 mb-0.5">Recent Run Failed</p>
                                        <p className="text-sm text-slate-600">Pipeline run on <span className="font-semibold">11 Apr 2026 at 11:15 AM</span> encountered the same errors — confirming this is an active, unresolved issue.</p>
                                      </div>
                                    </div>
                                    {/* Failed run log */}
                                    <div>
                                      <p className="text-sm font-bold text-slate-700 mb-1.5">Recent Run Log:</p>
                                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-0.5 overflow-x-auto">
                                        <p className="text-slate-400 whitespace-nowrap">{'[2026-04-11 11:15:02] INFO  Databridge pipeline started: SalesforceToCapacitor - UAT'}</p>
                                        <p className="text-slate-400 whitespace-nowrap">{'[2026-04-11 11:15:04] INFO  Fetching MPM package: corp/salesforcehub/integrations/sawmill/salesforce_sawmill_d_v7_pipeline'}</p>
                                        <p className="text-yellow-400 whitespace-nowrap">{'[2026-04-11 11:15:07] WARN  MPM build date: 2025-09-14 — predates required fix (cl/816241916, 2025-10-31)'}</p>
                                        <p className="text-red-400 whitespace-nowrap">{'[2026-04-11 11:15:09] ERROR Step Transform_Salesforce_Data FAILED'}</p>
                                        <p className="text-red-400 whitespace-nowrap mt-1">{'Caused by: java.lang.NullPointerException: Cannot resolve sub-transformation path'}</p>
                                        <p className="text-red-400 whitespace-nowrap pl-4">{'at com.google.corp.salesforcehub.integrations.sawmill.SalesforceTransformDofn.invoke(SalesforceTransformDofn.java:142)'}</p>
                                        <p className="text-red-400 whitespace-nowrap mt-1">{'[2026-04-11 11:15:09] ERROR PermissionDeniedException: Access denied on /google_src/files/head/depot/google3/corp/salesforcehub/'}</p>
                                        <p className="text-slate-500 whitespace-nowrap mt-1">{'[2026-04-11 11:15:09] INFO  Pipeline terminated. Exit code: 1'}</p>
                                      </div>
                                    </div>
                                    {/* Reopen recommendation */}
                                    <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
                                      <p className="text-sm font-bold text-red-700 mb-1.5">Lifecycle Recommendation</p>
                                      <p className="text-sm text-slate-600">Issue is active and recurring. This ticket should be <span className="font-semibold text-red-700">reopened</span> — immediate action required.</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LifecycleOps Agent Card — b/471136666 only */}
                  {agentTicket?.id === 'b/471136666' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                          <RefreshCw className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">LifecycleOps Agent</p>
                            {b471LifecycleDone
                              ? <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Close Recommended</span>
                              : b471LifecycleSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-teal-500 font-medium">Checking <ThinkingDots /></span>
                                : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {b471LifecycleSteps.length > 0 && (
                            <div className="mt-2">
                              <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-teal-700">Recent Run Verification</p>
                                  {!b471LifecycleDone
                                    ? <span className="flex items-center gap-1 text-sm text-teal-500 font-medium">Checking <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> Verified</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {b471LifecycleSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-teal-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {b471LifecycleDone && (
                                  <div className="mt-3 pt-2 border-t border-teal-100 space-y-3">
                                    {/* Recent Run success banner */}
                                    <div className="flex items-start gap-2.5 p-2.5 bg-green-50 rounded-lg border border-green-200">
                                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-bold text-green-700 mb-0.5">Recent Run Successful</p>
                                        <p className="text-sm text-slate-600">Pipeline run on <span className="font-semibold">6 Apr 2026 at 03:47 AM</span> completed with no errors — confirming a transient data-driven failure.</p>
                                      </div>
                                    </div>
                                    {/* Successful run log */}
                                    <div>
                                      <p className="text-sm font-bold text-slate-700 mb-1.5">Recent Run Log:</p>
                                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-0.5">
                                        <p className="text-slate-400">{'[2026-04-06 03:47:12] INFO  Databridge pipeline started: [PROD] Salesforce to Gin Integration - Android BD Prod'}</p>
                                        <p className="text-slate-400">{'[2026-04-06 03:47:14] INFO  Step Convert_Search_Fields 2 — processing records...'}</p>
                                        <p className="text-green-400">{'[2026-04-06 03:47:31] INFO  Step Convert_Search_Fields 2 completed — 1,247 records processed'}</p>
                                        <p className="text-green-400">{'[2026-04-06 03:47:45] INFO  Pipeline completed successfully. Exit code: 0'}</p>
                                      </div>
                                    </div>
                                    {/* Close recommendation */}
                                    <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
                                      <p className="text-sm font-bold text-green-700 mb-1.5">Lifecycle Recommendation</p>
                                      <p className="text-sm text-slate-600">Transient failure confirmed — Recent Run succeeded without intervention. This ticket can be <span className="font-semibold text-green-700">closed</span>. No service disruption persists.</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LifecycleOps Agent Card — b/446740953: Recent Run also failed, open 2 months */}
                  {agentTicket?.id === 'b/446740953' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                          <RefreshCw className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-slate-800">LifecycleOps Agent</p>
                            {b446LifecycleDone
                              ? <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Reopen Recommended</span>
                              : b446LifecycleSteps.length > 0
                                ? <span className="flex items-center gap-1.5 text-sm text-teal-500 font-medium">Checking <ThinkingDots /></span>
                                : <span className="text-sm text-slate-400 font-medium">Pending...</span>}
                          </div>
                          {b446LifecycleSteps.length > 0 && (
                            <div className="mt-2">
                              <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-100">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-teal-700">Recent Run Verification</p>
                                  {!b446LifecycleDone
                                    ? <span className="flex items-center gap-1 text-sm text-teal-500 font-medium">Checking <ThinkingDots /></span>
                                    : <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Failed</span>}
                                </div>
                                <div className="space-y-1 font-mono">
                                  {b446LifecycleSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <span className="text-teal-400">*</span><span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                                {b446LifecycleDone && (
                                  <div className="mt-3 pt-2 border-t border-teal-100 space-y-3">
                                    {/* Open 2 months alert */}
                                    <div className="flex items-start gap-2.5 p-2.5 bg-orange-50 rounded-lg border border-orange-200">
                                      <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-bold text-orange-700 mb-0.5">Ticket Open for 2 Months</p>
                                        <p className="text-sm text-slate-600">This ticket has been open since <span className="font-semibold">20 Mar 2026</span> with no resolution. Immediate escalation required.</p>
                                      </div>
                                    </div>
                                    {/* Recent Run failure banner */}
                                    <div className="flex items-start gap-2.5 p-2.5 bg-red-50 rounded-lg border border-red-200">
                                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-bold text-red-700 mb-0.5">Recent Run Failed</p>
                                        <p className="text-sm text-slate-600">Pipeline run on <span className="font-semibold">20 May 2026 at 15:30 PM</span> encountered the same EventLogFileCSV endpoint failure — issue is active and unresolved.</p>
                                      </div>
                                    </div>
                                    {/* Failed run log */}
                                    <div>
                                      <p className="text-sm font-bold text-slate-700 mb-1.5">Recent Run Log:</p>
                                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-0.5 overflow-x-auto">
                                        <p className="text-slate-400 whitespace-nowrap">{'[2026-03-20 15:30:14] INFO  Databridge pipeline started: [PROD] Salesforce to Gin Integration - Google Play Merchandising Prod'}</p>
                                        <p className="text-slate-400 whitespace-nowrap">{'[2026-03-20 15:30:16] INFO  Initialising step: EventLogFileCSV — operation READ-BY-ID'}</p>
                                        <p className="text-yellow-400 whitespace-nowrap">{'[2026-03-20 15:30:18] WARN  Endpoint "EventLogFileCSV" READ-BY-ID attempt 1/5 — no response'}</p>
                                        <p className="text-yellow-400 whitespace-nowrap">{'[2026-03-20 15:30:24] WARN  Endpoint "EventLogFileCSV" READ-BY-ID attempt 3/5 — timeout'}</p>
                                        <p className="text-red-400 whitespace-nowrap">{'[2026-03-20 15:30:33] ERROR Endpoint "EventLogFileCSV" READ-BY-ID attempt 5/5 — FAILED'}</p>
                                        <p className="text-red-400 whitespace-nowrap mt-1">{'Completed work item 2318146419733207274 UNSUCCESSFULLY: UNKNOWN:'}</p>
                                        <p className="text-red-400 whitespace-nowrap pl-4">{'  org.apache.beam.sdk.util.UserCodeException'}</p>
                                        <p className="text-red-400 whitespace-nowrap pl-4">{'  at org.apache.beam.sdk.util.UserCodeException.wrap(UserCodeException.java:39)'}</p>
                                        <p className="text-red-400 whitespace-nowrap mt-1">{'Caused by: java.lang.RuntimeException: Endpoint "EventLogFileCSV", op READ-BY-ID:'}</p>
                                        <p className="text-red-400 whitespace-nowrap pl-4">{'  failed: 5 total operations, last error: API endpoint unavailable'}</p>
                                        <p className="text-red-400 whitespace-nowrap mt-1">{'Caused by: org.apache.beam.sdk.util.UserCodeException: java.lang.IllegalStateException:'}</p>
                                        <p className="text-red-400 whitespace-nowrap pl-4">{'  Step [TransformOfFcEventsData>EventLogFileCSV] has failed'}</p>
                                        <p className="text-slate-500 whitespace-nowrap mt-1">{'[2026-03-20 15:49:16] INFO  Pipeline terminated. Exit code: 1'}</p>
                                      </div>
                                    </div>
                                    {/* Reopen recommendation */}
                                    <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
                                      <p className="text-sm font-bold text-red-700 mb-1.5">Lifecycle Recommendation</p>
                                      <p className="text-sm text-slate-600">Issue is active and recurring. This ticket has been open for <span className="font-semibold text-red-700">2 months</span> — immediate escalation and resolution required.</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

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
                    {agentKBMessages.length > 0 && (
                      <div className="mb-2 space-y-2 max-h-[28rem] overflow-y-auto">
                        {agentKBMessages.map((m, i) => (
                          <div key={i} className="flex flex-col gap-2">
                            {/* User message */}
                            {m.role === 'user' && (
                              <div className="flex justify-end">
                                <div className="w-full px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap bg-indigo-600 text-white rounded-br-sm">
                                  {m.text}
                                </div>
                              </div>
                            )}

                            {/* Bot: telemetry card */}
                            {m.role === 'bot' && m.steps && m.steps.length > 0 && (
                              <div className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Knowledge Base Search</p>
                                <div className="space-y-1 font-mono">
                                  {m.steps.map((step, si) => (
                                    <div key={si} className="flex items-center gap-1.5 text-xs text-slate-500">
                                      <span className="text-slate-400">*</span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                  {!m.done && (
                                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-1">Scanning <ThinkingDots /></div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Bot: answer card */}
                            {m.role === 'bot' && m.done && (m.text || (m.links && m.links.length > 0)) && (
                              <div className="w-full px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm leading-relaxed">
                                {m.text && <p className="whitespace-pre-wrap mb-2">{m.text}</p>}
                                {m.links && m.links.length > 0 && (
                                  <div className="space-y-1.5">
                                    {m.links.map((link, li) => (
                                      <div key={li} className="flex items-start gap-1.5">
                                        <span className="text-slate-400 text-xs flex-shrink-0 mt-0.5">{li + 1}.</span>
                                        <div className="flex-1 min-w-0">
                                          <a href="#" onClick={e => e.preventDefault()}
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs underline underline-offset-2 inline-flex items-center gap-0.5">
                                            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                            {link.id}
                                          </a>
                                          <span className="text-xs text-slate-500"> · {link.date}</span>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-xs text-slate-500">Priority: {link.priority}</span>
                                            <span className="text-xs text-slate-300">·</span>
                                            <span className="text-xs text-slate-500">Type: {link.type}</span>
                                            <span className="text-xs text-slate-300">·</span>
                                            <span className="text-xs text-slate-500">Severity: {link.severity}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Bot: plain text answer (no telemetry) */}
                            {m.role === 'bot' && !m.steps && (
                              <div className="w-full px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap bg-slate-100 text-slate-700 rounded-bl-sm">
                                {m.text}
                              </div>
                            )}
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
                        { label: 'Priority', value: agentTicket.id === 'b/448326226' ? 'P1' : 'P2', color: 'text-orange-600 font-semibold' },
                        { label: 'Type', value: 'Bug' },
                        { label: 'Severity', value: agentTicket.id === 'b/448326226' ? 'S1' : 'S2', color: 'text-orange-600 font-semibold' },
                        { label: 'State', value: agentTicket.status, color: 'text-green-600' },
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
    <>
      {/* User profile — fixed top-right */}
      <div className="fixed top-0 right-0 z-50 flex items-center gap-2 px-4 py-2 bg-white border-b border-l border-slate-200 rounded-bl-xl shadow-sm">
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-800 leading-tight">Shivam Gupta</p>
          <p className="text-xs text-slate-400 leading-tight">L1 Support</p>
        </div>
        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">SG</div>
      </div>
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
    </>
  );
};

export default App;

