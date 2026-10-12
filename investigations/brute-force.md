---
layout: default
title: Sudoers File Modification & Suspicious Account Creation
parent: Investigations
nav_order: 2
---


# SOC Investigation: Sudoers File Modification & Suspicious Account Creation

## 1. Incident Overview

| Field | Details |
|---|---|
| Alert Name | SOC324 - Sudoers File Modification Detected |
| Severity | High |
| Alert ID | 302 |
| Hostname | Kristine |
| Host IP | `172.16.17.129` |
| Suspicious Source IP | `149.88.25.133` |
| New Account | `letsdefend1` |
| Investigation Type | Linux Security Incident |
| Primary Concern | Potential unauthorized account creation and privilege escalation |
| Platform | LetsDefend |

## 2. Executive Summary

A high-priority alert was generated after activity involving the Linux sudoers configuration file was detected on the host `Kristine`.

The investigation identified SSH authentication attempts originating from `149.88.25.133`, including successful authentications for the accounts `letsdefend` and `analyst`.

Subsequent endpoint telemetry recorded commands consistent with the creation of a new local account, password assignment, sudo privilege enumeration, and inspection of the sudoers configuration.

The account `letsdefend1` was subsequently observed in the system account database. The inspected sudoers configuration contained a rule granting this account unrestricted command execution through `sudo` without requiring a password.

The observed activity is consistent with possible unauthorized account creation, privilege escalation, and persistence. However, the available evidence does not conclusively establish that the SSH session associated with `analyst` executed every subsequent command, or that the activity was definitively malicious.

## 3. Initial Alert

The investigation began with the following alert:

- **Alert:** SOC324 - Sudoers File Modification Detected
- **Severity:** High
- **Event ID:** 302
- **Event timestamp:** `2024-09-20 06:35:12 UTC+03:00`
- **Affected host:** `Kristine`
- **Host IP:** `172.16.17.129`
- **Observed command:** `sudo cat /etc/sudoers`

### Why the alert matters

The `/etc/sudoers` file defines which users and groups can execute commands with elevated privileges through `sudo`.

Unauthorized modifications can allow an attacker with an existing foothold to execute commands as root, potentially enabling further compromise and persistence.

Reading the file is not inherently malicious. The significance of this event became clearer when correlated with authentication records, terminal history, process execution telemetry, and the observed sudoers configuration.

## 4. Investigation Timeline

The following timeline summarises the observed activity. Authentication events and terminal-history events use different displayed timestamps; their timezone relationship should be validated before asserting an exact chronological correlation.

| Timestamp | Observed Activity | Investigation Significance |
|---|---|---|
| 04:32:30 | SSH accepted password for `letsdefend` from `149.88.25.133` | Successful authentication |
| 04:33:18 | SSH accepted password for `analyst` from `149.88.25.133` | Additional successful authentication |
| 06:33:48 | `whoami` | Current identity enumeration |
| 06:34:24 | `sudo useradd -m letsdefend1` | Local account creation command |
| 06:34:32 | `sudo passwd letsdefend1` | Password-setting command |
| 06:34:57 | `sudo -l` | Sudo permission enumeration |
| 06:35:12 | `sudo cat /etc/sudoers` | Sudoers configuration inspection |
| 06:35:26 | `sudo visudo` | Sudoers editor launched |
| 06:36:03 | `sudo cat /etc/sudoers` | Configuration inspected again |
| 06:36:13 | `groups letsdefend1` | Account group membership checked |
| 06:36:22 | `getent passwd` | Account enumeration |

## 5. Evidence Analysis

### 5.1 SSH Authentication Activity

Authentication logs showed activity originating from `149.88.25.133`, targeting the Linux host over SSH.

The available records included:

- Successful authentication for `letsdefend`.
- Successful authentication for `analyst`.
- Failed password attempts involving other usernames.

These events establish successful authentication from the source IP but do not independently establish that the source was unauthorized or identify which authenticated session executed the subsequent commands.

**Assessment:** Suspicious authentication activity requiring correlation with endpoint telemetry.

### 5.2 Account Creation

Endpoint telemetry recorded the following command at `06:34:24`:

```bash
sudo useradd -m letsdefend1
```

The associated process details included:

| Field | Value |
|---|---|
| Process ID | `4253` |
| Executable | `/usr/bin/sudo` |
| Parent executable | `/usr/bin/bash` |
| Target command | `useradd -m letsdefend1` |

The command requests creation of a local user with a home directory.

The account was subsequently observed in the account database:

```text
letsdefend1:x:1003:1003::/home/letsdefend1:/bin/sh
```

This entry identifies the account name, UID, primary GID, home directory, and configured login shell.

The presence of the account supports the conclusion that it existed when the account database was inspected. The process record and account entry together are consistent with the observed account-creation activity.

### 5.3 Password Assignment

At `06:34:32`, terminal history recorded:

```bash
sudo passwd letsdefend1
```

This command attempts to set or change the account's password.

The command history alone does not establish whether the operation completed successfully. Additional authentication or account-management evidence would be required to verify the resulting credential state.

### 5.4 Sudo Privilege Enumeration

At `06:34:57`, the following command was recorded:

```bash
sudo -l
```

This command lists the sudo permissions available to the current user.

Its position in the timeline is consistent with an operator investigating available elevated privileges before inspecting the sudoers configuration.

### 5.5 Sudoers Configuration Inspection

At `06:35:12`, the following command was recorded:

