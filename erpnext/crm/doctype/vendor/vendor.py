# Copyright (c) 2025, Unideft and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class vendor(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.crm.doctype.vendor_contracts.vendor_contracts import VendorContracts
		from frappe.types import DF

		address: DF.Data | None
		city: DF.Data | None
		country: DF.Data
		email: DF.Data | None
		first_name: DF.Data | None
		last_name: DF.Data | None
		name1: DF.Data | None
		phone_number: DF.Phone | None
		short_name: DF.Data | None
		state: DF.Data | None
		table_ocev: DF.Table[VendorContracts]
	# end: auto-generated types

	pass
