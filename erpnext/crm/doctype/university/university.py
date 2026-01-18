# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class University(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		address: DF.SmallText | None
		campus_name: DF.Data | None
		city: DF.Data | None
		commision: DF.Currency
		country: DF.Data
		email: DF.Data | None
		established_year: DF.Data | None
		is_direct: DF.Check
		is_private: DF.Check
		logo: DF.AttachImage | None
		naming_series: DF.Literal["UNI-.YYYY.-"]
		old_id: DF.Data | None
		phone: DF.Data | None
		shore_type: DF.Literal["both", "offshore", "onshore"]
		stateprovience: DF.Data | None
		type: DF.Literal["university", "college", "school"]
		university_name: DF.Data
		vendor_id: DF.Data | None
		vendor_name: DF.Data | None
		website: DF.Data | None
		world_ranking: DF.Data | None
	# end: auto-generated types

	pass
