<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Your PharmacyCat Order #{{ $order['order_number'] }} is Confirmed</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');

        body, table, td, p, a, li, blockquote, h1, h2, h3, h4, span, div, strong, th {
            font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #f1f5f9;
            color: #0f172a;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        @media only screen and (max-width: 620px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
                border-radius: 0 !important;
            }
            .content-padding {
                padding: 20px 16px !important;
            }
            .stack-column {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
            .item-image {
                width: 44px !important;
                height: 44px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">

    <!-- Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; width: 100%; margin: 0; padding: 32px 0;">
        <tr>
            <td align="center" style="padding: 0 12px;">

                <!-- Card Container -->
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">

                    <!-- Brand Header -->
                    <tr>
                        <td align="center" style="background-color: #ffffff; padding: 28px 24px 20px; border-bottom: 1px solid #f1f5f9;">
                            <a href="{{ config('app.url') }}" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: #0f172a;">
                                <span style="display: inline-block; width: 38px; height: 38px; line-height: 38px; background-color: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 10px; text-align: center; font-size: 20px; vertical-align: middle; margin-right: 10px;">🐱</span>
                                <span style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a; vertical-align: middle;">Pharmacy<span style="color: #059669;">Cat</span></span>
                            </a>
                            <div style="margin-top: 6px; font-size: 12px; font-weight: 500; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">Official Order Receipt</div>
                        </td>
                    </tr>

                    <!-- Main Content Body -->
                    <tr>
                        <td class="content-padding" style="padding: 32px 32px 24px;">

                            <!-- Hero Confirmation Box -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td>
                                        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px; padding: 4px 12px; margin-bottom: 12px;">
                                            <span style="color: #059669; font-size: 13px; font-weight: 600; letter-spacing: 0.2px;">✓ Order Confirmed</span>
                                        </div>
                                        <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                                            Thank you for your order, {{ $order['customer_name'] }}!
                                        </h1>
                                        <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.5;">
                                            We've received your order and our registered pharmacists are preparing your prescription & health products for {{ $order['delivery_type'] === 'pickup' ? 'counter collection' : 'delivery via ' . ($order['courier_name'] ?? 'courier') }}.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Order Summary Details Card -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 18px 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="50%" valign="top" style="padding-bottom: 12px;">
                                                    <span style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 3px;">Order Number</span>
                                                    <strong style="font-size: 15px; color: #059669; font-weight: 700;">#{{ $order['order_number'] }}</strong>
                                                </td>
                                                <td width="50%" valign="top" style="padding-bottom: 12px;">
                                                    <span style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 3px;">Date Placed</span>
                                                    <strong style="font-size: 14px; color: #1e293b; font-weight: 600;">{{ $order['placed_at'] ?? date('M j, Y') }}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="50%" valign="top">
                                                    <span style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 3px;">Fulfillment & Courier</span>
                                                    <strong style="font-size: 14px; color: #1e293b; font-weight: 600;">{{ $order['courier_name'] ?? ($order['delivery_type'] === 'pickup' ? 'Pharmacy Counter Pickup' : 'Home Delivery') }}</strong>
                                                </td>
                                                <td width="50%" valign="top">
                                                    <span style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 3px;">Payment Method</span>
                                                    <strong style="font-size: 14px; color: #1e293b; font-weight: 600;">{{ $order['payment_method'] }}</strong>
                                                </td>
                                            </tr>
                                            @if (!empty($order['delivery_address']) && $order['delivery_type'] !== 'pickup')
                                                <tr>
                                                    <td colspan="2" style="padding-top: 12px; border-top: 1px dashed #e2e8f0;">
                                                        <span style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 3px;">Delivery Destination</span>
                                                        <span style="font-size: 14px; color: #334155;">{{ $order['delivery_address'] }}</span>
                                                    </td>
                                                </tr>
                                            @endif
                                            @if (in_array($order['delivery_type'] ?? '', ['yango', 'indrive']))
                                                <tr>
                                                    <td colspan="2" style="padding-top: 12px; border-top: 1px dashed #e2e8f0;">
                                                        <div style="font-size: 12px; color: #92400e; background-color: #fef3c7; border: 1px solid #fde68a; padding: 10px 14px; border-radius: 8px; line-height: 1.4;">
                                                            🛵 <strong>Courier Dispatch Note:</strong> A PharmacyCat staff member will book your courier and call you to confirm.
                                                        </div>
                                                    </td>
                                                </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Items Heading -->
                            <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.2px;">
                                Items in Your Order
                            </div>

                            <!-- Items Table -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                                <thead>
                                    <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                                        <th align="left" style="padding: 12px 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Item Description</th>
                                        <th align="center" style="padding: 12px 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; width: 60px;">Qty</th>
                                        <th align="right" style="padding: 12px 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; width: 100px;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($order['items'] as $item)
                                        <tr style="border-bottom: 1px solid #f1f5f9;">
                                            <td style="padding: 14px 16px;" valign="middle">
                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td style="padding-right: 12px;" valign="middle">
                                                            @if (!empty($item['image']))
                                                                <img class="item-image" src="{{ $item['image'] }}" alt="{{ $item['name'] }}" width="50" height="50" style="width: 50px; height: 50px; border-radius: 8px; border: 1px solid #e2e8f0; object-fit: cover; display: block; background-color: #f8fafc;" onerror="this.style.display='none'" />
                                                            @else
                                                                <div class="item-image" style="width: 50px; height: 50px; border-radius: 8px; border: 1px solid #e2e8f0; background-color: #ecfdf5; text-align: center; line-height: 50px; font-size: 20px;">💊</div>
                                                            @endif
                                                        </td>
                                                        <td valign="middle">
                                                            <div style="font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4;">{{ $item['name'] }}</div>
                                                            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Unit Price: {{ $item['price'] }}</div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td align="center" style="padding: 14px 12px;" valign="middle">
                                                <span style="display: inline-block; background-color: #f1f5f9; color: #334155; font-size: 13px; font-weight: 600; border-radius: 6px; padding: 2px 8px;">
                                                    {{ $item['qty'] }}
                                                </span>
                                            </td>
                                            <td align="right" style="padding: 14px 16px; font-size: 14px; font-weight: 600; color: #0f172a;" valign="middle">
                                                {{ $item['price'] }}
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>

                            <!-- Pricing Breakdown Box -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td align="right">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 280px;">
                                            @if (isset($order['subtotal']))
                                                <tr>
                                                    <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Subtotal:</td>
                                                    <td align="right" style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 500;">{{ $order['subtotal'] }}</td>
                                                </tr>
                                            @endif
                                            @if (isset($order['delivery_fee']))
                                                <tr>
                                                    <td style="padding: 4px 0; font-size: 14px; color: #64748b;">Delivery Fee:</td>
                                                    <td align="right" style="padding: 4px 0; font-size: 14px; color: #1e293b; font-weight: 500;">{{ $order['delivery_fee'] }}</td>
                                                </tr>
                                            @endif
                                            <tr>
                                                <td colspan="2" style="padding-top: 8px;">
                                                    <div style="border-top: 2px solid #e2e8f0;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; font-size: 16px; font-weight: 700; color: #0f172a;">Grand Total:</td>
                                                <td align="right" style="padding: 10px 0; font-size: 20px; font-weight: 800; color: #059669;">{{ $order['total'] }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Fulfillment Notice Card -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 28px;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <div style="font-size: 14px; font-weight: 700; color: #166534; margin-bottom: 4px;">
                                            @if ($order['delivery_type'] === 'pickup')
                                                🏥 Collection Ready Information
                                            @else
                                                🚚 Delivery Dispatch Information
                                            @endif
                                        </div>
                                        <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
                                            @if ($order['delivery_type'] === 'pickup')
                                                Your order will be packaged for counter pickup at PharmacyCat. Please provide Order ID <strong>#{{ $order['order_number'] }}</strong> upon arrival.
                                            @else
                                                Your order is being packaged safely. You will receive an update once the rider is dispatched to your delivery address.
                                            @endif
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 13px 32px; border-radius: 8px; text-align: center; letter-spacing: -0.2px; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);">
                                            Visit PharmacyCat Store
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support Help Note -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
                                <tr>
                                    <td align="center" style="font-size: 13px; color: #64748b; line-height: 1.5;">
                                        Have a question about your medication or order? Feel free to reply directly to this email or contact us at <a href="mailto:{{ config('mail.admin_address', 'support@pharmacycat.com') }}" style="color: #059669; text-decoration: underline;">{{ config('mail.admin_address', 'support@pharmacycat.com') }}</a>.
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f8fafc; padding: 24px 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                            <p style="margin: 0 0 6px 0; font-weight: 600; color: #475569;">PharmacyCat Community Pharmacy</p>
                            <p style="margin: 0 0 6px 0;">Providing licensed healthcare, trusted prescriptions, and authentic products.</p>
                            <p style="margin: 0;">© {{ date('Y') }} PharmacyCat. All rights reserved.</p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
