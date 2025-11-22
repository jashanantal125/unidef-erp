// Copyright (c) 2025, Unideft and contributors
// For license information, please see license.txt

frappe.ui.form.on("Student", {
	refresh(frm) {
		// Add any custom client-side logic here
	},
	
	date_of_birth(frm) {
		// Auto-calculate age from date of birth
		if (frm.doc.date_of_birth) {
			const today = new Date();
			const birthDate = new Date(frm.doc.date_of_birth);
			let age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			
			frm.set_value("age", age);
		}
	}
});

