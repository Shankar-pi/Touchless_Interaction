import smtplib
import ssl
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
import io
import random
import string

email_sender = "jejjalarohit@gmail.com"
email_password = "arlu groj mmvh ptvu"

def generate_booking_reference():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def create_ticket_image(first_name, last_name, aadhar, from_location, to_location, flight_date, flight_time, travel_class):
    width, height = 800, 500
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    try:
        title_font = ImageFont.truetype("arial.ttf", 36)
        header_font = ImageFont.truetype("arial.ttf", 24)
        text_font = ImageFont.truetype("arial.ttf", 18)
        small_font = ImageFont.truetype("arial.ttf", 14)
    except:
        title_font = ImageFont.load_default()
        header_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    draw.rectangle([(0, 0), (width, 80)], fill='#1e3a8a')
    draw.text((width//2, 40), "✈️ FLIGHT TICKET", font=title_font, fill='white', anchor="mm")
    
    booking_ref = generate_booking_reference()
    
    y_offset = 120
    line_spacing = 35
    
    details = [
        ("Passenger Name:", f"{first_name} {last_name}"),
        ("Aadhar Number:", aadhar),
        ("From:", from_location),
        ("To:", to_location),
        ("Flight Date:", flight_date),
        ("Flight Time:", flight_time),
        ("Class:", travel_class)
    ]
    
    for label, value in details:
        draw.text((50, y_offset), label, font=header_font, fill='#1e3a8a')
        draw.text((320, y_offset), value, font=text_font, fill='black')
        y_offset += line_spacing
    
    draw.rectangle([(0, height-60), (width, height)], fill='#f3f4f6')
    draw.text((width//2, height-30), "Please arrive 2 hours before departure | Carry valid ID proof", 
              font=small_font, fill='#374151', anchor="mm")
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return img_byte_arr

def send_ticket_confirmation(booking_data):
    try:
        aadhar = booking_data.get('aadhar', '')
        from_location = booking_data.get('from', '')
        to_location = booking_data.get('to', '')
        travel_class = booking_data.get('class', '')
        flight_date = booking_data.get('flight_date', '')
        flight_time = booking_data.get('flight_time', '')
        
        df = pd.read_excel('static/BookingDetails.xlsx')
        
        user_row = df[df['Aadhar'] == int(aadhar)]
        
        if user_row.empty:
            return False
        
        email = user_row.iloc[0]['Email Id']
        first_name = user_row.iloc[0]['First Name']
        last_name = user_row.iloc[0]['Last Name']
        
        ticket_image = create_ticket_image(first_name, last_name, aadhar, from_location, to_location, 
                                          flight_date, flight_time, travel_class)
        
        msg = MIMEMultipart()
        msg['From'] = email_sender
        msg['To'] = email
        msg['Subject'] = "🎫 Flight Ticket Booking Confirmation"
        
        body = f"""Dear {first_name} {last_name},

Thank you for booking with us! Your flight ticket has been confirmed successfully.

✈️ BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passenger Name    : {first_name} {last_name}
Aadhar Number     : {aadhar}
From              : {from_location}
To                : {to_location}
Flight Date       : {flight_date}
Flight Time       : {flight_time}
Class             : {travel_class}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 IMPORTANT INFORMATION:
- Please arrive at the airport at least 2 hours before departure
- Carry a valid ID proof (Aadhar card) for verification
- Web check-in opens 24 hours before departure
- This ticket is non-transferable
- Baggage allowance: Check-in 15kg, Cabin 7kg

⚠️ CANCELLATION POLICY:
- Cancellations made 24 hours before departure: Full refund
- Cancellations made within 24 hours: 50% refund
- No-show: No refund

📎 DOWNLOAD YOUR TICKET:
Your flight ticket is attached to this email. Please download and save it for your records.

If you have any questions or need assistance, please contact our support team.

Safe travels!

Best regards,
Airport Booking Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated confirmation email. Please do not reply."""
        
        msg.attach(MIMEText(body, 'plain'))
        
        attachment = MIMEBase('application', 'octet-stream')
        attachment.set_payload(ticket_image.read())
        encoders.encode_base64(attachment)
        attachment.add_header('Content-Disposition', f'attachment; filename=FlightTicket_{aadhar}.png')
        msg.attach(attachment)
        
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender, email_password)
            smtp.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False