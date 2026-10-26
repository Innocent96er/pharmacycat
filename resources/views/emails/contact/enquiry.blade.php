<x-mail::message>
# 📬 New Contact Enquiry

You have a new message from the PharmacyCat contact form.

---

| Field | Value |
|:------|:------|
| Name | **{{ $enquiry['sender_name'] }}** |
| Email | {{ $enquiry['sender_email'] }} |
| Subject | {{ $enquiry['subject'] }} |

**Message:**

> {!! nl2br(e($enquiry['message'])) !!}

---

Reply directly to this email to respond to the customer.

PharmacyCat Admin
</x-mail::message>
