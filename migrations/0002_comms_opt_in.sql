-- Track email/SMS communication opt-ins for RSVP leads.
ALTER TABLE leads ADD COLUMN email_opt_in INTEGER NOT NULL DEFAULT 1;
ALTER TABLE leads ADD COLUMN sms_opt_in INTEGER NOT NULL DEFAULT 0;
