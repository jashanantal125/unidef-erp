# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.desk.form.assign_to import add as assign_to_user, clear as clear_assignments


class Student(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.crm.doctype.shortlisted_program.shortlisted_program import ShortlistedProgram
		from frappe.types import DF

		area_of_interest: DF.Data
		assigned_to: DF.Link | None
		birthday: DF.Date | None
		city: DF.Data | None
		comment: DF.SmallText | None
		country: DF.Link | None
		country_code: DF.Data
		destination_country: DF.Link | None
		education: DF.Attach | None
		email: DF.Data
		english_test: DF.Attach | None
		first_name: DF.Data
		gender: DF.Literal["", "Male", "Female", "Other"]
		highest_education: DF.Data | None
		last_name: DF.Data | None
		lead_link: DF.Link | None
		loa: DF.Attach | None
		mobile: DF.Data
		other: DF.Attach | None
		passport_travel: DF.Attach | None
		preferred_study_level: DF.Data | None
		refusal_letter: DF.Attach | None
		shortlisted_programs: DF.Table[ShortlistedProgram]
		state: DF.Data | None
		testscore: DF.Data | None
		tuition_fee_receipt: DF.Attach | None
		visa: DF.Attach | None
		work_experience: DF.Attach | None
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

