# Secure Learning App PRD

## 1. Product Vision

Build a premium, secure education platform where only admin-approved students can access structured study materials such as PDFs, images, audio lessons, notes, and future video content. The platform should feel professional, fast, trustworthy, and modern without relying on generic gradient-heavy UI patterns.

The core product promise is controlled access: students can preview authorized study materials inside the app, while the system discourages downloading, sharing, screen recording, screenshotting, and account misuse through layered security.

## 2. Target Users

### Students

Students create an account, wait for admin approval, subscribe to a plan if required, and access allowed study materials from a personal dashboard.

Primary needs:

- Secure account creation and login.
- Clear approval status after registration.
- Fast access to organized subjects, chapters, notes, PDFs, images, and audio.
- Premium reading and listening experience.
- Simple subscription status visibility.

### Admins

Admins manage users, approvals, subscriptions, content uploads, content organization, and access controls.

Primary needs:

- Review newly registered users.
- Approve, reject, suspend, or verify users.
- Upload and manage PDFs, images, audio, and study notes.
- Organize content by course, subject, chapter, topic, and plan.
- Control which subscription level can access each item.
- Monitor suspicious access activity.

## 3. Core Principles

- Security first: every protected resource must be checked server-side before access.
- Preview-only by default: no direct public file URLs.
- Admin-controlled enrollment: a student cannot use the app until approved.
- Premium and practical UI: clean layouts, strong typography, restrained colors, fast navigation.
- Structured learning: content should be easy to browse by course, subject, chapter, and material type.
- Auditability: important access and admin actions should be logged.
- Scalable foundations: architecture should support future apps, batches, payments, video, certificates, and analytics.

## 4. Main Features

### 4.1 Student Registration

Students register with:

- Full name.
- Email.
- Password.
- Phone number.
- Address.
- Optional profile photo.

System behavior:

- New accounts are created in `pending_approval` status.
- Pending students cannot access protected dashboard content.
- Students receive a clear status screen after signup.
- Duplicate email and duplicate phone checks should be enforced.
- Email verification should be required before approval where possible.

### 4.2 Student Login

Login rules:

- Students can log in only after email verification and admin approval.
- Pending users see an approval-pending screen.
- Rejected users see a support/contact message.
- Suspended users cannot access the app.
- Admin users login through a separate admin route or admin role gate.

Recommended security:

- Strong password rules.
- Rate limiting for login attempts.
- Optional two-factor authentication for admins.
- Session expiry and refresh-token rotation.
- Device/session management.

### 4.3 Student Dashboard

The student dashboard should include:

- Welcome header with subscription status.
- Continue learning section.
- Courses or batches available to the student.
- Recently added materials.
- Bookmarked materials.
- Announcements.
- Account and subscription details.

Dashboard states:

- Pending approval.
- Approved but no subscription.
- Free plan user.
- Pro plan user.
- Premium plan user.
- Suspended account.

### 4.4 Content Library

Content should be structured as:

- Course or batch.
- Subject.
- Chapter.
- Topic.
- Material item.

Material types:

- PDF notes.
- Images.
- Audio lessons.
- Text notes.
- External references, if enabled later.
- Video lessons, optional future phase.

Each material item should support:

- Title.
- Description.
- Type.
- Course/subject/chapter/topic assignment.
- Subscription access level.
- Published/draft status.
- Upload date.
- Created by admin.
- Version history, future phase.

### 4.5 Secure Preview

Students should view materials only inside the app.

Required behavior:

- Files are stored privately, not in public buckets.
- Students never receive permanent direct file URLs.
- Access is checked server-side for every material request.
- Preview URLs are short-lived and signed.
- PDF viewer should disable visible download and print buttons.
- Right-click and common save shortcuts should be blocked where possible.
- Student identity watermark should appear over PDFs/images.
- Audio should stream through authorized endpoints.

Important limitation:

No web or mobile app can fully prevent screenshots or external recording. The app can block or discourage screenshots in supported native environments, disable simple browser actions, watermark content, detect suspicious behavior, and revoke access. The strongest practical protection is layered security plus visible traceability.

### 4.6 Admin Panel

Admin panel modules:

- Overview dashboard.
- Pending user approvals.
- User management.
- Subscription management.
- Content upload.
- Content organization.
- Access control rules.
- Announcements.
- Audit logs.
- Security alerts.
- Settings.

Admin user actions:

- Approve student.
- Reject student.
- Suspend student.
- Assign subscription.
- Extend subscription.
- Change plan.
- Upload material.
- Replace material.
- Publish/unpublish material.
- Delete or archive material.
- Review access logs.

### 4.7 Subscription Plans

Initial plans:

- Free.
- Pro.
- Premium.

Plan capabilities should be configurable by admin.

Example access:

- Free: sample notes, announcements, limited materials.
- Pro: standard course notes, selected audio, chapter-wise PDFs.
- Premium: all Pro content plus premium notes, exclusive audio, priority materials, future video.

Payment can be implemented later. In the first version, admins may manually assign plans.

Future payment support:

- Online payment gateway.
- Invoices.
- Coupon codes.
- Auto-expiry.
- Renewal reminders.
- Failed payment handling.

### 4.8 Notifications

Recommended notifications:

- Signup received.
- Account approved.
- Account rejected.
- Subscription activated.
- Subscription expiring.
- New material published.
- Admin security alert.

