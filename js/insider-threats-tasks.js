// CyberSleuth Academy – Insider Threats Lab
// This file contains all tasks for the Insider Threats module.
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
            <li><strong>Amina</strong> – A new junior security analyst who’s eager to learn and help protect the company.</li>
            <li><strong>Daniel</strong> – A long-time employee in the Finance department. Usually quiet, but lately, he’s been stressed.</li>
            <li><strong>Mr Lim</strong> – The experienced IT manager. He trains staff, monitors behavior, and responds to security concerns.</li>
        </ul>
        </div>


  <p><strong>Scenario:</strong> Amina just joined the security team at her company. During her training, she learns that not all cyber threats come from the outside. Some come from people already inside the organization. This include, employees, contractors, or partners.</p>

    <p>These insiders already have access to systems, so they don’t need to break in. That makes them harder to catch and sometimes more dangerous than outside hackers.</p>

    <p>Some insiders act on purpose, like stealing or leaking files. Others make careless mistakes or fall for phishing attacks.</p>

    <p>Amina wants to learn how to spot these insider threats and stop them before damage is done.</p>

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
                question: "1. Daniel works in Finance. He already has access to sensitive files, so he doesn’t need to hack in. Why would he be harder to detect than an outsider?",
                options: [
                    "He already has access to systems",
                    "He sends warnings first",
                    "He leaves obvious clues",
                    "He always wears disguises"
                ],
                correctAnswer: 0,
                hint: "Insiders don’t need to break in. They already have trusted access."
            }
        ]
    },

    // ========== TASK 2 ==========
    {
        title: "Types of Insider Threats",
        icon: "fas fa-users",
        content: `
    <p><strong>Scenario:</strong> Daniel has been feeling unhappy at work lately. One day, he copies client data to a USB drive without permission. Meanwhile, Amina notices that another co-worker, Sharon, often sends emails to the wrong people and once clicked a strange link. Later, the IT team finds out that someone's account was hijacked by a hacker.</p>

    <p>These are all insider threats, but each case is different:</p>

    <p><strong>Malicious insiders</strong> like Daniel act on purpose to cause harm. They might steal or leak data.</p>

    <p><strong>Negligent insiders</strong> like Sharon don’t mean to cause problems, but their careless mistakes still create risk.</p>

    <p><strong>Compromised insiders</strong> are people whose accounts are taken over by attackers. The hacker uses their access without being noticed.</p>

    <p>Knowing the types helps Amina understand what signs to watch for and how to respond.</p>

    <div class="text-center my-3">
        <img src="assets/images/insider/types-of-insider.png"
            alt="Types of Insider Threats illustration"
            class="img-fluid rounded shadow-sm"
            style="max-width: 100%; height: 450px;" />
        <p class="mt-2 mb-0">Example: Types of insider threats – malicious, negligent, and compromised insiders.</p>
        <p class="small mb-0" style="color: inherit;">
            🖼️ Image credit:
            <a href="https://www.swimlane.com/assets/uploads/images/types-of-insider-threat.png"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-underline">
            Swimlane
            </a>. Used for educational purposes.
        </p>
    </div>

    <hr class="my-3" />

    <div class="d-flex align-items-center mb-2">
      <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
      <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    </div>
    <p>Drag each real-life behavior to the correct insider threat type.</p>

    <div class="h5p-container my-3">
      <iframe src="assets/h5p/insider/task2/task2.html" width="100%" height="500" frameborder="0" allowfullscreen></iframe>
    </div>
  `,
        quiz: [
            {
                question: "1. Daniel secretly copied sensitive files and shared them. What kind of insider is he?",
                options: [
                    "Malicious insider",
                    "Negligent insider",
                    "Compromised insider",
                    "External hacker"
                ],
                correctAnswer: 0,
                hint: "He acted on purpose to harm or steal."
            },
            {
                question: "2. Sharon clicked on a suspicious link by mistake. What kind of insider is she?",
                options: [
                    "Malicious",
                    "Negligent",
                    "Compromised",
                    "Curious"
                ],
                correctAnswer: 1,
                hint: "She didn’t mean to cause harm, but her mistake created risk."
            },
            {
                question: "3. Amina finds out that a staff account was taken over by a hacker. What kind of insider is this?",
                options: [
                    "Malicious",
                    "Negligent",
                    "Compromised",
                    "Accidental"
                ],
                correctAnswer: 2,
                hint: "The real person didn’t act, their account was hijacked."
            }
        ]
    },


    // ========== TASK 3 ==========
    {
        title: "Suspicious Behavior & Warning Signs",
        icon: "fas fa-user-secret",
        content: `
    <p><strong>Scenario:</strong> Amina notices that Daniel has been acting strangely. He stays late at the office when no one else is around. He tries to access folders that aren’t part of his job. He also seems secretive and recently made angry comments about the company.</p>

    <p>These small changes in behavior can be warning signs of insider threats. Other signs include copying large amounts of data, skipping security steps, or suddenly changing work habits.</p>

    <hr class="my-3" />

    <div class="d-flex align-items-center mb-2">
      <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
      <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    </div>

    <p>Drag the missing words into the blanks to complete each sentence about red flag behaviors.</p>

    <div class="h5p-container my-3">
      <iframe src="assets/h5p/insider/task3/task3.html" width="100%" height="450" frameborder="0" allowfullscreen></iframe>
    </div>
  `,
        quiz: [
            {
                question: "1. Amina notices Daniel is copying lots of files, staying late, and acting secretive. Which are warning signs of insider threats? (Select all that apply)",
                options: [
                    "Accessing files not related to their job",
                    "Always following security rules",
                    "Copying large amounts of data",
                    "Acting angry or secretive"
                ],
                correctAnswer: [0, 2, 3],
                hint: "Look for unusual behavior or actions that don’t match their usual job."
            },
            {
                question: "2. Is it suspicious if an employee starts working late at night with no reason?",
                options: ["True", "False"],
                correctAnswer: 0,
                hint: "Unusual work hours can be a red flag."
            }
        ]
    },

    // ========== TASK 4 ==========
    {
        title: "Data Protection & Access Control",
        icon: "fas fa-key",
        content: `
    <p><strong>Scenario:</strong> Amina is helping Mr Lim review staff access. She sees that Daniel still has access to client files, even though he moved to a different role. She also finds that another intern can open files that don’t match their job at all.</p>

    <p>Mr Lim explains that every employee should only have access to the data they actually need. This is called the <strong>principle of least privilege</strong> (PoLP). It’s also part of <strong>role-based access control</strong> (RBAC).</p>

    <p>He also shows her the company’s logging system. It tracks who opens, edits, or moves files. This helps them notice strange activity quickly.</p>

    <p>By fixing access issues and checking logs often, Amina can help stop insider threats before they cause harm.</p>

    <div class="text-center my-3">
        <img src="assets/images/insider/PoLP.png"
            alt="Principle of Least Privilege visual diagram"
            class="img-fluid rounded shadow-sm"
            style="max-width: 100%; height: 450px;" />
        <p class="mt-2 mb-0">Example: How the Principle of Least Privilege (PoLP) restricts access.</p>
        <p class="small mb-0" style="color: inherit;">
            🖼️ Image credit:
            <a href="https://www.zenarmor.com/docs/assets/images/importance-and-best-practices-of-polp-30b222a0a078ad7b9c7391dcbc37420c.png"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-underline">
            Zenarmor
            </a>. Used for educational purposes.
        </p>
    </div>

    <hr class="my-3" />

    <div class="d-flex align-items-center mb-2">
      <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
      <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    </div>

    <p>Complete the blanks to review access control, RBAC, PoLP, and logging best practices.</p>

    <div class="h5p-container my-3">
      <iframe src="assets/h5p/insider/task4/task4.html" width="100%" height="350" frameborder="0" allowfullscreen></iframe>
    </div>
  `,
        quiz: [
            {
                question: "1. Amina finds that an intern can access financial reports. What should the company do? (Select all that apply)",
                options: [
                    "Use least privilege access",
                    "Let everyone access everything",
                    "Track who views and edits files",
                    "Give access only when needed"
                ],
                correctAnswer: [0, 2, 3],
                hint: "Access should always match the person’s role. No more, no less."
            },
            {
                question: "2. Amina says 'Let's give full access just in case.' Is that what 'least privilege' means?",
                options: ["True", "False"],
                correctAnswer: 1,
                hint: "Least privilege means limiting access to only what is required."
            }
        ]
    },

    // ========== TASK 5 ==========
    {
        title: "Prevention & Reporting Steps",
        icon: "fas fa-user-shield",
        content: `
    <p><strong>Scenario:</strong> Amina receives a tip from another staff member. They noticed Daniel trying to view files outside his project. Amina follows procedure and reports it to Mr Lim, who starts an investigation.</p>

    <p>Later, she joins a team meeting where Mr Lim reminds everyone: if something seems odd just report it. Don’t ignore it or fix it on your own.</p>

    <p>He also shares short training videos every month to remind staff how to stay secure. Topics include password safety, access control, and spotting red flags.</p>

    <p>By staying aware and speaking up, everyone in the company plays a part in stopping insider threats.</p>

    <hr class="my-3" />

    <div class="d-flex align-items-center mb-2">
      <i class="fas fa-mouse-pointer me-2 fs-4 text-info"></i>
      <span class="fs-5 fw-semibold">Interactive Activity <span class="text-muted small">(optional)</span></span>
    </div>

    <p>Drag the correct best-practice words into the blank spaces to complete each insider threat prevention tip.</p>

    <div class="h5p-container my-3">
      <iframe src="assets/h5p/insider/task5/task5.html" width="100%" height="400" frameborder="0" allowfullscreen></iframe>
    </div>
  `,
        quiz: [
            {
                question: "1. Amina catches Daniel accessing private files. What should she do?",
                options: [
                    "Ignore it",
                    "Tell the person to stop quietly",
                    "Report it to your IT or manager",
                    "Change the password yourself"
                ],
                correctAnswer: 2,
                hint: "Always follow the correct reporting steps. Don’t handle it alone."
            },
            {
                question: "2. Which actions help prevent insider threats? (Select all that apply)",
                options: [
                    "Use strong passwords",
                    "Report unusual behavior",
                    "Let coworkers borrow your login",
                    "Send regular security awareness videos"
                ],
                correctAnswer: [0, 1, 3],
                hint: "Think of habits that protect access and raise awareness."
            }
        ]
    },

    // ========== TASK 6 ==========
    {
        title: "Conclusion",
        icon: "fas fa-flag-checkered",
        content: `
    <p><strong>Scenario:</strong> After finishing her training, Amina feels confident. She understands how to spot risky behavior, why reporting matters, and how her actions can help prevent data loss or damage.</p>

    <p>She knows that even trusted employees like Daniel can make mistakes or turn into threats. That's why it's important to always stay alert.</p>

    <p>Security is everyone’s job. And with good habits, Amina can help protect both people and systems from real harm.</p>

    <p>🎉 Well done! You’ve now completed the Insider Threats Lab.</p>
  `,
        quiz: [
            {
                question: "1. What is one key takeaway from Amina’s training?",
                options: [
                    "Outsiders are more dangerous than insiders",
                    "Only IT staff can stop insider threats",
                    "You should always report suspicious behavior",
                    "Insider threats are not real problems"
                ],
                correctAnswer: 2,
                hint: "Every employee can help by noticing and reporting early."
            }
        ]
    },



];
