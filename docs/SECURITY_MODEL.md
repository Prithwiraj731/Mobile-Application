# Security Model

## 1. Security Goal

The app must ensure that only approved and authorized students can access protected study materials, and that materials are difficult to download, share, or misuse.

The security model is based on layered defense:

- Identity verification.
- Admin approval.
- Role-based access control.
- Plan-based content authorization.
- Private file storage.
- Short-lived preview sessions.
- Watermarking.
- Audit logging.
- Suspicious activity detection.

## 2. Important Security Reality

Perfect screenshot prevention is not possible across all platforms. A student can always use another device to record the screen. Browser restrictions can also be bypassed by technical users.

The correct production strategy is:

- Prevent easy downloads.
- Avoid direct file exposure.
- Block simple browser save/print actions.
- Add student-specific watermarks.
- Detect and log suspicious behavior.
- Limit sessions and devices.
- Revoke access quickly when abuse is detected.

## 3. Authentication

Recommended requirements:

- Email and password login.
- Strong password rules.
- Email verification.
- Password hashing with a modern algorithm.
- Session expiry.
- Refresh-token rotation if token-based auth is used.
- Login rate limiting.
- Account lockout or challenge after repeated failures.
- Admin two-factor authentication.

Student account states:

- `pending_email_verification`
- `pending_approval`
- `approved`
- `rejected`
- `suspended`

Only `approved` students can access the protected student app.

## 4. Authorization

Authorization must happen on the backend, never only in the frontend.

Every protected request must check:

- Authenticated user.
- User status.
- Role.
- Subscription.
- Material access level.
- Course/batch access.
- Preview session validity.

Recommended function:

```ts
canAccessMaterial({
  userId,
  materialId,
  action: "view" | "preview" | "download",
  sessionId,
})
```

Initial behavior:

- `view`: allowed for metadata if user can access the course and plan.
- `preview`: allowed only for approved users with a valid plan.
- `download`: disabled for all students in MVP.

## 5. File Storage

Files must be stored in private buckets.

Rules:

- No public file URLs.
- No static folder for protected files.
- No permanent CDN URLs.
- No direct file path exposure in client responses.
- Store only internal file IDs and object keys.
- Generate short-lived signed URLs only after authorization.
- Prefer proxy streaming for highly sensitive files.

Recommended storage metadata:

- `id`
- `material_id`
- `storage_provider`
- `bucket`
- `object_key`
- `mime_type`
- `size_bytes`
- `checksum`
- `created_by_admin_id`
- `created_at`

## 6. Secure PDF Preview

Recommended MVP approach:

- Use PDF.js in a custom viewer.
- Hide download and print controls.
- Render pages inside the app.
- Request page data only through authorized endpoints.
- Add visible watermark overlay.
- Log each material open and important viewer events.

Stronger future approach:

- Pre-render PDF pages into watermarked images per session.
- Serve page images through short-lived authorized URLs.
- Cache carefully with private cache controls.
- Add forensic watermarking for high-value content.

PDF viewer restrictions:

- Disable visible download button.
- Disable visible print button.
- Disable right-click inside viewer.
- Intercept common save/print shortcuts where possible.
- Use `Cache-Control: no-store` for sensitive preview endpoints.

## 7. Image Preview

Rules:

- Images must be served only after authorization.
- Images should include visible student/session watermark.
- Avoid exposing original object storage URLs.
- Use private cache headers for protected images.

## 8. Audio Preview

Rules:

- Audio should stream through an authenticated endpoint.
- Avoid direct public audio file URLs.
- Use range request support for playback.
- Log audio starts and meaningful seek events if feasible.
- Disable visible download controls where possible.

Note:

HTML audio controls may expose browser-specific options. A custom audio player can reduce casual downloading, but cannot fully prevent technical extraction if raw bytes reach the client.

## 9. Watermarking

Visible watermark should include:

- Student name.
- Email or phone.
- Date/time.
- Session ID or short trace ID.

