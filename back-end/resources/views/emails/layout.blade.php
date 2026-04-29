<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Base Reset */
        body, table, td, a { text-decoration: none !important; }
        body { background-color: #020617; margin: 0; padding: 0; width: 100% !important; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

        /* Container */
        .wrapper { background-color: #020617; padding: 40px 20px; }
        .main-card { max-width: 550px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 40px; overflow: hidden; position: relative; }
        
        /* Indigo Stripe - LENTERA Theme */
        .header-stripe { height: 6px; background: #6366f1; background: linear-gradient(to right, #4338ca, #6366f1, #4338ca); }
        
        /* Content Body */
        .content { padding: 45px 40px; }
        
        /* Logo Badge */
        .badge { display: inline-block; background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); padding: 8px 16px; border-radius: 14px; }
        .badge-text { color: #6366f1; font-size: 11px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }

        /* Typography */
        .title { color: #ffffff; font-size: 30px; font-weight: 900; margin: 25px 0 10px 0; text-transform: uppercase; font-style: italic; letter-spacing: -1.5px; line-height: 1; }
        .subtitle { color: #475569; font-size: 10px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 30px; }
        .text { color: #94a3b8; font-size: 15px; line-height: 1.7; margin-bottom: 30px; }

        /* Button */
        .btn-wrapper { text-align: center; padding: 25px 0; }
        .btn { display: inline-block; background-color: #6366f1; color: #ffffff !important; padding: 20px 40px; border-radius: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; font-size: 13px; box-shadow: 0 15px 35px rgba(99, 102, 241, 0.25); border-top: 1px solid rgba(255,255,255,0.2); }

        /* Footer */
        .footer { text-align: center; padding: 30px 0; }
        .footer-text { color: #334155; font-size: 9px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="main-card">
            <div class="header-stripe"></div>
            
            <div class="content">
                <div class="badge">
                    <span class="badge-text">LENTERA NODE</span>
                </div>

                @yield('content')

                <div style="margin-top: 45px; padding-top: 30px; border-top: 1px solid #1e293b; text-align: center;">
                    <p style="color: #475569; font-size: 10px; line-height: 1.6; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Node Authentication Protocol:<br>
                        <a href="{{ $url }}" style="color: #6366f1; text-decoration: underline !important;">{{ $url }}</a>
                    </p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">&copy; {{ date('Y') }} LENTERA INFRASTRUCTURE SYSTEM</p>
        </div>
    </div>
</body>
</html>