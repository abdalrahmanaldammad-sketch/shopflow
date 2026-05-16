package org.example.shopflow.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.base-url}")
    private String baseUrl;

   @Async
    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify your email address";
        String verificationUrl = baseUrl + "/api/auth/verify-email?token=" + token;
        String body = """
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Email Verification</h2>
                        <p>Thank you for registering. Please click the link below to verify your email address:</p>
                        <p style="margin: 20px 0;">
                            <a href="%s"
                               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                                Verify Email
                            </a>
                        </p>
                        <p>This link will expire in 24 hours.</p>
                        <p>If you did not create an account, please ignore this email.</p>
                    </div>
                </body>
                </html>
                """.formatted(verificationUrl);

        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Reset your password";
        String resetUrl = baseUrl + "/api/auth/reset-password?token=" + token;
        String body = """
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Password Reset</h2>
                        <p>You have requested to reset your password. Click the link below:</p>
                        <p style="margin: 20px 0;">
                            <a href="%s"
                               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                                Reset Password
                            </a>
                        </p>
                        <p>This link will expire in 30 minutes.</p>
                        <p>If you did not request a password reset, please ignore this email and ensure your account is secure.</p>
                    </div>
                </body>
                </html>
                """.formatted(resetUrl);

        sendHtmlEmail(to, subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }
}