```bash
sudo cat /etc/sudoers
```

The command was executed again at `06:36:03`, following the launch of `visudo`.

The observed configuration included:

```text
analyst ALL=(ALL) NOPASSWD: ALL
letsdefend1 ALL=(ALL) NOPASSWD: ALL
```

The rules grant the named accounts permission to execute any command as any user, including root, without a sudo password.

The `letsdefend1` entry is particularly significant because the account was created shortly beforehand in the observed terminal history.

The configuration establishes that these permissions were present when the file was inspected. The available evidence does not independently establish whether the entries were newly added during this incident or were already present.

### 5.6 Sudoers Editor Execution

At `06:35:26`, endpoint telemetry recorded:

```bash
sudo visudo
```

The associated process details included:

| Field | Value |
|---|---|
| Process ID | `4300` |
| Executable | `/usr/bin/sudo` |
| Parent executable | `/usr/bin/bash` |
| Target command | `visudo` |

`visudo` is the standard utility used to edit the sudoers configuration while checking its syntax.

The subsequent configuration output contained the unrestricted sudo rule for `letsdefend1`.

This sequence is consistent with a sudoers configuration change. However, the process event alone does not prove that the file was saved or that a particular line was introduced during this session.

### 5.7 Account Enumeration

The following commands were also observed:

```bash
groups letsdefend1
getent passwd
```

The first queries the account's group memberships. The second queries the system's configured user-account databases.

In the context of account creation and sudoers inspection, these commands are consistent with verifying account properties and enumerating users.

Neither command is inherently malicious, but both contribute to the overall activity pattern.

## 6. MITRE ATT&CK Mapping

The following techniques are relevant to the observed activity.

| Technique | Name | Relevance |
|---|---|---|
| T1110 | Brute Force | Failed authentication attempts were observed. |
| T1078 | Valid Accounts | Successful authentication using account credentials was recorded. |
| T1136.001 | Create Account: Local Account | The `useradd` command attempted to create a local account. |
| T1087.001 | Account Discovery: Local Account | Account enumeration was observed. |
| T1548.003 | Sudo and Sudo Caching | Relevant to the investigation of potential sudo privilege abuse. |
| T1059.004 | Unix Shell | Commands were executed through a Unix shell. |

These mappings are investigative classifications, not proof that an attacker successfully performed every associated technique.

## 7. Findings

### Finding 1: Suspicious SSH Authentication

Multiple authentication attempts originated from `149.88.25.133`, including successful authentication for two accounts.

**Status:** Observed; authorization and attribution not conclusively established.

### Finding 2: Local Account Creation

The endpoint recorded the account-creation command, and `letsdefend1` was subsequently present in the account database.

**Status:** Account existence confirmed in the observed account data; command success and exact creation time should be validated against additional records where available.

### Finding 3: Unrestricted Passwordless Sudo Permissions

The inspected configuration contained an unrestricted `NOPASSWD` sudo rule for `letsdefend1`.

**Status:** Configuration observed; whether the rule was newly introduced during the incident remains unverified.

### Finding 4: Potential Privilege Escalation and Persistence

The sequence of account creation, password assignment, sudo permission enumeration, and sudoers inspection is consistent with an attempt to establish a privileged account.

**Status:** Plausible investigative conclusion; malicious intent and the complete execution chain have not been conclusively established.

## 8. Recommended Response Actions

If this activity is confirmed to be unauthorized, the following actions are recommended:

1. **Containment:** Isolate the affected host as appropriate and restrict suspicious remote access.
2. **Account security:** Review the `analyst`, `letsdefend`, and `letsdefend1` accounts. Disable or remove unauthorized accounts according to incident-response procedures.
3. **Privilege remediation:** Review `/etc/sudoers` and `/etc/sudoers.d/` for unauthorized rules. Validate the configuration before applying changes.
4. **Credential security:** Rotate potentially compromised credentials and investigate whether they were reused elsewhere.
5. **Evidence preservation:** Retain authentication logs, process telemetry, relevant file metadata, and available audit records.
6. **Scope assessment:** Investigate other systems for activity associated with the source IP, affected accounts, and suspicious account-creation patterns.
7. **Recovery and monitoring:** Verify the host's integrity and monitor for further unauthorized authentication or privilege changes.

## 9. Investigation Limitations

The following limitations should be considered when interpreting the results:

- The available process events do not conclusively link all commands to the successful SSH session authenticated as `analyst`.
- The timezone relationship between the authentication logs and terminal history requires validation.
- The observed sudoers configuration was not compared against a verified pre-incident baseline.
- The command history does not independently prove successful password assignment or every command's outcome.
- The available evidence does not establish whether the source IP represents an attacker, an authorized administrator, or another legitimate system.

These limitations do not eliminate the significance of the observed activity. They identify the remaining questions required for a conclusive attribution and impact assessment.

## 10. Final Assessment

The investigation identified a sequence of suspicious authentication, account-management, and privilege-configuration activity on a Linux host.

The most significant finding is the presence of an unrestricted passwordless sudo rule for `letsdefend1`, an account observed in the system account database after an account-creation command was recorded.

The combined evidence is consistent with possible unauthorized account creation, privilege escalation, and persistence. The activity warrants escalation and validation against authentication, process, and file-integrity records before declaring the incident conclusively confirmed.

**Final assessment:** Suspicious activity with potential privileged-account persistence. Further validation is required to confirm unauthorized access, session attribution, and the precise origin of the sudoers configuration.
