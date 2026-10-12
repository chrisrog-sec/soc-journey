---
layout: default
title: Sudoers File Modification & Suspicious Account Creation
parent: Investigations
nav_order: 2
---

# SOC Investigation Report: Sudoers File Modification

## Alert Details

- **Alert:** SOC324 - Sudoers File Modification Detected
- **Alert ID:** 302
- **Affected Host:** Kristine
- **Host IP:** `172.16.17.129`
- **Incident Type:** Suspicious Account Creation / Privilege Escalation
- **Severity:** High
- **Verdict:** True Positive

## Summary

The alert was triggered by activity involving access to the `/etc/sudoers` file on the affected host. The investigation identified a sequence of privileged commands, including the creation of a new user account, inspection of sudo permissions, and execution of `visudo`.

Terminal history showed that the account `letsdefend1` was created using `sudo useradd -m letsdefend1`, followed by a password being assigned to the account. Subsequent commands included `sudo -l`, `sudo cat /etc/sudoers`, and `sudo visudo`.

The observed sudoers configuration contained entries granting both `analyst` and `letsdefend1` passwordless sudo access to all commands. This configuration provides unrestricted administrative privileges to those accounts.

Authentication logs also recorded successful SSH password authentication for the accounts `letsdefend` and `analyst` from the external IP address `149.88.25.133`, alongside failed authentication attempts.

The combination of successful SSH authentication, account creation, and unrestricted passwordless sudo permissions is consistent with potentially malicious account and privilege manipulation. However, the available evidence does not independently establish which authenticated session performed every action or whether the activity was authorised.

## Investigation Findings

### Authentication Analysis

Authentication logs recorded successful SSH password authentication for the accounts `letsdefend` and `analyst` from:

`149.88.25.133`

The logs also contained failed authentication attempts from the same IP address.

These events establish that successful SSH authentication occurred for the recorded accounts. Further investigation would be required to determine whether the successful logins were associated with the suspicious activity observed later on the host.

### Account Creation

Terminal history showed the following command being executed at approximately 06:34:24:

```bash
sudo useradd -m letsdefend1
```

The `useradd` command creates a new user account, while the `-m` option creates a home directory for the account if required.

A subsequent command assigned a password to the new account:

```bash
sudo passwd letsdefend1
```

The account database contained the following entry:

```text
letsdefend1:x:1003:1003::/home/letsdefend1:/bin/sh
```

This confirms that the account existed in the observed account database. The account's creation and subsequent privilege configuration warrant investigation because a newly created account can be used to establish additional access to a system.

### Sudoers File Inspection and Modification

Terminal history showed the following commands:

```bash
sudo -l
sudo cat /etc/sudoers
sudo visudo
sudo cat /etc/sudoers
```

The `sudo -l` command lists the sudo permissions available to the current user. The `visudo` utility is used to edit the sudoers configuration while performing syntax validation.

The observed sudoers configuration contained the following entries:

```text
$USER ALL=(ALL) NOPASSWD: ALL
analyst ALL=(ALL) NOPASSWD: ALL
letsdefend1 ALL=(ALL) NOPASSWD: ALL
```

The entries for `analyst` and `letsdefend1` grant the accounts permission to execute any command as any user without being prompted for a password, subject to the applicable sudo configuration.

The sequence of commands is consistent with the inspection and configuration of sudo permissions. The observed configuration confirms that the entries were present when the file was read. Establishing exactly when each entry was introduced would require additional evidence, such as file modification timestamps or audit records.

### Process Analysis

Endpoint process events recorded privileged commands associated with the investigation.

The event for `sudo useradd -m letsdefend1` recorded `/usr/bin/sudo` as the executable and `/usr/bin/bash` as its parent process.

A subsequent event recorded `/usr/bin/sudo` executing `visudo`, also with `/usr/bin/bash` as its parent process.

These events support the observation that account-management and sudoers-editing commands were executed. The process information alone does not establish the identity of the interactive user or prove that the commands originated from the SSH sessions identified in the authentication logs.

### Privilege Escalation Risk

The observed sudoers entries allow `analyst` and `letsdefend1` to execute commands with unrestricted privileges without a password prompt.

If these permissions were introduced without authorisation, they could allow an attacker with access to either account to maintain privileged access and perform administrative actions on the host.

The available evidence supports a significant privilege-escalation risk. However, the evidence reviewed does not independently establish the original access method, the identity of the person responsible, or whether the configuration was part of authorised administration.

## MITRE ATT&CK

- **T1098 - Account Manipulation:** Relevant to the creation and configuration of an additional user account.
- **T1548.003 - Sudo and Sudo Caching:** Relevant to the observed sudo permission configuration and potential abuse of elevated privileges.

These techniques describe behaviours relevant to the investigation. Their inclusion does not independently establish malicious intent or confirm that an attacker successfully exploited the permissions.

## Assessment

The alert is classified as a **True Positive** because the investigation identified a new user account, privileged account-management activity, and a sudoers configuration containing unrestricted passwordless sudo permissions for `analyst` and `letsdefend1`.

The combination of these findings represents a potential unauthorised privilege-escalation and access-persistence risk.

Although the authentication logs recorded successful SSH logins from `149.88.25.133`, the available evidence does not independently link those sessions to the account creation or sudoers configuration activity.

The authorisation of the changes, the identity of the responsible user, and the full extent of any potential compromise remain undetermined.

## Recommended Actions

- Verify whether the creation of `letsdefend1` and the observed sudoers entries were authorised administrative changes.
- Review SSH authentication logs and session records to establish whether the successful logins from `149.88.25.133` are associated with the activity.
- Review file metadata and available audit logs to determine when `/etc/sudoers` was modified and which account performed the modification.
- Remove unauthorised accounts and revoke excessive sudo permissions in accordance with the organisation's incident response procedures.
- Review the affected host for additional accounts, persistence mechanisms, and other unauthorised configuration changes.
- Investigate the source IP address and associated authentication activity for additional indicators of compromise.
- Preserve relevant authentication, process, and file-system evidence for further analysis.

## Conclusion

The investigation identified the creation of a new user account and a sudoers configuration granting unrestricted passwordless sudo access to `analyst` and `letsdefend1`.

These findings support the True Positive classification and indicate a potentially serious privilege-management issue. Successful SSH authentication from `149.88.25.133` provides additional context that warrants investigation, but a direct relationship between those logins and the subsequent commands has not been established.

Further investigation is required to determine whether the changes were authorised, identify the account responsible, and establish the full impact on the affected host.

