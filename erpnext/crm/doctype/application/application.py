# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Application(Document):
	@staticmethod
	def get_list_query(query):
		"""Filter applications for Agent role - only show applications where agent matches logged-in user's agent"""
		if "Agent" in frappe.get_roles():
			# Get the agent record linked to the current user
			agent_name = frappe.db.get_value("Agent", {"user": frappe.session.user}, "name")
			if agent_name:
				Application = frappe.qb.DocType("Application")
				query = query.where(Application.agent == agent_name)
			else:
				# If user has no agent record, show nothing
				Application = frappe.qb.DocType("Application")
				query = query.where(Application.agent == "")
		return query
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.crm.doctype.student_documents.student_documents import studentdocuments
		from frappe.types import DF

		agent: DF.Link | None
		all_documents: DF.Table[studentdocuments]
		any_visa_refused: DF.Literal["No", "Yes"]
		application_type: DF.Literal["B2B"]
		bank_name: DF.Data | None
		campus: DF.Data | None
		course_name: DF.Data | None
		data_isfw: DF.Data | None
		data_swym: DF.Data | None
		defer_offer: DF.Literal[None]
		destination_country: DF.Link
		digi_locker_id_optional: DF.Data | None
		digi_locker_password: DF.Password | None
		dob_matched: DF.Check
		documents: DF.Table[studentdocuments]
		documents_10th_to_12th: DF.Table[studentdocuments]
		documents_passport_application_form_sop: DF.Table[studentdocuments]
		fd_holding_duration: DF.Duration | None
		fd_uploaded: DF.Check
		fd_verified: DF.Check
		financial_documents: DF.Table[studentdocuments]
		funds_type: DF.Literal["Savings Account", "Fixed Deposit", "Bank Statement", "Education Loan", "GPF / Post Office", "Mixed (Multiple Sources)"]
		higher_education: DF.Literal[None]
		intake: DF.Literal["", "Fall", "Spring", "Summer", "Winter"]
		itr_verified: DF.Check
		large_balance_holding_duration_1_lakh: DF.Duration | None
		loan_amount: DF.Currency
		loan_docs_uploaded: DF.Check
		loan_docs_verified: DF.Check
		martial_status: DF.Literal["Married", "Single"]
		name_matched: DF.Check
		naming_series: DF.Literal["APP-.YYYY.-"]
		nationalised_bank: DF.Literal["Nationalised", "Private", "Cooperative", "Other"]
		oshc: DF.Literal["Yes", "No"]
		oshc_arranged_by: DF.Data | None
		oshc_uploaded: DF.Check
		password: DF.Password | None
		preferred_courses: DF.Table[studentdocuments]
		preferred_university: DF.Link
		recovery_email_id: DF.Data | None
		security_type: DF.Literal["Property", "Other", "Unsecured"]
		source_of_funds_required: DF.Literal["Yes", "No"]
		sponsored_by: DF.Literal["Father", "Mother", "Self", "Government", "Relative"]
		statement_uploaded: DF.Check
		statement_verified: DF.Check
		status: DF.Literal["", "Application Fee Paid", "Started & Submitted", "Review & Course Finalizations", "Submitted", "LOA/OL", "Tuition Fee Paid", "Visa Applied", "Visa Approved", "Cancel Withdrawn", "Refund Required", "Enrolled and Closed", "Offer Letter Expired", "Refund and Closed", "Rejection from Institution"]
		student: DF.Link
		table_eliz: DF.Table[studentdocuments]
		total_funds_required: DF.Literal["Full Year", "Half-Year (6 Months)"]
		tuition_fee_uploaded: DF.Check
		tution_fee: DF.Literal["Paid", "Not Paid", "Processing"]
		university_intake: DF.Date | None
		university_name: DF.Data | None
		year: DF.Int
	# end: auto-generated types

	def validate(self):
		# Validate that maximum 3 courses are selected
		if len(self.preferred_courses) > 3:
			frappe.throw("You can select a maximum of 3 courses only.")
		
		if len(self.preferred_courses) == 0:
			frappe.throw("Please select at least one course.")
		
		# For B2C: Auto-set agent to Unideft if not set or if wrong agent selected
		if self.application_type == "B2C":
			unideft_agent = frappe.db.get_value("Agent", {"company_name": "Unideft"}, "name")
			if unideft_agent:
				# Always set to Unideft for B2C
				if not self.agent or self.agent != unideft_agent:
					self.agent = unideft_agent
			else:
				frappe.throw("Unideft agent not found. Please create it first.")
		
		# For B2B: No validation - can select any agent or leave empty

	pass

