import React, { useState, useEffect } from 'react';
import {
  Search, Inbox, Cpu, GitBranch, Database,
  Zap, BookOpen, UserCheck, Check, Terminal, CheckCircle, Layers, Send,
  Tag, Link, Clock, AlertTriangle, Server, Phone, ExternalLink, Copy
} from 'lucide-react';

// ── Pre-existing sample tickets shown in agent queue ──────────────────────────
const SAMPLE_TICKETS = [
  {
    id: 'GSD-139',
    email: 'arjun.mehta@company.com',
    description: 'Kubernetes pods in payments-service namespace are crash looping. CrashLoopBackOff on all 3 replicas since this morning.',
    status: 'Open',
    createdAt: '4 Apr 2026, 11:48 AM',
    hasUpdate: true,
    isSample: true,
    comments: [
      {
        author: 'AI Agent',
        role: 'bot',
        timestamp: '11:49 AM',
        missingFields: [
          { label: 'Namespace & Pod Name' },
          { label: 'Error Logs / Exit Code' },
          { label: 'Recent Deployment Changes' },
        ],
      },
      {
        author: 'arjun.mehta@company.com',
        role: 'user',
        timestamp: '11:54 AM',
        text: 'Namespace: payments-service | Pods: payment-processor-7d9f6b-* (3 replicas all failing)\n\nError Logs / Exit Code: kubectl logs --previous shows "java.lang.OutOfMemoryError: Java heap space" followed by exit code 137 (OOMKilled). The JVM is hitting the container memory limit on startup.\n\nRecent Deployment Changes: We pushed a new build at 10:45 AM today (v2.4.1) that increased the thread pool size and added a new in-memory cache layer. No changes were made to the resource limits in the deployment manifest — they were last set 3 months ago at 512Mi memory limit.',
      },
    ],
  },
  {
    id: 'GSD-130',
    email: 'priya.verma@company.com',
    description: 'I am unable to log in to my Snowflake account. It shows that my user is locked due to multiple failed login attempts.',
    status: 'Open',
    createdAt: '4 Apr 2026, 8:30 AM',
    hasUpdate: true,
    isSample: true,
    comments: [
      {
        author: 'AI Agent',
        role: 'bot',
        timestamp: '8:31 AM',
        missingFields: [
          { label: 'Browser & Environment' },
          { label: 'Steps to Reproduce' },
          { label: 'Impact' },
        ],
      },
      {
        author: 'priya.verma@company.com',
        role: 'user',
        timestamp: '8:40 AM',
        text: 'Browser & Environment:\nUsing Google Chrome on Production\n\nSteps to Reproduce:\nOpen Snowflake login page\nEnter username and password\nError message: "User is locked. Contact your administrator."\n\nImpact:\nOnly affecting me (single user issue)',
      },
    ],
  },
  {
    id: 'GSD-145',
    email: 'divya.sharma@company.com',
    description: 'Kubernetes pods in order-service namespace crashing with OOMKilled. All replicas in CrashLoopBackOff since deployment at 9:30 AM. Memory limit was not updated with the new build.',
    status: 'Open',
    createdAt: '4 Apr 2026, 9:55 AM',
    comments: [],
    hasUpdate: false,
    isSample: true,
  },
  {
    id: 'GSD-150',
    email: 'nisha.kapoor@company.com',
    description: 'Salesforce API integration is failing intermittently.',
    status: 'Open',
    createdAt: '4 Apr 2026, 10:25 AM',
    hasUpdate: true,
    isSample: true,
    comments: [
      {
        author: 'AI Agent',
        role: 'bot',
        timestamp: '10:26 AM',
        missingFields: [
          { label: 'Error Message / Status Code' },
          { label: 'Integration Tool' },
          { label: 'API Limits Usage' },
          { label: 'Business Impact' },
        ],
      },
      {
        author: 'nisha.kapoor@company.com',
        role: 'user',
        timestamp: '10:35 AM',
        text: 'Error: HTTP 429 - Too Many Requests\nTool: MuleSoft\nFrequency: During peak hours\nAPI usage: Near limit\nImpact: Data sync delays',
      },
    ],
  },
  {
    id: 'GSD-153',
    email: 'amit.sharma@company.com',
    description: 'GitHub Actions CI pipeline failing on main branch after merging latest PR. Build step exits with code 1.',
    status: 'Open',
    createdAt: '4 Apr 2026, 11:40 AM',
    comments: [],
    hasUpdate: false,
    isSample: true,
  },
  {
    id: 'GSD-157',
    email: 'pooja.menon@company.com',
    description: 'Redis cache eviction rate spiking — cache hit ratio dropped from 94% to 61% after config change this morning.',
    status: 'Open',
    createdAt: '4 Apr 2026, 12:15 PM',
    comments: [],
    hasUpdate: false,
    isSample: true,
  },
];

