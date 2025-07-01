const tasks = [
    {
        title: "Introduction",
        icon: "fas fa-info-circle",
        // content: "<p>Phishing emails try to trick you into clicking dangerous links or giving away your personal data. To protect yourself, it’s important to learn how to look at emails closely. You’ll need to understand how to read headers, check links, examine attachments, and study the writing style. This will help you spot fake messages before they cause harm.</p><p>📸 [Insert H5P welcome interaction – a brief drag-and-drop or true/false quiz]</p>",
        content: `
            <p>Phishing emails try to trick you into clicking dangerous links or giving away your personal data.</p>
            <p>To protect yourself, it’s important to learn how to examine headers, links, attachments, and wording.</p>

            <!-- Embed H5P Interactive -->
            <div class="h5p-container my-3">
                <iframe src="h5p/Phishing-practice-mock.html" width="100%" height="480" frameborder="0" allowfullscreen></iframe>
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

    {
        title: "Email Header Analysis",
        icon: "fas fa-envelope-open-text",
        content: "<p>An email header is like the envelope of a letter. It shows where the email came from, when it was sent, and what servers it passed through. These lines are called “Received”, “From”, “To”, “Reply-To”, and so on. If the email says it’s from your bank, but the first server it came from is in another country, that’s suspicious.</p><p>The “From” field shows who claims to be the sender. But this can be faked. The “Reply-To” field shows where replies go. If that’s different, it could be a trick. Some emails include DKIM and SPF info. These are security tools that show if the email was really sent from the domain it claims to use.</p><p>You can view headers by clicking “Show original” in Gmail or opening Properties in Outlook. Start reading from the bottom up to see the full route the email took.</p><p>📸 [Insert H5P interactive hotspot image showing header parts]</p>",
        quiz: [
            {
                question: "What does the 'Received' line in an email header show?",
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
                question: "Which of the following can help spot a fake email header? (Select all that apply)",
                options: [
                    "Strange IP addresses",
                    "Matching 'From' and 'Reply-To' fields",
                    "Missing authentication results like DKIM",
                    "A perfect subject line"
                ],
                correctAnswer: [0, 2],
                hint: "Look at what's missing or out of place."
            }
        ]
    },

    {
        title: "Link Analysis",
        icon: "fas fa-link",
        content: "<p>Phishing emails often hide bad links that take you to fake websites. These links might look real at first. But when you hover over them, you’ll see the real address. Always check where a link leads before clicking.</p><p>Scammers often change spellings or add extra words to confuse you. A link like secure.microsoft-login.com.fake.site is not from Microsoft. The real domain is fake.site. Read URLs from right to left to find the real site name.</p><p>If the link doesn’t have HTTPS or looks strange, be careful. You can copy it and paste into online scanners like VirusTotal to check if it’s dangerous. Never click a link if the email tries to scare or rush you.</p><p>🎮 [Insert H5P link scanner simulator – scan fake vs safe URLs]</p>",
        quiz: [
            {
                question: "What should you do before clicking a link in a suspicious email?",
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
                question: "Which signs could mean a link is dangerous? (Select all that apply)",
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

    {
        title: "Attachment Analysis",
        icon: "fas fa-file-archive",
        content: "<p>Some phishing emails don’t use links. Instead, they attach files that contain malware. These can be .exe, .zip, .docx, .pdf, or even .html. A file like invoice.pdf.exe is actually a program, not a document.<p/><p>Attackers may use double extensions or hide them with tricks. Windows sometimes hides file endings. They also use HTML files that load fake login pages or run scripts when you open them in a browser. That’s dangerous.</p><p>To be safe, never open attachments you didn’t expect. Hover over the name to see the real extension. You can also scan the file using antivirus or upload it to VirusTotal. Always be careful with macros in Office files too.</p><p>📸 [Insert H5P image hotspot showing suspicious file and JavaScript]</p>",
        quiz: [
            {
                question: "Which file extension is most likely dangerous?",
                options: [".pdf", ".exe", ".jpg", ".txt"],
                correctAnswer: 1,
                hint: "Think about files that can run programs."
            },
            {
                question: "What are signs an attachment might be harmful? (Select all that apply)",
                options: [
                    "It has two extensions (like .pdf.exe)",
                    "You weren’t expecting it",
                    "It has a funny name",
                    "It looks important"
                ],
                correctAnswer: [0, 1],
                hint: "Watch out for hidden tricks and unexpected files."
            }
        ]
    },

    {
        title: "SPF, DKIM, and DMARC",
        icon: "fas fa-lock",
        content: "<p>These are email security checks. SPF tells which servers can send emails for a domain. DKIM adds a digital signature to make sure the message wasn’t changed. DMARC tells the email system what to do if SPF or DKIM fail.</p><p>Think of SPF as a list of allowed senders. DKIM is like a seal on a letter. DMARC is the final check that says “Block this” or “Allow that.” You’ll see these in the header as spf=pass, dkim=pass, or fail.</p><p>If SPF or DKIM fail, and the domain has a strict DMARC policy, it’s very likely the email is fake. These tools are important in stopping spoofed messages.</p><p>📸 [Insert H5P flowchart diagram of SPF, DKIM, DMARC checks]</p>",
        quiz: [
            {
                question: "What is DKIM used for in emails?",
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
                question: "What do SPF, DKIM, and DMARC help do? (Select all that apply)",
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

    {
        title: "Language & Tone Analysis",
        icon: "fas fa-align-left",
        content: "<p>Phishing emails often sound scary or urgent. They may say things like “Verify your account now” or “Your access will be removed”. Real companies don’t usually pressure you like this.</p><p>Watch out for strange greetings like “Dear User” instead of your real name. Look for bad grammar, spelling mistakes, or exciting offers that seem too good to be true. If the tone of the email feels off, it’s a red flag.</p><p>Always pause and read carefully. Think about why they want you to act fast. Most phishing emails try to rush you into clicking or replying without thinking.</p><p>📸 [Insert H5P activity highlighting red-flag words and phrases in phishing emails]</p>",
        quiz: [
            {
                question: "Which line is most likely from a phishing email?",
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
                question: "What writing signs often show a phishing email? (Select all that apply)",
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

    {
        title: "Reporting",
        icon: "fas fa-file-alt",
        content: "<p>If you get a phishing email, do not reply. Do not click any links. Most email platforms have a “Report” button. In Gmail, click the three dots and select “Report phishing”. In Outlook, click Report > Report phishing.</p><p>You can also forward the full email to reportphishing@apwg.org or file a report at FTC.gov/Complaint. Some workplaces have a special address where you can report scams to the security team.</p><p>Every report helps. It improves spam filters and stops more people from being tricked.</p><p>📸 [Insert H5P clickable checklist showing how to report emails step-by-step]</p>",
        quiz: [
            {
                question: "What is the safest way to handle a suspicious email?",
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

    {
        title: "Conclusion",
        icon: "fas fa-flag-checkered",
        content: `<p>🎉 Congratulations! You’ve finished the Phishing Forensics Lab.</p>
        <p>You now know how to check email headers, scan suspicious links, inspect attachments, and read tone carefully.</p>
        <p>Keep practicing. Stay alert. Help others stay safe too. Together, we can stop phishing threats!</p>`,
        quiz: [
            {
                question: "Which step is NOT part of a basic phishing forensics check?",
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
