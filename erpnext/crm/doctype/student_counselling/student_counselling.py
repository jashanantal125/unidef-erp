# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class StudentCounselling(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		assign_to: DF.Literal["Myself", "Destination Manager"]
		destination_country: DF.Link | None
		destination_manager: DF.Literal["", "Narender Singh", "Himani Bajaj"]
		meeting_link: DF.Data | None
		meeting_type: DF.Literal["Walk-in", "Virtual"]
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		remarks: DF.Data
		schedule_at: DF.Datetime
		student_name: DF.Link
	# end: auto-generated types

	def validate(self):
		"""Ensure student_name is set from parent"""
		if self.parenttype == "Student" and self.parent:
			if not self.student_name:
				self.student_name = self.parent
			elif self.student_name != self.parent:
				self.student_name = self.parent
	
	def on_update(self):
		"""Sync this counselling to main Counsellings doctype"""
		if not self.parent or not self.parenttype == "Student":
			return
		
		if not self.schedule_at:
			return
		
		try:
			# Check if a Counsellings record already exists
			existing_counselling = frappe.db.get_value(
				"Counsellings",
				{
					"student_name": self.parent,
					"schedule_at": self.schedule_at
				},
				"name"
			)
			
			if existing_counselling:
				# Update existing record
				counselling_doc = frappe.get_doc("Counsellings", existing_counselling)
			else:
				# Create new record
				counselling_doc = frappe.get_doc({
					"doctype": "Counsellings",
					"student_name": self.parent
				})
			
			# Update all fields
			counselling_doc.schedule_at = self.schedule_at
			counselling_doc.meeting_type = self.meeting_type
			counselling_doc.meeting_link = self.meeting_link or None
			counselling_doc.assign_to = self.assign_to
			counselling_doc.destination_manager = self.destination_manager or None
			counselling_doc.destination_country = self.destination_country
			counselling_doc.remarks = self.remarks
			
			counselling_doc.save(ignore_permissions=True)
			frappe.db.commit()
		except Exception as e:
			frappe.log_error(f"Error syncing counselling from child table: {str(e)}", "Counselling Sync Error")

	pass
