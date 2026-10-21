<x-mail::message>
# Welcome to PharmacyCat! 🐱

Hi **{{ $subscriberName }}**,

You're in! Welcome to the **PharmacyCat Newsletter** — your source for health tips, product highlights, exclusive offers, and pharmacy news.

Here's what to expect:

- 💊 **Health & wellness tips** from our pharmacists
- 🏷️ **Exclusive deals** on popular products
- 📣 **New arrivals** and seasonal promotions

We respect your inbox — no spam, ever.

<x-mail::button :url="config('app.url')">
Visit Our Store
</x-mail::button>

Thanks for joining us,<br>
**The PharmacyCat Team** 🐱

---

<small>If you didn't sign up for this newsletter, you can safely ignore this email.</small>
</x-mail::message>