Channels:

- In-app notifications first.
- Email in phase 2.
- SMS/WhatsApp optional future phase.

## 5. Security Requirements

### 5.1 Authorization

Every protected action must validate:

- User is authenticated.
- User email is verified.
- User status is approved.
- User is not suspended.
- User has an active subscription if required.
- User plan allows the requested content.
- Requested file belongs to an accessible course or batch.

### 5.2 File Security

Files must be:

- Stored in private object storage.
- Referenced by internal IDs, not public URLs.
- Served through signed short-lived URLs or streaming proxy.
- Watermarked per student/session when feasible.
- Protected by access logs.

### 5.3 Admin Security

Admin area must include:

- Role-based access control.
- Admin-only routes and APIs.
- Strong password policy.
- Two-factor authentication recommendation.
- Audit logs for approval, upload, delete, subscription, and permission changes.
- Principle of least privilege for future staff roles.

### 5.4 Anti-Sharing Measures

Recommended controls:

- Visible watermark with student name, phone/email, date, and session ID.
- Limit concurrent active sessions.
- Device/session tracking.
- Unusual activity detection.
- Rate limits on material access.
- Token expiry for file previews.
- IP and device metadata logging.
- Automatic warning or suspension workflow for suspicious activity.

### 5.5 Screenshot and Download Controls

Web app controls:

- Hide download and print controls in embedded viewers.
- Disable right-click on protected viewer areas.
- Disable common keyboard shortcuts for save/print where possible.
- Use canvas/image rendering for PDF pages instead of direct file exposure where feasible.
- Add user-specific watermarks.

Native mobile controls:

- Android: use secure window flags to block screenshots and screen recording where supported.
- iOS: detection and obscuring strategies are possible, but full screenshot prevention is limited.

Security reality:

- A second camera can always record a screen.
- Browser-level restrictions can be bypassed by advanced users.
- Therefore, watermarking, access control, legal terms, monitoring, and fast revocation are essential.

## 6. User Experience Requirements

### Visual Direction

- Premium education product, not a generic template.
- Clean white or near-white base with deep neutral text.
- One strong accent color plus measured secondary colors.
- Avoid heavy gradients and flashy decoration.
- Dense but readable dashboards.
- Clear hierarchy for courses, subjects, chapters, and materials.

### Student UI

- Fast sidebar or tab navigation.
- Content-first dashboard.
- Professional PDF/image/audio preview experience.
- Clear locked states for unavailable premium content.
- Minimal friction after approval.

### Admin UI

- Operational and efficient.
- Tables with filters, search, bulk actions, and status chips.
- Upload workflows with progress and validation.
- Clear audit trail and confirmation modals for risky actions.

## 7. Data Model Draft

Core entities:

- `User`
- `StudentProfile`
- `AdminProfile`
- `ApprovalRequest`
- `SubscriptionPlan`
- `StudentSubscription`
- `Course`
- `Subject`
- `Chapter`
- `Topic`
- `Material`
- `MaterialFile`
- `MaterialAccessLog`
- `AdminAuditLog`
- `DeviceSession`
- `Notification`

User statuses:

- `pending_email_verification`
- `pending_approval`
- `approved`
- `rejected`
- `suspended`

Material statuses:

- `draft`
- `published`
- `archived`

Material access levels:

- `free`
- `pro`
- `premium`
- Custom plan IDs in future.

## 8. Non-Functional Requirements

Performance:

- Dashboard initial load under 2 seconds on normal broadband.
- Material list filtering should feel instant for common queries.
- Large PDFs should render page-by-page.
- Audio should stream without forcing full-file download.

Reliability:

- File uploads must be resumable or safely retryable in later phases.
- Admin actions should be transactional where needed.
- Failed uploads should not create broken published materials.

Privacy:

- Store only required student information.
- Protect phone/address as sensitive data.
- Restrict admin access based on role.
- Log sensitive actions.

Accessibility:

- Keyboard navigable UI.
- Sufficient color contrast.
- Proper labels for forms and controls.
- Readable text sizes.

## 9. MVP Scope

MVP must include:

- Student signup.
- Email/password login.
- Admin approval workflow.
- Student dashboard.
- Admin dashboard.
- User management.
- Manual subscription assignment.
- Course/subject/chapter organization.
- PDF, image, and audio upload.
- Secure preview for approved users.
- Basic watermarking.
- Private file storage.
- Audit logs for admin actions.

MVP excludes:

- Online payments.
- Advanced DRM.
- Offline access.
- Mobile app.
- Video streaming.
- AI recommendations.
- Public marketplace.

## 10. Success Metrics

Product metrics:

- Signup completion rate.
- Approval turnaround time.
- Active students per week.
- Material views per student.
- Subscription conversion from Free to Pro/Premium.

Security metrics:

- Unauthorized access attempts blocked.
- Suspicious session alerts.
- Shared account detections.
- Watermarked leak traceability.
- Admin action audit completeness.

Performance metrics:

- Dashboard load time.
- Material preview open time.
- Upload success rate.
- API error rate.

## 11. Open Decisions

- Web-only first, or web plus mobile app?
- Which payment gateway should be used later?
- Should approval require document/ID verification?
- Should phone OTP be required at signup?
- How many concurrent devices should each plan allow?
- Should materials be tied to batches, courses, or both?
- Should admin be able to create staff roles such as editor, reviewer, and support?
