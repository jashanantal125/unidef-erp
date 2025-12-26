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
		from erpnext.crm.doctype.application_course.application_course import ApplicationCourse
		from frappe.types import DF

		agent: DF.Link | None
		application_type: DF.Literal["B2B"]
		campus: DF.Data | None
		destination_country: DF.Link
		intake: DF.Literal["", "Fall", "Spring", "Summer", "Winter"]
		naming_series: DF.Literal["APP-.YYYY.-"]
		preferred_courses: DF.Table[ApplicationCourse]
		preferred_university: DF.Link
		status: DF.Literal["", "Application Fee Paid", "Started & Submitted", "Review & Course Finalizations", "Submitted", "LOA/OL", "Tuition Fee Paid", "Visa Applied", "Visa Approved", "Cancel Withdrawn", "Refund Required", "Enrolled and Closed", "Offer Letter Expired", "Refund and Closed", "Rejection from Institution"]
		student: DF.Link
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

