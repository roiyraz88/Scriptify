const generateScript = (
    fromEmail: string,
    toEmail: string,
    subject: string,
    body: string,
    filename: string,
    appPassword: string
  ): string => {
    return `
  import smtplib
  from email.message import EmailMessage
  
  msg = EmailMessage()
  msg["Subject"] = "${subject}"
  msg["From"] = "${fromEmail}"
  msg["To"] = "${toEmail}"
  msg.set_content("""${body}""")
  
  with open("${filename}", "rb") as f:
      file_data = f.read()
      msg.add_attachment(
          file_data,
          maintype="application",
          subtype="octet-stream",
          filename="${filename}"
      )
  
  with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
      smtp.login("${fromEmail}", "${appPassword}")
      smtp.send_message(msg)
  `;
  };
  