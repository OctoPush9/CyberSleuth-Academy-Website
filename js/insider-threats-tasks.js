// CyberSleuth Academy – Insider Threats Lab
// This file contains all tasks for the Insider Threats module.
// Each task has a title, icon, content, quiz questions & answers, and hints.


const tasks = [

    // ========== TASK 1 ==========
    {
        title: "Introduction",
        icon: "fas fa-info-circle",
        content: `
            <p>Insider threats come from people inside an organization. This include, staff, contractors, or partners.</p>

            <p>They already have access, so they don’t need to hack in. That makes them harder to detect and often more damaging than outside attackers.</p>

            <p>Some insiders act on purpose, like stealing data. Others just make careless mistakes, or fall for phishing scams.</p>

            <p>Either way, insider threats can leak confidential files, expose systems, or put the whole organization at risk.</p>

            <p>In this lab, you’ll explore what insider threats look like, how to recognize red flags, and how to prevent serious damage before it happens.</p>

            <div class="text-center my-4">
                <div class="ratio ratio-16x9">
                    <iframe 
                        src="https://www.youtube.com/embed/iAFy-wGGyeY" 
                        title="Detecting and Managing Insider Threats – Arctic Wolf Networks"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen 
                        referrerpolicy="strict-origin-when-cross-origin">
                    </iframe>
                </div>
                <p class="mt-2 mb-0">
                    <i class="fas fa-video me-1 text-danger"></i>
                    <strong>Video:</strong> Detecting and Managing Insider Threats
                </p>
                <p class="small text-muted mb-0">
                    🎥 Source: 
                    <a href="https://www.youtube.com/@ArcticWolfNetworks" target="_blank" rel="noopener noreferrer" class="text-decoration-underline">
                        Arctic Wolf Networks (YouTube)
                    </a><br/>
                    Used for educational purposes.
                </p>
            </div>
        `,
        quiz: [
            {
                question: "1. Why are insider threats harder to catch?",
                options: [
                    "They already have access to systems",
                    "They send warnings first",
                    "They leave obvious clues",
                    "They always wear disguises"
                ],
                correctAnswer: 0,
                hint: "They don’t need to break in as they’re already trusted."
            }
        ]
    },

    // // ========== TASK 2 ==========
    // {
    //     title: "Types of Insider Threats",
    //     icon: "fas fa-users",
    //     content: `
    //         <p>Not all insider threats are the same. They can happen in different ways, and for different reasons.</p>

    //         <p><strong>Malicious insiders</strong> do harm on purpose. They may steal data, delete files, or leak secrets. This could be a disgruntled employee or someone working for a competitor.</p>

    //         <p><strong>Negligent insiders</strong> don’t mean to cause damage, but they make careless mistakes. For example, sending sensitive files to the wrong person or clicking on a phishing link.</p>

    //         <p><strong>Compromised insiders</strong> are people whose accounts have been taken over by attackers. The attacker uses their access to move around the system without being noticed.</p>

    //         <p>Understanding these types helps you know what to watch for and how to respond.</p>
    //         <div class="text-center my-3">
    //             <img src="assets/images/insider/types-of-insider.png"
    //                 alt="Types of Insider Threats illustration"
    //                 class="img-fluid rounded shadow-sm"
    //                 style="max-width: 100%; height: 450px;" />
    //             <p class="mt-2 mb-0">Example: Types of insider threats – malicious, negligent, and compromised insiders.</p>
    //             <p class="small mb-0" style="color: inherit;">
    //                 🖼️ Image credit:
    //                 <a href="https://www.swimlane.com/assets/uploads/images/types-of-insider-threat.png"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 class="text-decoration-underline">
    //                 Swimlane
    //                 </a>. Used for educational purposes.
    //             </p>
    //         </div>
    //         <hr class="my-3" />

    //         <div class="d-flex align-items-center mb-2">
    //         <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
    //         <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    //         </div>
    //         <p>Drag each real-life behavior to the correct insider threat type.</p>

    //         <div class="h5p-container my-3">
    //         <iframe src="assets/h5p/insider/task2/task2.html" width="100%" height="500" frameborder="0" allowfullscreen></iframe>
    //         </div>
    //     `,
    //     quiz: [
    //         {
    //             question: "1. Which insider type causes harm on purpose?",
    //             options: [
    //                 "Malicious insider",
    //                 "Negligent insider",
    //                 "Compromised insider",
    //                 "External hacker"
    //             ],
    //             correctAnswer: 0,
    //             hint: "This person acts with intent to damage or steal."
    //         },
    //         {
    //             question: "2. What is a negligent insider most likely to do?",
    //             options: [
    //                 "Sell secrets to a rival",
    //                 "Click on a dangerous link by mistake",
    //                 "Break into the server room",
    //                 "Install ransomware"
    //             ],
    //             correctAnswer: 1,
    //             hint: "They don't mean to cause harm but still make risky errors."
    //         },
    //         {
    //             question: "3. If someone’s account is taken over by a hacker, what kind of insider is that?",
    //             options: [
    //                 "Malicious",
    //                 "Negligent",
    //                 "Compromised",
    //                 "Curious"
    //             ],
    //             correctAnswer: 2,
    //             hint: "The person didn’t act, but their login was used."
    //         }
    //     ]
    // },


    // // ========== TASK 3 ==========
    // {
    //     title: "Suspicious Behavior & Warning Signs",
    //     icon: "fas fa-user-secret",
    //     content: `
    //         <p>Insider threats often leave clues. These clues are small changes in behavior or activity that don’t match what the person normally does.</p>

    //         <p>Someone might start working odd hours without reason. They might try to access files they don’t need for their job, or copy lots of data at once.</p>

    //         <p>They could act secretive, upset, or suddenly talk badly about the company. Even skipping security rules can be a red flag.</p>

    //         <p>It’s important to notice these signs early. Reporting strange behavior can prevent bigger problems later.</p>
    //         <hr class="my-3" />

    //         <div class="d-flex align-items-center mb-2">
    //         <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
    //         <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    //         </div>

    //         <p>Drag the missing words into the blanks to complete each sentence about red flag behaviors.</p>

    //         <div class="h5p-container my-3">
    //         <iframe src="assets/h5p/insider/task3/task3.html" width="100%" height="450" frameborder="0" allowfullscreen></iframe>
    //         </div>

    //     `,
    //     quiz: [
    //         {
    //             question: "1. Which of these could be signs of insider threat behavior? (Select all that apply)",
    //             options: [
    //                 "Accessing files not related to their job",
    //                 "Always following security rules",
    //                 "Copying large amounts of data",
    //                 "Acting angry or secretive"
    //             ],
    //             correctAnswer: [0, 2, 3],
    //             hint: "Think about actions that don’t match their normal job behavior."
    //         },
    //         {
    //             question: "2. A person working late at night for no reason might be a warning sign.",
    //             options: ["True", "False"],
    //             correctAnswer: 0,
    //             hint: "Unusual hours with no explanation can raise concerns."
    //         }
    //     ]
    // },

    // // ========== TASK 4 ==========
    // {
    //     title: "Data Protection & Access Control",
    //     icon: "fas fa-key",
    //     content: `
    //         <p>One way to stop insider threats is by limiting access. This means people can only see the data they need for their work.</p>

    //         <p>This is called the "principle of least privilege (PoLP)" and "role based access control (RBAC)". If someone doesn’t need access, they shouldn’t have it.</p>

    //         <p>Companies also use tools to track who opens files, moves data, or makes changes. These logs help spot problems early.</p>

    //         <p>Good access control keeps important data safe and helps stop harmful actions before they spread.</p>

    //         <div class="text-center my-3">
    //             <img src="assets/images/insider/PoLP.png"
    //                 alt="Principle of Least Privilege visual diagram"
    //                 class="img-fluid rounded shadow-sm"
    //                 style="max-width: 100%; height: 450px;" />
    //             <p class="mt-2 mb-0">Example: How the Principle of Least Privilege (PoLP) restricts access.</p>
    //             <p class="small mb-0" style="color: inherit;">
    //                 🖼️ Image credit:
    //                 <a href="https://www.zenarmor.com/docs/assets/images/importance-and-best-practices-of-polp-30b222a0a078ad7b9c7391dcbc37420c.png"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 class="text-decoration-underline">
    //                 Zenarmor
    //                 </a>. Used for educational purposes.
    //             </p>
    //         </div>
    //         <hr class="my-3" />

    //         <div class="d-flex align-items-center mb-2">
    //         <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
    //         <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    //         </div>

    //         <p>Complete the blanks to review access control, RBAC, PoLP, and logging best practices.</p>

    //         <div class="h5p-container my-3">
    //         <iframe src="assets/h5p/insider/task4/task4.html" width="100%" height="350" frameborder="0" allowfullscreen></iframe>
    //         </div>

    //     `,
    //     quiz: [
    //         {
    //             question: "1. What are good ways to protect data from insider threats? (Select all that apply)",
    //             options: [
    //                 "Use least privilege access",
    //                 "Let everyone access everything",
    //                 "Track who views and edits files",
    //                 "Give access only when needed"
    //             ],
    //             correctAnswer: [0, 2, 3],
    //             hint: "More access means more risk. Only allow what’s needed."
    //         },
    //         {
    //             question: "2. Least privilege means giving access to all files just in case.",
    //             options: ["True", "False"],
    //             correctAnswer: 1,
    //             hint: "Think about what 'least' really means here."
    //         }
    //     ]
    // },

    // // ========== TASK 5 ==========
    // {
    //     title: "Prevention & Reporting Steps",
    //     icon: "fas fa-user-shield",
    //     content: `
    //         <p>Insider threats can be stopped before damage happens. Everyone needs to stay alert, follow policies, and report unusual behavior right away.</p>

    //         <p>If someone tries to access files they shouldn't or acts suspiciously, it's important to report it. Use proper channels like your manager, IT team, or an internal reporting tool.</p>

    //         <p>To reduce risk, organizations need to run user awareness training regularly. Sending short security videos every few weeks helps remind staff what to look out for and reinforces safe habits.</p>

    //         <p>Everyone needs to follow access rules, use strong passwords, and report anything strange. Prevention works best when both employees and organizations take action together.</p>
    //         <hr class="my-3" />

    //         <div class="d-flex align-items-center mb-2">
    //         <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
    //         <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    //         </div>

    //         <p>Drag the correct best-practice words into the blank spaces to complete each insider threat prevention tip.</p>

    //         <div class="h5p-container my-3">
    //         <iframe src="assets/h5p/insider/task5/task5.html" width="100%" height="400" frameborder="0" allowfullscreen></iframe>
    //         </div>

    //     `,
    //     quiz: [
    //         {
    //             question: "1. What should you do if you notice a co-worker accessing files they shouldn’t?",
    //             options: [
    //                 "Ignore it",
    //                 "Tell the person to stop quietly",
    //                 "Report it to your IT or manager",
    //                 "Change the password yourself"
    //             ],
    //             correctAnswer: 2,
    //             hint: "Always use the proper channel to report concerns."
    //         },
    //         {
    //             question: "2. Which are good ways to help prevent insider threats? (Select all that apply)",
    //             options: [
    //                 "Use strong passwords",
    //                 "Report unusual behavior",
    //                 "Let coworkers borrow your login",
    //                 "Send regular security awareness videos"
    //             ],
    //             correctAnswer: [0, 1, 3],
    //             hint: "Think about actions that increase safety, not risk."
    //         }
    //     ]
    // },

    // ========== TASK 6 ==========
    {
        title: "Conclusion",
        icon: "fas fa-flag-checkered",
        content: `
            <p>🎉 Well done! You’ve now completed the Insider Threats Lab.</p>

            <p>You learned how insider threats work, how to spot risky behavior, and how to report problems early.</p>

            <p>These skills help protect systems and people from real harm. Remember, even trusted insiders can become a threat if they’re careless or unhappy.</p>

            <p>Stay alert. Always think before you click, share, or act. Security is everyone’s job, including yours.</p>
        `,
        quiz: [
            {
                question: "1. What is one key takeaway from this lab?",
                options: [
                    "Outsiders are more dangerous than insiders",
                    "Only IT staff can stop insider threats",
                    "You should always report suspicious behavior",
                    "Insider threats are not real problems"
                ],
                correctAnswer: 2,
                hint: "Reporting helps catch problems early."
            }
        ]
    },


];
