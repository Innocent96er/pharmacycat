<x-mail::message>
# 🛒 New Order Received

A new order has just been placed on PharmacyCat.

---

**Order Details**

| Field | Value |
|:------|:------|
| Order # | **{{ $order['order_number'] }}** |
| Customer | {{ $order['customer_name'] }} |
| Email | {{ $order['customer_email'] }} |
| Items | {{ $order['items_count'] }} |
| Total | **{{ $order['total'] }}** |

---

<x-mail::button :url="config('app.url').'/dashboard'">
View in Dashboard
</x-mail::button>

PharmacyCat Admin
</x-mail::message>
