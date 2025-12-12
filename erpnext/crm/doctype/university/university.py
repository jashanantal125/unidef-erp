# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class University(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.crm.doctype.application_course.application_course import ApplicationCourse
		from frappe.types import DF

		address: DF.SmallText | None
		city: DF.Data | None
		commision: DF.Currency
		country: DF.Data
		email: DF.Data | None
		established_year: DF.Data | None
		naming_series: DF.Literal["UNI-.YYYY.-"]
		phone: DF.Data | None
		stateprovience: DF.Data | None
		table_rkkw: DF.Table[ApplicationCourse]
		university_name: DF.Data
		university_type: DF.Data | None
		website: DF.Data | None
		world_ranking: DF.Data | None
	# end: auto-generated types

	pass
