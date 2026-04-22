export const SCENARIO_LIBRARY = [
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

export const PAST_RESOLUTIONS = [
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

export const ESCALATION_AGENTS = [
  { agent: 'Sarah Mitchell', department: 'L2 Infrastructure' },
  { agent: 'James Okafor', department: 'L2 Applications' },
  { agent: 'Priya Nair', department: 'L2 Platform Engineering' },
];

export function matchScenario(description) {
  const lower = description.toLowerCase();
  const scored = SCENARIO_LIBRARY.map(s => {
    const keywords = s.scenario.toLowerCase().split(/\W+/);
    const hits = keywords.filter(k => k.length > 3 && lower.includes(k)).length;
    return { ...s, hits };
  });
  const best = scored.sort((a, b) => b.hits - a.hits)[0];
  return best?.hits > 0 ? best : null;
}

export function matchPastResolution(text) {
  const lower = text.toLowerCase();
  const scored = PAST_RESOLUTIONS.map(r => {
    const hits = r.keywords.filter(k => lower.includes(k)).length;
    return { ...r, hits };
  });
  const best = scored.sort((a, b) => b.hits - a.hits)[0];
  return best?.hits > 0 ? best : null;
}
