<x-mail::message>
# Order Confirmed ✅

Hi **{{ $order['customer_name'] }}**,

Thank you for your order! We've received it and it's being processed.

---

**Order #{{ $order['order_number'] }}**

<x-mail::table>
| Item | Qty | Price |
|:-----|:---:|------:|
@foreach ($order['items'] as $item)
| {{ $item['name'] }} | {{ $item['qty'] }} | {{ $item['price'] }} |
@endforeach
| | **Total** | **{{ $order['total'] }}** |
</x-mail::table>

---

We'll notify you once your order is ready for collection or has been dispatched.

If you have any questions, feel free to reply to this email.

<x-mail::button :url="config('app.url')">
Visit PharmacyCat
</x-mail::button>

Thanks for choosing us,<br>
**The PharmacyCat Team** 🐱
</x-mail::message>
