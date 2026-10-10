---
title: LetsDefend Phishing Investigation
parent: SOC Investigations
nav_order: 2
---
# SOC Investigation Report: Phishing Alert

# SOC Investigation Report: Phishing Alert

## Alert Details

- **Alert:** SOC337 - Lazarus Phishing Campaign Detected (APT38)
- **Alert ID:** 315
- **Affected User:** Ellen
- **Incident Type:** Phishing / Suspected Malware Delivery
- **Verdict:** True Positive

## Summary

The alert was triggered by a suspicious email sent to Ellen with the subject *Invitation: Coinbase Crypto Trader Hiring Assessment*. The email contained a link to `blockchainjobhub.com`, which was identified as malicious during threat intelligence analysis.

The email was allowed through the security control and delivered to the recipient. The LetsDefend playbook recorded that the user accessed the malicious URL and that a file was downloaded and opened.

Further investigation identified `curl.exe` downloading a file named `nvidiaupdate.zip` from `api.drivercams.cloud`. Sysmon logs also showed PowerShell extracting the archive into `C:\Users\LetsDefend\nvidiadrive`.

VirusTotal reported 15 detections out of 98 for the download URL, with classifications including Trojan and Downloader.

## Investigation Findings

**Email analysis:** The email contained a suspicious hyperlink directing the recipient to `blockchainjobhub.com/invite/E3fM8yF7`. The URL was identified as malicious through threat intelligence checks.

**Delivery and user activity:** The email security alert recorded the message as allowed. The playbook indicated that the recipient accessed the malicious URL and downloaded and opened a file.

**Endpoint activity:** Process logs showed `curl.exe` downloading `nvidiaupdate.zip`, followed by PowerShell extracting the archive into the user's directory. This activity is consistent with a potential malware delivery chain.

**Threat intelligence:** VirusTotal flagged the download URL, supporting the assessment that the activity was malicious. The alert referenced Lazarus Group (APT38), but the evidence reviewed does not independently establish attribution to that group.

**Email headers:** The `From` and `Return-Path` fields matched in the EML file. This does not rule out a malicious sender or establish the sender's identity.

## Assessment

The alert is classified as a **True Positive** because the investigation identified a malicious URL and suspicious download and extraction activity consistent with malware delivery.

The available evidence does not independently confirm whether the extracted payload was executed, whether persistence was established, or whether data was compromised.

## Recommended Actions

- Remove the phishing email from the recipient's mailbox if it remains present.
- Investigate the downloaded archive and its extracted contents.
- Review endpoint logs for further execution, persistence, or suspicious network connections.
- Block confirmed malicious URLs and domains through the appropriate security controls.
- Contain the endpoint if further investigation indicates active compromise.

## Conclusion

The investigation supports the True Positive classification. A malicious phishing URL was identified, and subsequent endpoint activity showed a suspicious download followed by archive extraction.

Further investigation would be required to establish the full impact on the endpoint and determine whether the downloaded payload was executed.
