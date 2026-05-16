---

title: Cyber Kill Chain
layout: default
nav_order: 1
parent: Notes
---

# Cyber Kill Chain: SOC Analyst Interpretation

## Overview

The Cyber Kill Chain is a framework used to describe the stages of a cyber attack from initial reconnaissance through to achieving the attacker’s objectives. In a SOC environment, it is used to map observed activity in logs and alerts to attacker behaviour, helping analysts understand intrusion progression and severity.

Rather than treating alerts in isolation, the Kill Chain provides structure for interpreting events as part of a broader attack lifecycle.

---

## Reconnaissance

The attacker gathers information about the target such as exposed services, users, or vulnerabilities.

**Examples:**
- Port scanning
- DNS enumeration
- OSINT collection

**SOC perspective:**
Often observed as scanning activity, repeated requests across multiple ports, or unusual traffic patterns from a single source IP.

---

## Weaponization

The attacker prepares malicious payloads or exploits.

**SOC perspective:**
Not directly visible in logs. Information may appear in threat intelligence sources such as known malware hashes or exploit campaigns.

---

## Delivery

The attacker delivers the payload to the target.

**Examples:**
- Phishing emails
- Malicious attachments
- Exploit delivery via web traffic

**SOC perspective:**
Detected through email security tools, proxy logs, or network traffic inspection.

---

## Exploitation

The payload is executed and a vulnerability is triggered.

**SOC perspective:**
Often produces higher-confidence signals such as:
- Suspicious process execution
- Exploit detection signatures
- Unexpected script activity

---

## Installation

The attacker establishes persistence.

**Examples:**
- Scheduled tasks
- Registry modifications
- New services

**SOC perspective:**
Strong indicator of compromise when correlated with prior suspicious activity.

---

## Command and Control (C2)

The compromised system communicates with an external server.

**SOC perspective:**
Key indicators include:
- Periodic outbound connections (beaconing)
- Suspicious or unknown domains
- Encrypted traffic to unusual endpoints

---

## Actions on Objectives

The attacker performs their intended goal.

**Examples:**
- Data exfiltration
- Lateral movement
- Privilege escalation
- Ransomware execution

**SOC perspective:**
Visible impact such as file encryption, abnormal access patterns, or system disruption.

---

## Summary

The Cyber Kill Chain helps structure incident analysis by mapping individual events to stages of an attack lifecycle. In SOC operations, this improves detection context and supports better incident prioritisation and response.
