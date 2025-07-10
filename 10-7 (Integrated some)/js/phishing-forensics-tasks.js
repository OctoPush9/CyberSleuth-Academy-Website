// CyberSleuth Academy – Phishing Forensics Lab
// This file contains all tasks for the phishing module.
// Each task has a title, icon, content, quiz questions & answers, and hints.


const tasks = [

    // ========== TASK 1 ==========
    {
        title: "Introduction",
        icon: "fas fa-info-circle",
        content: `
        <p>Phishing is a type of cyber attack that tricks people into clicking fake links or opening harmful files.</p>

        <p>These emails look like they come from trusted sources, but they are sent by attackers who want to steal information or install malware.</p>

        <p>As a cybersecurity learner, you need to know how to spot the signs and examine emails carefully.</p>

        <p>In this lab, you will check the sender, inspect links and attachments, and look at the tone of the message.</p>

        <p>You will also learn how to report phishing and how email security tools help detect fake messages.</p>

        <div class="text-center my-4">
            <div class="ratio ratio-16x9">
                <iframe 
                    src="https://www.youtube.com/embed/XBkzBrXlle0?si=5vK66H0bTFMOKc8x" 
                    title="What is Phishing? | Phishing Scams Explained – Simplilearn"
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
        <p>An email header is like the envelope for your message. It shows who sent it, when it was sent, and which servers moved it along the way.</p>

        <p>The From line shows who claims to be the sender. This name can be faked by attackers. The Reply-To line shows where your reply will go. If that is different from the From line, it might be a trick.</p>

        <p>The Received lines list each server that handled the email, along with the time. These help you see if the message used normal paths or suspicious routes. For example, if a message says it is from your company but the first server is in another country, that can be a red flag.</p>

        <p>In Gmail, click the three dots and choose Show original to see the full header. In Outlook, open the email, click File, then Properties, and look in the Internet headers box.</p>

        <p>Always read the header starting from the bottom. Check each part for strange IP addresses, missing details, or signs that do not match the sender’s real domain. Look for DKIM or SPF results too. These help you check if the message is real or fake.</p>

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
            <span class="fs-5 fw-semibold">Interactive Activity</span>
        </div>
        <p>This header has several warning signs of spoofing. Click each hotspot to understand what’s suspicious and why it matters.</p>

        <div class="h5p-container my-3">
            <iframe src="assets/h5p/phishing/task2/task2.html" width="100%" height="190" frameborder="0" allowfullscreen></iframe>
        </div>

        <p class="small" style="color: #6c757d;">
            🖼️ Image credit: <a href="https://intezer.com/blog/automate-analysis-phishing-email-files/" target="_blank" rel="noopener noreferrer">Intezer Labs</a>. Used under fair use for educational, non-commercial purposes.
        </p>
        `,

        quiz: [
            {
                question: "1. What does the 'Received' line in an email header show?",
                options: [
                    "The size of the attachment",
                    "The email’s subject",
                    "Each server the email passed through",
                    "The number of replies sent"
                ],
                correctAnswer: 2,
                hint: "Each 'hop' leaves a record."
            },
            {
                question: "2. Which of the following can help spot a fake email header? (Select all that apply)",
                options: [
                    "Strange IP addresses",
                    "Matching 'From' and 'Reply-To' fields",
                    "Missing authentication results like DKIM",
                    "A perfect subject line"
                ],
                correctAnswer: [0, 2],
                hint: "Look at what's missing or out of place."
            },
            {
                question: "3. The 'Reply-To' address can be different from the 'From' address in a phishing email.",
                options: ["True", "False"],
                correctAnswer: 0,
                hint: "Attackers often spoof the Reply-To field to mislead users."
            }

        ]
    },

    // ========== TASK 3 ==========
    {
        title: "Link Analysis",
        icon: "fas fa-link",
        content: `
        <p>Phishing emails often hide bad links that lead to fake websites. These links can look real in the email text but show a different address when you hover over them.</p>

        <p>Always move your mouse over a link to see where it really goes before you click. Look at the end of the link to find the true domain name.</p>

        <p>Scammers often use tricks to confuse you. They might add words or change spellings. For example, a link like <code>secure.microsoft-login.com.fake.site</code> looks like Microsoft but is really fake.site.</p>

        <p>Check if the link uses HTTPS. A real site should have <code>https://</code> and a secure lock icon. No lock or HTTP only can be risky.</p>

        <p>Be careful with short links or links that ask you to log in fast. If you feel unsure, copy the link and check it with an online scanner like VirusTotal.</p>

        <p>If an email tries to scare you into clicking quickly, slow down. Think twice before you trust any link.</p>

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
            <span class="fs-5 fw-semibold">Interactive Activity</span>
        </div>

        <p>Click each link preview below and decide if it's safe or suspicious. Use what you’ve learned to identify red flags like misspelled domains or lack of HTTPS.</p>

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
                question: "2. Which signs could mean a link is dangerous? (Select all that apply)",
                options: [
                    "Typos in the domain name",
                    "No HTTPS in the URL",
                    "It says 'click here'",
                    "A very short URL"
                ],
                correctAnswer: [0, 1],
                hint: "Spelling and security matter most."
            }
        ]
    },

    // ========== TASK 4 ==========
    {
        title: "Attachment Analysis",
        icon: "fas fa-file-archive",
        content: `
        <p>Phishing emails sometimes use attachments instead of links. These files can hide malware. Dangerous attachments include programs (.exe), compressed files (.zip), or documents (.docx, .pdf, .html).</p>

        <p>Watch out for tricks like double extensions. A file named <code>invoice.pdf.exe</code> is really a program, not a PDF. Attackers also hide real file types by adding fake endings or using settings that hide extensions in Windows.</p>

        <p>Be careful with HTML files too. Some emails attach .html files that open fake login pages or run scripts when you open them in your browser. This can connect to harmful websites without you knowing.</p>

        <p>Office files like Word or Excel can have hidden macros. Macros are small programs that run when you open the file. If you did not expect the file, never enable macros.</p>

        <p>Before opening any attachment, check if it looks strange or has two extensions. Scan it with antivirus or an online scanner like VirusTotal. If you are not sure, do not open it at all. When in doubt, ask your IT personnel for help.</p>

        <div class="text-center my-3">
        <img src="assets/images/phishing/attachment.jpg"
            alt="Example VirusTotal scan result"
            class="img-fluid rounded shadow-sm"
            style="max-width: 100%; height: auto;" />
        <p class="mt-2 mb-0">Example: Checking an attachment with VirusTotal.</p>
        </div>
        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
        <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
        <span class="fs-5 fw-semibold">Interactive Activity</span>
        </div>
        <p>Complete the blanks below to review key points about dangerous attachments and how to check them.</p>

        <div class="h5p-container my-3">
        <iframe src="assets/h5p/phishing/task4/task4.html" width="100%" height="300" frameborder="0" allowfullscreen></iframe>
        </div>

        `,
        quiz: [
            {
                question: "1. Which file extension is most likely dangerous?",
                options: [".pdf", ".exe", ".jpg", ".txt"],
                correctAnswer: 1,
                hint: "Think about files that can run programs."
            },
            {
                question: "2. What are signs an attachment might be harmful? (Select all that apply)",
                options: [
                    "It has two extensions (like .pdf.exe)",
                    "You weren’t expecting it",
                    "It has a funny name",
                    "It looks important"
                ],
                correctAnswer: [0, 1],
                hint: "Watch out for hidden tricks and unexpected files."
            },
            {
                question: "3. Macros in Office files can be used to run malicious code.",
                options: ["True", "False"],
                correctAnswer: 0,
                hint: "Macros can execute scripts that install malware."
            }

        ]
    },

    // ========== TASK 5 ==========
    {
        title: "Email Authentication Checks",
        icon: "fas fa-lock",
        content: `
        <p>SPF, DKIM, and DMARC work together to protect email. They stop attackers from sending fake emails that look like they came from you.</p>

        <p><strong>SPF</strong> (Sender Policy Framework) is like a safe list. It tells which servers can send emails for a domain. When an email arrives, the receiver checks if it came from an allowed server. If not, it may be blocked or marked as fake.</p>

        <p><strong>DKIM</strong> (DomainKeys Identified Mail) adds a digital signature. This signature proves the email was not changed on its way to you. Think of it like a wax seal on a letter. If the seal is valid, the email is trusted.</p>

        <p><strong>DMARC</strong> connects SPF and DKIM. It tells email systems what to do if a message fails the checks, includes block it, mark it as spam, or report it. This helps stop spoofing and gives domain owners reports about any fake attempts.</p>

        <p>If you check an email header, you might see <code>spf=pass</code> or <code>dkim=pass</code>. This means the checks worked. If they fail, the email is likely fake.</p>

        <p>SPF, DKIM, and DMARC make phishing much harder by proving who really sent the email and keeping fake senders out.</p>

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
            <span class="fs-5 fw-semibold">Interactive Activity</span>
        </div>
        <p>Slide through the example below to see how SPF, DKIM, and DMARC protect emails from being spoofed.</p>

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
            Medium – Neer Sharma
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
                question: "1. What is DKIM used for in emails?",
                options: [
                    "Encrypt the whole message",
                    "Add a digital signature",
                    "Hide your IP address",
                    "Make the subject line bold"
                ],
                correctAnswer: 1,
                hint: "It's like a wax seal — it proves authenticity."
            },
            {
                question: "2. What do SPF, DKIM, and DMARC help do? (Select all that apply)",
                options: [
                    "Confirm who sent the email",
                    "Improve grammar",
                    "Stop domain spoofing",
                    "Speed up email delivery"
                ],
                correctAnswer: [0, 2],
                hint: "Think about trust and protection."
            }
        ]
    },

    // ========== TASK 6 ==========
    {
        title: "Language & Tone Analysis",
        icon: "fas fa-align-left",
        content: `
        <p>Phishing emails often sound urgent or scary. They push you to act fast before you think.</p>

        <p>Watch for words that threaten you, like “Your account will close” or “Act now or lose access.” These phrases create panic.</p>

        <p>Check how the email greets you. Real companies use your name. Fake ones might say “Dear User” or “Dear Customer.”</p>

        <p>Bad grammar or strange spelling are red flags too. Scammers often rush or use poor English to send out thousands of fake emails quickly.</p>

        <p>Be careful with big promises or warnings. If an email offers something too good to be true or threatens trouble, stop and think. Most real companies won’t ask for your password or payment by email.</p>

        <p>Always slow down and read carefully. The way an email sounds can tell you if it’s real or fake.</p>

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
                <span class="fs-5 fw-semibold">Interactive Activity</span>
            </div>
            <p>Drag each phrase to either the “Safe” or “Phishing” tone category based on how it sounds. Can you spot the red flags?</p>

            <div class="h5p-container my-3">
                <iframe src="assets/h5p/phishing/task6/task6.html" width="100%" height="500" frameborder="0" allowfullscreen></iframe>
            </div>
        `,

        quiz: [
            {
                question: "1. Which line is most likely from a phishing email?",
                options: [
                    "Your order has shipped.",
                    "Dear [Your Name], your subscription is active.",
                    "Click now or lose your account!",
                    "Reminder: Your meeting is at 3 PM."
                ],
                correctAnswer: 2,
                hint: "Scammers love pressure and fear."
            },
            {
                question: "2. What writing signs often show a phishing email? (Select all that apply)",
                options: [
                    "Bad grammar",
                    "Urgent language",
                    "Personalized greeting",
                    "Strange offers or threats"
                ],
                correctAnswer: [0, 1, 3],
                hint: "Trust your gut — does it feel weird or pushy?"
            }
        ]
    },

    // ========== TASK 7 ==========
    {
        title: "Reporting",
        icon: "fas fa-file-alt",
        content: `
        <p>When you find a phishing email, do not reply or click any links.</p>

        <p>Use your email app’s “Report phishing” button if it has one. For example, in Gmail click the three dots and pick “Report phishing.” In Outlook, use “Report” > “Report phishing.”</p>

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


        <p>You can also forward the full email to <code>reportphishing@apwg.org</code>. This helps global anti-phishing teams stop scams.</p>

        <p>If you are in school or at work, your IT or security team may have a special email address or tool to report scams. Ask if you are not sure.</p>

        <p>Each time you report a phishing email, you help improve filters and protect other people too.</p>


        <hr class="my-3" />

        <div class="d-flex align-items-center mb-2">
            <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
            <span class="fs-5 fw-semibold">Interactive Activity</span>
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
                    "Reply and ask if it’s real",
                    "Click the link and see",
                    "Report it using your email’s tools",
                    "Share it on social media"
                ],
                correctAnswer: 2,
                hint: "Most apps let you mark phishing with a button."
            }
        ]
    },

    // ========== TASK 8 ==========
    {
        title: "Conclusion",
        icon: "fas fa-flag-checkered",
        content: `
        <p>🎉 Great work. You have almost completed the Phishing Forensics Lab.</p>

        <p>You learned how to check email headers, analyze suspicious links, scan risky attachments, and spot dangerous language and tone.</p>

        <p>You also explored how tools like SPF, DKIM, and DMARC help protect against fake emails. You practiced how to report phishing the correct way.</p>

        <p>These are real skills used by cybersecurity and forensics teams every day. Use them to stay alert, protect others, and respond quickly to threats.</p>

        <p>Keep learning. Keep practicing. And remember that one click can make a big difference.</p>

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
