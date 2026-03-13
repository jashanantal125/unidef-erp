# Unideft – AI-Driven Visa Management CRM

Unideft is an **AI-driven visa management CRM** built on the Frappe/ERPNext framework, designed specifically for **overseas education and migration consultancies**.  
It centralizes student applications, documents, visa stages, financials, and team workflows into a single, auditable system, while leveraging **Python-based automation and data analytics to generate insights, streamline decision-making, and improve operational efficiency.**

---

<img width="1438" height="809" alt="Screenshot 2026-03-03 at 6 57 25 PM" src="https://github.com/user-attachments/assets/051f7d45-ca00-484d-a9cf-cd9b2db06e66" />

### 🔑 Key Highlights (Forensic & Analytics Focus)

- **End‑to‑end case lifecycle modeling**: Structured the full visa journey (enquiry → offer → COE → file lodged → visa decision → enrollment) into a single, auditable **Application** entity with defined stages and transitions.
- **Forensic‑grade traceability**: Normalized linked data (student, agent, sponsor, financials, conditions, refusals, study gap proofs, documents) so any case’s decisions and timeline can be reconstructed quickly.
- **Rule‑based logic & risk flags**: Implemented business logic for offer‑letter conditions, English requirements, gap justification, interview scheduling, and refusal handling—similar to expert‑system workflows used in regulatory/dispute contexts.
- **Evidence & document workflows**: Built granular document schemas (ITR, salary slips, SOPs, offer letters, OSHC, sponsor docs) with verification flags/status fields to support review and investigation.
- **Analytics‑ready foundation**: Designed structured tables and status fields suitable for downstream advanced analytics/ML (risk scoring, anomaly detection, pattern analysis).

---

## 🧩 Core Features (Dispute, Risk & Regulatory‑Ready)

This project is an **AI‑driven visa management CRM** designed as a **case management system** for a migration consultancy, built to support high‑stakes, evidence‑heavy workflows similar to those seen in **dispute advisory, investigations, and regulatory/litigation support**. The platform models each client matter as a single **Application** record with a clearly defined lifecycle (Processing → Financials → GS Processing → Acceptance → COE → File Lodged → Visa → Enrolled), capturing decisions, conditions, dependencies, and status outcomes in a structured and repeatable format. Dynamic sections appear only when relevant (e.g., spouse scenarios, refusal handling, interview requirements, study gap proofs), ensuring the workflow is both operationally efficient and **audit‑ready**.

A major emphasis is **forensic‑grade traceability and evidence management**. The system normalizes data across linked entities (student, agent, sponsor, university/course, documents, tests, gap proof types) and stores key “why” signals (conditions on offer letter, verification flags, and compliance‑style status fields). Document workflows cover the full spectrum of case evidence—SOPs, offer letters, sponsor proofs, and financial artifacts (e.g., ITR, salary slips, bank statements)—with structured verification checkpoints to support review, escalation, and defensible decisioning. This design enables rapid reconstruction of timelines and supporting evidence for any matter, which is central to investigative and litigation contexts.

Finally, the CRM is built as an **analytics‑ready foundation** for advanced analytics and AI. Because the data model is strongly structured (normalized child tables, consistent field naming, categorical status states, and conditional logic), it is well‑suited for downstream applications such as **risk scoring**, exception handling, anomaly detection, and cohort analysis (e.g., identifying patterns across refusals, gap categories, sponsor strength, or interview readiness). In practice, this turns operational case data into a high‑quality dataset that can support analytics deliverables aligned with FTI’s Data & Analytics work across critical business events.

---

## 🧱 Tech Stack

- **Framework**: Frappe / ERPNext
- **Language**: Python (backend), JavaScript (client scripts)
- **Database**: MariaDB (via Frappe)
- **UI**: Frappe Desk, Form Views, Child Tables

---

## 🖼 Screenshots


<img width="1440" height="810" alt="Screenshot 2026-03-13 at 11 27 31 AM" src="https://github.com/user-attachments/assets/ef53ca68-797b-4023-a77e-15009f154af8" />

<img width="1440" height="813" alt="Screenshot 2026-03-13 at 11 27 42 AM" src="https://github.com/user-attachments/assets/2664ab54-735c-4773-acd7-83dff993400a" />

<img width="1440" height="811" alt="Screenshot 2026-03-13 at 11 27 56 AM" src="https://github.com/user-attachments/assets/3e64a313-35a5-4883-9cf6-b90fd7ebcaf3" />

<img width="1440" height="808" alt="Screenshot 2026-03-13 at 11 28 29 AM" src="https://github.com/user-attachments/assets/323ae299-c396-4b88-bb7b-814f63a17ae9" />

<img width="1440" height="814" alt="Screenshot 2026-03-13 at 11 28 54 AM" src="https://github.com/user-attachments/assets/4a5f2cb9-0513-44c0-a601-866dbd9f8d3a" />



---

## 🛠 Setup (High‑Level)

> This is intentionally brief; adjust for your exact bench/app setup.

1. Install Frappe/ERPNext and create a bench.
2. Clone this app:
   cd /path/to/frappe-bench/apps
   git clone https://github.com/<your-username>/unidef-erp.git
   
