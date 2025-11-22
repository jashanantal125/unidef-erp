# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Course(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		course_code: DF.Data | None
		course_name: DF.Data
		currency: DF.Link | None
		degree_level: DF.Literal["", "Certificate", "Diploma", "Bachelor's", "Master's", "PhD", "Foundation"] | None
		description: DF.TextEditor | None
		duration: DF.Int | None
		duration_unit: DF.Literal["", "Months", "Years"] | None
		entry_requirements: DF.TextEditor | None
		intake_months: DF.SmallText | None
		tuition_fee: DF.Currency | None
		university: DF.Link
	# end: auto-generated types

	def after_insert(self):
		"""Add course to university's courses child table"""
		if self.university:
			self.add_to_university_courses()
	
	def on_update(self):
		"""Update university's courses child table if university changed"""
		if self.has_value_changed("university"):
			# Remove from old university
			if self.get_doc_before_save() and self.get_doc_before_save().university:
				self.remove_from_university_courses(self.get_doc_before_save().university)
			# Add to new university
			if self.university:
				self.add_to_university_courses()
	
	def add_to_university_courses(self):
		"""Add this course to the university's courses child table"""
		if not self.university:
			return
		
		try:
			university = frappe.get_doc("University", self.university)
			
			# Check if course already exists in child table
			existing = [row.course for row in university.courses if row.course == self.name]
			
			if not existing:
				university.append("courses", {"course": self.name})
				university.save(ignore_permissions=True)
				frappe.db.commit()
		except Exception as e:
			frappe.log_error(f"Error adding course to university: {str(e)}")
	
	def remove_from_university_courses(self, university_name):
		"""Remove this course from the university's courses child table"""
		try:
			university = frappe.get_doc("University", university_name)
			university.courses = [row for row in university.courses if row.course != self.name]
			university.save(ignore_permissions=True)
			frappe.db.commit()
		except Exception as e:
			frappe.log_error(f"Error removing course from university: {str(e)}")

	pass
