package com.app.rentconnect.v1.service.command;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.owasp.encoder.Encode;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service

public class MailCommandService {
    private final ExecutorService executorService = Executors.newFixedThreadPool(3);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String username;

    public void sendMailOTP(String to, String opt, String fullName) {
        String subject = "Your One-Time Password (OTP) for Account Verification";

        StringBuilder content = new StringBuilder();
        content.append("<p>Dear ").append(Encode.forHtml(fullName)).append(",</p>");
        content.append("<p>Thank you for registering with us! To complete the verification process and ensure the security of ")
                .append("your account, please find your One-Time Password (OTP) below:</p>");
        content.append("<p>OTP: <b>");
        content.append(opt);
        content.append("</b></p>");
        content.append("<p>Please use this OTP to verify your account. It is valid for a single use and will expire shortly. For security reasons, please do not share this OTP with anyone</p>");
        content.append("<p>If you did not attempt to register with us, please disregard this email. However, if you have any concerns or questions, feel free to reach out to our customer support team immediately.</p>");
        content.append("<p>Thank you for choosing us. We look forward to serving you!</p>");

        sendMail(to, subject, content.toString());
    }
    private void sendMail(String to, String subject, String content) {
        executorService.submit(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();

                MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

                helper.setFrom(new InternetAddress(username));
                helper.setTo(new InternetAddress(to));
                helper.setSubject(subject);
                helper.setText(content, true);

                mailSender.send(message);

                System.out.println("Message sent successfully");
            } catch (MessagingException ex) {
                ex.printStackTrace();
            }
        });
    }
}
