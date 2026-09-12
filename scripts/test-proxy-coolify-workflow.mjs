#!/usr/bin/env node
/**
 * Contract test for the Coolify proxy deploy migration (task t_f67eba6b).
 * Run: node scripts/test-proxy-coolify-workflow.mjs
 *
 * Validates CI workflow security/trigger semantics and required deployment
 * documentation using only Node built-ins. Never reads secrets or .env files.
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const workflowPath = path.join(root, ".github/workflows/deploy-proxy-coolify.yml");
const docsPath = path.join(root, "docs/deploy/proxy-coolify.md");
const hostingerWorkflowPath = path.join(root, ".github/workflows/deploy-proxy-hostinger.yml");

let failures = 0;
function check(ok, label) {
  if (ok) {
    console.log(`ok - ${label}`);
  } else {
    failures += 1;
    console.error(`FAIL - ${label}`);
  }
}

function readIfExists(p) {
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

const workflow = readIfExists(workflowPath);
const docs = readIfExists(docsPath);
const hostingerWorkflow = readIfExists(hostingerWorkflowPath);

// 1. Workflow exists and no longer ships the Hostinger push deploy.
check(workflow.length > 0, "Coolify workflow file exists (.github/workflows/deploy-proxy-coolify.yml)");
check(
  !/HOSTINGER_[A-Z_]+/.test(workflow),
  "Coolify workflow does not reference Hostinger secrets",
);
check(
  !/rsync|ssh-keyscan|id_ed25519/.test(workflow),
  "Coolify workflow does not use rsync/SSH deployment",
);
check(
  hostingerWorkflow.length === 0,
  "Legacy Hostinger workflow is removed",
);
check(
  !/^\s*push:/m.test(workflow),
  "Coolify workflow does not auto-trigger on push",
);

// 2. Explicit, reusable trigger semantics.
check(
  /build:\s*\n\s+name: Build proxy[\s\S]*?timeout-minutes: 20\s*\n\s+steps:/.test(workflow),
  "Build job has a bounded 20-minute timeout",
);
check(
  /deploy:\s*\n\s+name: Trigger Coolify deployment\s*\n\s+needs: build[\s\S]*?timeout-minutes: 10\s*\n\s+if:/.test(workflow),
  "Deploy job has a bounded 10-minute timeout",
);
check(
  /workflow_dispatch:\s*\n\s*inputs:\s*\n\s*environment:/.test(workflow),
  "Workflow exposes manual workflow_dispatch with an environment input",
);
check(
  /workflow_call:\s*\n\s*inputs:\s*\n\s*environment:/.test(workflow),
  "Workflow exposes reusable workflow_call with an environment input",
);
check(
  /inputs\.environment/.test(workflow),
  "Workflow uses the shared inputs.environment context",
);
check(
  /github\.event_name == 'workflow_dispatch' \|\| github\.event_name == 'workflow_call'/.test(workflow),
  "Deploy job runs for both supported trigger types",
);
check(
  /description:.*(staging|production)/i.test(workflow) || /choices:\s*\n\s*-\s*staging\s*\n\s*-\s*production/.test(workflow),
  "Environment input offers staging and production choices",
);
check(
  /COOLIFY_DEPLOY_WEBHOOK_PROXY_STAGING/.test(workflow),
  "Workflow references exact staging secret name",
);
check(
  /COOLIFY_DEPLOY_WEBHOOK_PROXY_PRODUCTION/.test(workflow),
  "Workflow references exact production secret name",
);
check(
  !/COOLIFY_DEPLOY_WEBHOOK_PROXY_[A-Z_]*(URL|TOKEN|KEY|HOST|SECRET)\b/.test(workflow),
  "No ad-hoc Coolify secret variants beyond the two documented webhook secrets",
);

// 3. Bounded, secret-safe curl invocation.
check(
  /curl\s+[^|]*--fail/.test(workflow),
  "curl uses --fail so non-2xx responses fail the job",
);
check(
  /--show-error/.test(workflow),
  "curl uses --show-error for diagnosable failures",
);
check(/--silent/.test(workflow), "curl uses --silent (no progress or response body spam)");
check(/--max-time\s+\d+/.test(workflow), "curl has a bounded --max-time timeout");
check(
  /\[\[\s*!?\s*"?\$?\{?http_code/.test(workflow) && /\^2\[0-9\]\{2\}\$/.test(workflow),
  "Workflow explicitly accepts only 2xx webhook responses",
);
check(
  /2>\s*"\$curl_error_file"/.test(workflow) && /trap\s+'rm -f/.test(workflow),
  "Workflow discards curl diagnostics after failure to avoid URL leakage",
);
check(
  !/(echo|printf)\s+.*\$(?:WEBHOOK_URL|COOLIFY_DEPLOY_WEBHOOK_PROXY_)/.test(workflow),
  "Workflow does not echo a webhook secret value",
);
check(
  !/set\s+-x/.test(workflow),
  "Workflow does not enable shell tracing",
);

// 4. Branch mapping: dev → staging, main → production.
check(
  /refs\/heads\/dev/.test(workflow) && /refs\/heads\/main/.test(workflow),
  "Workflow documents dev→staging and main→production branch mapping",
);

// 5. Documentation covers the operational contract.
check(docs.length > 0, "Deployment doc exists (docs/deploy/proxy-coolify.md)");
for (const term of [
  "COOLIFY_DEPLOY_WEBHOOK_PROXY_STAGING",
  "COOLIFY_DEPLOY_WEBHOOK_PROXY_PRODUCTION",
  "Nixpacks",
  "apps/proxy",
  "npm run build",
  "npm run start",
  "/health",
  "PORT",
  "tunnel",
  "workflow_dispatch",
  "rollback",
  "Rollback",
]) {
  check(
    docs.includes(term),
    `Documentation mentions ${term}`,
  );
}
check(
  /dev`?\s+(?:branch\s+)?(→|->|to)\s*staging/i.test(docs),
  "Documentation maps dev branch to staging",
);
check(
  /main`?\s+(?:branch\s+)?(→|->|to)\s*production/i.test(docs),
  "Documentation maps main branch to production",
);

// 6. No generated/deployment artifacts in the diff scope.
const trackedDist = spawnSync(
  "git",
  ["ls-files", "--", "apps/proxy/dist"],
  { cwd: root, encoding: "utf8" },
);
check(
  trackedDist.status === 0 && trackedDist.stdout.trim().length === 0,
  "No tracked apps/proxy/dist build output expected in scope",
);

process.exit(failures === 0 ? 0 : 1);
