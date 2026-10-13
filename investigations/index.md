---
title: Investigations
layout: default
nav_order: 3
has_children: true
has_toc: false
permalink: /investigations/
---

<div class="soc-eyebrow">Case files · Evidence-led analysis</div>

# Investigations

A collection of SOC-style case studies documenting alert context, investigative pivots, supporting telemetry, conclusions, and recommended next steps. Each write-up aims to separate what the evidence shows from what still needs validation.

<div class="soc-grid">
  <article class="soc-card">
    <span class="soc-card-icon">PH</span>
    <h3 class="no_anchor">Phishing campaign</h3>
    <p>Trace a suspicious email through a malicious link, a downloaded archive, and endpoint activity.</p>
    <div class="soc-card-footer">
      <a href="{{ '/investigations/letsdefend-phishing-investigation/' | relative_url }}">Open investigation <span aria-hidden="true">↗</span></a>
    </div>
  </article>
  <article class="soc-card">
    <span class="soc-card-icon">PR</span>
    <h3 class="no_anchor">Sudoers modification</h3>
    <p>Review account creation, authentication activity, and changes to privileged access.</p>
    <div class="soc-card-footer">
      <a href="{{ '/investigations/sudoers-file-modification/' | relative_url }}">Open investigation <span aria-hidden="true">↗</span></a>
    </div>
  </article>
  <article class="soc-card">
    <span class="soc-card-icon">EDR</span>
    <h3 class="no_anchor">EDR tampering attempt</h3>
    <p>Examine suspicious execution and activity consistent with attempts to impair endpoint protection.</p>
    <div class="soc-card-footer">
      <a href="{{ '/investigations/edr-freeze-tampering/' | relative_url }}">Open investigation <span aria-hidden="true">↗</span></a>
    </div>
  </article>
  <article class="soc-card">
    <span class="soc-card-icon">CVE</span>
    <h3 class="no_anchor">Possible PHP injection</h3>
    <p>Assess a suspicious request targeting a PHP CGI vulnerability and distinguish attempt from confirmed impact.</p>
    <div class="soc-card-footer">
      <a href="{{ '/investigations/php-cve-2024-4577/' | relative_url }}">Open investigation <span aria-hidden="true">↗</span></a>
    </div>
  </article>
  <article class="soc-card">
    <span class="soc-card-icon">IOC</span>
    <h3 class="no_anchor">WinRAR path traversal</h3>
    <p>Investigate suspicious archive extraction and file creation linked to a vulnerability alert.</p>
    <div class="soc-card-footer">
      <a href="{{ '/investigations/winrar-cve-2025-8088/' | relative_url }}">Open investigation <span aria-hidden="true">↗</span></a>
    </div>
  </article>
</div>

<div class="soc-note"><strong>Investigation standard:</strong> conclusions should be proportionate to the evidence. Where telemetry is incomplete or a successful outcome cannot be independently verified, that limitation belongs in the report.</div>
