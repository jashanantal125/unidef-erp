# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class VendorContracts(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		agreement_date: DF.Date
		files: DF.Attach | None
		name1: DF.Data
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		valid_upto: DF.Date
	# end: auto-generated types

	pass
