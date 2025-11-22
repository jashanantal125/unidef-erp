# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class University(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		city: DF.Data | None
		uniname: DF.Data | None
	# end: auto-generated types

	def onload(self):
		"""Auto-populate courses child table with courses for this university"""
		if self.name:
			# Get all courses for this university
			courses = frappe.get_all(
				"Course",
				filters={"university": self.name},
				fields=["name"],
				order_by="course_name"
			)
			
			# Get existing course links in child table
			existing_courses = {row.course for row in self.courses if row.course}
			
			# Add missing courses to child table
			for course in courses:
				if course.name not in existing_courses:
					self.append("courses", {"course": course.name})
			
			# Remove courses that no longer exist or belong to different university
			course_names = {course.name for course in courses}
			self.courses = [row for row in self.courses if row.course in course_names or not row.course]

	pass


@frappe.whitelist()
def sync_courses(university):
	"""Get all courses for a university"""
	courses = frappe.get_all(
		"Course",
		filters={"university": university},
		fields=["name", "course_name"],
		order_by="course_name"
	)
	return courses
