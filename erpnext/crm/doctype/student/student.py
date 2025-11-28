# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.desk.form.assign_to import add as assign_to_user, clear as clear_assignments


class Student(Document):
	@staticmethod
	def get_list_query(query):
		"""Filter students for Agent role - only show students linked to applications where agent matches logged-in user's agent"""
		if "Agent" in frappe.get_roles():
			# Get the agent record linked to the current user
			agent_name = frappe.db.get_value("Agent", {"user": frappe.session.user}, "name")
			if agent_name:
				Student = frappe.qb.DocType("Student")
				Application = frappe.qb.DocType("Application")
				# Join with Application to filter by agent
				query = query.join(Application).on(Application.student == Student.name).where(Application.agent == agent_name)
			else:
				# If user has no agent record, show nothing
				Student = frappe.qb.DocType("Student")
				query = query.where(Student.name == "")
		return query
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.crm.doctype.shortlisted_program.shortlisted_program import ShortlistedProgram
		from erpnext.crm.doctype.student_application.student_application import StudentApplication
<<<<<<< HEAD
=======
		from erpnext.crm.doctype.student_documents.student_documents import studentdocuments
>>>>>>> 7bb4a0a26ff1bc430b1b557a68e08fcd6bbaecbe
		from frappe.types import DF

		applications: DF.Table[StudentApplication]
		area_of_interest: DF.Data
		assigned_to: DF.Link | None
		birthday: DF.Date | None
		city: DF.Data | None
		comment: DF.SmallText | None
		country: DF.Link | None
		country_code: DF.Data
		destination_country: DF.Link | None
		email: DF.Data
		first_name: DF.Data
		gender: DF.Literal["", "Male", "Female", "Other"]
		highest_education: DF.Data | None
		last_name: DF.Data | None
		lead_link: DF.Link | None
		mobile: DF.Data
<<<<<<< HEAD
		naming_series: DF.Literal[None]
		other: DF.Attach | None
		passport_travel: DF.Attach | None
=======
		naming_series: DF.Literal["STU-.YYYY.-"]
>>>>>>> 7bb4a0a26ff1bc430b1b557a68e08fcd6bbaecbe
		preferred_study_level: DF.Data | None
		shortlisted_programs: DF.Table[ShortlistedProgram]
		state: DF.Data
		table_rnxy: DF.Table[studentdocuments]
		testscore: DF.Data | None
		title: DF.Data | None
<<<<<<< HEAD
		tuition_fee_receipt: DF.Attach | None
		visa: DF.Attach | None
		work_experience: DF.Attach | None
=======
>>>>>>> 7bb4a0a26ff1bc430b1b557a68e08fcd6bbaecbe
	# end: auto-generated types

	def validate(self):
		# Set title field for display in Link dropdowns
		if self.first_name:
			if self.last_name:
				self.title = f"{self.first_name} {self.last_name}"
			else:
				self.title = self.first_name
		elif self.email:
			self.title = self.email
		else:
			self.title = self.name
		
		# Sync assigned_to field with Frappe's assignment system
		if self.has_value_changed("assigned_to"):
			if self.assigned_to:
				# Clear existing assignments and assign to new user
				clear_assignments(self.doctype, self.name)
				assign_to_user({
					"assign_to": [self.assigned_to],
					"doctype": self.doctype,
					"name": self.name,
					"description": f"Student: {self.first_name} {self.last_name or ''}"
				})
			else:
				# Clear assignments if field is cleared
				clear_assignments(self.doctype, self.name)

	pass

