# Security Remediation - Exposed API Keys

## Issue Summary

On April 13-17, 2026, we discovered that sensitive API keys and credentials were committed to the git repository history through the `dev.vars.example` file.

## Exposed Credentials (MUST BE ROTATED)

The following credentials were exposed in git commits `e85443f` and `ab519a1`:

1. **Google API Key**: `AIzaSyBaWgtypipKVknHO-W1eBuTpoeNTj8NYGw`
2. **Resend API Key**: `re_TfmU4YzT_6S1dCUhnf1sbn1FzTuF7awKq`
3. **Google Cloud Project ID**: `ninth-botany-485105-d7`
4. **Google Ads Customer ID**: `8038035043`

## Actions Taken

### 1. Removed Hardcoded Credentials (✅ Complete)
- Removed hardcoded customer ID from `check_campaign.py`
- Updated to use environment variable `GOOGLE_ADS_CUSTOMER_ID`
- Replaced real customer ID with placeholder in `google-ads.yaml.example`

### 2. Current Code Status (✅ Complete)
- `.gitignore` properly configured to prevent future commits of sensitive files
- All current code uses environment variables or config files (which are gitignored)

## CRITICAL: Required Actions by Repository Owner

### Immediate Actions (MUST DO NOW)

1. **Revoke ALL exposed credentials**:
   - Google API Key: Create new key at https://console.cloud.google.com/apis/credentials
   - Resend API Key: Create new key at https://resend.com/api-keys
   - Consider rotating OAuth tokens and refresh tokens

2. **Clean Git History** (choose ONE option):

   **Option A: Use BFG Repo-Cleaner (Recommended - Easiest)**
   ```bash
   # Install BFG
   brew install bfg  # macOS
   # or download from: https://rtyley.github.io/bfg-repo-cleaner/

   # Clone a fresh copy
   git clone --mirror https://github.com/calebmills99/golden-wings-screening.git
   cd golden-wings-screening.git

   # Remove the file from all history
   bfg --delete-files dev.vars.example

   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive

   # Force push (WARNING: rewrites history)
   git push --force
   ```

   **Option B: Use git-filter-repo (Most Thorough)**
   ```bash
   # Install git-filter-repo
   pip install git-filter-repo

   # Clone fresh copy
   git clone https://github.com/calebmills99/golden-wings-screening.git
   cd golden-wings-screening

   # Remove file from all history
   git filter-repo --path dev.vars.example --invert-paths

   # Force push (WARNING: rewrites history)
   git push --force --all
   git push --force --tags
   ```

   **Option C: Create Fresh Repository (Nuclear Option - Loses History)**
   ```bash
   # If history isn't important, start fresh
   # 1. Download current code (without .git directory)
   # 2. Create new GitHub repository
   # 3. Initialize and push clean code
   ```

3. **Notify GitHub** (after cleaning history):
   - GitHub will continue alerting until secrets are removed from history
   - After force-pushing cleaned history, alerts should resolve within 24 hours
   - If alerts persist, contact GitHub Support

### Follow-up Actions

4. **Verify cleanup**:
   ```bash
   # Search entire history for exposed keys
   git log --all -p | grep -i "AIzaSyBaWgtypipKVknHO-W1eBuTpoeNTj8NYGw"
   git log --all -p | grep -i "re_TfmU4YzT"
   # Should return no results after cleanup
   ```

5. **Update documentation**:
   - Add note to README about using environment variables
   - Document the incident in team communications
   - Review access logs for suspicious activity

6. **Implement safeguards**:
   - Enable branch protection rules
   - Consider using git-secrets or similar pre-commit hooks
   - Use secret scanning tools in CI/CD pipeline

## Environment Variable Setup

After rotating credentials, configure the new values:

```bash
# Add to your ~/.bashrc, ~/.zshrc, or .env file (which is gitignored)
export GOOGLE_API_KEY="your_new_google_api_key"
export RESEND_API_KEY="your_new_resend_api_key"
export GOOGLE_ADS_CUSTOMER_ID="your_customer_id"
export PROJECT_ID="your_project_id"
```

For Cloudflare Workers, set these in the Cloudflare dashboard:
- Settings → Variables → Environment Variables

## References

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

## Timeline

- **2026-02-25**: Secrets first committed in commit `e85443f`
- **2026-04-13**: Attempted cleanup in commits `ab519a1` and `2567039` (incomplete - only removed from current version)
- **2026-04-17**: Security audit completed, hardcoded values removed, this remediation document created
- **PENDING**: Git history cleanup and credential rotation