const ThinkingDots = ({ color = 'blue' }) => (
  <span className="flex gap-0.5 items-center">
    {[0, 150, 300].map(d => (
      <span key={d} className={`w-1 h-1 bg-${color}-400 rounded-full animate-bounce`} style={{ animationDelay: `${d}ms` }} />
    ))}
  </span>
);

const S3_STEPS = [
  'Loading scenario library…',
  'Tokenising incident description…',
  'Matching keyword intent patterns…',
  'Scoring confidence across scenarios…',
];
const S4_STEPS = [
  'Connecting to resolution knowledge base…',
  'Embedding incident context…',
  'Computing similarity scores…',
  'Ranking top historical matches…',
  'Querying KB article index…',
  'Linking related knowledge base articles…',
];
const DUP_STEPS = [
  'Scanning active incident queue…',
  'Embedding ticket description for similarity check…',
  'Comparing against open tickets…',
  'Querying resolved ticket history…',
  'Evaluating similarity threshold…',
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
  const [dupSteps, setDupSteps] = useState([]);
  const [dupDone, setDupDone] = useState(false);
  const [s3Steps, setS3Steps] = useState([]);
  const [s4Steps, setS4Steps] = useState([]);
  const [s3Done, setS3Done] = useState(false);
  const [s4Done, setS4Done] = useState(false);
  const [s3AnimSolution, setS3AnimSolution] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

    setDupSteps([]);
    setDupDone(false);
    setS3Steps([]);
    setS4Steps([]);
    setS3Done(false);
    setS4Done(false);
    setS3AnimSolution(null);

    const ticket = allQueueTickets.find(t => t.id === agentSelectedTicketId);
    const match = ticket ? matchScenario(ticket.description) : null;

    const showsDupCard = ['GSD-130', 'GSD-139', 'GSD-145', 'GSD-150'].includes(agentSelectedTicketId);
    const dupOffset = showsDupCard ? 5500 : 0;

    const timers = [];
    if (showsDupCard) {
      DUP_STEPS.forEach((step, i) => {
        timers.push(setTimeout(() => setDupSteps(prev => [...prev, step]), i * 900));
      });
      timers.push(setTimeout(() => setDupDone(true), DUP_STEPS.length * 900));
    }
    S3_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setS3Steps(prev => [...prev, step]), dupOffset + i * 2000));
    });
    timers.push(setTimeout(() => setS3AnimSolution(match || 'none'), dupOffset + 6500));
    S4_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => setS4Steps(prev => [...prev, step]), dupOffset + 7500 + i * 2000));
    });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routingTicketId, agentSelectedTicketId]);

  useEffect(() => {
    if (agentSelectedTicketId != null && routingTicketId == null) {
      setDupDone(true);
      setS3Done(true);
      setS4Done(true);
    }
  }, [routingTicketId, agentSelectedTicketId]);

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
  const sopResolutionText = resolutionComment?.solution
    || (resolutionComment?.matchedScenario ? scenarioLibrary.find(s => s.scenario === resolutionComment.matchedScenario.scenario)?.solution : null);
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
    const subStepDefs = ticketId === 'GSD-130' ? {
      0: ['Connected to Snowflake Admin Console (account: prod-01.us-east-1)', 'Navigating to Admin → Users & Roles → priya.verma@company.com', 'User status: LOCKED — 8 failed login attempts recorded'],
      2: ['Executing: ALTER USER "PRIYA.VERMA" SET PASSWORD = \'[temp_secure_pwd]\'', 'Temporary password set — sending via IT secure messaging channel', 'Password reset acknowledged — user notified via email'],
      4: ['Checking MFA enforcement policy for user role: DATA_ANALYST', 'MFA: Required — Duo authenticator linked and active', 'IP allowlist: Production network confirmed — Chrome/Production environment valid'],
    } : ticketId === 'GSD-150' ? {
      0: ['Authenticating to Salesforce via OAuth2 (client_id: sf-int-prod)', 'GET /services/data/v58.0/limits → API_REQUESTS: 187,432 / 200,000', 'API usage at 93.7% — HTTP 429 rate-limit threshold confirmed'],
      1: ['Connecting to prod-mulesoft-01 via management API', 'Fetching HTTP connector config for Salesforce integration flow', 'Injecting retry policy: base 2s, max 3 retries on HTTP 429'],
      3: ['Configuring Salesforce platform event alert at 80% quota (160,000 calls)', 'Alert rule saved → notifying devops@company.com on breach', 'Test alert fired — email delivery confirmed'],
    } : {
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
                if (!hasBeenRouted) {
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
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">{agentTicket.email[0].toUpperCase()}</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{agentTicket.email}</p>
                      <p className="text-[10px] text-slate-400">Employee</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Assigned To</p>
                  {(() => {
                    const assigneeMap = {
                      'GSD-139': { agent: 'Priya Nair', department: 'L2 Platform Engineering' },
                      'GSD-145': { agent: 'Priya Nair', department: 'L2 Platform Engineering' },
                      'GSD-130': { agent: 'Kiran Mehta', department: 'L2 Data Engineering' },
                      'GSD-150': { agent: 'Nisha Kapoor', department: 'L2 Integration Engineering' },
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
                          return (
                            <div className="mt-2 space-y-2">
                              <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-100">
                                <p className="text-[10px] font-bold text-orange-600 mb-1.5">Missing fields requested from requester:</p>
                                <div className="flex flex-wrap gap-1">
                                  {pipeline.enrichment.missingFields.map((f, i) => (
                                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${enrichmentResolved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-orange-700 border-orange-200'}`}>
                                      {enrichmentResolved && <CheckCircle className="w-2.5 h-2.5" />}{f.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {enrichmentResolved && reporterReply && (
                                <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                                  <p className="text-[10px] font-bold text-blue-600 mb-1">Context provided by reporter:</p>
                                  <p className="text-[11px] text-slate-700 leading-relaxed italic whitespace-pre-wrap">"{reporterReply.text}"</p>
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

                  {/* Duplication Identification Card — GSD-139, GSD-145, GSD-130, GSD-150 */}
                  {(agentTicket.id === 'GSD-139' || agentTicket.id === 'GSD-145' || agentTicket.id === 'GSD-130' || agentTicket.id === 'GSD-150') && !isThinking && (
                    <div className={`bg-white rounded-xl border p-4 shadow-sm ${agentTicket.id === 'GSD-145' ? 'border-red-200' : 'border-slate-200'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${agentTicket.id === 'GSD-145' ? 'bg-red-50 border border-red-100' : 'bg-slate-50 border border-slate-200'}`}>
                          <Copy className={`w-4 h-4 ${agentTicket.id === 'GSD-145' ? 'text-red-500' : 'text-slate-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className={`text-[9px] font-bold uppercase tracking-wider ${agentTicket.id === 'GSD-145' ? 'text-red-400' : 'text-slate-400'}`}>Agent</span>
                              <p className="text-xs font-bold text-slate-800">Duplication Identification</p>
                            </div>
                            {routingTicketId === agentSelectedTicketId && !dupDone ? (
                              <span className="flex items-center gap-1.5 text-[10px] text-blue-500 font-medium">Scanning <ThinkingDots /></span>
                            ) : agentTicket.id === 'GSD-145' ? (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Duplicate Detected
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                                <Check className="w-3 h-3" /> No Duplicate Found
                              </span>
                            )}
                          </div>
                          {routingTicketId === agentSelectedTicketId && dupSteps.length > 0 && (
                            <div className="mt-2 space-y-1 font-mono">
                              {dupSteps.map((step, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                  <span className="text-slate-400">›</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {dupDone && (
                            agentTicket.id === 'GSD-145' ? (
                              <div className="mt-2 p-2.5 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-[11px] text-red-700 font-medium">This ticket is a duplicate of an active incident:</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                  <span className="font-mono text-[11px] font-bold text-red-800">GSD-139</span>
                                  <span className="text-[10px] text-red-600">Kubernetes pods in payments-service namespace — CrashLoopBackOff (OOMKilled)</span>
                                </div>
                                <p className="text-[10px] text-red-500 mt-1.5">Opened 4 Apr 2026, 11:48 AM · Assigned to Priya Nair · L2 Platform Engineering</p>
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-500 mt-0.5">Scanned active and resolved tickets — no duplicate or parent incident detected for this issue.</p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* S3 Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                        <GitBranch className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Agent</span>
                            <p className="text-xs font-bold text-slate-800">Scenario / SOP Mapping</p>
                          </div>
                          {(() => {
                            const isRouting = routingTicketId === agentSelectedTicketId;
                            if (isRouting && s3AnimSolution && s3AnimSolution !== 'none') return <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Match Found</span>;
                            if (isRouting && s3AnimSolution === 'none') return <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">No Match</span>;
                            if (isThinking || isRouting) return <span className="flex items-center gap-1.5 text-[10px] text-blue-500 font-medium">Matching <ThinkingDots /></span>;
                            if (pipeline?.sopMatch) return <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Match Found</span>;
                            if (pipeline?.isDuplicateOf) return <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">Skipped</span>;
                            if (s3Done || pipeline) return <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">No Match</span>;
                            return null;
                          })()}
                        </div>
                        {routingTicketId === agentSelectedTicketId && s3Steps.length > 0 && (
                          <div className="mt-2 space-y-1 font-mono">
                            {s3Steps.map((step, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                <span className="text-purple-400">›</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {routingTicketId === agentSelectedTicketId && s3AnimSolution && s3AnimSolution !== 'none' && (
                          <div className="mt-2 p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                            <p className="text-[11px] font-bold text-purple-800">{s3AnimSolution.scenario}</p>
                            <p className="text-[10px] text-purple-500 mt-0.5">{s3AnimSolution.sop} · Intent mapped and SOP retrieved</p>
                            <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap mt-2 pt-2 border-t border-purple-100">{s3AnimSolution.solution}</p>
                          </div>
                        )}
                        {routingTicketId === agentSelectedTicketId && s3AnimSolution === 'none' && (
                          <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="mb-1.5 space-y-0.5 font-mono">
                              {S3_STEPS.map((step, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                  <Check className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                              <p className="text-[11px] text-slate-500 font-medium">No matching SOP found in scenario library.</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Routing to Resolution Recommendation Engine for historical analysis.</p>
                            </div>
                          </div>
                        )}
                        {!isThinking && routingTicketId !== agentSelectedTicketId && (
                          pipeline?.isDuplicateOf ? (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-[11px] text-slate-500">Analysis skipped — this is a duplicate ticket.</p>
                              <p className="text-[11px] text-slate-600 mt-1">Refer to <span className="font-bold text-indigo-600">{pipeline.isDuplicateOf}</span> for SOP mapping and resolution steps.</p>
                            </div>
                          ) : pipeline?.sopMatch ? (
                            <div className="mt-2 p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                              <div className="mb-1.5 space-y-0.5 font-mono">
                                {S3_STEPS.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <Check className="w-2.5 h-2.5 text-purple-400 flex-shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-1.5 pt-1.5 border-t border-purple-100">
                                <p className="text-[11px] font-bold text-purple-800">{pipeline.sopMatch.scenario}</p>
                                <p className="text-[10px] text-purple-500 mt-0.5">{pipeline.sopMatch.sop} · Intent mapped and SOP retrieved</p>
                                {sopResolutionText && <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap mt-2 pt-2 border-t border-purple-100">{sopResolutionText}</p>}
                              </div>
                            </div>
                          ) : (pipeline || s3Done) ? (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="mb-1.5 space-y-0.5 font-mono">
                                {S3_STEPS.map((step, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                    <Check className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                                <p className="text-[11px] text-slate-500 font-medium">No matching SOP found in scenario library.</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Routing to Resolution Recommendation Engine for historical analysis.</p>
                              </div>
                            </div>
                          ) : null
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
                            <p className="text-xs font-bold text-slate-800">Resolution Recommendation Engine</p>
                          </div>
                          {(() => {
                            const isRouting = routingTicketId === agentSelectedTicketId;
                            if (isThinking || isRouting) return <span className="flex items-center gap-1.5 text-[10px] text-blue-500 font-medium">Searching <ThinkingDots /></span>;
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
                        {!isThinking && routingTicketId !== agentSelectedTicketId && (
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
                        const slaMap = { 'GSD-139': '4h remaining', 'GSD-130': '3h remaining', 'GSD-150': '5h remaining' };
                        const sla = slaMap[agentTicket.id];
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
                    <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Support Navigator</p>
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
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5"><GitBranch className="w-2.5 h-2.5 text-purple-600" /></div>
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
            const categoryMap = {
              'GSD-139': { category: 'Infrastructure', subcategory: 'Container Orchestration', ci: 'payments-service / k8s-prod-cluster', service: 'Payment Processing', department: 'Engineering — Platform', location: 'Remote / Bangalore HQ', phone: '+91 98201 34567', tags: ['kubernetes', 'crashloop', 'oom', 'payments', 'prod'], assignmentGroup: 'L2 Platform Engineering', assignedTo: 'Priya Nair', escalationTier: 'L2' },
            };
            const info = categoryMap[agentTicket.id] || { category: 'General IT', subcategory: 'User Support', ci: 'N/A', service: 'Internal IT', department: 'Corporate IT', location: 'HQ', phone: 'N/A', tags: ['it-support'], assignmentGroup: 'L1 Service Desk', assignedTo: 'Unassigned', escalationTier: 'L1' };
            const relatedTickets = {
              'GSD-139': [{ id: 'GSD-112', label: 'OOM on payments worker — Mar 2026', type: 'Related' }, { id: 'GSD-098', label: 'k8s node pressure — Feb 2026', type: 'Parent Problem' }],
            };
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

    const dupOnlyMap = { 'GSD-145': 'GSD-139' };
    const isDupOnly = !!dupOnlyMap[ticketId];
    const dupOffset = ['GSD-130', 'GSD-139', 'GSD-145', 'GSD-150'].includes(ticketId) ? 5500 : 0;
    const totalAnimTime = isDupOnly ? dupOffset : dupOffset + 7500 + S4_STEPS.length * 2000 + 1200;
    setTimeout(() => {
      const escalationOverride = { 'GSD-139': { agent: 'Rohan Desai', department: 'L2 Platform Engineering' }, 'GSD-130': { agent: 'Kiran Mehta', department: 'L3 Cloud Data Platform' }, 'GSD-150': { agent: 'Arjun Mehta', department: 'L3 Integration Engineering' } };
      const escalation = escalationOverride[ticketId] || ESCALATION_AGENTS[Math.floor(Math.random() * ESCALATION_AGENTS.length)];
      if (isDupOnly) {
        const ts = new Date().toLocaleTimeString();
        setTickets(prev => prev.map(t => t.id === ticketId ? {
          ...t,
          comments: [...(t.comments || []), {
            author: 'AI Agent',
            role: 'bot',
            timestamp: ts,
            routedAfterEnrichment: true,
            isDuplicateOf: dupOnlyMap[ticketId],
            escalation: { agent: escalation.agent, department: escalation.department },
            awaitingApproval: false,
          }],
        } : t));
        setRoutingTicketId(null);
        return;
      }
      const kbOnlyMap = {
        'GSD-150': {
          articles: [
            { id: 'KB-6201', title: 'Salesforce API rate limits and best practices', tag: 'Salesforce' },
            { id: 'KB-6185', title: 'MuleSoft integration retry and backoff strategies', tag: 'MuleSoft' },
            { id: 'KB-6170', title: 'Managing Salesforce API call quotas and monitoring', tag: 'API' },
          ],
          steps: [
            '1. Check current API usage in Salesforce Setup → API Usage monitor',
            '2. Configure exponential backoff in MuleSoft HTTP connector for HTTP 429 responses',
            '3. Set API rate-limit policy in MuleSoft to stay 20% below daily quota',
            '4. Enable Salesforce API usage alerts at 80% threshold via platform events',
            '5. Reschedule non-critical batch jobs to off-peak hours to reduce API load',
            '6. Verify data sync pipelines resume without 429 errors after throttling changes',
          ],
        },
      };
      const kbOnly = kbOnlyMap[ticketId] || null;
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
