// CyberSleuth Academy – Phishing Forensics Lab
// This file contains all tasks for the phishing module.
// Each task has a title, icon, content, quiz questions & answers, and hints.


const tasks = [

    // ========== TASK 1 ==========
    {
        title: "Introduction",
        icon: "fas fa-info-circle",
        content: `
        <div class="meet-the-team-box">
        <div class="icon-label">
            <i class="fas fa-users"></i> Meet the Team
        </div>
        <ul class="mb-0 ps-3">
            <li><strong>Zara</strong> - A junior cyber forensics trainee on internship. Curious, smart, and learning fast.</li>
            <li><strong>Alex</strong> - A senior cybersecurity analyst mentoring Zara. Calm and methodical.</li>
            <li><strong>Maya</strong> - A non-technical staff member who unknowingly triggers a phishing investigation.</li>
        </ul>
        </div>


        <p><strong>Scenario:</strong> In this lab, you'll join Zara and Alex as they investigate what happened. You'll learn how phishing works and how to catch the signs before it's too late.</p>

        <p>Phishing attacks often look like real emails from trusted companies. But they trick people into clicking fake links or opening dangerous files.</p>

        <p>You'll learn how to check email headers, look for shady links, and examine attachments. You'll also learn how to report phishing and understand how email tools protect users.</p>

        <p>Let's start by understanding the basics of phishing. Watch the short video below to see how these scams work.</p>

        <div class="text-center my-4">
        <div class="ratio ratio-16x9">
            <iframe 
            src="https://www.youtube.com/embed/XBkzBrXlle0?si=5vK66H0bTFMOKc8x" 
            title="What is Phishing? | Phishing Scams Explained - Simplilearn"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen 
            referrerpolicy="strict-origin-when-cross-origin">
            </iframe>
        </div>
        <p class="mt-2 mb-0">
            <i class="fas fa-video me-1 text-danger"></i>
            <strong>Video:</strong> What is Phishing? | Phishing Scams Explained
        </p>
        <p class="small text-muted mb-0">
            🎥 Source: 
            <a href="https://www.youtube.com/@SimplilearnOfficial" target="_blank" rel="noopener noreferrer" class="text-decoration-underline">
            Simplilearn (YouTube)
            </a><br/>
            Used for educational purposes only.
        </p>
        </div>

        `,
        quiz: [
            {
                question: "1. What is the main goal of a phishing email?",
                options: [
                    "To fix email settings",
                    "To ask for feedback",
                    "To trick you into clicking or giving personal data",
                    "To test your spelling"
                ],
                correctAnswer: 2,
                hint: "Think about what scammers want you to do when you see the email."
            }
        ]
    },

    // ========== TASK 2 ==========
    {
        title: "Email Header Analysis",
        icon: "fas fa-envelope-open-text",
        content: `
        <p><strong>Scenario:</strong> Zara is reviewing a suspicious email forwarded by Maya. At first glance, the message looks like a normal company update. The subject says “New Update!” and appears to come from someone named Mike McDuck (<code>mmcduck@outlook.com</code>).</p>

        <p>But Alex teaches her to look deeper. They inspect the full email header and find something strange. The true sender isn't Mike at all. It came from <code>badguy_spammer@spammy.com</code> with an IP address traced to the United States: <code>184.83.22.146</code>.</p>

        <p>Later, the subject line mysteriously changes to “Super Cheap Diet Pills!” and “Sponsored Promotions >> Insurance Deals!” That's a clear red flag.</p>

        <p>Now Zara understands why it's important to check headers. Phishing emails often fake the “From” field. Only the full header shows who really sent it.</p>

            <div class="text-center my-3">
                <img src="assets/images/phishing/email-header.jpg"
                    alt="Example of a full email header showing key fields"
                    class="img-fluid rounded shadow-sm"
                    style="max-width: 100%; height: auto;" />
                <p class="mt-2 mb-0">Example: Email header showing sender, reply-to, and server path.</p>
                <p class="small mb-0" style="color: inherit;">
                    🖼️ Image credit:
                    <a href="https://alyninc.com/wp-content/uploads/2018/11/email_header_blog_image_v2.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-underline">
                    ALYN Inc.
                    </a>
                </p>
            </div>

        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
            <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
        </div>
        <p>This email header has several red flags. Click the hotspots in the message to see what's wrong.</p>

        <div class="h5p-container my-3">
            <iframe src="assets/h5p/phishing/task2/task2.html" width="100%" height="190" frameborder="0" allowfullscreen></iframe>
        </div>
        `,
        quiz: [
            {
                question: "1. What does the 'Received' line in an email header show?",
                options: [
                    "The size of the attachment",
                    "The email's subject",
                    "Each server the email passed through",
                    "The number of replies sent"
                ],
                correctAnswer: 2,
                hint: "Each 'hop' leaves a record."
            },
            {
                question: "2. Which signs suggest this email is a phishing scam? (Select all that apply)",
                options: [
                    "Hidden sender address from spammy.com",
                    "Changing subject lines",
                    "Message flagged by DuckFish",
                    "It came from Mike McDuck"
                ],
                correctAnswer: [0, 1],
                hint: "Think about what doesn't match or seems deceptive."
            },
            {
                question: "3. The 'Reply-To' field can be used to trick users into replying to scammers.",
                options: ["True", "False"],
                correctAnswer: 0,
                hint: "It doesn't always match the From address."
            }
        ]
    }
    ,

    // ========== TASK 3 ==========
    {
        title: "Link Analysis",
        icon: "fas fa-link",
        content: `
        <p><strong>Scenario:</strong> Zara receives another report from Maya. This time, it's an email that looks like it came from Amazon. The message says “Confirm your identity to avoid account lockout.”</p>

        <p>Alex asks Zara to inspect the links. At first, the blue text says it goes to <code>https://amazon.com</code>. But when she hovers over it, she sees the truth: <code>redirect.kereskedj.com</code>. That's a totally different domain.</p>

        <p>Zara quickly realizes this is a phishing link. Real companies like Amazon don't ask for identity confirmation this way, and they definitely don't redirect through shady domains.</p>

        <p>Scammers often hide fake links behind text that looks familiar. That's why it's important to hover and check the actual destination before clicking anything.</p>

            <div class="text-center my-3">
            <img src="assets/images/phishing/link.png"
                alt="Example phishing link hover showing fake domain"
                class="img-fluid rounded shadow-sm"
                style="max-width: 100%; height: auto;" />
            <p class="mt-2 mb-0">Example: Hover shows a suspicious domain in a link.</p>
            <p class="small mb-0" style="color: inherit;">
                🖼️ Image credit: 
                <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fkybersecure.com%2Fphishing%2F&psig=AOvVaw0X1L3SZk-zgiel3bweCvmV&ust=1751964622059000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCOqYGvqo4DFQAAAAAdAAAAABAp"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-underline">
                Kyber Secure
                </a>
            </p>
            </div>

        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
            <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
        </div>
        <p>Drag and drop each link into the correct box (Safe or Phishing) to test your understanding.</p>

        <div class="h5p-container my-3">
            <iframe src="assets/h5p/phishing/task3/task3.html" width="100%" height="500" frameborder="0" allowfullscreen></iframe>
        </div>
        `,
        quiz: [
            {
                question: "1. What should you do before clicking a link in a suspicious email?",
                options: [
                    "Forward it to a friend",
                    "Hover to see the real URL",
                    "Close the email and ignore it",
                    "Click it quickly"
                ],
                correctAnswer: 1,
                hint: "The visible text may hide the real address."
            },
            {
                question: "2. What are red flags that a link may be dangerous? (Select all that apply)",
                options: [
                    "Typos in the domain name",
                    "Hover shows a different site",
                    "HTTPS is missing",
                    "It ends in .com"
                ],
                correctAnswer: [0, 1, 2],
                hint: "Legit sites don't hide where they're taking you."
            },
            {
                question: "3. A link that looks like amazon.com but redirects elsewhere is likely safe.",
                options: ["True", "False"],
                correctAnswer: 1,
                hint: "Always check where the link actually goes."
            }
        ]
    }
    ,

    // ========== TASK 4 ==========
    {
        title: "Attachment Analysis",
        icon: "fas fa-file-archive",
        content: `
        <p><strong>Scenario:</strong> Maya receives an email with a file called <code>invoice-details.docx</code>. It says it's an urgent invoice she needs to open. Unsure what to do, she forwards it to Alex and Zara for help.</p>

        <p>Zara uploads the file to VirusTotal. The scan reveals the file is really <strong>malsample2.exe</strong> a dangerous malware flagged by many antivirus vendors. It includes trojans and backdoors that can steal data or give remote access to hackers.</p>

        <p>Alex explains that attackers often hide malware by naming it to look like a safe document. They also use double extensions like <code>.docx.exe</code> to confuse users. On some systems, only the first extension shows, making it seem harmless.</p>

        <p>He adds that even files like <code>.zip</code>, <code>.html</code>, or Office files can be risky. Some may contain macros or open fake login pages when clicked. It's always best to check the file type and sender before opening anything.</p>

        <p>Zara learns to scan suspicious files using VirusTotal and to look out for weird names, unexpected attachments, or anything with two extensions.</p>

            <div class="text-center my-3">
            <img src="assets/images/phishing/attachment.jpg"
                alt="Example VirusTotal scan result"
                class="img-fluid rounded shadow-sm"
                style="max-width: 100%; height: auto;" />
            <p class="mt-2 mb-0">Example: VirusTotal scan showing invoice-details.docx flagged as malware (malsample2.exe).</p>
            </div>

        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
            <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
        </div>
        <p>Complete the blanks below to review key points about dangerous attachments and how to check them.</p>

        <div class="h5p-container my-3">
            <iframe src="assets/h5p/phishing/task4/task4.html" width="100%" height="300" frameborder="0" allowfullscreen></iframe>
        </div>
        `,
        quiz: [
            {
                question: "1. What kind of file is <code>invoice-details.docx.exe</code> really?",
                options: [
                    "A spreadsheet",
                    "A text file",
                    "A program",
                    "An image"
                ],
                correctAnswer: 2,
                hint: "The last extension shows what type it truly is."
            },
            {
                question: "2. Which signs show a file might be dangerous? (Select all that apply)",
                options: [
                    "Double extensions like .pdf.exe",
                    "Unexpected attachment",
                    "The file opens slowly",
                    "Request to enable macros"
                ],
                correctAnswer: [0, 1, 3],
                hint: "Think about strange behavior or hidden file types."
            },
            {
                question: "3. It's safe to open any .html file if it looks simple.",
                options: ["True", "False"],
                correctAnswer: 1,
                hint: "Some HTML files open fake login pages or scripts."
            }
        ]
    }
    ,

    // ========== TASK 5 ==========
    {
        title: "Email Authentication Checks",
        icon: "fas fa-lock",
        content: `
        <p><strong>Scenario:</strong> Zara checks an email sent from <code>hr@company.com</code>. Alex shows her how to verify if it's real by looking at email headers.</p>

        <p>They click “Show Original” and look for three checks:</p>

        <ul>
            <li><strong>SPF</strong> - Checks if the email was sent from an authorized mail server.</li>
            <li><strong>DKIM</strong> - Verifies the email was not altered and is properly signed.</li>
            <li><strong>DMARC</strong> - Confirms both SPF and DKIM passed and tells the receiver what to do if they fail.</li>
        </ul>

        <p>If any of these fail, it could be a spoofed or fake email. Zara sees <code>spf=pass</code>, <code>dkim=pass</code>, and <code>dmarc=pass</code>, so this one looks legit.</p>

            <div class="text-center my-3">
            <img src="assets/images/phishing/spk-dkim-dmarc.jpg"
                alt="Visual flow of SPF, DKIM, and DMARC email checks"
                class="img-fluid rounded shadow-sm"
                style="max-width: 100%; height: auto;" />
            <p class="mt-2 mb-0">Example: How SPF, DKIM, and DMARC work together to verify email.</p>
            <p class="small mb-0" style="color: inherit;">
                🖼️ Image credit:
                <a href="https://esilo.com/how-to-spot-a-phishing-email/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-underline">
                    Esilo
                </a>
            </p>
            </div>

        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
            <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
        </div>
        <p>Slide through the example below to see how SPF, DKIM, and DMARC help protect emails from spoofing.</p>

        <div class="h5p-container my-3">
            <iframe src="assets/h5p/phishing/task5/task5.html" width="100%" height="520" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="text-center mt-3">
        <p class="small mb-1" style="color: inherit;">
            🖼️ Image credits:
        </p>
        <p class="small mb-0" style="color: inherit;">
            <strong>SPF:</strong>
            <a href="https://medium.com/@neer.s/how-to-fix-weak-spf-sender-policy-framework-policy-0ba6337a5a28"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-underline">
            Medium - Neer Sharma
            </a>
            |
            <strong>DKIM:</strong>
            <a href="https://cdn.prod.website-files.com/60bfd2b558c9eba77e06bf57/60f7282b6c03b385e5e00b7c_DKIM_record_image-01-1024x686.png"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-underline">
            ActiveCampaign
            </a>
            |
            <strong>DMARC:</strong>
            <a href="https://www.proofpoint.com/us/resources/white-papers/dmarc-protect-email-domains"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-underline">
            Proofpoint
            </a>
        </p>
        </div>

        `,
        quiz: [
            {
                question: "1. What does a <code>dkim=fail</code> result suggest?",
                options: [
                    "The message came from the right sender",
                    "The message was changed or forged",
                    "The subject line is wrong",
                    "The email was delayed"
                ],
                correctAnswer: 1,
                hint: "DKIM checks if the content was modified."
            },
            {
                question: "2. Which methods help confirm an email is real? (Select all that apply)",
                options: [
                    "SPF validation",
                    "Checking the sender's grammar",
                    "DKIM signature",
                    "DMARC result"
                ],
                correctAnswer: [0, 2, 3],
                hint: "These are technical checks used by email systems."
            }
        ]
    }
    ,

    // ========== TASK 6 ==========
    {
        title: "Language & Tone Analysis",
        icon: "fas fa-align-left",
        content: `
        <p><strong>Scenario:</strong> Maya receives a strange system alert. It's from <code>"Critical System Maintenance Team" &lt;noreply@csmt.com&gt;</code>. The subject says <strong>"URGENT: Critical System Maintenance - Validate user account"</strong>.</p>

        <p>The email greets her as “Dear user” and says her account will be <em>inactive</em> if she doesn't click a link by end of day. The link points to <code>reviewuserinterface.com/verify</code>.</p>

        <p>Zara checks it and finds many red flags: generic sender name, vague instructions, fake urgency, and a suspicious link. There's even a grammar error: “will inactive all user accounts.”</p>

        <p>Alex says phishing emails often sound urgent, include threats, and avoid personal details. They rely on fear to make users click fast without thinking.</p>

        <p>Always slow down. Look at the sender, tone, spelling, and link before doing anything.</p>

            <div class="text-center my-3">
            <img src="assets/images/phishing/phishinglanguage.png"
                alt="Example phishing email with urgent and generic language"
                class="img-fluid rounded shadow-sm"
                style="max-width: 100%; height: auto;" />
            <p class="mt-2 mb-0">Example: Suspicious email with urgency, threats and generic greeting.</p>
            <p class="small mb-0" style="color: inherit;">
                🖼️ Image credit: 
                <a href="https://miro.medium.com/v2/resize:fit:1400/1*VsddpRDphE26LOt-fdeE_Q.png"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-underline">
                Medium
                </a>
            </p>
            </div>

        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
            <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
        </div>
        <p>Drag each phrase to either the “Safe” or “Phishing” tone category based on how it sounds. Can you spot the red flags?</p>

        <div class="h5p-container my-3">
            <iframe src="assets/h5p/phishing/task6/task6.html" width="100%" height="500" frameborder="0" allowfullscreen></iframe>
        </div>
        `,
        quiz: [
            {
                question: "1. What part of the email shows urgency?",
                options: [
                    "Saying 'Your subscription is active'",
                    "Asking to confirm shipping address",
                    "Using 'URGENT' in the subject",
                    "Signing off politely"
                ],
                correctAnswer: 2,
                hint: "Phishing emails often use fear to pressure action."
            },
            {
                question: "2. What language clues suggest the email is fake? (Select all that apply)",
                options: [
                    "Grammar mistake: 'will inactive all accounts'",
                    "Generic greeting: 'Dear user'",
                    "Email sent from a real IT team",
                    "Suspicious link unrelated to the company"
                ],
                correctAnswer: [0, 1, 3],
                hint: "Look for tone, sender details, and vague or pushy words."
            }
        ]
    }
    ,

    // ========== TASK 7 ==========
    {
        title: "Reporting",
        icon: "fas fa-file-alt",
        content: `
        <p><strong>Scenario:</strong> Maya receives another strange email asking her to confirm her bank account. She doesn't open the link this time. Instead, she shows it to Zara.</p>

        <p>Zara checks it and confirms it's a phishing attempt. Alex reminds her not to reply, click, or download anything. Instead, they report it.</p>

        <p>Zara clicks the three dots in Gmail and selects “Report phishing.” Alex explains that different apps have different steps. In Outlook, it's under “Report” > “Report phishing.”</p>

        <div class="text-center my-3">
            <img src="assets/images/phishing/report-phishing.png"
                alt="Example: Report phishing in Gmail"
                class="img-fluid rounded shadow-sm"
                style="max-width: 100%; height: auto;" />

            <p class="mt-2 mb-0">Example: How to report phishing in Gmail.</p>

            <p class="small mb-0"
                style="color: inherit;">
                🖼️ Image credit: 
                <a href="https://it.stonybrook.edu/sites/default/files/kb/25246/images/new-gmail-report-phishing.png"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-underline">
                Stony Brook University IT
                </a>
            </p>
        </div>

        <p>They also learn that they can forward the email to <code>reportphishing@apwg.org</code> to help global security teams track phishing scams.</p>

        <p>At work or school, it's also a good idea to check if there's a local reporting email or IT tool. Always ask if unsure.</p>

        <p>By reporting phishing emails, Zara helps others stay safe. Every report helps filters improve.</p>

        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
            <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
        </div>
        <p>Click the spot in the image where you would report a phishing email in Gmail or Outlook.</p>

        <div class="h5p-container my-3">
            <iframe src="assets/h5p/phishing/task7/task7.html" width="100%" height="400" ></iframe>
        </div>
        `,
        quiz: [
            {
                question: "1. What is the safest way to handle a suspicious email?",
                options: [
                    "Reply and ask if it's real",
                    "Click the link and see",
                    "Report it using your email's tools",
                    "Share it on social media"
                ],
                correctAnswer: 2,
                hint: "Most apps let you mark phishing with a button."
            }
        ]
    }
    ,

    // ========== TASK 8 ==========
    {
        title: "Conclusion",
        icon: "fas fa-flag-checkered",
        content: `
        <p><strong>Scenario:</strong> Zara has come a long way during her internship. With Alex's help, she learned how to investigate phishing emails safely and correctly.</p>

        <p>She now knows how to:</p>
        <ul>
            <li>Check email headers</li>
            <li>Inspect suspicious links</li>
            <li>Analyze risky attachments</li>
            <li>Spot urgent or threatening language</li>
            <li>Verify SPF, DKIM, and DMARC results</li>
            <li>Report phishing using proper tools</li>
        </ul>

        <p>Alex reminds her that these are real skills used in cybersecurity and digital forensics. By staying alert and responding quickly, she can help prevent serious attacks.</p>

        <p>Zara thanks Alex and looks forward to applying what she's learned in future cases.</p>

        <p>🎉 Well done! You've now completed the Phishing Forensics Lab.</p>
        `,
        quiz: [
            {
                question: "1. Which step is NOT part of a basic phishing forensics check?",
                options: [
                    "Inspecting the email header",
                    "Analyzing suspicious links",
                    "Checking file attachments",
                    "Changing your desktop wallpaper"
                ],
                correctAnswer: 3,
                hint: "One of these does nothing for phishing checks."
            }
        ]
    }


];