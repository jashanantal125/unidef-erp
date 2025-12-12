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
		degree_level: DF.Literal["", "Certificate", "Diploma", "Bachelor's", "Master's", "PhD", "Foundation"]
		description: DF.TextEditor | None
		duration: DF.Int
		duration_unit: DF.Literal["", "Months", "Years"]
		entry_requirements: DF.TextEditor | None
		intake_months: DF.Data | None
		naming_series: DF.Literal["COURSE-.YYYY.-"]
		tuition_fee: DF.Currency
	# end: auto-generated types

	pass
