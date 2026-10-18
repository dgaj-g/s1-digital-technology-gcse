# ------------------------------------------------------------------ chapter 0
ch0 = {
 "id": "00", "n": 0, "of": 15, "title": "Start here: how to use this guide", "kind": "start", "color": "#4F2D9E", "noTurn": True,
 "one": "What you are making, how a chapter works, and the three rules.",
 "prev": None, "next": {"id": "01", "n": 1, "title": "The login form"},
 "methods": [],
 "stages": [
  {"id": "1", "title": "What you are making", "screens": [
   {"id": "1", "title": "Your program: five forms and one file", "foot": "next",
    "goal": "My program is five forms joined by buttons, plus one text file that saves each pupil.",
    "blocks": [
    {"p": "This guide helps you create your Unit 5 program, one part at a time. Here is the whole thing."},
    {"words": [
      ["form", "One of the pages of your program. The login is a form. The quiz is a form.", "1-1", False],
      ["control", "Anything you put on a form: a button, a text box, a panel, a label.", "3-1", False],
      ["property", "A setting of a control, like its Name or its Text. The Properties window lists them.", "3-1", False],
      ["IntelliSense", "The list that pops up as you type code. It knows every name in your program.", "3-2", False]],
     "intro": "Four words you will see a lot. Click any marked word to see what it means."},
    {"drawn": {"id": "five-screens", "alt": "Five cards: Login, Data entry, Quiz, Reaction test and Report, joined by arrows, with a note card for the file pupilStats.txt.",
               "say": "Each card is one [[form|0]]. The arrows are the buttons that take you from one to the next.",
               "cards": [["frmLogin", "Login", "Two boxes and a button."],
                         ["frmDataEntry", "Data entry", "Five panels, where everything is typed in."],
                         ["frmQuiz", "Quiz", "Five questions, one score."],
                         ["frmTest", "Reaction test", "Twelve pictures and a ten-second clock."],
                         ["frmReport", "Report", "A table of every saved pupil."],
                         ["pupilStats.txt", "The file", "Your program saves each pupil's results in here, one line per pupil."]]}},
    {"p": "You have made some of these already. The home page shows which parts you have done and which come next."},
    {"watch": "Every form has a name that starts with frm. You will see those names in the code."}
   ]},
   {"id": "2", "title": "Where your forms and your code live", "foot": "next",
    "goal": "Solution Explorer lists my forms, double-clicking one opens the Design tab, and View Code opens the code tab.",
    "blocks": [
    {"p": "Everything in your project is listed in one place: Solution Explorer, on the right of Visual Studio."},
    frames("F11", "Solution Explorer", [
      ("f11-1", "Solution Explorer on the right of Visual Studio 2019, listing the five forms and Global.cs", "Solution Explorer is on the right. Every form is listed. Global.cs is listed too. It is the file that remembers things for the whole program, like the quiz score."),
      ("f11-2", "The right-click menu of a form with View Code highlighted", "Double-click a form to see it in the Design tab. Right-click it and choose View Code to see its code.")]),
    {"p": "Each form has two tabs. The Design tab shows the form. The code tab shows the code behind it."},
    {"p": "Double-click a button in the Design tab and the code tab opens at that button's code."},
    {"watch": "Closing a tab deletes nothing. Double-click the form in Solution Explorer to open it again."}
   ]},
   {"id": "3", "title": "Run your program and stop it again", "foot": "next",
    "goal": "The green Start arrow runs my program and the red square stops it.",
    "blocks": [
    {"p": "You will run your program a lot in this guide. Here is how to start it and how to stop it."},
    frames("F9", "Running your program", [
      ("f9-1", "The toolbar with the green Start arrow", "The green Start arrow at the top runs your program."),
      ("f9-2", "The toolbar while the program runs, with the red Stop square", "While it runs, the arrow becomes a red Stop square. Press it to stop.")]),
    {"watch": "Use the green arrow and the menus, never keyboard shortcuts. In a browser tab, a shortcut can reload the page."}
   ]}]},
  {"id": "2", "title": "How this guide works", "screens": [
   {"id": "1", "title": "What a chapter looks like", "foot": "next",
    "goal": "A chapter is a row of stages, each stage is a few screens, and the big button at the bottom ticks a screen off.",
    "blocks": [
    {"p": "This guide is split into chapters. One chapter is one part of your program, like the login or the quiz."},
    {"drawn": {"id": "mini-chapter", "alt": "A small drawn chapter: a rail of stage pills, a list of three steps with tick boxes, and a big button at the foot.",
               "say": "A chapter is a row of stages. Each stage is a few screens. Each screen has one job."}},
    {"p": "Every chapter starts with Have you got this? It checks you have what the chapter needs."},
    {"p": "Then come the steps and the code, one screen at a time. The last screen is Test it."},
    {"p": "When you have done a screen, press the big button at the bottom. It ticks the screen and moves you on."},
    {"watch": "Your ticks are saved to your school account. Next lesson, the guide opens where you left off."}
   ]},
   {"id": "2", "title": "Find where you are up to", "foot": "next",
    "goal": "The home page lists every part in order, I tick what I have done, and I open the first part that is not ticked.",
    "blocks": [
    {"p": "The home page is called Where am I up to? It lists every part of the program, in order."},
    {"p": "Tick the parts you have already done. Then open the first part that is not ticked. That is your next job."},
    {"p": "If you were away, this is how you pick up where you were. If you were here, you carry on."},
    {"drawn": {"id": "home-card", "alt": "One chapter card from the home page: the number, the title, a progress ring, an Open button and a smaller I did this already button.",
               "say": "A chapter card. The ring fills as you tick. The small grey button is for a part you did already."}},
    {"p": "Already made a part before you saw this guide? Press I did this already on its card."},
    {"watch": "Only press I did this already if it is true. The guide cannot check. Your program will."}
   ]}]},
  {"id": "3", "title": "The three rules", "screens": [
   {"id": "1", "title": "Rule 1: my names are not your names", "foot": "next",
    "goal": "The guide shows the names Mr Gartland gave his controls, and I use the names I gave mine, found at the top of the Properties window.",
    "blocks": [
    {"p": "Every [[control|1]] in your program has a name, like tbxSurname or btnEnter. The code uses those names."},
    {"p": "This guide shows MY example, with MY names. YOUR names may be different, and that is fine."},
    frames("F2", "Finding a control's name", [
      ("f2-1", "The Design tab with one text box clicked once", "In the Design tab, click the control once."),
      ("f2-2", "The Properties window with the name tbxSurname at the top", "Look at the top of the Properties window. The name is written beside the word Name.")]),
    {"p": "The name is a [[property|2]] of the control, one of its settings. Its Text is another."},
    {"names": {"form": "frmDataEntry", "list": ["tbxSurname", "btnEnter", "pnlPupilDetails"]}},
    {"watch": "When this guide shows one of my names, read it as: the name YOU gave that control."}
   ]},
   {"id": "2", "title": "Rule 2: let IntelliSense type the name for you", "foot": "next",
    "goal": "When I type the first letters of a name, IntelliSense lists the names in my program and Tab finishes it.",
    "blocks": [
    {"p": "You will type a lot of names. Visual Studio can type most of each one for you."},
    {"p": "[[IntelliSense|3]] is the list that pops up as you type code. It knows every name in your program."},
    {"isense": {"form": "frmDataEntry", "typed": "pnl", "pick": "pnlPupilDetails",
                "list": ["pnlPupilDetails", "pnlQuizResult", "pnlReactionTest", "pnlSwimLengths", "pnlSwimmingGroup"]}},
    frames("F3", "The real list in Visual Studio 2019", [
      ("f3-1", "The code tab with pnl typed on a new line", "Type the first letters of the name."),
      ("f3-2", "The IntelliSense list open under pnl, showing the matching names", "The list pops up with every matching name in YOUR program."),
      ("f3-3", "The line completed to a panel name", "Press Tab. The name is typed for you, spelt right.")]),
    {"watch": "If a name is not in the list, your control has a different name. Check it in the Properties window."}
   ]},
   {"id": "3", "title": "Rule 3: you type every line yourself", "foot": "done",
    "goal": "I cannot copy code from the guide, I type it, and I read each line as I type it.",
    "blocks": [
    {"p": "You cannot copy code from this guide. You type it. Typing is how it sticks in your head."},
    {"code": {"id": "3-3.c1", "kind": "type", "snippet": True, "title": "Three lines to try, for practice only",
              "where": "nowhere yet. This one is only for trying the rule.", "lang": "cs",
              "text": "pnlPupilDetails.Enabled = false;\npnlSwimLengths.Enabled = true;\nbtnEnter.Visible = false;",
              "partLines": [[1, 3, "Three lines you will meet again", "Switch off one panel, switch on the next, hide a button. Each line ends with a semicolon."]],
              "names": ["pnlPupilDetails", "pnlSwimLengths", "btnEnter"], "isense": ["pnlPupilDetails"]}},
    {"steps": [step("3-3.1", "Try to copy a line from the box above. Select it, right-click it, or drag it.",
                    "The guide says no, with a small message. You type it instead.")]},
    {"watch": "Read each line as you type it, so you know what it does."}
   ]},
   {"id": "4", "title": "When a line goes red", "foot": "next",
    "goal": "A red wiggly line means Visual Studio does not understand that line, and the Error List takes me to it.",
    "blocks": [
    {"p": "Sometimes a line gets a red wiggly underline. That means Visual Studio does not understand it yet."},
    frames("F10", "Finding an error", [
      ("f10-1", "A code line with a red wiggly underline under a misspelt name", "A red wiggly line under a word."),
      ("f10-2", "The Error List at the bottom of Visual Studio 2019 with one error", "The Error List at the bottom names the problem."),
      ("f10-3", "The cursor on the line after double-clicking the error", "Double-click the error. The cursor jumps to the line.")]),
    {"watch": "Most red lines are a name spelt differently from the control. Check the name in the Properties window."}
   ]},
   {"id": "5", "title": "Build your program before you run it", "foot": "chapter-done",
    "goal": "Build Solution checks every line, and Build succeeded at the bottom left means I can run it.",
    "blocks": [
    {"p": "Before you run, build. Building checks every line. Build succeeded means every line is understood."},
    frames("F12", "Building", [
      ("f12-1", "The Build menu open with Build Solution highlighted", "Open the Build menu and choose Build Solution."),
      ("f12-2", "The bottom left of Visual Studio 2019 saying Build succeeded", "Bottom left says Build succeeded.")]),
    {"watch": "If the bottom left says Build failed, go back one screen and find the red line."}
   ]}]}
 ]}
for ch in (ch0, ch7):
    ch["glossary"] = [[w[0], w[1]] for s in ch["stages"] for sc in s["screens"] for b in sc["blocks"] if "words" in b for w in b["words"]]
