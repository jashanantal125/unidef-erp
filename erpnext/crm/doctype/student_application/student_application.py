# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class StudentApplication(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.crm.doctype.application_course.application_course import ApplicationCourse
		from frappe.types import DF

		campus: DF.Link
		destination_country: DF.Link
		intake: DF.Literal["", "Fall", "Spring", "Summer", "Winter"]
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		preferred_college: DF.Link
		preferred_courses: DF.Table[ApplicationCourse]
		year: DF.Int
	# end: auto-generated types

	def validate(self):
		# Validate that maximum 3 courses are selected
		if len(self.preferred_courses) > 3:
			frappe.throw("You can select a maximum of 3 courses only.")
		
		if len(self.preferred_courses) == 0:
			frappe.throw("Please select at least one course.")

	pass

