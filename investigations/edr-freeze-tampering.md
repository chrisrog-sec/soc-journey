---
layout: default
title: EDR Tampering Attempt via EDR-Freeze
parent: Investigations
nav_order: 3
permalink: /investigations/edr-freeze-tampering/
---

# SOC Investigation Report: EDR Tampering Attempt via EDR-Freeze

## Alert Details

- **Alert:** SOC344 - EDR Tampering Attempt via EDR-Freeze
- **Alert ID:** SOC344
- **Affected Host:** `WS-Prod-02`
- **Host IP:** `172.16.20.69`
- **Incident Type:** Malware / Defence Evasion
- **Severity:** High
- **Verdict:** True Positive

## Summary

The alert was triggered by the execution of `EDR-Freeze_1.0.exe`, a tool associated with attempts to interfere with endpoint detection and response (EDR) security controls.

The initial investigation identified RDP brute-force activity preceding a successful logon on `WS-Prod-02`. Following authentication, PowerShell was used to execute reconnaissance commands and download an executable from GitHub.

The executable was launched from the user's Downloads directory with the following command line:

```powershell
"C:\Users\LetsDefend\Downloads\EDR-Freeze_1.0.exe" 6080 10000
```

The process was launched by `powershell.exe`, and the device action was recorded as **Allowed**. The alert context indicates that the tool targeted Microsoft Defender using process ID `6080`, consistent with an attempt to impair endpoint security.

The SHA-256 hash was reported as malicious by the threat intelligence sources referenced in the LetsDefend investigation. The available evidence supports a True Positive classification for suspicious defence-evasion activity. However, the extent to which endpoint protection was successfully impaired remains undetermined.

## Investigation Findings

### Authentication Analysis

The initial alert notes identified RDP brute-force activity followed by a successful logon on the affected host.

This sequence raises concerns about potential credential compromise and unauthorised remote access. The successful logon requires further investigation to determine the source IP address, the account involved, and whether the authentication was legitimate.

The available alert information does not independently establish the identity of the person responsible for the subsequent activity.

### PowerShell Activity and Reconnaissance

Following the successful logon, PowerShell was used to execute reconnaissance commands, including `whoami`, and to download an executable from GitHub.

The use of PowerShell is not inherently malicious. However, in the context of suspicious RDP authentication and the subsequent execution of an EDR tampering tool, this activity warrants investigation as part of the suspected attack sequence.

Further review of PowerShell logs and process telemetry would help establish the commands executed, the download source, and the relationship between the observed events.

### EDR-Freeze Execution

Process telemetry identified the following command line:

```powershell
"C:\Users\LetsDefend\Downloads\EDR-Freeze_1.0.exe" 6080 10000
```

The associated process details were:

- **Process:** `EDR-Freeze_1.0.exe`
- **Parent Process:** `powershell.exe`
- **Process Directory:** `C:\Users\LetsDefend\Downloads\`
- **Target Process ID:** `6080`
- **Device Action:** Allowed

The alert identified EDR-Freeze as a known EDR tampering tool. The supplied investigation notes indicate that the tool targeted Microsoft Defender's process, attempting to freeze or bypass security software.

The execution of a security-tampering tool following suspicious authentication and reconnaissance is consistent with an attempt to impair endpoint protection and evade detection.

Although the process was allowed to execute, this does not independently confirm that the tool successfully disabled or impaired Microsoft Defender.

### Indicator of Compromise Analysis

The SHA-256 hash associated with the executable was:

`970c7834e58b6ef22473875167a333dbb33bf7b667d1cb814829f68579cd85f7`

The LetsDefend investigation reported that the hash was flagged as malicious by VirusTotal and the platform's threat intelligence sources.

This reputation information supports treating the executable as suspicious in the context of the observed activity. The precise vendor detection results and current reputation would need to be verified directly against the relevant threat intelligence sources if required for a formal incident report.

### Scope Assessment

The investigation playbook identified `WS-Prod-02` as the affected device and reported no evidence of compromise on other devices.

This finding limits the currently identified scope to the observed host. However, the absence of evidence on other devices does not conclusively establish that lateral movement or additional compromise did not occur.

Further investigation of authentication records, network connections, and related endpoint telemetry would be required to determine whether other systems were affected.

## MITRE ATT&CK

- **T1078 - Valid Accounts:** Relevant to the successful logon following RDP brute-force activity. The specific account and whether valid credentials were compromised require further investigation.
- **T1059.001 - PowerShell:** PowerShell was used for reconnaissance and executable download activity.
- **T1055 - Process Injection:** Included in the alert's technique mapping. The supplied evidence does not independently establish that process injection occurred.
- **T1562 - Impair Defenses:** Relevant to the attempted interference with endpoint security.
- **T1562.001 - Impair Defenses: Disable or Modify Tools:** Specifically relevant to the suspected attempt to interfere with Microsoft Defender.
- **T1489 - Service Stop:** Included in the alert's technique mapping. The available evidence does not independently confirm that a service was stopped.

These techniques provide a framework for classifying the observed and suspected behaviours. They should not be interpreted as confirmation that every listed technique was successfully executed.

## Assessment

The alert is classified as a **True Positive** because the investigation identified suspicious RDP authentication activity, subsequent PowerShell execution, and the launch of a known EDR tampering tool.

The combination of these events indicates a high-risk potential compromise involving remote access, host reconnaissance, and attempted defence evasion. The executable was permitted to run, creating a need to establish whether Microsoft Defender or other endpoint protections were affected.

The available evidence does not independently confirm successful EDR impairment, the identity of the attacker, the full extent of the compromise, or whether additional systems were accessed.

## Recommended Actions

- Investigate the successful RDP logon, including the source IP address, account involved, authentication timeline, and preceding failed attempts.
- Validate the executable's SHA-256 hash against VirusTotal and trusted threat intelligence sources.
- Review PowerShell logs, process-creation events, and endpoint telemetry to reconstruct the activity leading to EDR-Freeze execution.
- Determine whether Microsoft Defender was successfully impaired by reviewing its health status, configuration changes, service state, and relevant security events.
- Isolate `WS-Prod-02` in accordance with incident response procedures if active compromise or ongoing malicious activity is suspected.
- Investigate the endpoint for additional malware, persistence mechanisms, credential theft, and suspicious network connections.
- Review authentication and network telemetry for signs of lateral movement or activity involving other systems.
- Preserve relevant logs and forensic evidence to support further investigation.

## Conclusion

The investigation identified suspicious RDP authentication activity followed by PowerShell reconnaissance and execution of `EDR-Freeze_1.0.exe` on `WS-Prod-02`.

The executable was associated with EDR tampering, and the reported malicious hash, execution context, and sequence of events support the True Positive classification. The activity is consistent with an attempt to impair endpoint security and evade detection.

Further investigation is required to determine whether Microsoft Defender was successfully impaired, whether credentials were compromised, and whether the activity extended beyond the affected host.
