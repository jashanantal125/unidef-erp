# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Counsellings(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		assign_to: DF.Literal["Myself", "Destination Manager"]
		destination_country: DF.Literal[None]
		meeting_type: DF.Literal["Walk-in", "Virtual"]
		remarks: DF.Data
		schedule_at: DF.Datetime
		student_name: DF.Data
	# end: auto-generated types

	pass
