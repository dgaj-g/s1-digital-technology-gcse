# Sit report: S2 Unit 5 Coursework Guide (built platform, 18 Oct 2026)

How it was checked: every screen of chapters 0 to 14 (165 screens), the home page (a new pupil and a pupil with chapters 1 to 13 done), and the landing page with its pop-up, at 1500 px (desk) and 390 px (phone). Pictures are in gates/_out/ownlook/. Numbers are in gates/_out/ownlook/REPORT.md.

## What a pupil sees

1. **The landing page.** A blue header, one card and one button: "Open the guide".
2. **The pop-up.** It is headed "Before you go in, Google will ask you one question". Three pictures play one after another: Review permissions, then her own c2ken.net account, then Allow. Under them are two lines: "This is normal" and "if you see Google hasn't verified this app, choose Advanced". The last part is the "OK, take me in" button. On a later visit, a pupil who has been in before also sees "I've read this before".
3. **Google's permission screen.** She sees it once, then never again.
4. **Where am I up to?** This is a list of chapter cards with a ring that counts ticks. The next card to open is marked "Start here". Each card has an "I did this already" button. Chapter 14 is hidden until chapter 13 is done, then it appears marked "Optional".
5. **A chapter.** Every screen shows:
   - Chapter · Stage · Screen k of t at the top
   - one goal line
   - short steps
   - the real Visual Studio 2019 pictures, labelled with "my name / yours"
   - code to type, with a walk-through
   - one footer button: "I've done this ✓", "I have all these ✓" or "Next ›"

   Try-it screens list "Must happen" and "Must NOT happen" rows. Each row has a link back to the screen that fixes it.
6. **Something moves on every screen in its first second** (G-MOVE, checked at desk on all 165 screens). On a screen that is only a table of controls, the rows come in one at a time and the property to set lights up.

## Where she would stall

| # | Where | Why she would stall | What carries her |
|---|---|---|---|
| 1 | The Google permission screen (first visit) | "Google hasn't verified this app" frightens pupils, and some press Back. | The pop-up's second line names Advanced and the exact link to choose. Pictures 1 and 3 are taken after deploy, so until then the pop-up shows "Picture to come" for them. |
| 2 | Chapter 1, the first double-click | The pupil's button is not my quiz button, and her click method has a different name. | The caption now says "Yours is the Login button" and "Yours says btnLogin_Click". |
| 3 | Chapters 5, 6, 9 and 12: the frmTemp pictures | My pictures show a form called frmTemp, and hers has the name she typed. | Each of these captions now says "My picture says frmTemp. Yours shows the name you typed." |
| 4 | Every "names in MY example" screen | A pupil who named a control differently does not know if she is wrong. | Each screen has a "How do I find my name?" link, and IntelliSense lists her own names. |
| 5 | Chapter 6 onward: long chapters (14 to 18 screens) | A pupil who loses her place halfway does not know where she was. | Ticks save as she goes. The home card's "Carry on" button opens the screen where she stopped. |
| 6 | Chapter 10, the group rules | Her task sheet's group names differ from mine. | The "yours" box tells her to use the names on her sheet, spelled the same each time. Chapter 14's colour extra repeats the warning. |
| 7 | Phone width | This is a desk job, so a pupil should not be working on a phone. | Phone width still has no sideways scroll on any screen. The code blocks scroll inside themselves. |

## Found and fixed in this look

- Seven screens that are only a table of controls were still (they failed G-MOVE). Their rows now come in one at a time, and the property cell lights up.
- **Every call showed "The papers were updated. Reload to get the latest."** The page's build stamp had an s2u5- prefix that the client never strips, so it never matched the server. The stamp now carries the prefix the client expects. The own look now fails if that line appears on any screen.
- Four picture captions now tell her that her names differ from mine (see rows 2 and 3 above).

## Still owed after deploy

- The landing pictures P1 and P3. They are taken from his own sign-in, after the app is revoked, and blurred by script.
- T1 to T6 on the live /exec address.
