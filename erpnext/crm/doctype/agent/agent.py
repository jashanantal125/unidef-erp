# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Agent(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		address: DF.SmallText
		agent_type: DF.Literal["", "B2B", "B2C"]
		city: DF.Data
		comments: DF.SmallText | None
		company_name: DF.Data
		contact_person: DF.Data
		country: DF.Link
		country_code: DF.Data
		designation: DF.Literal["", "Owner", "Manager", "Director", "Representative", "Other"]
		email: DF.Data
		first_name: DF.Data
		last_name: DF.Data
		mobile: DF.Data
		naming_series: DF.Literal["AGT-.YYYY.-"]
		no_of_employees: DF.Int
		state: DF.Data
	# end: auto-generated types

	pass