Watermark placement:

- Repeated diagonal watermark for PDFs and images.
- Small fixed watermark near viewer edge.
- Avoid blocking readability too much.

Purpose:

- Discourage sharing.
- Trace leaked screenshots or recordings.
- Support enforcement decisions.

## 10. Session and Device Controls

Recommended MVP:

- Store sessions server-side or track active token sessions.
- Show current sessions to admin.
- Allow admin to revoke sessions.
- Log device, IP, user agent, and approximate location where allowed.

Recommended phase 2:

- Limit concurrent sessions per plan.
- Add trusted devices.
- Notify users of new device login.
- Flag rapid device/IP switching.

## 11. Audit Logs

Admin audit logs should record:

- Admin login.
- Student approval.
- Student rejection.
- Student suspension.
- Subscription assignment.
- Content upload.
- Content publish/unpublish.
- Content delete/archive.
- Permission changes.

Student access logs should record:

- Login.
- Material list view.
- Material preview open.
- PDF page range viewed, if feasible.
- Audio play.
- Unauthorized access attempt.
- Rate limit events.

Log fields:

- Actor user ID.
- Target entity ID.
- Action.
- Timestamp.
- IP address.
- User agent.
- Session ID.
- Result.
- Metadata.

## 12. Rate Limiting

Apply rate limits to:

- Signup.
- Login.
- Password reset.
- Preview session creation.
- Material page/image/audio endpoints.
- Admin upload endpoints.

Possible policy:

- Strict rate limits for unauthenticated routes.
- Moderate limits for normal student browsing.
- Lower thresholds for repeated material access failures.
- Alerts for unusual spikes.

## 13. Admin Panel Protection

Admin routes must require:

- Authenticated admin user.
- Admin role.
- Optional 2FA.
- Active session.
- CSRF protection if cookie-based auth is used.

Admin panel should include:

- Audit logs.
- Confirmation for destructive actions.
- Role management in later phases.
- Session revocation.
- Security alert dashboard.

## 14. Browser-Level Deterrents

Useful controls:

- Disable right-click in protected viewer.
- Block `Ctrl+S`, `Cmd+S`, `Ctrl+P`, `Cmd+P` in viewer area.
- Hide iframe/embed toolbars.
- Use custom PDF rendering rather than browser-native PDF display.
- Avoid placing original file URLs in the DOM.

Limitations:

- Browser dev tools can inspect network requests.
- Extensions may bypass UI restrictions.
- Screenshots cannot be reliably blocked in web browsers.

Therefore, browser controls are deterrents, not the main security layer.

## 15. Native App Screenshot Controls

If a mobile app is built later:

- Android can block screenshots and screen recording with secure window flags.
- iOS has more limited prevention, but the app can detect screenshot events and obscure sensitive screens in app switcher states.

Native apps improve control but still cannot stop external camera recording.

## 16. Security Acceptance Criteria

MVP should pass these checks:

- Pending students cannot access dashboard data.
- Rejected students cannot access protected data.
- Suspended students cannot access protected data.
- Student users cannot access admin APIs.
- Free users cannot access Pro/Premium materials.
- Pro users cannot access Premium materials.
- Direct storage URLs are not public.
- Expired preview URLs stop working.
- Preview endpoints require authorization.
- Admin actions are logged.
- Material preview actions are logged.
- Watermark appears on PDF and image previews.
- Download buttons are not exposed in the app viewer.

## 17. Production Checklist

Before launch:

- Enable HTTPS.
- Enable secure cookies.
- Set strict CORS.
- Set private cache headers for protected content.
- Configure database backups.
- Configure object storage lifecycle and backups.
- Enable error monitoring.
- Enable security event alerts.
- Rotate production secrets.
- Create emergency admin account recovery process.
- Test restore from backup.
- Test account suspension and session revocation.
- Run dependency vulnerability checks.
- Review access logs and audit logs.
