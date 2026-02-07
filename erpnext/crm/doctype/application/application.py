# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Application(Document):
	@staticmethod
	def get_list_query(query):
		"""Filter applications based on user role hierarchy"""
		user_roles = frappe.get_roles()
		ApplicationDoc = frappe.qb.DocType("Application")
		
		# System Manager, Administrator, and CRM Admin see all applications
		if "System Manager" in user_roles or "Administrator" in user_roles or "CRM Admin" in user_roles:
			return query
		
		# Team Lead sees applications assigned to their team(s)
		if "Team Lead" in user_roles:
			teams = frappe.get_all("Team", filters={"team_leader": frappe.session.user}, pluck="name")
			if teams:
				query = query.where(ApplicationDoc.assigned_team.isin(teams))
			else:
				# Team Lead with no team sees nothing
				query = query.where(ApplicationDoc.assigned_team == "__no_match__")
			return query
		
		# Team Executive sees only applications assigned to them
		if "Team Executive" in user_roles:
			query = query.where(ApplicationDoc.assigned_executive == frappe.session.user)
			return query
		
		# Agent sees only their own applications (where agent field matches logged-in user)
		if "Agent" in user_roles or "B2B Agent" in user_roles or "B2C Agent" in user_roles:
			query = query.where(ApplicationDoc.agent == frappe.session.user)
			return query
		
		# Default: show nothing for unknown roles
		query = query.where(ApplicationDoc.name == "__no_match__")
		return query
	
	def before_save(self):
		"""Auto-assign team based on destination country"""
		self.auto_assign_team()
	
	def auto_assign_team(self):
		"""Find the team that handles this destination country and assign it"""
		if self.destination_country and not self.assigned_team:
			# Find team whose territories include this country
			team_result = frappe.db.sql("""
				SELECT parent FROM `tabTeam Territory`
				WHERE country = %s
				LIMIT 1
			""", (self.destination_country,), as_dict=True)
			
			if team_result:
				self.assigned_team = team_result[0].parent
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
		coe_documents: DF.Table[studentdocuments]
		coe_uploaded: DF.Check
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
		intake_date: DF.Date | None
		itr_verified: DF.Check
		large_balance_holding_duration_1_lakh: DF.Duration | None
		loan_amount: DF.Currency
		loan_docs_uploaded: DF.Check
		loan_docs_verified: DF.Check
		martial_status: DF.Literal["Married", "Single"]
		name_matched: DF.Check
		naming_series: DF.Literal["APP-.YYYY.-"]
		nationalised_bank: DF.Literal["Nationalised", "Private", "Cooperative", "Other"]
		offer_accepted: DF.Literal["Yes", "No"]
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

